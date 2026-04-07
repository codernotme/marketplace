from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, saas_admin_required
from core.exceptions import ConflictError, UnauthorizedError
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from schemas.auth import LoginRequest, RefreshRequest, RegisterRequest
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/auth", tags=["saas-auth"])


@router.post("/signup")
async def signup(payload: RegisterRequest, master_db=Depends(get_master_db)):
    email = payload.email.lower()
    existing = await master_db["saas_admins"].find_one({"email": email, "is_active": True})
    if existing:
        raise ConflictError("Admin with this email already exists")

    doc = {
        "name": payload.name,
        "email": email,
        "password_hash": hash_password(payload.password),
        "role": "saas_admin",
        "is_active": True,
        "created_at": utcnow(),
        "last_login": None,
    }
    result = await master_db["saas_admins"].insert_one(dict(doc))

    created = await master_db["saas_admins"].find_one({"_id": result.inserted_id})
    token_payload = {"sub": str(result.inserted_id), "role": "saas_admin", "tenant_id": None}
    token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    admin_out = to_jsonable(created)
    admin_out.pop("password_hash", None)
    return {"token": token, "refresh_token": refresh_token, "user": admin_out}


@router.post("/login")
async def login(payload: LoginRequest, master_db=Depends(get_master_db)):
    admin = await master_db["saas_admins"].find_one({"email": payload.email.lower(), "is_active": True})
    if not admin or not verify_password(payload.password, admin["password_hash"]):
        raise UnauthorizedError("Invalid credentials")

    token_payload = {"sub": str(admin["_id"]), "role": "saas_admin", "tenant_id": None}
    token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    await master_db["saas_admins"].update_one(
        {"_id": admin["_id"]}, {"$set": {"last_login": utcnow()}}
    )

    admin_out = to_jsonable(admin)
    admin_out.pop("password_hash", None)
    return {"token": token, "refresh_token": refresh_token, "user": admin_out}


@router.post("/refresh")
async def refresh(payload: RefreshRequest):
    decoded = decode_refresh_token(payload.refresh_token)
    token = create_access_token(
        {"sub": decoded["sub"], "role": decoded.get("role", "saas_admin"), "tenant_id": None}
    )
    return {"token": token}


@router.post("/logout")
async def logout(_: dict = Depends(saas_admin_required)):
    return {"message": "Logged out"}


@router.get("/me")
async def me(user: dict = Depends(saas_admin_required)):
    output = to_jsonable(user)
    output.pop("password_hash", None)
    return {"data": output}


@router.post("/seed-admin")
async def seed_admin(payload: LoginRequest, master_db=Depends(get_master_db)):
    existing = await master_db["saas_admins"].find_one({"email": payload.email.lower()})
    if existing:
        return {"message": "Admin already exists"}
    await master_db["saas_admins"].insert_one(
        {
            "name": "Platform Admin",
            "email": payload.email.lower(),
            "password_hash": hash_password(payload.password),
            "role": "saas_admin",
            "is_active": True,
            "created_at": utcnow(),
            "last_login": None,
        }
    )
    return {"message": "Seed admin created"}
