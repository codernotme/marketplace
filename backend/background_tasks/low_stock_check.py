from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorDatabase

from services.telegram_service import send_telegram


async def run_low_stock_check(tenant_db: AsyncIOMotorDatabase, tenant_id, bot_token: str, chat_id: str) -> int:
    cursor = tenant_db["products"].find(
        {
            "tenant_id": tenant_id,
            "track_inventory": {"$ne": False},
            "$expr": {"$lte": ["$stock", {"$ifNull": ["$low_stock_threshold", 5]}]},
            "status": "active",
        },
        {"title": 1, "stock": 1},
    )
    items = [item async for item in cursor]
    if not items:
        return 0

    lines = ["Low stock alert:"] + [f"- {item.get('title')} ({item.get('stock')})" for item in items]
    await send_telegram(bot_token, chat_id, "\n".join(lines))
    return len(items)
