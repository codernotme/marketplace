from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from core.dependencies import get_master_db, saas_admin_required
from utils.object_id import to_object_id
from utils.serialize import to_jsonable

router = APIRouter(tags=["saas-users"])


@router.get("/users")
async def get_all_users(
    request: Request,
    role: str | None = Query(default=None),
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    db_manager = request.app.state.db_manager

    query_role = role if role and role != "all" else None
    users: list[dict] = []

    # Include SaaS admins as global identities in the same list.
    admin_query: dict = {"is_active": True}
    if query_role:
        if query_role in {"saas_admin", "support"}:
            admin_query["role"] = query_role
        else:
            admin_query["role"] = {"$in": ["saas_admin", "support"]}

    async for admin in master_db["saas_admins"].find(admin_query):
        users.append(
            {
                "_id": str(admin["_id"]),
                "tenant_id": "sys_global",
                "name": admin.get("name", ""),
                "email": admin.get("email", ""),
                "role": admin.get("role", "saas_admin"),
                "is_active": admin.get("is_active", True),
                "total_orders": 0,
                "total_spent": 0,
                "created_at": admin.get("created_at"),
                "last_login": admin.get("last_login"),
            }
        )

    tenant_query = {"status": "active"}
    async for tenant in master_db["tenants"].find(tenant_query):
        tenant_db = await db_manager.get_tenant_db(tenant)
        user_query = {"tenant_id": tenant["_id"]}
        if query_role and query_role not in {"saas_admin", "support"}:
            user_query["role"] = query_role

        async for user in tenant_db["users"].find(user_query):
            users.append(
                {
                    "_id": str(user["_id"]),
                    "tenant_id": str(tenant["_id"]),
                    "name": user.get("name", ""),
                    "email": user.get("email", ""),
                    "phone": user.get("phone"),
                    "role": user.get("role", "customer"),
                    "is_email_verified": user.get("is_email_verified", False),
                    "is_phone_verified": user.get("is_phone_verified", False),
                    "is_active": user.get("is_active", True),
                    "auth_provider": user.get("auth_provider", "local"),
                    "total_orders": user.get("total_orders", 0),
                    "total_spent": user.get("total_spent", 0),
                    "created_at": user.get("created_at"),
                    "last_login": user.get("last_login"),
                }
            )

    return {"data": to_jsonable(users)}


@router.patch("/users/{user_id}/status")
async def update_user_status(
    request: Request,
    user_id: str,
    payload: dict,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    is_active = payload.get("is_active")
    tenant_id = payload.get("tenant_id")
    if not isinstance(is_active, bool):
        raise HTTPException(status_code=400, detail="is_active must be a boolean")

    db_manager = request.app.state.db_manager

    if tenant_id == "sys_global":
        result = await master_db["saas_admins"].update_one(
            {"_id": to_object_id(user_id)}, {"$set": {"is_active": is_active}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        admin = await master_db["saas_admins"].find_one({"_id": to_object_id(user_id)})
        return {"data": to_jsonable(admin)}

    if tenant_id:
        tenant = await master_db["tenants"].find_one({"_id": to_object_id(tenant_id)})
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        tenant_db = await db_manager.get_tenant_db(tenant)
        result = await tenant_db["users"].update_one(
            {"_id": to_object_id(user_id), "tenant_id": tenant["_id"]},
            {"$set": {"is_active": is_active}},
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        user = await tenant_db["users"].find_one({"_id": to_object_id(user_id)})
        return {"data": to_jsonable(user)}

    # Fallback: locate user across active tenants.
    async for tenant in master_db["tenants"].find({"status": "active"}):
        tenant_db = await db_manager.get_tenant_db(tenant)
        result = await tenant_db["users"].update_one(
            {"_id": to_object_id(user_id), "tenant_id": tenant["_id"]},
            {"$set": {"is_active": is_active}},
        )
        if result.modified_count > 0:
            user = await tenant_db["users"].find_one({"_id": to_object_id(user_id)})
            return {"data": to_jsonable(user)}

    raise HTTPException(status_code=404, detail="User not found")
