# Backend — FastAPI Endpoints, Algorithms & Architecture

**Stack:** FastAPI + Motor (async MongoDB) + Resend + Razorpay + Telegram Bot API

---

## Project Structure

```
backend/
├── main.py                      # App entry, middleware, routers
├── core/
│   ├── config.py                # Master env vars (DB_URI, SECRET_KEY, etc.)
│   ├── database.py              # MongoDB Motor client
│   ├── security.py              # JWT, hashing, encryption helpers
│   ├── dependencies.py          # FastAPI Depends (auth guards, tenant context)
│   └── exceptions.py            # Custom HTTP exceptions
├── routers/
│   ├── saas/
│   │   ├── auth.py
│   │   ├── tenants.py
│   │   ├── plans.py
│   │   └── announcements.py
│   └── shop/
│       ├── auth.py
│       ├── products.py
│       ├── categories.py
│       ├── cart.py
│       ├── orders.py
│       ├── checkout.py
│       ├── payments.py
│       ├── coupons.py
│       ├── banners.py
│       ├── reviews.py
│       ├── wishlist.py
│       ├── search.py
│       ├── users.py
│       ├── queries.py
│       ├── analytics.py
│       ├── inventory.py
│       ├── shipping.py
│       ├── mails.py
│       └── settings.py
├── services/
│   ├── email_service.py         # Resend wrapper
│   ├── telegram_service.py      # Telegram Bot wrapper
│   ├── razorpay_service.py      # Razorpay wrapper
│   ├── storage_service.py       # Image upload (Cloudflare R2 / S3)
│   ├── order_service.py         # Order business logic
│   └── analytics_service.py    # Event tracking + aggregations
├── models/
│   ├── user.py
│   ├── product.py
│   ├── order.py
│   └── ...                      # Pydantic models per domain
├── utils/
│   ├── slug.py
│   ├── pagination.py
│   ├── validators.py
│   └── order_number.py
└── background_tasks/
    ├── daily_summary.py         # Telegram daily summary (APScheduler)
    ├── low_stock_check.py
    └── coupon_expiry.py
```

---

## Auth & Middleware

### Tenant Resolution Middleware
```python
# Every request to /api/shop/* must carry X-Tenant-ID header (or subdomain)
# Middleware resolves tenant, injects into request.state.tenant
@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    tenant_id = request.headers.get("X-Tenant-ID") or resolve_from_subdomain(request)
    tenant = await get_active_tenant(tenant_id)
    request.state.tenant = tenant
    request.state.config = await get_tenant_config(tenant_id)  # cached
    return await call_next(request)
```

### JWT Structure
```json
{
  "sub": "user_id",
  "role": "customer | vendor | shop_admin | saas_admin",
  "tenant_id": "string | null",
  "exp": "timestamp"
}
```

---

## API Endpoint Reference

### Base Paths
- `GET /health` — health check
- `/api/saas/*` — SaaS admin APIs (guarded by saas_admin JWT)
- `/api/shop/*` — Shop APIs (guarded by tenant context + optional user JWT)

---

## SaaS Admin APIs (`/api/saas/`)

### Auth
```
POST   /api/saas/auth/login           → {email, password} → JWT
POST   /api/saas/auth/refresh         → refresh JWT
POST   /api/saas/auth/logout
```

### Tenants
```
GET    /api/saas/tenants              → list (filter: status, plan, search, page)
POST   /api/saas/tenants              → create tenant + send invite email
GET    /api/saas/tenants/:id          → detail
PATCH  /api/saas/tenants/:id          → update basic info
POST   /api/saas/tenants/:id/suspend  → {reason} → suspend
POST   /api/saas/tenants/:id/activate → reactivate
DELETE /api/saas/tenants/:id          → soft delete
GET    /api/saas/tenants/:id/config   → view config (decrypted for saas admin)
PATCH  /api/saas/tenants/:id/config   → update config
POST   /api/saas/tenants/:id/impersonate → get short-lived token as that tenant admin
```

### Plans
```
GET    /api/saas/plans                → list all plans
POST   /api/saas/plans                → create plan
PATCH  /api/saas/plans/:id            → update plan
DELETE /api/saas/plans/:id            → deactivate plan
PATCH  /api/saas/tenants/:id/plan     → override tenant plan
```

### Analytics (Platform)
```
GET    /api/saas/analytics/overview   → MRR, tenant counts, churn
GET    /api/saas/analytics/tenants    → per-tenant revenue/activity
```

### Announcements
```
GET    /api/saas/announcements        → list
POST   /api/saas/announcements        → create
PATCH  /api/saas/announcements/:id    → update
DELETE /api/saas/announcements/:id
```

---

## Shop Auth APIs (`/api/shop/auth/`)

```
POST   /api/shop/auth/register         → {name, email, password, phone} → user created + OTP email
POST   /api/shop/auth/verify-email     → {email, otp} → JWT
POST   /api/shop/auth/login            → {email, password} → JWT
POST   /api/shop/auth/login/otp        → {email} → sends OTP (passwordless)
POST   /api/shop/auth/login/otp/verify → {email, otp} → JWT
POST   /api/shop/auth/forgot-password  → {email} → sends reset OTP
POST   /api/shop/auth/reset-password   → {email, otp, new_password}
POST   /api/shop/auth/refresh          → refresh JWT
POST   /api/shop/auth/logout
GET    /api/shop/auth/me               → current user profile [AUTH]
```

**OTP Algorithm:**
```python
def generate_otp() -> str:
    return str(random.randint(100000, 999999))

# Store in MongoDB with TTL index (10 min expiry)
otp_doc = {
    "email": email,
    "otp": hash_otp(otp),  # bcrypt hash
    "purpose": "email_verify | login | password_reset",
    "expires_at": datetime.utcnow() + timedelta(minutes=10),
    "used": False,
    "attempts": 0  # max 5 attempts before invalidation
}

# Verify
async def verify_otp(email, otp, purpose):
    doc = await db.otps.find_one({"email": email, "purpose": purpose, "used": False})
    if not doc or doc["expires_at"] < datetime.utcnow():
        raise OTPExpiredError
    if doc["attempts"] >= 5:
        raise OTPLockedError
    if not verify_hash(otp, doc["otp"]):
        await db.otps.update_one({"_id": doc["_id"]}, {"$inc": {"attempts": 1}})
        raise OTPInvalidError
    await db.otps.update_one({"_id": doc["_id"]}, {"$set": {"used": True}})
    return True
```

---

## Shop Admin Onboarding API (`/api/shop/onboarding/`)

```
GET    /api/shop/onboarding/status          → current step + completion
POST   /api/shop/onboarding/step/1          → {shop_name, brand, logo_url, ...}
POST   /api/shop/onboarding/step/2          → {email, password} (sets admin login)
POST   /api/shop/onboarding/step/3          → {razorpay_key_id, razorpay_secret, telegram_token, ...}
POST   /api/shop/onboarding/step/4/verify   → verifies all creds (Razorpay ping, Telegram ping)
POST   /api/shop/onboarding/step/5/complete → marks onboarding done, activates shop
```

**Credential Verification Algorithm (Step 4):**
```python
async def verify_credentials(config: TenantConfig) -> VerificationResult:
    results = {}

    # Razorpay: fetch account info
    try:
        rz = razorpay.Client(auth=(config.razorpay_key_id, config.razorpay_key_secret))
        rz.order.all({"count": 1})
        results["razorpay"] = "ok"
    except Exception:
        results["razorpay"] = "failed"

    # Telegram: send test message
    try:
        await send_telegram(config.telegram_bot_token, config.telegram_chat_id, "✅ theMrktPlace connected!")
        results["telegram"] = "ok"
    except Exception:
        results["telegram"] = "failed"

    # Resend: send test email
    try:
        await send_email(config.resend_api_key, to=config.owner_email, subject="Test", body="Connected!")
        results["resend"] = "ok"
    except Exception:
        results["resend"] = "failed"

    return results
```

---

## Products API (`/api/shop/products/`)

```
GET    /api/shop/products                      → list (filter: category, brand, tag, status, price_min/max, sort, page, limit)
GET    /api/shop/products/:slug                → product detail (with variants, reviews summary)
POST   /api/shop/products                      → create [ADMIN]
PATCH  /api/shop/products/:id                  → update [ADMIN]
DELETE /api/shop/products/:id                  → soft delete (status=archived) [ADMIN]
POST   /api/shop/products/bulk-import          → CSV import [ADMIN]
GET    /api/shop/products/export               → CSV export [ADMIN]
PATCH  /api/shop/products/:id/stock            → update stock [ADMIN]
POST   /api/shop/products/:id/images           → upload images [ADMIN]
DELETE /api/shop/products/:id/images/:image_id → remove image [ADMIN]

# Storefront helpers
GET    /api/shop/products/featured             → is_featured=true, limit 12
GET    /api/shop/products/new-arrivals         → newest first, limit 20
GET    /api/shop/products/trending             → is_trending=true, limit 12
GET    /api/shop/products/best-sellers         → sorted by sales_count, limit 12
GET    /api/shop/products/:id/related          → related_product_ids resolved
GET    /api/shop/products/:id/reviews          → paginated reviews for product
```

**Product Listing Algorithm:**
```python
async def list_products(filters: ProductFilters, tenant_id: str):
    query = {"tenant_id": ObjectId(tenant_id), "status": "active"}

    if filters.category_slug:
        category = await db.categories.find_one({"slug": filters.category_slug})
        category_ids = await get_category_tree_ids(category["_id"])  # includes children
        query["category_id"] = {"$in": category_ids}

    if filters.price_min is not None:
        query["price"] = {"$gte": filters.price_min}
    if filters.price_max is not None:
        query.setdefault("price", {})["$lte"] = filters.price_max

    if filters.brand:
        query["brand"] = {"$in": filters.brand}

    if filters.rating_min:
        query["ratings_avg"] = {"$gte": filters.rating_min}

    if filters.in_stock:
        query["stock"] = {"$gt": 0}

    sort_map = {
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
        "newest": [("created_at", -1)],
        "rating": [("ratings_avg", -1)],
        "best_sellers": [("sales_count", -1)],
    }
    sort = sort_map.get(filters.sort, [("created_at", -1)])

    total = await db.products.count_documents(query)
    items = await db.products.find(query).sort(sort).skip(filters.skip).limit(filters.limit).to_list(None)
    return {"items": items, "total": total, "page": filters.page, "limit": filters.limit}
```

---

## Categories API (`/api/shop/categories/`)

```
GET    /api/shop/categories           → tree structure (nested)
GET    /api/shop/categories/:slug     → single category + children
POST   /api/shop/categories           → create [ADMIN]
PATCH  /api/shop/categories/:id       → update [ADMIN]
DELETE /api/shop/categories/:id       → delete (only if no products) [ADMIN]
PATCH  /api/shop/categories/reorder   → {ids: [...]} drag-drop reorder [ADMIN]
```

---

## Search API (`/api/shop/search/`)

```
GET  /api/shop/search?q=&category=&page=
GET  /api/shop/search/suggest?q=          → instant suggestions (5 results)
GET  /api/shop/search/popular             → top search terms [cached]
```

**Search Algorithm:**
```python
async def search_products(q: str, tenant_id: str):
    # MongoDB Atlas Search (full-text) — preferred
    pipeline = [
        {"$search": {
            "index": "product_search",
            "compound": {
                "should": [
                    {"text": {"query": q, "path": "title", "score": {"boost": {"value": 3}}}},
                    {"text": {"query": q, "path": "description"}},
                    {"text": {"query": q, "path": "tags"}},
                    {"text": {"query": q, "path": "brand"}},
                ]
            }
        }},
        {"$match": {"tenant_id": ObjectId(tenant_id), "status": "active"}},
        {"$limit": 20},
        {"$project": {"_id":1, "title":1, "slug":1, "price":1, "images":{"$first":"$images"}, "ratings_avg":1, "score": {"$meta": "searchScore"}}}
    ]
    # Log search term for analytics
    await db.search_logs.insert_one({"tenant_id": ObjectId(tenant_id), "query": q, "created_at": datetime.utcnow()})
    return await db.products.aggregate(pipeline).to_list(None)
```

---

## Cart API (`/api/shop/cart/`)

Cart is client-side (Zustand) for guests. For logged-in users, cart can be synced to backend.

```
GET    /api/shop/cart              → get server cart [AUTH]
POST   /api/shop/cart/sync         → sync client cart to server [AUTH]
POST   /api/shop/cart/items        → add item [AUTH]
PATCH  /api/shop/cart/items/:id    → update qty [AUTH]
DELETE /api/shop/cart/items/:id    → remove item [AUTH]
DELETE /api/shop/cart              → clear cart [AUTH]
POST   /api/shop/cart/coupon       → apply coupon code → returns discount info
DELETE /api/shop/cart/coupon       → remove coupon
```

**Coupon Validation Algorithm:**
```python
async def validate_coupon(code: str, cart: Cart, tenant_id: str, user_id: str):
    coupon = await db.coupons.find_one({
        "tenant_id": ObjectId(tenant_id),
        "code": code.upper(),
        "is_active": True
    })
    if not coupon:
        raise CouponNotFoundError

    now = datetime.utcnow()
    if coupon.get("starts_at") and coupon["starts_at"] > now:
        raise CouponNotActiveYetError
    if coupon.get("expires_at") and coupon["expires_at"] < now:
        raise CouponExpiredError
    if coupon.get("usage_limit") and coupon["used_count"] >= coupon["usage_limit"]:
        raise CouponUsedUpError

    # Per-user usage check
    user_usage = await db.orders.count_documents({
        "tenant_id": ObjectId(tenant_id),
        "user_id": ObjectId(user_id),
        "coupon_code": code.upper(),
        "payment.status": "paid"
    })
    if coupon.get("usage_per_user") and user_usage >= coupon["usage_per_user"]:
        raise CouponPerUserLimitError

    if coupon.get("min_order_value") and cart.subtotal < coupon["min_order_value"]:
        raise MinOrderValueNotMetError(coupon["min_order_value"])

    # Calculate discount
    discount = 0
    if coupon["type"] == "percentage":
        discount = cart.subtotal * (coupon["value"] / 100)
        if coupon.get("max_discount"):
            discount = min(discount, coupon["max_discount"])
    elif coupon["type"] == "fixed":
        discount = min(coupon["value"], cart.subtotal)
    elif coupon["type"] == "free_shipping":
        discount = cart.shipping_fee

    return {"discount": round(discount, 2), "coupon": coupon}
```

---

## Orders API (`/api/shop/orders/`)

```
GET    /api/shop/orders                     → user's orders [AUTH]
GET    /api/shop/orders/:id                 → order detail [AUTH, owns order]
POST   /api/shop/orders/track               → {order_number, email} → public tracking

# Admin
GET    /api/shop/admin/orders               → all orders (filter, search, page) [ADMIN]
GET    /api/shop/admin/orders/:id           → admin order detail [ADMIN]
PATCH  /api/shop/admin/orders/:id/status    → update fulfillment status [ADMIN]
PATCH  /api/shop/admin/orders/:id/tracking  → set tracking info [ADMIN]
POST   /api/shop/admin/orders/:id/cancel    → cancel order [ADMIN]
POST   /api/shop/admin/orders/:id/notes     → add admin note [ADMIN]
GET    /api/shop/admin/orders/export        → CSV export [ADMIN]
```

---

## Checkout & Payments (`/api/shop/checkout/`, `/api/shop/payments/`)

```
POST   /api/shop/checkout/validate         → validate cart + address + shipping
POST   /api/shop/checkout/razorpay/create  → create Razorpay order → returns order_id + amount
POST   /api/shop/checkout/razorpay/verify  → verify signature + create our order record
POST   /api/shop/checkout/cod              → create COD order directly
```

**Order Creation Algorithm (after payment):**
```python
async def create_order_after_payment(checkout_data: CheckoutData, payment_data: PaymentData, tenant_id: str):
    # 1. Verify Razorpay signature
    verify_razorpay_signature(
        payment_data.razorpay_order_id,
        payment_data.razorpay_payment_id,
        payment_data.razorpay_signature,
        config.razorpay_key_secret
    )

    # 2. Re-validate cart prices (prevent tampering)
    validated_items = await validate_cart_prices(checkout_data.items, tenant_id)

    # 3. Generate order number
    order_number = await generate_order_number(tenant_id)  # "MKT-YYYYMM-NNNNN"

    # 4. Build order document
    order = Order(
        tenant_id=tenant_id,
        order_number=order_number,
        user_id=checkout_data.user_id,
        items=validated_items,
        pricing=checkout_data.pricing,
        shipping_address=checkout_data.shipping_address,
        payment={
            "method": "razorpay",
            "status": "paid",
            "razorpay_order_id": payment_data.razorpay_order_id,
            "razorpay_payment_id": payment_data.razorpay_payment_id,
            "paid_at": datetime.utcnow(),
            "amount_paid": checkout_data.pricing.grand_total
        },
        fulfillment={"status": "pending"},
        timeline=[{"status": "pending", "note": "Order placed", "created_by": "system", "created_at": datetime.utcnow()}]
    )

    # 5. Insert order
    result = await db.orders.insert_one(order.dict())

    # 6. Deduct inventory (async, with rollback on failure)
    await deduct_inventory(validated_items, result.inserted_id, tenant_id)

    # 7. Mark coupon as used
    if checkout_data.coupon_code:
        await db.coupons.update_one(
            {"code": checkout_data.coupon_code, "tenant_id": ObjectId(tenant_id)},
            {"$inc": {"used_count": 1}}
        )

    # 8. Update user stats
    if checkout_data.user_id:
        await db.users.update_one(
            {"_id": ObjectId(checkout_data.user_id)},
            {"$inc": {"total_orders": 1, "total_spent": checkout_data.pricing.grand_total}}
        )

    # 9. Send confirmation email (background task)
    background_tasks.add_task(send_order_confirmation_email, order, config)

    # 10. Send Telegram alert
    background_tasks.add_task(send_telegram_order_alert, order, config)

    # 11. Clear server cart
    if checkout_data.user_id:
        await db.carts.delete_one({"user_id": ObjectId(checkout_data.user_id)})

    return order
```

**Order Number Generator:**
```python
async def generate_order_number(tenant_id: str) -> str:
    counter_key = f"order_counter:{tenant_id}:{datetime.utcnow().strftime('%Y%m')}"
    counter = await redis.incr(counter_key)
    await redis.expire(counter_key, 60 * 60 * 24 * 35)  # keep for ~35 days
    return f"MKT-{datetime.utcnow().strftime('%Y%m')}-{counter:05d}"
```

---

## Razorpay Webhook (`/webhooks/razorpay`)

```
POST /webhooks/razorpay
  → verify X-Razorpay-Signature header
  → handle events:
    - payment.captured → confirm payment status
    - payment.failed   → mark order payment failed, notify customer
    - refund.created   → update order refund status
```

---

## Reviews API (`/api/shop/reviews/`)

```
GET    /api/shop/reviews?product_id=&rating=&page=  → public reviews
POST   /api/shop/reviews                            → submit review [AUTH, must have purchased]
DELETE /api/shop/reviews/:id                        → delete own review [AUTH]

# Admin
GET    /api/shop/admin/reviews                      → all reviews (filter by status) [ADMIN]
PATCH  /api/shop/admin/reviews/:id/approve          → approve [ADMIN]
PATCH  /api/shop/admin/reviews/:id/reject           → reject [ADMIN]
POST   /api/shop/admin/reviews/:id/reply            → {reply} [ADMIN]
```

**On review approval** → update product `ratings_avg` and `ratings_count`:
```python
async def recalculate_product_ratings(product_id: str, tenant_id: str):
    pipeline = [
        {"$match": {"product_id": ObjectId(product_id), "status": "approved"}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(1)
    if result:
        await db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"ratings_avg": round(result[0]["avg"], 1), "ratings_count": result[0]["count"]}}
        )
```

---

## Banners API (`/api/shop/banners/`)

```
GET    /api/shop/banners?placement=hero     → public, active, in-date banners
POST   /api/shop/banners                    → create [ADMIN]
PATCH  /api/shop/banners/:id                → update [ADMIN]
DELETE /api/shop/banners/:id                → delete [ADMIN]
PATCH  /api/shop/banners/reorder            → {ids:[...]} [ADMIN]
POST   /api/shop/banners/:id/impression     → increment impression count (from frontend)
POST   /api/shop/banners/:id/click          → increment click count (from frontend)
```

---

## Analytics API (`/api/shop/admin/analytics/`)

```
GET  /api/shop/admin/analytics/overview        → {revenue, orders, customers, aov} for date range
GET  /api/shop/admin/analytics/sales-chart     → daily/weekly/monthly revenue series
GET  /api/shop/admin/analytics/top-products    → top N by revenue/units
GET  /api/shop/admin/analytics/customer-stats  → new vs returning, LTV
GET  /api/shop/admin/analytics/funnel          → add-to-cart → checkout → paid conversion
POST /api/shop/analytics/event                 → track frontend event (public endpoint)
```

**Analytics Event Algorithm:**
```python
async def track_event(event: AnalyticsEvent, tenant_id: str):
    doc = {
        "tenant_id": ObjectId(tenant_id),
        "event": event.name,           # page_view, add_to_cart, checkout_started, etc.
        "user_id": event.user_id,
        "session_id": event.session_id,
        "properties": event.properties,
        "ip": event.ip,
        "user_agent": event.user_agent,
        "created_at": datetime.utcnow()
    }
    await db.analytics_events.insert_one(doc)
    # Also update Redis counters for real-time dashboard
    await redis.incr(f"analytics:{tenant_id}:{event.name}:{datetime.utcnow().strftime('%Y%m%d')}")
```

---

## Inventory API (`/api/shop/admin/inventory/`)

```
GET    /api/shop/admin/inventory               → products with stock levels, filter low-stock
PATCH  /api/shop/admin/inventory/:product_id   → manual stock adjustment + log reason
GET    /api/shop/admin/inventory/logs          → inventory log history (filter by product, type, date)
GET    /api/shop/admin/inventory/low-stock     → products below threshold
```

---

## Mails API (`/api/shop/admin/mails/`)

```
GET    /api/shop/admin/mails/templates         → list editable templates
PATCH  /api/shop/admin/mails/templates/:type   → update template content
POST   /api/shop/admin/mails/templates/:type/preview → send test email
POST   /api/shop/admin/mails/broadcast         → create broadcast campaign
GET    /api/shop/admin/mails/logs              → sent email history (filter, search)
```

---

## Delivery / Shipping API (`/api/shop/admin/shipping/`)

```
GET    /api/shop/admin/shipping/zones          → list zones
POST   /api/shop/admin/shipping/zones          → create zone
PATCH  /api/shop/admin/shipping/zones/:id      → update
DELETE /api/shop/admin/shipping/zones/:id
GET    /api/shop/shipping/rates?pincode=&weight= → calculate shipping options for checkout
```

---

## Settings API (`/api/shop/admin/settings/`)

```
GET    /api/shop/admin/settings             → all settings
PATCH  /api/shop/admin/settings/general
PATCH  /api/shop/admin/settings/branding
PATCH  /api/shop/admin/settings/policies
PATCH  /api/shop/admin/settings/payments    → update Razorpay/Resend keys (encrypted)
PATCH  /api/shop/admin/settings/features
PATCH  /api/shop/admin/settings/seo
GET    /api/shop/admin/settings/team        → list team members
POST   /api/shop/admin/settings/team/invite → invite by email
DELETE /api/shop/admin/settings/team/:id    → revoke access
```

---

## Users Admin API (`/api/shop/admin/users/`)

```
GET    /api/shop/admin/users              → list customers (filter, search, page)
GET    /api/shop/admin/users/:id          → customer detail with order history
PATCH  /api/shop/admin/users/:id          → update notes, tags
POST   /api/shop/admin/users/:id/email    → send direct email to customer
GET    /api/shop/admin/users/export       → CSV export
```

---

## Queries (Support) API (`/api/shop/`)

```
POST   /api/shop/queries                       → submit query (public)
GET    /api/shop/admin/queries                 → list (filter status, priority, category) [ADMIN]
GET    /api/shop/admin/queries/:id             → detail with thread [ADMIN]
POST   /api/shop/admin/queries/:id/reply       → {message, is_internal} [ADMIN]
PATCH  /api/shop/admin/queries/:id/status      → update status [ADMIN]
PATCH  /api/shop/admin/queries/:id/priority    → update priority [ADMIN]
```

---

## Telegram Bot Service

```python
class TelegramService:
    async def send(self, token: str, chat_id: str, message: str):
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        await httpx.post(url, json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"})

    async def send_new_order_alert(self, order: Order, config: TenantConfig):
        msg = f"""
🛒 <b>New Order!</b>
Order: #{order.order_number}
Customer: {order.customer_name}
Amount: ₹{order.pricing.grand_total}
Items: {len(order.items)}
"""
        await self.send(config.telegram_bot_token, config.telegram_chat_id, msg)

    async def send_daily_summary(self, tenant_id: str, config: TenantConfig):
        # Aggregated at 9 PM daily via APScheduler
        stats = await get_daily_stats(tenant_id)
        msg = f"""
📊 <b>Daily Summary — {date.today()}</b>
Orders: {stats.orders_count}
Revenue: ₹{stats.revenue}
New Customers: {stats.new_customers}
Pending Orders: {stats.pending_orders}
"""
        await self.send(config.telegram_bot_token, config.telegram_chat_id, msg)
```

---

## Background Tasks (APScheduler)

```python
scheduler = AsyncIOScheduler()

# Daily summary at 9 PM IST for all active tenants
@scheduler.scheduled_job("cron", hour=21, minute=0, timezone="Asia/Kolkata")
async def daily_summaries():
    tenants = await db.tenants.find({"status": "active"}).to_list(None)
    for tenant in tenants:
        config = await get_tenant_config(str(tenant["_id"]))
        if config.telegram_bot_token:
            await telegram_service.send_daily_summary(str(tenant["_id"]), config)

# Low stock check every hour
@scheduler.scheduled_job("interval", hours=1)
async def low_stock_check():
    pipeline = [
        {"$match": {"stock": {"$lte": "$low_stock_threshold"}, "track_inventory": True, "status": "active"}},
        {"$group": {"_id": "$tenant_id", "products": {"$push": {"id": "$_id", "title": "$title", "stock": "$stock"}}}}
    ]
    results = await db.products.aggregate(pipeline).to_list(None)
    for r in results:
        config = await get_tenant_config(str(r["_id"]))
        if config.telegram_bot_token:
            items = "\n".join([f"• {p['title']}: {p['stock']} left" for p in r["products"][:10]])
            await telegram_service.send(config.telegram_bot_token, config.telegram_chat_id,
                f"⚠️ <b>Low Stock Alert</b>\n{items}")

# Expire coupons
@scheduler.scheduled_job("cron", hour=0, minute=5)
async def deactivate_expired_coupons():
    await db.coupons.update_many(
        {"expires_at": {"$lt": datetime.utcnow()}, "is_active": True},
        {"$set": {"is_active": False}}
    )
```

---

## Image Upload Service

```python
# Uses Cloudflare R2 (S3-compatible) or AWS S3
async def upload_image(file: UploadFile, tenant_id: str, folder: str) -> str:
    # Resize + compress using Pillow
    image = Image.open(file.file)
    image = image.convert("RGB")
    image.thumbnail((1200, 1200), Image.LANCZOS)

    buffer = BytesIO()
    image.save(buffer, "WEBP", quality=85)
    buffer.seek(0)

    key = f"{tenant_id}/{folder}/{uuid4()}.webp"
    await s3_client.upload_fileobj(buffer, BUCKET_NAME, key, ExtraArgs={"ContentType": "image/webp"})
    return f"{CDN_BASE_URL}/{key}"
```
