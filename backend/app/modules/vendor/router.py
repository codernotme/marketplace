from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.store import store

router = APIRouter(prefix="/vendor", tags=["vendor"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class VendorApply(BaseModel):
    store_name: str
    description: str | None = None


class StoreUpdate(BaseModel):
    store_name: str | None = None
    description: str | None = None


class KYCData(BaseModel):
    pan: str
    bank_account: str


class PayoutRequest(BaseModel):
    amount: float


@router.post("/apply")
async def apply(payload: VendorApply, user=Depends(get_current_user)):
    vendor = {
        "id": _new_id(),
        "user_id": user["id"],
        "store_name": payload.store_name,
        "description": payload.description,
        "kyc_status": "pending",
        "commission_rate": 10.0,
        "earnings": 0.0,
        "pending_payout": 0.0,
    }

    if settings.use_in_memory:
        store.vendors[user["id"]] = vendor
        user["role"] = "vendor"
        return vendor

    db = await get_db()
    await db.vendors.update_one({"user_id": user["id"]}, {"$set": vendor}, upsert=True)
    await db.users.update_one({"id": user["id"]}, {"$set": {"role": "vendor"}})
    return vendor


@router.get("/profile")
async def profile(user=Depends(require_role("vendor"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(user["id"])
    else:
        db = await get_db()
        vendor = await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return vendor


@router.put("/profile")
async def update_profile(payload: StoreUpdate, user=Depends(require_role("vendor"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(user["id"])
    else:
        db = await get_db()
        vendor = await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    update_data = payload.model_dump(exclude_none=True)
    if settings.use_in_memory:
        vendor.update(update_data)
        return vendor

    if update_data:
        await db.vendors.update_one({"user_id": user["id"]}, {"$set": update_data})
    return await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})


@router.post("/kyc")
async def submit_kyc(payload: KYCData, user=Depends(require_role("vendor"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(user["id"])
    else:
        db = await get_db()
        vendor = await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    if settings.use_in_memory:
        vendor["kyc"] = payload.model_dump()
        vendor["kyc_status"] = "submitted"
        return vendor

    await db.vendors.update_one(
        {"user_id": user["id"]},
        {"$set": {"kyc": payload.model_dump(), "kyc_status": "submitted"}},
    )
    return await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})


@router.get("/earnings")
async def earnings(user=Depends(require_role("vendor"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(user["id"])
    else:
        db = await get_db()
        vendor = await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return {
        "total_earnings": vendor.get("earnings", 0.0),
        "pending_payout": vendor.get("pending_payout", 0.0),
        "commission_rate": vendor.get("commission_rate", 10.0),
    }


@router.post("/payout")
async def request_payout(payload: PayoutRequest, user=Depends(require_role("vendor"))):
    if settings.use_in_memory:
        vendor = store.vendors.get(user["id"])
    else:
        db = await get_db()
        vendor = await db.vendors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    pending_payout = vendor.get("pending_payout", 0.0) + payload.amount
    if settings.use_in_memory:
        vendor["pending_payout"] = pending_payout
    else:
        await db.vendors.update_one({"user_id": user["id"]}, {"$set": {"pending_payout": pending_payout}})

    return {"ok": True, "pending_payout": pending_payout}
