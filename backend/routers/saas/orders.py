from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request

from core.dependencies import get_master_db, saas_admin_required
from utils.serialize import to_jsonable

router = APIRouter(tags=["saas-orders"])


def _get_payment_status(order: dict) -> str:
    return (
        order.get("payment_status")
        or order.get("paymentStatus")
        or (order.get("payment") or {}).get("status")
        or "pending"
    )


def _get_fulfillment_status(order: dict) -> str:
    return (
        order.get("fulfillment_status")
        or order.get("fulfillmentStatus")
        or (order.get("fulfillment") or {}).get("status")
        or "pending"
    )


def _get_total_amount(order: dict) -> float:
    if "total_amount" in order:
        return float(order.get("total_amount", 0) or 0)
    pricing = order.get("pricing") or {}
    if "grand_total" in pricing:
        return float(pricing.get("grand_total", 0) or 0)
    if "grandTotal" in pricing:
        return float(pricing.get("grandTotal", 0) or 0)
    return 0.0


@router.get("/orders")
async def get_all_orders(
    request: Request,
    tenant_id: str | None = Query(default=None),
    payment_status: str | None = Query(default=None),
    fulfillment_status: str | None = Query(default=None),
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    db_manager = request.app.state.db_manager

    tenant_query = {"status": "active"}
    if tenant_id:
        tenant_query["$or"] = [{"slug": tenant_id}, {"_id": tenant_id}]

    resolved_tenants = [t async for t in master_db["tenants"].find(tenant_query)]

    data: list[dict] = []
    for tenant in resolved_tenants:
        tenant_db = await db_manager.get_tenant_db(tenant)
        query: dict = {"tenant_id": tenant["_id"]}
        cursor = tenant_db["orders"].find(query).sort("created_at", -1).limit(500)
        async for order in cursor:
            order_payment_status = _get_payment_status(order)
            order_fulfillment_status = _get_fulfillment_status(order)
            if payment_status and order_payment_status != payment_status:
                continue
            if fulfillment_status and order_fulfillment_status != fulfillment_status:
                continue

            obj = to_jsonable(order)
            obj["tenant_slug"] = tenant.get("slug")
            obj["tenant_name"] = tenant.get("name")
            obj["payment_status"] = order_payment_status
            obj["fulfillment_status"] = order_fulfillment_status
            obj["total_amount"] = _get_total_amount(order)
            data.append(obj)

    return {"data": data}


@router.get("/orders/stats")
async def get_order_stats(
    request: Request,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    db_manager = request.app.state.db_manager

    total_revenue = 0.0
    total_orders = 0
    successful_orders = 0

    async for tenant in master_db["tenants"].find({"status": "active"}):
        tenant_db = await db_manager.get_tenant_db(tenant)
        cursor = tenant_db["orders"].find({"tenant_id": tenant["_id"]})
        async for order in cursor:
            total_orders += 1
            payment_status = _get_payment_status(order)
            if payment_status == "paid":
                successful_orders += 1
                total_revenue += _get_total_amount(order)

    avg_order_value = (total_revenue / successful_orders) if successful_orders > 0 else 0.0
    success_rate = (successful_orders / total_orders * 100) if total_orders > 0 else 0.0

    return {
        "gross_revenue": round(total_revenue, 2),
        "avg_order_value": round(avg_order_value, 2),
        "total_volume": total_orders,
        "success_rate": round(success_rate, 2),
    }
