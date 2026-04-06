from __future__ import annotations

from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from utils.object_id import to_object_id
from utils.time import utcnow


async def deduct_inventory_atomic(
    db: AsyncIOMotorDatabase,
    tenant_id,
    product_id: str,
    qty: int,
    reason: str = "sale",
) -> bool:
    result = await db["products"].update_one(
        {
            "_id": to_object_id(product_id),
            "tenant_id": tenant_id,
            "stock": {"$gte": qty},
            "track_inventory": {"$ne": False},
        },
        {"$inc": {"stock": -qty}, "$set": {"updated_at": utcnow()}},
    )
    if result.modified_count == 0:
        return False

    await db["inventory_logs"].insert_one(
        {
            "tenant_id": tenant_id,
            "product_id": to_object_id(product_id),
            "type": reason,
            "quantity_change": -qty,
            "created_at": utcnow(),
        }
    )
    return True


async def next_order_number(db: AsyncIOMotorDatabase, tenant_id) -> str:
    counter = await db["counters"].find_one_and_update(
        {"tenant_id": tenant_id, "key": "order_number"},
        {"$inc": {"value": 1}, "$setOnInsert": {"value": 0}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    seq = counter["value"]
    year = utcnow().year
    return f"MKT-{year}-{seq:05d}"


def compute_order_pricing(items: list[dict[str, Any]], shipping_fee: float = 0.0, coupon_discount: float = 0.0) -> dict[str, float]:
    subtotal = sum(float(item.get("subtotal", 0)) for item in items)
    tax_total = sum(float(item.get("tax_amount", 0)) for item in items)
    discount_total = sum(float(item.get("discount_amount", 0)) for item in items)
    grand_total = max(subtotal + tax_total + shipping_fee - discount_total - coupon_discount, 0)
    return {
        "subtotal": subtotal,
        "shipping_fee": shipping_fee,
        "tax_total": tax_total,
        "discount_total": discount_total,
        "coupon_discount": coupon_discount,
        "grand_total": grand_total,
    }
