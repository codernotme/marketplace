from collections import Counter, defaultdict

from fastapi import APIRouter, Depends

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.store import store

router = APIRouter(prefix="/analytics", tags=["analytics"])
settings = get_settings()


async def _orders_products_events():
    if settings.use_in_memory:
        return list(store.orders.values()), store.products, list(store.events)

    db = await get_db()
    orders = await db.orders.find({}, {"_id": 0}).to_list(length=5000)
    products_list = await db.products.find({}, {"_id": 0}).to_list(length=5000)
    events = await db.events.find({}, {"_id": 0}).to_list(length=10000)
    products = {p["id"]: p for p in products_list}
    return orders, products, events


@router.get("/vendor/sales")
async def vendor_sales(user=Depends(require_role("vendor"))):
    orders, products, _ = await _orders_products_events()
    sales_total = 0.0
    points = defaultdict(float)
    for order in orders:
        for item in order.get("items", []):
            product = products.get(item["product_id"])
            if product and product.get("vendor_id") == user["id"]:
                line_total = item["price"] * item["qty"]
                sales_total += line_total
                points[order["created_at"][:10]] += line_total
    return {"total": round(sales_total, 2), "points": [{"date": k, "value": v} for k, v in points.items()]}


@router.get("/vendor/top-products")
async def top_products(user=Depends(require_role("vendor"))):
    orders, products, _ = await _orders_products_events()
    revenue = defaultdict(float)
    for order in orders:
        for item in order.get("items", []):
            product = products.get(item["product_id"])
            if product and product.get("vendor_id") == user["id"]:
                revenue[item["product_id"]] += item["price"] * item["qty"]
    ranked = sorted(revenue.items(), key=lambda kv: kv[1], reverse=True)
    return [{"product": products[pid], "revenue": value} for pid, value in ranked[:10] if pid in products]


@router.get("/vendor/orders")
async def vendor_order_breakdown(user=Depends(require_role("vendor"))):
    orders, _, _ = await _orders_products_events()
    counts = Counter(order.get("status", "unknown") for order in orders)
    return dict(counts)


@router.get("/admin/gmv")
async def admin_gmv(_=Depends(require_role("admin"))):
    orders, _, _ = await _orders_products_events()
    gmv = sum(item["price"] * item["qty"] for order in orders for item in order.get("items", []))
    return {"gmv": round(gmv, 2)}


@router.get("/admin/users")
async def admin_users_growth(_=Depends(require_role("admin"))):
    if settings.use_in_memory:
        return {"total_users": len(store.users)}
    db = await get_db()
    return {"total_users": await db.users.count_documents({})}


@router.get("/admin/categories")
async def admin_categories(_=Depends(require_role("admin"))):
    orders, products, _ = await _orders_products_events()
    revenue = defaultdict(float)
    for order in orders:
        for item in order.get("items", []):
            product = products.get(item["product_id"])
            if product:
                revenue[product.get("category_id", "uncategorized")] += item["price"] * item["qty"]
    return [{"category_id": category_id, "revenue": amount} for category_id, amount in revenue.items()]


@router.get("/admin/funnel")
async def admin_funnel(_=Depends(require_role("admin"))):
    orders, _, events = await _orders_products_events()
    views = sum(1 for e in events if e["event_type"] == "view")
    clicks = sum(1 for e in events if e["event_type"] == "click")
    add_to_cart = sum(1 for e in events if e["event_type"] == "add_to_cart")
    purchased = len(orders)
    return {"views": views, "clicks": clicks, "add_to_cart": add_to_cart, "purchased": purchased}


@router.get("/admin/leaderboard")
async def admin_leaderboard(_=Depends(require_role("admin"))):
    orders, products, _ = await _orders_products_events()
    board = defaultdict(float)
    for order in orders:
        for item in order.get("items", []):
            product = products.get(item["product_id"])
            if product:
                board[product["vendor_id"]] += item["price"] * item["qty"]
    ranked = sorted(board.items(), key=lambda kv: kv[1], reverse=True)
    return [{"vendor_id": vendor_id, "sales": sales} for vendor_id, sales in ranked]
