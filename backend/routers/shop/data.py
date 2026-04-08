from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.dependencies import get_tenant, get_tenant_db, pagination_params
from utils.object_id import try_object_id
from utils.serialize import to_jsonable

router = APIRouter(prefix="/data", tags=["shop-data"])


def _json_list(items):
    return [to_jsonable(item) for item in items]


@router.get("/bootstrap")
async def bootstrap(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    products = [
        to_jsonable(item)
        async for item in tenant_db["products"].find({"tenant_id": tenant["_id"]}).limit(200)
    ]
    orders = [
        to_jsonable(item)
        async for item in tenant_db["orders"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1).limit(200)
    ]
    customers = [
        to_jsonable(item)
        async for item in tenant_db["users"].find(
            {"tenant_id": tenant["_id"], "role": {"$in": ["customer", "user"]}}
        )
        .sort("created_at", -1)
        .limit(200)
    ]

    categories = [
        to_jsonable(item)
        async for item in tenant_db["categories"].find({"tenant_id": tenant["_id"]}).sort("name", 1)
    ]
    coupons = [
        to_jsonable(item)
        async for item in tenant_db["coupons"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1).limit(200)
    ]
    tickets = [
        to_jsonable(item)
        async for item in tenant_db["queries"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1).limit(200)
    ]
    banners = [
        to_jsonable(item)
        async for item in tenant_db["banners"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1).limit(200)
    ]

    return {
        "products": products,
        "orders": orders,
        "customers": customers,
        "categories": categories,
        "brands": [],
        "coupons": coupons,
        "tickets": tickets,
        "banners": banners,
        "pages": [],
    }


@router.get("/storefront-content")
async def get_storefront_content(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    settings = await tenant_db["shop_settings"].find_one({"tenant_id": tenant["_id"]})
    return {
        "brand": {
            "siteName": (settings or {}).get("brand_name") or tenant.get("name") or "theMrktPlace",
            "tagline": (settings or {}).get("tagline") or "Shop smarter, live better.",
        },
        "navigation": {
            "shopCategories": (settings or {}).get("shop_categories", []),
            "primaryLinks": (settings or {}).get("primary_links", []),
            "searchPlaceholder": (settings or {}).get("search_placeholder", "Search products"),
            "authLabels": {
                "signIn": "Sign In",
                "signOut": "Sign Out",
                "accountShortName": "Account",
            },
        },
        "footer": (settings or {}).get("footer", {}),
    }


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
async def list_customers(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = (
        tenant_db["users"]
        .find({"tenant_id": tenant["_id"], "role": {"$in": ["customer", "user"]}})
        .sort("created_at", -1)
    )
    return {"data": _json_list([item async for item in cursor])}


@router.get("/coupons")
async def list_coupons(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["coupons"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/tickets")
async def list_tickets(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["queries"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/banners")
async def list_banners(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["banners"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/pages")
async def list_pages(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["pages"].find({"tenant_id": tenant["_id"]}).sort("created_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/email-templates")
async def list_email_templates(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["email_templates"].find({"tenant_id": tenant["_id"]}).sort("updated_at", -1)
    return {"data": _json_list([item async for item in cursor])}


@router.get("/team")
async def list_team(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = tenant_db["users"].find(
        {
            "tenant_id": tenant["_id"],
            "role": {"$in": ["shop_admin", "staff", "manager"]},
            "is_active": True,
        }
    )
    return {"data": _json_list([item async for item in cursor])}


@router.get("/analytics")
async def get_analytics(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    total_orders = await tenant_db["orders"].count_documents({"tenant_id": tenant["_id"]})
    paid_orders = await tenant_db["orders"].count_documents(
        {
            "tenant_id": tenant["_id"],
            "$or": [
                {"payment_status": "paid"},
                {"paymentStatus": "paid"},
                {"payment.status": "paid"},
            ],
        }
    )
    return {
        "data": {
            "total_orders": total_orders,
            "paid_orders": paid_orders,
            "conversion_rate": round((paid_orders / total_orders * 100), 2) if total_orders else 0,
        }
    }


@router.get("/kpi")
async def get_kpi(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    total_orders = await tenant_db["orders"].count_documents({"tenant_id": tenant["_id"]})
    paid_count = 0
    gross_revenue = 0.0
    async for order in tenant_db["orders"].find({"tenant_id": tenant["_id"]}):
        payment_status = (
            order.get("payment_status")
            or order.get("paymentStatus")
            or (order.get("payment") or {}).get("status")
            or "pending"
        )
        if payment_status == "paid":
            paid_count += 1
            pricing = order.get("pricing") or {}
            gross_revenue += float(
                order.get("total_amount")
                or pricing.get("grand_total")
                or pricing.get("grandTotal")
                or 0
            )

    return {
        "data": {
            "total_orders": total_orders,
            "paid_orders": paid_count,
            "gross_revenue": round(gross_revenue, 2),
            "aov": round(gross_revenue / paid_count, 2) if paid_count else 0,
        }
    }


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
