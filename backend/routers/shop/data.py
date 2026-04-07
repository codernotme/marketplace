from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.dependencies import get_tenant, get_tenant_db, pagination_params
from services.demo_data import shop_dashboard_bootstrap, storefront_content
from utils.object_id import try_object_id
from utils.serialize import to_jsonable

router = APIRouter(prefix="/data", tags=["shop-data"])


def _json_list(items):
    return [to_jsonable(item) for item in items]


@router.get("/bootstrap")
async def bootstrap(_: dict = Depends(get_tenant)):
    return to_jsonable(shop_dashboard_bootstrap())


@router.get("/storefront-content")
async def get_storefront_content(_: dict = Depends(get_tenant)):
    return storefront_content()


@router.get("/categories")
async def list_categories(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["categories"].find({"tenant_id": tenant["_id"]}).sort("name", 1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/reviews")
async def list_reviews(
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    product_id: str | None = Query(default=None),
):
    query = {"tenant_id": tenant["_id"]}
    if product_id:
        product_oid = try_object_id(product_id)
        query["$or"] = [{"product_id": product_id}, {"productId": product_id}]
        if product_oid is not None:
            query["$or"].append({"product_id": product_oid})
    cursor = tenant_db["reviews"].find(query).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/blog-posts")
async def list_blog_posts(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["blog_posts"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/orders")
async def list_orders(
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    pg: tuple[int, int] = Depends(pagination_params),
):
    skip, limit = pg
    cursor = (
        tenant_db["orders"]
        .find({"tenant_id": tenant["_id"]})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    data = [to_jsonable(item) async for item in cursor]
    total = await tenant_db["orders"].count_documents({"tenant_id": tenant["_id"]})
    return {"data": data, "total": total}


@router.get("/orders/{order_id}")
async def get_order(order_id: str, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    query = {
        "tenant_id": tenant["_id"],
        "$or": [{"id": order_id}, {"orderNumber": order_id}, {"order_number": order_id}],
    }
    order = await tenant_db["orders"].find_one(query)
    return {"data": to_jsonable(order) if order else None}


@router.get("/addresses")
async def list_addresses(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["addresses"].find({"tenant_id": tenant["_id"]}).sort("isDefault", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/notifications")
async def list_notifications(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["notifications"].find({"tenant_id": tenant["_id"]}).sort("createdAt", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/customers")
async def list_customers(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("customers", []))}


@router.get("/coupons")
async def list_coupons(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("coupons", []))}


@router.get("/tickets")
async def list_tickets(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("tickets", []))}


@router.get("/banners")
async def list_banners(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("banners", []))}


@router.get("/pages")
async def list_pages(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("pages", []))}


@router.get("/email-templates")
async def list_email_templates(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("emailTemplates", []))}


@router.get("/team")
async def list_team(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("teamMembers", []))}


@router.get("/analytics")
async def get_analytics(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("analyticsData", {}))}


@router.get("/kpi")
async def get_kpi(_: dict = Depends(get_tenant)):
    bs = shop_dashboard_bootstrap()
    return {"data": to_jsonable(bs.get("kpiData", {}))}


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str, payload: dict, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)
):
    query = {
        "tenant_id": tenant["_id"],
        "$or": [{"id": order_id}, {"orderNumber": order_id}, {"order_number": order_id}],
    }
    if "status" in payload:
        await tenant_db["orders"].update_one(
            query, {"$set": {"fulfillmentStatus": payload["status"]}}
        )
    return {"message": "Success"}


@router.patch("/orders/{order_id}/tracking")
async def update_order_tracking(
    order_id: str, payload: dict, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)
):
    query = {
        "tenant_id": tenant["_id"],
        "$or": [{"id": order_id}, {"orderNumber": order_id}, {"order_number": order_id}],
    }
    updates = {}
    if "trackingNumber" in payload:
        updates["trackingNumber"] = payload["trackingNumber"]
        updates["tracking_number"] = payload["trackingNumber"]
    if "courier" in payload:
        updates["courier"] = payload["courier"]
    if updates:
        await tenant_db["orders"].update_one(query, {"$set": updates})
    return {"message": "Success"}
