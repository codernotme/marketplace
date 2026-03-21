from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.store import store
from app.utils.slug_utils import generate_slug

router = APIRouter(prefix="/categories", tags=["categories"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class CategoryPayload(BaseModel):
    name: str
    parent_id: str | None = None
    icon: str | None = None


@router.get("")
async def list_categories():
    if not settings.use_in_memory:
        db = await get_db()
        return await db.categories.find({}, {"_id": 0}).to_list(length=1000)
    return list(store.categories.values())


@router.get("/{slug}")
async def get_category(slug: str):
    if not settings.use_in_memory:
        db = await get_db()
        category = await db.categories.find_one({"slug": slug}, {"_id": 0})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        products = await db.products.find({"category_id": category["id"]}, {"_id": 0}).to_list(length=1000)
        return {"category": category, "products": products}

    category = next((c for c in store.categories.values() if c["slug"] == slug), None)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    products = [p for p in store.products.values() if p.get("category_id") == category["id"]]
    return {"category": category, "products": products}


@router.post("")
async def create_category(payload: CategoryPayload, _=Depends(require_role("admin"))):
    category_id = _new_id()
    category = {
        "id": category_id,
        "name": payload.name,
        "slug": generate_slug(payload.name),
        "parent_id": payload.parent_id,
        "icon": payload.icon,
    }

    if not settings.use_in_memory:
        db = await get_db()
        await db.categories.insert_one(dict(category))
        return category

    store.categories[category_id] = category
    return category


@router.put("/{category_id}")
async def update_category(category_id: str, payload: CategoryPayload, _=Depends(require_role("admin"))):
    if not settings.use_in_memory:
        db = await get_db()
        category = await db.categories.find_one({"id": category_id}, {"_id": 0})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        update_data = payload.model_dump(exclude_none=True)
        if payload.name:
            update_data["slug"] = generate_slug(payload.name)
        if update_data:
            await db.categories.update_one({"id": category_id}, {"$set": update_data})
        return await db.categories.find_one({"id": category_id}, {"_id": 0})

    category = store.categories.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.update(payload.model_dump(exclude_none=True))
    if payload.name:
        category["slug"] = generate_slug(payload.name)
    return category


@router.delete("/{category_id}")
async def delete_category(category_id: str, _=Depends(require_role("admin"))):
    if not settings.use_in_memory:
        db = await get_db()
        category = await db.categories.find_one({"id": category_id}, {"_id": 0})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        await db.categories.delete_one({"id": category_id})
        return {"ok": True}

    if category_id not in store.categories:
        raise HTTPException(status_code=404, detail="Category not found")
    del store.categories[category_id]
    return {"ok": True}
