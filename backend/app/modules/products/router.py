from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.store import store, utcnow
from app.utils.cloudinary_utils import upload_image
from app.utils.pagination import paginate
from app.utils.slug_utils import ensure_unique_slug, generate_slug

router = APIRouter(prefix="/products", tags=["products"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


async def _list_all_products() -> list[dict]:
    if settings.use_in_memory:
        return list(store.products.values())
    db = await get_db()
    return await db.products.find({}, {"_id": 0}).to_list(length=2000)


async def _get_product_by_id(product_id: str) -> dict | None:
    if settings.use_in_memory:
        return store.products.get(product_id)
    db = await get_db()
    return await db.products.find_one({"id": product_id}, {"_id": 0})


class ProductPayload(BaseModel):
    title: str
    description: str
    category_id: str | None = None
    price: float
    tags: list[str] = []
    variants: list[dict] = []
    images: list[str] = []


@router.get("")
async def list_products(page: int = 1, limit: int = 20, category_id: str | None = None):
    products = await _list_all_products()
    if category_id:
        products = [p for p in products if p.get("category_id") == category_id]
    return paginate(products, page, limit)


@router.get("/search")
async def search_products(q: str = Query(default="")):
    query = q.lower()
    products = await _list_all_products()
    return [
        product
        for product in products
        if query in product["title"].lower() or query in product["description"].lower() or any(query in tag.lower() for tag in product.get("tags", []))
    ]


@router.get("/trending")
async def trending(limit: int = 10):
    products = sorted(await _list_all_products(), key=lambda p: p.get("views", 0), reverse=True)
    return products[:limit]


@router.get("/{slug}")
async def get_product(slug: str):
    if settings.use_in_memory:
        product = next((p for p in store.products.values() if p["slug"] == slug), None)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product["views"] = product.get("views", 0) + 1
        return product

    db = await get_db()
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    views = product.get("views", 0) + 1
    await db.products.update_one({"id": product["id"]}, {"$set": {"views": views}})
    product["views"] = views
    return product


@router.post("")
async def create_product(payload: ProductPayload, user=Depends(require_role("vendor"))):
    raw_slug = generate_slug(payload.title)
    existing_products = await _list_all_products()
    slug = ensure_unique_slug({p["slug"] for p in existing_products}, raw_slug)
    product_id = _new_id()
    product = {
        "id": product_id,
        "slug": slug,
        "vendor_id": user["id"],
        **payload.model_dump(),
        "rating": 0.0,
        "rating_count": 0,
        "created_at": utcnow().isoformat(),
        "deleted": False,
    }
    if settings.use_in_memory:
        store.products[product_id] = product
    else:
        db = await get_db()
        await db.products.insert_one(dict(product))
    return product


@router.put("/{product_id}")
async def update_product(product_id: str, payload: ProductPayload, user=Depends(get_current_user)):
    product = await _get_product_by_id(product_id)
    if not product or product.get("deleted"):
        raise HTTPException(status_code=404, detail="Product not found")
    if user["role"] not in ["vendor", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient role")
    if user["role"] == "vendor" and product["vendor_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not owner")

    data = payload.model_dump(exclude_none=True)
    if "title" in data:
        all_products = await _list_all_products()
        data["slug"] = ensure_unique_slug({p["slug"] for p in all_products if p["id"] != product_id}, generate_slug(data["title"]))

    if settings.use_in_memory:
        product.update(data)
        return product

    db = await get_db()
    if data:
        await db.products.update_one({"id": product_id}, {"$set": data})
    return await db.products.find_one({"id": product_id}, {"_id": 0})


@router.delete("/{product_id}")
async def delete_product(product_id: str, user=Depends(get_current_user)):
    product = await _get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if user["role"] not in ["vendor", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient role")
    if settings.use_in_memory:
        product["deleted"] = True
    else:
        db = await get_db()
        await db.products.update_one({"id": product_id}, {"$set": {"deleted": True}})
    return {"ok": True}


@router.post("/{product_id}/images")
async def upload_product_images(product_id: str, files: list[UploadFile], user=Depends(get_current_user)):
    product = await _get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if user["role"] not in ["vendor", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient role")

    urls = []
    for file in files:
        urls.append(await upload_image(file, folder=f"products/{product_id}"))
    if settings.use_in_memory:
        product.setdefault("images", []).extend(urls)
    else:
        db = await get_db()
        images = product.get("images", []) + urls
        await db.products.update_one({"id": product_id}, {"$set": {"images": images}})
    return {"images": urls}


@router.get("/{product_id}/reviews")
async def get_product_reviews(product_id: str):
    if not settings.use_in_memory:
        db = await get_db()
        return await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(length=1000)
    return [r for r in store.reviews.values() if r["product_id"] == product_id]


class ReviewPayload(BaseModel):
    rating: int
    body: str


@router.post("/{product_id}/reviews")
async def submit_review(product_id: str, payload: ReviewPayload, user=Depends(get_current_user)):
    product = await _get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    review_id = _new_id()
    review = {
        "id": review_id,
        "product_id": product_id,
        "user_id": user["id"],
        "rating": payload.rating,
        "body": payload.body,
        "helpful": 0,
        "created_at": utcnow().isoformat(),
    }
    if settings.use_in_memory:
        store.reviews[review_id] = review
        product_reviews = [r for r in store.reviews.values() if r["product_id"] == product_id]
        total = sum(r["rating"] for r in product_reviews)
        store.products[product_id]["rating"] = round(total / len(product_reviews), 2)
        store.products[product_id]["rating_count"] = len(product_reviews)
        return review

    db = await get_db()
    await db.reviews.insert_one(dict(review))
    product_reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(length=1000)
    total = sum(r["rating"] for r in product_reviews)
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"rating": round(total / len(product_reviews), 2), "rating_count": len(product_reviews)}},
    )

    return review
