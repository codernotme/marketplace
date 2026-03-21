from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.store import store, utcnow

router = APIRouter(prefix="/reviews", tags=["reviews"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class SubmitReview(BaseModel):
    product_id: str
    rating: int
    body: str


class ReplyPayload(BaseModel):
    text: str


@router.post("")
async def submit_review(payload: SubmitReview, user=Depends(get_current_user)):
    if settings.use_in_memory:
        if payload.product_id not in store.products:
            raise HTTPException(status_code=404, detail="Product not found")
    else:
        db = await get_db()
        product = await db.products.find_one({"id": payload.product_id}, {"_id": 0, "id": 1})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

    review_id = _new_id()
    review = {
        "id": review_id,
        "product_id": payload.product_id,
        "user_id": user["id"],
        "rating": payload.rating,
        "body": payload.body,
        "helpful": 0,
        "vendor_reply": None,
        "created_at": utcnow().isoformat(),
    }

    if settings.use_in_memory:
        store.reviews[review_id] = review
    else:
        await db.reviews.insert_one(dict(review))

    return review


@router.get("/{product_id}")
async def get_reviews(product_id: str):
    if settings.use_in_memory:
        return [r for r in store.reviews.values() if r["product_id"] == product_id]
    db = await get_db()
    return await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(length=500)


@router.post("/{review_id}/helpful")
async def vote_helpful(review_id: str, _=Depends(get_current_user)):
    if settings.use_in_memory:
        review = store.reviews.get(review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        review["helpful"] += 1
        return {"helpful": review["helpful"]}

    db = await get_db()
    result = await db.reviews.update_one({"id": review_id}, {"$inc": {"helpful": 1}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0, "helpful": 1})
    return {"helpful": review.get("helpful", 0)}


@router.post("/{review_id}/reply")
async def vendor_reply(review_id: str, payload: ReplyPayload, user=Depends(get_current_user)):
    if user["role"] not in ["vendor", "admin"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if settings.use_in_memory:
        review = store.reviews.get(review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        review["vendor_reply"] = payload.text
        return review

    db = await get_db()
    result = await db.reviews.update_one({"id": review_id}, {"$set": {"vendor_reply": payload.text}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return await db.reviews.find_one({"id": review_id}, {"_id": 0})
