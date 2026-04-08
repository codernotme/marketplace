from __future__ import annotations
import logging

from typing import Any
from pathlib import Path
from jinja2 import Template
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


def compute_order_pricing(
    items: list[dict[str, Any]], shipping_fee: float = 0.0, coupon_discount: float = 0.0
) -> dict[str, float]:
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


async def create_order(
    db: AsyncIOMotorDatabase,
    tenant: dict,
    user: dict | None,
    items: list[dict],
    pricing: dict,
    shipping_address: dict | None = None,
    payment_method: str = "card",
    source: str = "web",
    customer_email: str | None = None,
    customer_name: str | None = None,
    resend_api_key: str | None = None,
) -> dict:
    order_number = await next_order_number(db, tenant["_id"])
    
    order = {
        "tenant_id": tenant["_id"],
        "order_number": order_number,
        "user_id": user["_id"] if user else None,
        "items": items,
        "pricing": pricing,
        "shipping_address": shipping_address,
        "payment_method": payment_method,
        "payment_status": "pending" if payment_method == "card" else "paid",
        "fulfillment_status": "unfulfilled" if source == "web" else "fulfilled",
        "source": source,
        "customer_email": customer_email or (user.get("email") if user else None),
        "customer_name": customer_name or (user.get("name") if user else "Valued Customer"),
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }

    result = await db["orders"].insert_one(order)
    order["_id"] = result.inserted_id

    # Deduct inventory
    for item in items:
        if "product_id" in item:
            await deduct_inventory_atomic(
                db, tenant["_id"], str(item["product_id"]), item.get("quantity", 1)
            )

    await send_order_invoice_emails(order=order, tenant=tenant, resend_api_key=resend_api_key)

    return order


def render_invoice_html(order: dict, tenant: dict) -> str:
    template_path = Path(__file__).parent.parent / "templates" / "email" / "invoice.html"
    template_content = template_path.read_text(encoding="utf-8")
    template = Template(template_content)

    formatted_items = []
    for item in order.get("items", []):
        unit_price = float(item.get("price", item.get("unit_price", 0)) or 0)
        qty = int(item.get("quantity", 1) or 1)
        subtotal = float(item.get("subtotal", unit_price * qty) or 0)
        formatted_items.append(
            {
                "name": item.get("name") or item.get("title") or "Product",
                "sku": item.get("sku", "N/A"),
                "quantity": qty,
                "price": f"{unit_price:.2f}",
                "subtotal": f"{subtotal:.2f}",
            }
        )

    pricing = order.get("pricing") or {}
    invoice_data = {
        "order_number": order.get("order_number", "N/A"),
        "date": utcnow().strftime("%B %d, %Y"),
        "customer_name": order.get("customer_name") or "Valued Customer",
        "customer_email": order.get("customer_email") or "",
        "shop_name": tenant.get("name", "Our Shop"),
        "shop_address": tenant.get("address", ""),
        "items": formatted_items,
        "subtotal": f"{float(pricing.get('subtotal', 0) or 0):.2f}",
        "tax": f"{float(pricing.get('tax_total', 0) or 0):.2f}",
        "shipping_fee": (
            f"{float(pricing.get('shipping_fee', 0) or 0):.2f}"
            if pricing.get("shipping_fee")
            else None
        ),
        "total": f"{float(pricing.get('grand_total', 0) or 0):.2f}",
        "contact_email": tenant.get("contact_email") or tenant.get("owner_email") or tenant.get("email"),
    }
    return template.render(**invoice_data)


async def send_order_invoice_emails(order: dict, tenant: dict, resend_api_key: str | None) -> None:
    if not resend_api_key:
        return

    from services.email_service import send_email

    try:
        html = render_invoice_html(order=order, tenant=tenant)
        order_number = order.get("order_number", "N/A")

        customer_email = order.get("customer_email")
        if customer_email:
            customer_subject = f"Invoice for Order {order_number} - {tenant.get('name', 'Store')}"
            await send_email(resend_api_key, customer_email, customer_subject, html)

        shop_email = tenant.get("contact_email") or tenant.get("owner_email") or tenant.get("email")
        if shop_email:
            shop_subject = f"New Order Received: {order_number}"
            await send_email(resend_api_key, shop_email, shop_subject, html)
    except Exception as exc:
        logging.error("Order email notification failed: %s", exc)
