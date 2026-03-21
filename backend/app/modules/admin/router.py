from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.store import store

router = APIRouter(prefix="/admin", tags=["admin"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class BanPayload(BaseModel):
    banned: bool


class ApproveVendorPayload(BaseModel):
    approved: bool
    notes: str | None = None


class ApproveProductPayload(BaseModel):
    approved: bool


class CouponPayload(BaseModel):
    code: str
    type: str = "flat"
    value: float
    active: bool = True


@router.get("/users")
async def list_users(_=Depends(require_role("admin"))):
    if settings.use_in_memory:
        return [
            {
                "id": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "is_active": u["is_active"],
                "banned": u.get("banned", False),
            }
            for u in store.users.values()
        ]

    db = await get_db()
    users = await db.users.find({}, {"_id": 0}).to_list(length=1000)
    return [
        {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"],
            "is_active": u["is_active"],
            "banned": u.get("banned", False),
        }
        for u in users
    ]


@router.put("/users/{user_id}/ban")
async def ban_user(user_id: str, payload: BanPayload, _=Depends(require_role("admin"))):
    if settings.use_in_memory:
        user = store.users.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["banned"] = payload.banned
        return {"ok": True}

    db = await get_db()
    result = await db.users.update_one({"id": user_id}, {"$set": {"banned": payload.banned}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


@router.get("/vendors")
async def list_vendors(_=Depends(require_role("admin"))):
    if settings.use_in_memory:
        return list(store.vendors.values())
    db = await get_db()
    return await db.vendors.find({}, {"_id": 0}).to_list(length=1000)


@router.put("/vendors/{vendor_user_id}/approve")
async def approve_vendor(vendor_user_id: str, payload: ApproveVendorPayload, _=Depends(require_role("admin"))):
    kyc_status = "approved" if payload.approved else "rejected"
    if settings.use_in_memory:
        vendor = store.vendors.get(vendor_user_id)
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        vendor["kyc_status"] = kyc_status
        vendor["review_notes"] = payload.notes
        return vendor

    db = await get_db()
    result = await db.vendors.update_one(
        {"user_id": vendor_user_id},
        {"$set": {"kyc_status": kyc_status, "review_notes": payload.notes}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return await db.vendors.find_one({"user_id": vendor_user_id}, {"_id": 0})


@router.get("/products/pending")
async def pending_products(_=Depends(require_role("admin"))):
    if settings.use_in_memory:
        return [p for p in store.products.values() if p.get("moderation") == "pending"]
    db = await get_db()
    return await db.products.find({"moderation": "pending"}, {"_id": 0}).to_list(length=1000)


@router.put("/products/{product_id}/approve")
async def approve_product(product_id: str, payload: ApproveProductPayload, _=Depends(require_role("admin"))):
    moderation = "approved" if payload.approved else "rejected"
    if settings.use_in_memory:
        product = store.products.get(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product["moderation"] = moderation
        return product

    db = await get_db()
    result = await db.products.update_one({"id": product_id}, {"$set": {"moderation": moderation}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": product_id}, {"_id": 0})


@router.post("/coupons")
async def create_coupon(payload: CouponPayload, _=Depends(require_role("admin"))):
    coupon_id = _new_id()
    record = {"id": coupon_id, **payload.model_dump()}

    if settings.use_in_memory:
        store.coupons[coupon_id] = record
    else:
        db = await get_db()
        await db.coupons.insert_one(dict(record))

    return record


@router.put("/coupons/{coupon_id}")
async def update_coupon(coupon_id: str, payload: CouponPayload, _=Depends(require_role("admin"))):
    if settings.use_in_memory:
        coupon = store.coupons.get(coupon_id)
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")
        coupon.update(payload.model_dump())
        return coupon

    db = await get_db()
    result = await db.coupons.update_one({"id": coupon_id}, {"$set": payload.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return await db.coupons.find_one({"id": coupon_id}, {"_id": 0})


@router.put("/vendors/{vendor_user_id}/payout")
async def approve_payout(vendor_user_id: str, _=Depends(require_role("admin"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(vendor_user_id)
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        amount = vendor.get("pending_payout", 0.0)
        vendor["pending_payout"] = 0.0
        return {"ok": True, "amount_paid": amount}

    db = await get_db()
    vendor = await db.vendors.find_one({"user_id": vendor_user_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    amount = vendor.get("pending_payout", 0.0)
    await db.vendors.update_one({"user_id": vendor_user_id}, {"$set": {"pending_payout": 0.0}})
    return {"ok": True, "amount_paid": amount}
