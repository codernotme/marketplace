from __future__ import annotations

from cachetools import TTLCache
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.security import decrypt_secret, encrypt_secret

TENANT_CONFIG_CACHE = TTLCache(maxsize=2048, ttl=300)

SECRET_FIELDS = {
    "resend_api_key",
    "razorpay_key_id",
    "razorpay_key_secret",
    "telegram_bot_token",
    "telegram_chat_id",
    "dedicated_db_uri",
}


def _cache_key(tenant_id: str) -> str:
    return f"tenant-config:{tenant_id}"


def _mask_and_decrypt(doc: dict) -> dict:
    output = dict(doc)
    for key in SECRET_FIELDS:
        value = output.get(key)
        if isinstance(value, str) and value:
            try:
                output[key] = decrypt_secret(value)
            except Exception:
                output[key] = value
    return output


def _encrypt_patch(data: dict) -> dict:
    payload = dict(data)
    for key in SECRET_FIELDS:
        value = payload.get(key)
        if isinstance(value, str) and value:
            payload[key] = encrypt_secret(value)
    return payload


async def get_tenant_config(master_db: AsyncIOMotorDatabase, tenant_id: str) -> dict:
    cached = TENANT_CONFIG_CACHE.get(_cache_key(tenant_id))
    if cached is not None:
        return cached

    doc = await master_db["tenant_configs"].find_one({"tenant_id": tenant_id})
    data = _mask_and_decrypt(doc or {"tenant_id": tenant_id})
    TENANT_CONFIG_CACHE[_cache_key(tenant_id)] = data
    return data


async def patch_tenant_config(master_db: AsyncIOMotorDatabase, tenant_id: str, patch: dict) -> None:
    payload = _encrypt_patch(patch)
    await master_db["tenant_configs"].update_one(
        {"tenant_id": tenant_id},
        {"$set": payload, "$setOnInsert": {"tenant_id": tenant_id}},
        upsert=True,
    )
    TENANT_CONFIG_CACHE.pop(_cache_key(tenant_id), None)
