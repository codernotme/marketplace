from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, saas_admin_required
from core.security import hash_password
from schemas.saas import SaasAdminCreate
from utils.object_id import to_object_id
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/admins", tags=["saas-admins"])


@router.get("")
async def list_admins(_: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)):
    data = []
    async for item in master_db["saas_admins"].find({"is_active": True}).sort("created_at", -1):
        sanitized = to_jsonable(item)
        sanitized.pop("password_hash", None)
        data.append(sanitized)
    return {"data": data}


@router.post("")
async def create_admin(
    payload: SaasAdminCreate,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    now = utcnow()
    doc = {
        "name": payload.name,
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "is_active": True,
        "created_at": now,
        "last_login": None,
    }
    result = await master_db["saas_admins"].insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Admin created"}


@router.delete("/{admin_id}")
async def delete_admin(
    admin_id: str, _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    await master_db["saas_admins"].update_one(
        {"_id": to_object_id(admin_id)},
        {"$set": {"is_active": False, "updated_at": utcnow()}},
    )
    return {"message": "Admin deactivated"}
