from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.time import utcnow


async def create_audit_log(
    master_db: AsyncIOMotorDatabase,
    action: str,
    actor_id: str,
    actor_role: str,
    target: str,
    target_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    await master_db["audit_logs"].insert_one(
        {
            "action": action,
            "actor_id": actor_id,
            "actor_role": actor_role,
            "target": target,
            "target_id": target_id,
            "metadata": metadata or {},
            "created_at": utcnow(),
        }
    )
