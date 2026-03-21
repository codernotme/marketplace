from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.store import store

router = APIRouter(prefix="/cart", tags=["cart"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


async def _get_product_by_id(product_id: str):
    if settings.use_in_memory:
        return store.products.get(product_id)

    db = await get_db()
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if product:
        return product
    return store.products.get(product_id)


class CartAddItem(BaseModel):
    product_id: str
    variant_id: str | None = None
    qty: int = Field(default=1, ge=1)


class CartUpdateItem(BaseModel):
    item_id: str
    qty: int = Field(ge=1)


class CouponPayload(BaseModel):
    code: str


async def _get_cart(user_id: str) -> dict:
    if settings.use_in_memory:
        cart = store.carts.get(user_id)
        if not cart:
            cart = {"user_id": user_id, "items": [], "coupon": None}
            store.carts[user_id] = cart
        return cart

    db = await get_db()
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if cart:
        return cart

    cart = {"user_id": user_id, "items": [], "coupon": None}
    await db.carts.insert_one(dict(cart))
    return cart


async def _save_cart(user_id: str, cart: dict) -> None:
    if settings.use_in_memory:
        store.carts[user_id] = cart
        return

    db = await get_db()
    await db.carts.update_one({"user_id": user_id}, {"$set": cart}, upsert=True)


@router.get("")
async def get_cart(user=Depends(get_current_user)):
    return await _get_cart(user["id"])


@router.post("/add")
async def add_item(payload: CartAddItem, user=Depends(get_current_user)):
    product = await _get_product_by_id(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    cart = await _get_cart(user["id"])
    item = payload.model_dump()
    item["id"] = _new_id()
    item["price"] = product["price"]
    cart["items"].append(item)
    await _save_cart(user["id"], cart)
    return cart


@router.put("/update")
async def update_item(payload: CartUpdateItem, user=Depends(get_current_user)):
    cart = await _get_cart(user["id"])
    for item in cart["items"]:
        if item["id"] == payload.item_id:
            item["qty"] = payload.qty
            await _save_cart(user["id"], cart)
            return cart
    raise HTTPException(status_code=404, detail="Cart item not found")


@router.delete("/remove/{item_id}")
async def remove_item(item_id: str, user=Depends(get_current_user)):
    cart = await _get_cart(user["id"])
    cart["items"] = [i for i in cart["items"] if i["id"] != item_id]
    await _save_cart(user["id"], cart)
    return cart


@router.delete("/clear")
async def clear_cart(user=Depends(get_current_user)):
    await _save_cart(user["id"], {"user_id": user["id"], "items": [], "coupon": None})
    return {"ok": True}


@router.post("/validate")
async def validate_stock(user=Depends(get_current_user)):
    cart = await _get_cart(user["id"])
    results = []
    for item in cart["items"]:
        product = await _get_product_by_id(item["product_id"])
        in_stock = bool(product and not product.get("deleted"))
        results.append({"item_id": item["id"], "in_stock": in_stock})
    return {"items": results}


@router.post("/merge")
async def merge_guest_cart(guest_items: list[CartAddItem], user=Depends(get_current_user)):
    cart = await _get_cart(user["id"])
    for guest in guest_items:
        item = guest.model_dump()
        item["id"] = _new_id()
        product = await _get_product_by_id(guest.product_id)
        item["price"] = product.get("price", 0) if product else 0
        cart["items"].append(item)
    await _save_cart(user["id"], cart)
    return cart


@router.post("/apply-coupon")
async def apply_coupon(payload: CouponPayload, user=Depends(get_current_user)):
    cart = await _get_cart(user["id"])

    if settings.use_in_memory:
        coupon = next((c for c in store.coupons.values() if c["code"].lower() == payload.code.lower() and c.get("active", True)), None)
    else:
        db = await get_db()
        coupon = await db.coupons.find_one({"code": {"$regex": f"^{payload.code}$", "$options": "i"}, "active": True}, {"_id": 0})

    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    cart["coupon"] = coupon["code"]
    await _save_cart(user["id"], cart)

    subtotal = sum(item["price"] * item["qty"] for item in cart["items"])
    discount = min(subtotal, coupon["value"]) if coupon["type"] == "flat" else subtotal * (coupon["value"] / 100)
    total = max(0, subtotal - discount)
    return {"subtotal": subtotal, "discount": round(discount, 2), "total": round(total, 2)}
