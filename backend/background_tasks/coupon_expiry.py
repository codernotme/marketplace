from __future__ import annotations

from datetime import timedelta

from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.time import utcnow


async def deactivate_expired_coupons(tenant_db: AsyncIOMotorDatabase, tenant_id) -> int:
    now = utcnow()
    result = await tenant_db["coupons"].update_many(
        {
            "tenant_id": tenant_id,
            "is_active": True,
            "expires_at": {"$lte": now + timedelta(minutes=1)},
        },
        {"$set": {"is_active": False, "updated_at": now}},
    )
    return result.modified_count
