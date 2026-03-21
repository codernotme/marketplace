from uuid import uuid4

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.store import store, utcnow

router = APIRouter(prefix="/recommendations", tags=["recommendations"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class EventPayload(BaseModel):
    event_type: str
    product_id: str
    meta: dict = {}


@router.get("/home")
async def home(user=Depends(get_current_user)):
    wishlist = user.get("wishlist", [])
    if settings.use_in_memory:
        products = list(store.products.values())
        products_by_id = store.products
    else:
        db = await get_db()
        products = await db.products.find({}, {"_id": 0}).to_list(length=500)
        products_by_id = {p["id"]: p for p in products}

    preferred_products = [products_by_id[pid] for pid in wishlist if pid in products_by_id]
    if preferred_products:
        category_ids = {p.get("category_id") for p in preferred_products}
        return [p for p in products if p.get("category_id") in category_ids][:12]
    return products[:12]


@router.get("/similar/{product_id}")
async def similar(product_id: str, limit: int = 8):
    if settings.use_in_memory:
        product = store.products.get(product_id)
        products = list(store.products.values())
    else:
        db = await get_db()
        product = await db.products.find_one({"id": product_id}, {"_id": 0})
        products = await db.products.find({}, {"_id": 0}).to_list(length=500)

    if not product:
        return []
    same_category = [p for p in products if p.get("category_id") == product.get("category_id") and p["id"] != product_id]
    return same_category[:limit]


@router.get("/trending")
async def trending(limit: int = 10):
    if settings.use_in_memory:
        viewed = sorted(store.products.values(), key=lambda p: p.get("views", 0), reverse=True)
        return viewed[:limit]

    db = await get_db()
    viewed = await db.products.find({}, {"_id": 0}).sort("views", -1).limit(limit).to_list(length=limit)
    return viewed


@router.post("/event")
async def log_event(payload: EventPayload, user=Depends(get_current_user)):
    event = {
        "id": _new_id(),
        "user_id": user["id"],
        "event_type": payload.event_type,
        "product_id": payload.product_id,
        "meta": payload.meta,
        "timestamp": utcnow().isoformat(),
    }

    if settings.use_in_memory:
        store.events.append(event)
    else:
        db = await get_db()
        await db.events.insert_one(dict(event))

    return {"ok": True}
