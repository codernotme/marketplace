from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.dependencies import get_master_db, saas_admin_required
from repositories.audit import create_audit_log
from schemas.saas import TenantConfigUpdate, TenantCreate, TenantUpdate
from services.tenant_config_service import get_tenant_config, patch_tenant_config
from utils.object_id import to_object_id, try_object_id
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/tenants", tags=["saas-tenants"])


@router.get("")
async def list_tenants(
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
):
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"slug": {"$regex": search, "$options": "i"}},
            {"owner_email": {"$regex": search, "$options": "i"}},
        ]
    if status:
        query["status"] = status

    skip = (page - 1) * limit
    cursor = master_db["tenants"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    data = [to_jsonable(item) async for item in cursor]
    total = await master_db["tenants"].count_documents(query)
    return {"data": data, "total": total, "page": page, "limit": limit}


@router.post("")
async def create_tenant(
    payload: TenantCreate,
    user: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    now = utcnow()
    doc = {
        "name": payload.name,
        "slug": payload.slug.lower(),
        "owner_email": payload.owner_email.lower(),
        "plan_code": payload.plan_code,
        "status": "active",
        "onboarding_step": 1,
        "onboarding_completed": False,
        "db_mode": "shared",
        "db_uri": None,
        "db_name": None,
        "created_at": now,
        "updated_at": now,
    }
    result = await master_db["tenants"].insert_one(doc)
    await create_audit_log(
        master_db,
        action="tenant.create",
        actor_id=str(user["_id"]),
        actor_role=user["role"],
        target="tenant",
        target_id=str(result.inserted_id),
    )
    return {"id": str(result.inserted_id), "message": "Tenant created"}


@router.get("/{tenant_id}")
async def get_tenant(
    tenant_id: str, _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    query_id = try_object_id(tenant_id)
    query = {"_id": query_id} if query_id else {"slug": tenant_id}
    tenant = await master_db["tenants"].find_one(query)
    if not tenant:
        return {"data": None}
    return {"data": to_jsonable(tenant)}


@router.patch("/{tenant_id}")
async def update_tenant(
    tenant_id: str,
    payload: TenantUpdate,
    user: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    oid = to_object_id(tenant_id)
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        updates["updated_at"] = utcnow()
        await master_db["tenants"].update_one({"_id": oid}, {"$set": updates})
    await create_audit_log(
        master_db,
        action="tenant.update",
        actor_id=str(user["_id"]),
        actor_role=user["role"],
        target="tenant",
        target_id=tenant_id,
        metadata=updates,
    )
    return {"message": "Tenant updated"}


@router.post("/{tenant_id}/suspend")
async def suspend_tenant(
    tenant_id: str, user: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    await master_db["tenants"].update_one(
        {"_id": to_object_id(tenant_id)},
        {"$set": {"status": "suspended", "updated_at": utcnow()}},
    )
    await create_audit_log(
        master_db,
        action="tenant.suspend",
        actor_id=str(user["_id"]),
        actor_role=user["role"],
        target="tenant",
        target_id=tenant_id,
    )
    return {"message": "Tenant suspended"}


@router.post("/{tenant_id}/activate")
async def activate_tenant(
    tenant_id: str, user: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    await master_db["tenants"].update_one(
        {"_id": to_object_id(tenant_id)},
        {"$set": {"status": "active", "updated_at": utcnow()}},
    )
    await create_audit_log(
        master_db,
        action="tenant.activate",
        actor_id=str(user["_id"]),
        actor_role=user["role"],
        target="tenant",
        target_id=tenant_id,
    )
    return {"message": "Tenant activated"}


@router.get("/{tenant_id}/config")
async def get_config(
    tenant_id: str, _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    config = await get_tenant_config(master_db, tenant_id)
    return {"data": to_jsonable(config)}


@router.patch("/{tenant_id}/config")
async def update_config(
    tenant_id: str,
    payload: TenantConfigUpdate,
    user: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    await patch_tenant_config(master_db, tenant_id, patch)
    await create_audit_log(
        master_db,
        action="tenant.config.update",
        actor_id=str(user["_id"]),
        actor_role=user["role"],
        target="tenant_config",
        target_id=tenant_id,
        metadata={"keys": list(patch.keys())},
    )
    return {"message": "Tenant config updated"}
