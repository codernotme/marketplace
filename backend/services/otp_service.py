from __future__ import annotations

from datetime import timedelta

from motor.motor_asyncio import AsyncIOMotorDatabase

from core.security import generate_otp, hash_otp, verify_otp_hash
from utils.time import utcnow

MAX_OTP_ATTEMPTS = 5


async def create_otp(db: AsyncIOMotorDatabase, tenant_id, email: str, purpose: str) -> str:
    otp = generate_otp()
    now = utcnow()
    await db["otps"].insert_one(
        {
            "tenant_id": tenant_id,
            "email": email.lower(),
            "purpose": purpose,
            "otp": hash_otp(otp),
            "expires_at": now + timedelta(minutes=10),
            "used": False,
            "attempts": 0,
            "created_at": now,
        }
    )
    return otp


async def verify_otp(
    db: AsyncIOMotorDatabase, tenant_id, email: str, purpose: str, otp: str
) -> bool:
    doc = await db["otps"].find_one(
        {
            "tenant_id": tenant_id,
            "email": email.lower(),
            "purpose": purpose,
            "used": False,
        },
        sort=[("created_at", -1)],
    )

    if not doc:
        return False
    if doc.get("expires_at") < utcnow():
        return False
    if doc.get("attempts", 0) >= MAX_OTP_ATTEMPTS:
        return False

    if not verify_otp_hash(otp, doc["otp"]):
        await db["otps"].update_one({"_id": doc["_id"]}, {"$inc": {"attempts": 1}})
        return False

    await db["otps"].update_one({"_id": doc["_id"]}, {"$set": {"used": True}})
    return True
