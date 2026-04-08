from __future__ import annotations

from collections.abc import Callable

from fastapi import Depends, Query, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.database import DatabaseManager
from core.exceptions import ForbiddenError, UnauthorizedError
from core.security import decode_access_token
from utils.object_id import try_object_id

bearer_scheme = HTTPBearer(auto_error=False)


def get_db_manager(request: Request) -> DatabaseManager:
    manager: DatabaseManager = request.app.state.db_manager
    return manager


async def get_master_db(db_manager: DatabaseManager = Depends(get_db_manager)):
    return db_manager.master_db


async def get_shared_db(db_manager: DatabaseManager = Depends(get_db_manager)):
    return db_manager.shared_db


def get_tenant(request: Request) -> dict:
    tenant = getattr(request.state, "tenant", None)
    if tenant is None:
        raise UnauthorizedError("Tenant context missing")
    return tenant


def get_tenant_db(request: Request):
    db = getattr(request.state, "tenant_db", None)
    if db is None:
        raise UnauthorizedError("Tenant database not resolved")
    return db


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db_manager: DatabaseManager = Depends(get_db_manager),
) -> dict:
    if credentials is None:
        raise UnauthorizedError("Missing bearer token")

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    role = payload.get("role")
    if not user_id or not role:
        raise UnauthorizedError("Invalid token payload")

    user_oid = try_object_id(user_id)
    if user_oid is None:
        raise UnauthorizedError("Invalid user id in token")

    if role == "saas_admin":
        user = await db_manager.master_db["saas_admins"].find_one(
            {"_id": user_oid, "is_active": True}
        )
    else:
        tenant_db = getattr(request.state, "tenant_db", None)
        if tenant_db is None:
            raise UnauthorizedError("Tenant context required")
        tenant = getattr(request.state, "tenant", None)
        tenant_id = tenant.get("_id") if tenant else None
        user = await tenant_db["users"].find_one(
            {"_id": user_oid, "tenant_id": tenant_id, "is_active": True}
        )

    if user is None:
        raise UnauthorizedError("User not found")

    user["token_payload"] = payload
    return user


async def get_current_user_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db_manager: DatabaseManager = Depends(get_db_manager),
) -> dict | None:
    if credentials is None:
        return None

    try:
        payload = decode_access_token(credentials.credentials)
    except Exception:
        return None

    user_id = payload.get("sub")
    role = payload.get("role")
    if not user_id or not role:
        return None

    user_oid = try_object_id(user_id)
    if user_oid is None:
        return None

    if role == "saas_admin":
        user = await db_manager.master_db["saas_admins"].find_one(
            {"_id": user_oid, "is_active": True}
        )
    else:
        tenant_db = getattr(request.state, "tenant_db", None)
        tenant = getattr(request.state, "tenant", None)
        tenant_id = tenant.get("_id") if tenant else None
        if tenant_db is None or tenant_id is None:
            return None
        user = await tenant_db["users"].find_one(
            {"_id": user_oid, "tenant_id": tenant_id, "is_active": True}
        )

    if user is None:
        return None

    user["token_payload"] = payload
    return user


def require_roles(roles: list[str]) -> Callable:
    async def _guard(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in roles:
            raise ForbiddenError("Insufficient role")
        return user

    return _guard


async def saas_admin_required(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "saas_admin":
        raise ForbiddenError("SaaS admin required")
    return user


def pagination_params(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
) -> tuple[int, int]:
    skip = (page - 1) * limit
    return skip, limit
