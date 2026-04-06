from __future__ import annotations

import base64
import hashlib
import secrets
from datetime import timedelta
from typing import Any

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from jose import JWTError, jwt
from passlib.context import CryptContext

from core.config import get_settings
from utils.time import utcnow

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenError(Exception):
    pass


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def _create_token(payload: dict[str, Any], secret: str, expires_delta: timedelta) -> str:
    settings = get_settings()
    now = utcnow()
    data = dict(payload)
    data.update({"iat": int(now.timestamp()), "exp": int((now + expires_delta).timestamp())})
    return jwt.encode(data, secret, algorithm=settings.jwt_algorithm)


def create_access_token(payload: dict[str, Any]) -> str:
    settings = get_settings()
    return _create_token(
        payload,
        secret=settings.jwt_secret_key,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )


def create_refresh_token(payload: dict[str, Any]) -> str:
    settings = get_settings()
    return _create_token(
        payload,
        secret=settings.jwt_refresh_secret_key,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )


def decode_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise TokenError("Invalid access token") from exc


def decode_refresh_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_refresh_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise TokenError("Invalid refresh token") from exc


def generate_otp() -> str:
    return f"{secrets.randbelow(900000) + 100000}"


def hash_otp(otp: str) -> str:
    return pwd_context.hash(otp)


def verify_otp_hash(otp: str, otp_hash: str) -> bool:
    return pwd_context.verify(otp, otp_hash)


def _get_encryption_key() -> bytes:
    settings = get_settings()
    if not settings.encryption_key:
        raise ValueError("ENCRYPTION_KEY is required for credential encryption")
    raw = base64.urlsafe_b64decode(settings.encryption_key)
    if len(raw) != 32:
        raise ValueError("ENCRYPTION_KEY must decode to 32 bytes")
    return raw


def encrypt_secret(value: str) -> str:
    key = _get_encryption_key()
    aesgcm = AESGCM(key)
    nonce = secrets.token_bytes(12)
    cipher = aesgcm.encrypt(nonce, value.encode("utf-8"), None)
    return base64.urlsafe_b64encode(nonce + cipher).decode("utf-8")


def decrypt_secret(value: str) -> str:
    key = _get_encryption_key()
    raw = base64.urlsafe_b64decode(value.encode("utf-8"))
    nonce, cipher = raw[:12], raw[12:]
    aesgcm = AESGCM(key)
    plain = aesgcm.decrypt(nonce, cipher, None)
    return plain.decode("utf-8")


def stable_signature(*parts: str) -> str:
    base = "::".join(parts)
    return hashlib.sha256(base.encode("utf-8")).hexdigest()
