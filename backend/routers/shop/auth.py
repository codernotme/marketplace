from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from core.dependencies import get_current_user, get_tenant, get_tenant_db
from core.exceptions import UnauthorizedError
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from schemas.auth import (
    LoginRequest,
    OtpOnlyRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
)
from services.email_service import send_email
from services.otp_service import create_otp, verify_otp
from services.plan_catalog import get_plan_display_name, get_plan_modules, normalize_plan_code
from services.tenant_config_service import get_tenant_config
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/auth", tags=["shop-auth"])


def _token_payload(user: dict, tenant: dict) -> dict:
    return {"sub": str(user["_id"]), "role": user["role"], "tenant_id": str(tenant["_id"])}


def _build_session_user(user: dict, tenant: dict) -> dict:
    payload = to_jsonable(user)
    payload.pop("password_hash", None)
    payload.pop("token_payload", None)

    plan_code = normalize_plan_code(str(tenant.get("plan_code") or tenant.get("plan") or "free"))
    module_access = tenant.get("module_access") or get_plan_modules(plan_code)

    payload["plan_code"] = plan_code
    payload["plan_name"] = tenant.get("plan_name") or get_plan_display_name(plan_code)
    payload["module_access"] = module_access
    payload["tenant_slug"] = tenant.get("slug")
    return payload


async def _send_otp_email(master_db, tenant: dict, email: str, otp: str, purpose: str):
    config = await get_tenant_config(master_db, str(tenant["_id"]))
    api_key = config.get("resend_api_key")
    if not api_key:
        return
    await send_email(
        api_key=api_key,
        to=email,
        subject=f"Your {tenant.get('name', 'Store')} {purpose} OTP",
        html=f"<p>Your OTP is <b>{otp}</b>. It expires in 10 minutes.</p>",
    )


@router.post("/register")
async def register(
    payload: RegisterRequest,
    request: Request,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
):
    existing = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower()}
    )
    if existing:
        raise UnauthorizedError("Email already registered")

    user_doc = {
        "tenant_id": tenant["_id"],
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "password_hash": hash_password(payload.password),
        "role": "customer",
        "is_email_verified": False,
        "is_phone_verified": False,
        "is_active": True,
        "auth_provider": "local",
        "addresses": [],
        "wishlist": [],
        "tags": [],
        "total_orders": 0,
        "total_spent": 0,
        "created_at": utcnow(),
        "last_login": None,
    }
    await tenant_db["users"].insert_one(dict(user_doc))

    otp = await create_otp(tenant_db, tenant["_id"], payload.email.lower(), "email_verify")
    master_db = request.app.state.db_manager.master_db
    await _send_otp_email(master_db, tenant, payload.email.lower(), otp, "email verification")

    return {"message": "User registered. OTP sent"}


@router.post("/verify-email")
async def verify_email(
    payload: VerifyOtpRequest,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
):
    ok = await verify_otp(
        tenant_db, tenant["_id"], payload.email.lower(), "email_verify", payload.otp
    )
    if not ok:
        raise UnauthorizedError("Invalid OTP")

    user = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower()}
    )
    if not user:
        raise UnauthorizedError("User not found")

    await tenant_db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"is_email_verified": True, "last_login": utcnow()}},
    )

    token_payload = _token_payload(user, tenant)
    return {
        "token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "user": _build_session_user(user, tenant),
    }


@router.post("/login")
async def login(
    payload: LoginRequest, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)
):
    user = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower(), "is_active": True}
    )
    if not user or not user.get("password_hash"):
        raise UnauthorizedError("Invalid credentials")
    if not verify_password(payload.password, user["password_hash"]):
        raise UnauthorizedError("Invalid credentials")
    if not user.get("is_email_verified"):
        raise UnauthorizedError("Email not verified")

    await tenant_db["users"].update_one({"_id": user["_id"]}, {"$set": {"last_login": utcnow()}})
    token_payload = _token_payload(user, tenant)
    return {
        "token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "user": _build_session_user(user, tenant),
    }


@router.post("/login/otp")
async def login_otp(
    payload: OtpOnlyRequest,
    request: Request,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
):
    user = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower()}
    )
    if not user:
        created = {
            "tenant_id": tenant["_id"],
            "name": payload.email.split("@")[0],
            "email": payload.email.lower(),
            "password_hash": None,
            "phone": None,
            "role": "customer",
            "is_email_verified": True,
            "is_phone_verified": False,
            "is_active": True,
            "auth_provider": "otp",
            "addresses": [],
            "wishlist": [],
            "tags": [],
            "total_orders": 0,
            "total_spent": 0,
            "created_at": utcnow(),
            "last_login": None,
        }
        await tenant_db["users"].insert_one(dict(created))

    otp = await create_otp(tenant_db, tenant["_id"], payload.email.lower(), "login")
    master_db = request.app.state.db_manager.master_db
    await _send_otp_email(master_db, tenant, payload.email.lower(), otp, "login")

    return {"message": "OTP sent"}


@router.post("/login/otp/verify")
async def login_otp_verify(
    payload: VerifyOtpRequest, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)
):
    ok = await verify_otp(tenant_db, tenant["_id"], payload.email.lower(), "login", payload.otp)
    if not ok:
        raise UnauthorizedError("Invalid OTP")

    user = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower(), "is_active": True}
    )
    if not user:
        raise UnauthorizedError("User not found")

    await tenant_db["users"].update_one({"_id": user["_id"]}, {"$set": {"last_login": utcnow()}})
    token_payload = _token_payload(user, tenant)
    return {
        "token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "user": _build_session_user(user, tenant),
    }


@router.post("/forgot-password")
async def forgot_password(
    payload: OtpOnlyRequest,
    request: Request,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
):
    user = await tenant_db["users"].find_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower(), "is_active": True}
    )
    if not user:
        return {"message": "If account exists, OTP will be sent"}

    otp = await create_otp(tenant_db, tenant["_id"], payload.email.lower(), "password_reset")
    master_db = request.app.state.db_manager.master_db
    await _send_otp_email(master_db, tenant, payload.email.lower(), otp, "password reset")
    return {"message": "If account exists, OTP will be sent"}


@router.post("/reset-password")
async def reset_password(
    payload: ResetPasswordRequest,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
):
    ok = await verify_otp(
        tenant_db, tenant["_id"], payload.email.lower(), "password_reset", payload.otp
    )
    if not ok:
        raise UnauthorizedError("Invalid OTP")

    await tenant_db["users"].update_one(
        {"tenant_id": tenant["_id"], "email": payload.email.lower()},
        {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": utcnow()}},
    )
    return {"message": "Password reset successful"}


@router.post("/refresh")
async def refresh(payload: RefreshRequest):
    decoded = decode_refresh_token(payload.refresh_token)
    token = create_access_token(
        {
            "sub": decoded["sub"],
            "role": decoded["role"],
            "tenant_id": decoded.get("tenant_id"),
        }
    )
    return {"token": token}


@router.post("/logout")
async def logout(_: dict = Depends(get_current_user)):
    return {"message": "Logged out"}


@router.get("/me")
async def me(user: dict = Depends(get_current_user), tenant=Depends(get_tenant)):
    return {"data": _build_session_user(user, tenant)}
