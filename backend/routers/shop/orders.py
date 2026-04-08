from __future__ import annotations

from fastapi import APIRouter, Body, Depends, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.dependencies import (
    get_current_user,
    get_current_user_optional,
    get_tenant,
    get_tenant_db,
)
from services.order_service import (
    compute_order_pricing,
    create_order,
    render_invoice_html,
    send_order_invoice_emails,
)
from services.tenant_config_service import get_tenant_config
from utils.serialize import to_jsonable

router = APIRouter(prefix="/orders", tags=["shop-orders"])


@router.post("/create")
async def place_order(
    request: Request,
    payload: dict = Body(...),
    tenant: dict = Depends(get_tenant),
    tenant_db: AsyncIOMotorDatabase = Depends(get_tenant_db),
    user: dict | None = Depends(get_current_user_optional),
):
    items = payload.get("items", [])
    shipping_fee = payload.get("shipping_fee", 0.0)
    coupon_discount = payload.get("coupon_discount", 0.0)

    pricing = compute_order_pricing(items, shipping_fee, coupon_discount)

    shipping_address = payload.get("shipping_address") or {}
    explicit_customer_email = payload.get("customer_email") or shipping_address.get("email")
    explicit_customer_name = payload.get("customer_name") or shipping_address.get("full_name")

    master_db = request.app.state.db_manager.master_db
    tenant_config = await get_tenant_config(master_db, str(tenant["_id"]))

    order = await create_order(
        db=tenant_db,
        tenant=tenant,
        user=user,
        items=items,
        pricing=pricing,
        shipping_address=shipping_address,
        payment_method=payload.get("payment_method", "card"),
        source=payload.get("source", "web"),
        customer_email=explicit_customer_email,
        customer_name=explicit_customer_name,
        resend_api_key=tenant_config.get("resend_api_key"),
    )

    return {"status": "success", "order": to_jsonable(order)}

@router.get("/my-orders")
async def get_my_orders(
    tenant: dict = Depends(get_tenant),
    tenant_db: AsyncIOMotorDatabase = Depends(get_tenant_db),
    user: dict = Depends(get_current_user),
):
    cursor = tenant_db["orders"].find({"user_id": user["_id"]}).sort("created_at", -1)
    orders = [to_jsonable(item) async for item in cursor]
    return {"status": "success", "data": orders}


@router.get("/{order_id}/invoice")
async def get_order_invoice(
    order_id: str,
    tenant: dict = Depends(get_tenant),
    tenant_db: AsyncIOMotorDatabase = Depends(get_tenant_db),
    _: dict = Depends(get_current_user),
):
    order = await tenant_db["orders"].find_one(
        {
            "tenant_id": tenant["_id"],
            "$or": [
                {"_id": order_id},
                {"order_number": order_id},
                {"orderNumber": order_id},
                {"id": order_id},
            ],
        }
    )
    if not order:
        # Fallback for ObjectId-backed documents.
        from utils.object_id import try_object_id

        oid = try_object_id(order_id)
        if oid is not None:
            order = await tenant_db["orders"].find_one(
                {
                    "tenant_id": tenant["_id"],
                    "$or": [
                        {"_id": oid},
                        {"order_number": order_id},
                        {"orderNumber": order_id},
                        {"id": order_id},
                    ],
                }
            )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    html = render_invoice_html(order=order, tenant=tenant)
    return {"status": "success", "order": to_jsonable(order), "invoice_html": html}


@router.post("/{order_id}/send-email")
async def send_order_invoice_email(
    request: Request,
    order_id: str,
    tenant: dict = Depends(get_tenant),
    tenant_db: AsyncIOMotorDatabase = Depends(get_tenant_db),
    _: dict = Depends(get_current_user),
):
    order = await tenant_db["orders"].find_one(
        {
            "tenant_id": tenant["_id"],
            "$or": [
                {"_id": order_id},
                {"order_number": order_id},
                {"orderNumber": order_id},
                {"id": order_id},
            ],
        }
    )
    if not order:
        from utils.object_id import try_object_id

        oid = try_object_id(order_id)
        if oid is not None:
            order = await tenant_db["orders"].find_one(
                {
                    "tenant_id": tenant["_id"],
                    "$or": [
                        {"_id": oid},
                        {"order_number": order_id},
                        {"orderNumber": order_id},
                        {"id": order_id},
                    ],
                }
            )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    master_db = request.app.state.db_manager.master_db
    tenant_config = await get_tenant_config(master_db, str(tenant["_id"]))
    await send_order_invoice_emails(
        order=order,
        tenant=tenant,
        resend_api_key=tenant_config.get("resend_api_key"),
    )
    return {"status": "success", "message": "Invoice emails sent"}
