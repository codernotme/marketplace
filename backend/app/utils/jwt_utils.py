from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.core.config import get_settings


settings = get_settings()


def _create_token(payload: dict[str, Any], secret: str, expires_delta: timedelta) -> str:
    to_encode = payload.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret, algorithm="HS256")


def create_access_token(user_id: str, role: str) -> str:
    return _create_token({"sub": user_id, "role": role, "type": "access"}, settings.jwt_secret, timedelta(minutes=settings.access_token_expire_minutes))


def create_refresh_token(user_id: str) -> str:
    return _create_token({"sub": user_id, "type": "refresh"}, settings.jwt_refresh_secret, timedelta(days=settings.refresh_token_expire_days))


def verify_token(token: str, refresh: bool = False) -> dict[str, Any]:
    secret = settings.jwt_refresh_secret if refresh else settings.jwt_secret
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc


def blacklist_token(store_refresh: dict[str, dict[str, Any]], token: str, ttl_seconds: int) -> None:
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
    store_refresh[token] = {"revoked": True, "expires_at": expires_at}
