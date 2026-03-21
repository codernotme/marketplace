from app.core.config import get_settings
from app.core.database import get_db
from app.core.store import store
from app.workers.email_tasks import send_low_stock_alert

settings = get_settings()


async def check_low_stock(ctx) -> None:
    if settings.use_in_memory:
        users_by_id = store.users
        for item in store.inventory.values():
            threshold = item.get("low_stock_threshold", 5)
            if item.get("quantity", 0) > threshold:
                continue
            vendor_user = users_by_id.get(item.get("vendor_id"))
            if not vendor_user:
                continue
            await send_low_stock_alert(ctx, vendor_user.get("email", ""), item.get("sku", ""))
        return

    db = await get_db()
    cursor = db.inventory.find({}, {"_id": 0, "sku": 1, "vendor_id": 1, "quantity": 1, "low_stock_threshold": 1})
    inventory = await cursor.to_list(length=5000)
    for item in inventory:
        threshold = item.get("low_stock_threshold", 5)
        if item.get("quantity", 0) > threshold:
            continue
        vendor_user = await db.users.find_one({"id": item.get("vendor_id")}, {"_id": 0, "email": 1})
        if not vendor_user or not vendor_user.get("email"):
            continue
        redis_pool = ctx.get("redis") if isinstance(ctx, dict) else None
        if redis_pool is not None:
            await redis_pool.enqueue_job("send_low_stock_alert", vendor_user["email"], item.get("sku", ""))
        else:
            await send_low_stock_alert(ctx, vendor_user["email"], item.get("sku", ""))
