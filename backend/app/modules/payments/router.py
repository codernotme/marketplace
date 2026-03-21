from uuid import uuid4

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.store import store, utcnow

router = APIRouter(prefix="/payments", tags=["payments"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class CreateOrderRequest(BaseModel):
    amount: int
    currency: str = "INR"
    receipt: str


class VerifyPaymentRequest(BaseModel):
    order_id: str
    payment_id: str
    signature: str


class RefundRequest(BaseModel):
    payment_id: str
    amount: int
    notes: str | None = None


@router.post("/create-order")
async def create_payment_order(payload: CreateOrderRequest, user=Depends(get_current_user)):
    pid = _new_id()
    tx = {
        "id": pid,
        "gateway_order_id": f"order_{pid[:8]}",
        "amount": payload.amount,
        "currency": payload.currency,
        "receipt": payload.receipt,
        "status": "created",
        "user_id": user["id"],
        "created_at": utcnow().isoformat(),
    }

    if settings.use_in_memory:
        store.transactions[pid] = tx
    else:
        db = await get_db()
        await db.transactions.insert_one(dict(tx))

    return tx


@router.post("/verify")
async def verify(payload: VerifyPaymentRequest, user=Depends(get_current_user)):
    if not payload.signature:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if settings.use_in_memory:
        tx = store.transactions.get(payload.order_id)
        if tx:
            tx["status"] = "captured"
            tx["payment_id"] = payload.payment_id
    else:
        db = await get_db()
        tx = await db.transactions.find_one({"id": payload.order_id}, {"_id": 0})
        if tx:
            await db.transactions.update_one(
                {"id": payload.order_id},
                {"$set": {"status": "captured", "payment_id": payload.payment_id}},
            )

    return {"ok": True, "order_id": payload.order_id, "user_id": user["id"]}


@router.post("/webhook")
async def webhook(payload: dict, x_razorpay_signature: str | None = Header(default=None)):
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature")
    return {"ok": True, "event": payload.get("event")}


@router.post("/refund")
async def refund(payload: RefundRequest, _=Depends(require_role("admin"))):
    if settings.use_in_memory:
        tx = next((t for t in store.transactions.values() if t.get("payment_id") == payload.payment_id), None)
        if not tx:
            raise HTTPException(status_code=404, detail="Payment not found")
        tx["status"] = "refunded"
        tx["refund_amount"] = payload.amount
        return tx

    db = await get_db()
    tx = await db.transactions.find_one({"payment_id": payload.payment_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Payment not found")
    await db.transactions.update_one(
        {"id": tx["id"]},
        {"$set": {"status": "refunded", "refund_amount": payload.amount}},
    )
    return await db.transactions.find_one({"id": tx["id"]}, {"_id": 0})


@router.get("/history")
async def history(user=Depends(get_current_user)):
    if settings.use_in_memory:
        if user["role"] == "admin":
            return list(store.transactions.values())
        return [tx for tx in store.transactions.values() if tx.get("user_id") == user["id"]]

    db = await get_db()
    if user["role"] == "admin":
        return await db.transactions.find({}, {"_id": 0}).to_list(length=2000)
    return await db.transactions.find({"user_id": user["id"]}, {"_id": 0}).to_list(length=2000)
