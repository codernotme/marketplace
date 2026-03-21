import random
from datetime import datetime, timezone
from datetime import timedelta
from uuid import uuid4

import json

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.core.database import get_db
from app.core.redis import get_redis
from app.core.store import store, utcnow
from app.modules.auth.schemas import LoginRequest, OTPVerifyRequest, RegisterRequest, TokenPair
from app.utils.jwt_utils import blacklist_token, create_access_token, create_refresh_token, verify_token
from app.utils.password_utils import hash_password, verify_password

settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


def _otp_key(email: str) -> str:
    return f"otp:{email.lower()}"


def _refresh_key(token: str) -> str:
    return f"refresh:{token}"


def _reset_key(token: str) -> str:
    return f"reset:{token}"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


async def _enqueue_job(redis_client, job_name: str, *args) -> None:
    enqueue = getattr(redis_client, "enqueue_job", None)
    if callable(enqueue):
        await enqueue(job_name, *args)


async def register_user(data: RegisterRequest) -> dict:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        existing = await db.users.find_one({"email": data.email.lower()})
        if existing:
            raise HTTPException(status_code=409, detail="Email already exists")

        user_id = _new_id()
        user = {
            "id": user_id,
            "name": data.name,
            "email": data.email.lower(),
            "password_hash": hash_password(data.password),
            "role": data.role,
            "is_active": False,
            "addresses": [],
            "wishlist": [],
            "created_at": _utcnow().isoformat(),
        }
        await db.users.insert_one(dict(user))

        otp = f"{random.randint(0, 999999):06d}"
        otp_entry = {
            "otp": otp,
            "user_id": user_id,
            "expires_at": (_utcnow() + timedelta(minutes=10)).isoformat(),
        }
        await redis.setex(_otp_key(data.email), 10 * 60, json.dumps(otp_entry))
        await _enqueue_job(redis, "send_otp_email", data.email.lower(), otp)
        return user

    with store.lock:
        if any(u["email"] == data.email for u in store.users.values()):
            raise HTTPException(status_code=409, detail="Email already exists")

        user_id = _new_id()
        user = {
            "id": user_id,
            "name": data.name,
            "email": data.email,
            "password_hash": hash_password(data.password),
            "role": data.role,
            "is_active": False,
            "addresses": [],
            "wishlist": [],
            "created_at": utcnow().isoformat(),
        }
        store.users[user_id] = user

        otp = f"{random.randint(0, 999999):06d}"
        store.otp_codes[data.email] = {
            "otp": otp,
            "user_id": user_id,
            "expires_at": (utcnow() + timedelta(minutes=10)).isoformat(),
        }
        redis = await get_redis()
        await _enqueue_job(redis, "send_otp_email", data.email.lower(), otp)
        return user


async def verify_otp(data: OTPVerifyRequest) -> TokenPair:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        raw_entry = await redis.get(_otp_key(data.email))
        if not raw_entry:
            raise HTTPException(status_code=400, detail="OTP not found")
        otp_entry = json.loads(raw_entry)
        if otp_entry["otp"] != data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        user = await db.users.find_one({"id": otp_entry["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db.users.update_one({"id": user["id"]}, {"$set": {"is_active": True}})
        await redis.delete(_otp_key(data.email))

        access = create_access_token(user["id"], user["role"])
        refresh = create_refresh_token(user["id"])
        refresh_entry = {
            "user_id": user["id"],
            "expires_at": (_utcnow() + timedelta(days=settings.refresh_token_expire_days)).isoformat(),
            "revoked": False,
        }
        await redis.setex(_refresh_key(refresh), settings.refresh_token_expire_days * 24 * 3600, json.dumps(refresh_entry))
        return TokenPair(access_token=access, refresh_token=refresh)

    otp_entry = store.otp_codes.get(data.email)
    if not otp_entry:
        raise HTTPException(status_code=400, detail="OTP not found")
    if otp_entry["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = store.users.get(otp_entry["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["is_active"] = True
    store.otp_codes.pop(data.email, None)

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])
    store.refresh_tokens[refresh] = {
        "user_id": user["id"],
        "expires_at": (utcnow() + timedelta(days=settings.refresh_token_expire_days)).isoformat(),
        "revoked": False,
    }
    return TokenPair(access_token=access, refresh_token=refresh)


async def login(data: LoginRequest) -> TokenPair:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        user = await db.users.find_one({"email": data.email.lower()}, {"_id": 0})
        if not user or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.get("is_active"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is not verified")

        access = create_access_token(user["id"], user["role"])
        refresh = create_refresh_token(user["id"])
        refresh_entry = {
            "user_id": user["id"],
            "expires_at": (_utcnow() + timedelta(days=settings.refresh_token_expire_days)).isoformat(),
            "revoked": False,
        }
        await redis.setex(_refresh_key(refresh), settings.refresh_token_expire_days * 24 * 3600, json.dumps(refresh_entry))
        return TokenPair(access_token=access, refresh_token=refresh)

    user = next((u for u in store.users.values() if u["email"] == data.email), None)
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.get("is_active"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is not verified")

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])
    store.refresh_tokens[refresh] = {
        "user_id": user["id"],
        "expires_at": (utcnow() + timedelta(days=settings.refresh_token_expire_days)).isoformat(),
        "revoked": False,
    }
    return TokenPair(access_token=access, refresh_token=refresh)


async def refresh_access_token(refresh_token: str) -> str:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        raw_entry = await redis.get(_refresh_key(refresh_token))
        if not raw_entry:
            raise HTTPException(status_code=401, detail="Refresh token revoked")
        entry = json.loads(raw_entry)
        if entry.get("revoked"):
            raise HTTPException(status_code=401, detail="Refresh token revoked")

        try:
            payload = verify_token(refresh_token, refresh=True)
        except ValueError as exc:
            raise HTTPException(status_code=401, detail="Invalid refresh token") from exc

        user_id = payload.get("sub")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return create_access_token(user["id"], user["role"])

    entry = store.refresh_tokens.get(refresh_token)
    if not entry or entry.get("revoked"):
        raise HTTPException(status_code=401, detail="Refresh token revoked")

    try:
        payload = verify_token(refresh_token, refresh=True)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token") from exc

    user_id = payload.get("sub")
    user = store.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return create_access_token(user["id"], user["role"])


async def logout(refresh_token: str) -> None:
    if not settings.use_in_memory:
        redis = await get_redis()
        await redis.delete(_refresh_key(refresh_token))
        return

    blacklist_token(store.refresh_tokens, refresh_token, ttl_seconds=7 * 24 * 3600)


async def get_current_user(user_id: str) -> dict:
    if not settings.use_in_memory:
        db = await get_db()
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    user = store.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def request_password_reset(email: str) -> None:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        user = await db.users.find_one({"email": email.lower()}, {"_id": 0})
        if not user:
            return None

        token = create_refresh_token(user["id"])
        token_entry = {
            "user_id": user["id"],
            "expires_at": (_utcnow() + timedelta(hours=1)).isoformat(),
            "used": False,
        }
        await redis.setex(_reset_key(token), 60 * 60, json.dumps(token_entry))
        reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={token}"
        await _enqueue_job(redis, "send_password_reset", email.lower(), reset_url)
        return None

    user = next((u for u in store.users.values() if u["email"] == email), None)
    if not user:
        return None
    token = create_refresh_token(user["id"])
    store.password_reset_tokens[token] = {
        "user_id": user["id"],
        "expires_at": (utcnow() + timedelta(hours=1)).isoformat(),
        "used": False,
    }
    redis = await get_redis()
    reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={token}"
    await _enqueue_job(redis, "send_password_reset", email.lower(), reset_url)


async def reset_password(token: str, new_password: str) -> None:
    if not settings.use_in_memory:
        db = await get_db()
        redis = await get_redis()

        raw_token_entry = await redis.get(_reset_key(token))
        if not raw_token_entry:
            raise HTTPException(status_code=400, detail="Invalid reset token")
        token_entry = json.loads(raw_token_entry)
        if token_entry.get("used"):
            raise HTTPException(status_code=400, detail="Invalid reset token")

        try:
            verify_token(token, refresh=True)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid reset token") from exc

        user = await db.users.find_one({"id": token_entry.get("user_id")}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_password(new_password)}})
        await redis.delete(_reset_key(token))
        return None

    token_entry = store.password_reset_tokens.get(token)
    if not token_entry or token_entry.get("used"):
        raise HTTPException(status_code=400, detail="Invalid reset token")

    try:
        verify_token(token, refresh=True)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid reset token") from exc

    user = store.users.get(token_entry.get("user_id"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["password_hash"] = hash_password(new_password)
    token_entry["used"] = True
