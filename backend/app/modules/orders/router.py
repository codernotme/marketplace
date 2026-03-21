from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.redis import get_redis
from app.core.store import store, utcnow

router = APIRouter(prefix="/orders", tags=["orders"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


async def _enqueue_job(redis_client, job_name: str, *args) -> None:
    enqueue = getattr(redis_client, "enqueue_job", None)
    if callable(enqueue):
        await enqueue(job_name, *args)


class CreateOrderPayload(BaseModel):
    address: dict
    payment_id: str


class StatusPayload(BaseModel):
    status: str


class ReturnPayload(BaseModel):
    reason: str


@router.post("")
async def create_order(payload: CreateOrderPayload, user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0}) or {"items": []}
        if not cart["items"]:
            raise HTTPException(status_code=400, detail="Cart is empty")

        inventory_updates: list[tuple[dict, int]] = []
        for item in cart["items"]:
            stock_item = await db.inventory.find_one({"product_id": item["product_id"]}, {"_id": 0})
            if not stock_item:
                raise HTTPException(status_code=400, detail=f"Inventory missing for product {item['product_id']}")
            if stock_item["quantity"] < item["qty"]:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for product {item['product_id']}")
            inventory_updates.append((stock_item, item["qty"]))

        for stock_item, qty in inventory_updates:
            await db.inventory.update_one({"id": stock_item["id"]}, {"$inc": {"quantity": -qty}})

        order_id = _new_id()
        order = {
            "id": order_id,
            "user_id": user["id"],
            "items": cart["items"],
            "address": payload.address,
            "payment_id": payload.payment_id,
            "status": "placed",
            "created_at": utcnow().isoformat(),
        }
        await db.orders.insert_one(dict(order))
        await db.carts.update_one(
            {"user_id": user["id"]},
            {"$set": {"user_id": user["id"], "items": [], "coupon": None}},
            upsert=True,
        )
        redis = await get_redis()
        await _enqueue_job(redis, "send_order_confirmation", user.get("email", ""), order_id)
        return order

    cart = store.carts.get(user["id"], {"items": []})
    if not cart["items"]:
        raise HTTPException(status_code=400, detail="Cart is empty")

    inventory_updates: list[tuple[dict, int]] = []
    for item in cart["items"]:
        stock_item = next((i for i in store.inventory.values() if i["product_id"] == item["product_id"]), None)
        if not stock_item:
            raise HTTPException(status_code=400, detail=f"Inventory missing for product {item['product_id']}")
        if stock_item["quantity"] < item["qty"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {item['product_id']}")
        inventory_updates.append((stock_item, item["qty"]))

    for stock_item, qty in inventory_updates:
        stock_item["quantity"] -= qty

    order_id = _new_id()
    order = {
        "id": order_id,
        "user_id": user["id"],
        "items": cart["items"],
        "address": payload.address,
        "payment_id": payload.payment_id,
        "status": "placed",
        "created_at": utcnow().isoformat(),
    }
    store.orders[order_id] = order
    store.carts[user["id"]] = {"user_id": user["id"], "items": [], "coupon": None}
    redis = await get_redis()
    await _enqueue_job(redis, "send_order_confirmation", user.get("email", ""), order_id)
    return order


@router.get("")
async def get_orders(user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        if user["role"] == "admin":
            return await db.orders.find({}, {"_id": 0}).to_list(length=2000)
        return await db.orders.find({"user_id": user["id"]}, {"_id": 0}).to_list(length=2000)

    if user["role"] == "admin":
        return list(store.orders.values())
    return [o for o in store.orders.values() if o["user_id"] == user["id"]]


@router.get("/{order_id}")
async def get_order(order_id: str, user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if user["role"] != "admin" and order["user_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Forbidden")
        return order

    order = store.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if user["role"] != "admin" and order["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return order


@router.put("/{order_id}/cancel")
async def cancel_order(order_id: str, user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order["user_id"] != user["id"] and user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        if order["status"] in ["shipped", "delivered"]:
            raise HTTPException(status_code=400, detail="Cannot cancel")
        await db.orders.update_one({"id": order_id}, {"$set": {"status": "cancelled"}})
        return await db.orders.find_one({"id": order_id}, {"_id": 0})

    order = store.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["user_id"] != user["id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    if order["status"] in ["shipped", "delivered"]:
        raise HTTPException(status_code=400, detail="Cannot cancel")
    order["status"] = "cancelled"
    return order


@router.post("/{order_id}/return")
async def request_return(order_id: str, payload: ReturnPayload, user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order["user_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Forbidden")
        await db.orders.update_one(
            {"id": order_id},
            {"$set": {"return_reason": payload.reason, "status": "return_requested"}},
        )
        return await db.orders.find_one({"id": order_id}, {"_id": 0})

    order = store.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    order["return_reason"] = payload.reason
    order["status"] = "return_requested"
    return order


@router.get("/{order_id}/invoice")
async def get_invoice(order_id: str, user=Depends(get_current_user)):
    if not settings.use_in_memory:
        db = await get_db()
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order["user_id"] != user["id"] and user["role"] not in ["admin", "vendor"]:
            raise HTTPException(status_code=403, detail="Forbidden")
        return {"invoice_url": f"/invoices/{order_id}.pdf"}

    order = store.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["user_id"] != user["id"] and user["role"] not in ["admin", "vendor"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"invoice_url": f"/invoices/{order_id}.pdf"}


@router.put("/{order_id}/status")
async def update_status(order_id: str, payload: StatusPayload, user=Depends(get_current_user)):
    if user["role"] not in ["vendor", "admin"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if not settings.use_in_memory:
        db = await get_db()
        order = await db.orders.find_one({"id": order_id}, {"_id": 0})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        await db.orders.update_one({"id": order_id}, {"$set": {"status": payload.status}})
        return await db.orders.find_one({"id": order_id}, {"_id": 0})

    order = store.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order["status"] = payload.status
    return order
