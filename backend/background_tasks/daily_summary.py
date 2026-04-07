from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorDatabase

from services.telegram_service import send_telegram


async def send_daily_summary(
    tenant_db: AsyncIOMotorDatabase, tenant_id, bot_token: str, chat_id: str
) -> None:
    orders_today = await tenant_db["orders"].count_documents({"tenant_id": tenant_id})
    total_products = await tenant_db["products"].count_documents({"tenant_id": tenant_id})
    msg = f"Daily Summary\nOrders: {orders_today}\nProducts: {total_products}"
    await send_telegram(bot_token, chat_id, msg)
