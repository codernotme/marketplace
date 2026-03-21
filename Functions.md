# ⚙️ Functions.md
> Multi-Category Marketplace — API Endpoints & Service Functions
> Architecture: Modular Monolith — each module owns its router, service, models, schemas

Base URL: `https://api.yourdomain.com/api/v1`

---

## Module: `auth` — `/auth`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register user, enqueue OTP email (ARQ) | ❌ |
| POST | `/auth/verify-otp` | Validate OTP from Redis, activate account | ❌ |
| POST | `/auth/login` | Verify credentials, return access + refresh tokens | ❌ |
| POST | `/auth/refresh` | Rotate refresh token, return new access token | ❌ |
| POST | `/auth/logout` | Delete refresh token from Redis | ✅ |
| POST | `/auth/forgot-password` | Enqueue password reset email (ARQ) | ❌ |
| POST | `/auth/reset-password` | Validate reset token, update password | ❌ |
| GET | `/auth/me` | Return current authenticated user | ✅ |

### `modules/auth/service.py`

```python
async def register_user(data: RegisterRequest) -> User
async def verify_otp(email: str, otp: str) -> TokenPair
async def login(email: str, password: str) -> TokenPair
async def refresh_access_token(refresh_token: str) -> str
async def logout(refresh_token: str) -> None
async def request_password_reset(email: str) -> None
async def reset_password(token: str, new_password: str) -> None
async def get_current_user(user_id: str) -> User
```

### `utils/jwt_utils.py`

```python
def create_access_token(user_id: str, role: str) -> str
def create_refresh_token(user_id: str) -> str
def verify_token(token: str) -> dict
def blacklist_token(redis, token: str, ttl: int) -> None
```

### `utils/password_utils.py`

```python
def hash_password(password: str) -> str
def verify_password(plain: str, hashed: str) -> bool
```

### `core/dependencies.py`

```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User
async def require_role(role: str) -> Callable       # require_role("admin")
async def get_db() -> AsyncIOMotorDatabase
async def get_redis() -> aioredis.Redis
```

---

## Module: `users` — `/users`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users/profile` | Get current user profile | ✅ |
| PUT | `/users/profile` | Update name, phone, avatar | ✅ |
| GET | `/users/addresses` | List all saved addresses | ✅ |
| POST | `/users/addresses` | Add new address | ✅ |
| PUT | `/users/addresses/{id}` | Update address | ✅ |
| DELETE | `/users/addresses/{id}` | Delete address | ✅ |
| GET | `/users/wishlist` | Get wishlist products | ✅ |
| POST | `/users/wishlist/{product_id}` | Add to wishlist | ✅ |
| DELETE | `/users/wishlist/{product_id}` | Remove from wishlist | ✅ |

### `modules/users/service.py`

```python
async def get_profile(user_id: str) -> User
async def update_profile(user_id: str, data: ProfileUpdate) -> User
async def add_address(user_id: str, address: Address) -> list[Address]
async def update_address(user_id: str, address_id: str, data: Address) -> Address
async def delete_address(user_id: str, address_id: str) -> None
async def get_wishlist(user_id: str) -> list[Product]
async def toggle_wishlist(user_id: str, product_id: str) -> list[str]
```

---

## Module: `products` — `/products`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products, filters + pagination | ❌ |
| GET | `/products/{slug}` | Get single product by slug | ❌ |
| GET | `/products/search` | Full-text search | ❌ |
| GET | `/products/trending` | Trending products (event-based) | ❌ |
| POST | `/products` | Create product | ✅ Vendor |
| PUT | `/products/{id}` | Update product | ✅ Vendor |
| DELETE | `/products/{id}` | Soft-delete product | ✅ Vendor |
| POST | `/products/{id}/images` | Upload images to Cloudinary | ✅ Vendor |
| GET | `/products/{id}/reviews` | Get paginated reviews | ❌ |
| POST | `/products/{id}/reviews` | Submit review (verified purchase) | ✅ |

### `modules/products/service.py`

```python
async def list_products(filters: dict, page: int, limit: int) -> PaginatedResult
async def get_by_slug(slug: str) -> Product
async def search(query: str, filters: dict) -> list[Product]
async def get_trending(limit: int) -> list[Product]
async def create_product(data: ProductCreate, vendor_id: str) -> Product
async def update_product(product_id: str, data: ProductUpdate) -> Product
async def soft_delete(product_id: str) -> None
async def upload_images(product_id: str, files: list[UploadFile]) -> list[str]
async def recalculate_rating(product_id: str) -> float
```

### `utils/slug_utils.py`

```python
def generate_slug(title: str) -> str
async def ensure_unique_slug(db, slug: str) -> str
```

### `utils/cloudinary_utils.py`

```python
async def upload_image(file: UploadFile, folder: str) -> str
async def delete_image(public_id: str) -> None
def get_optimized_url(public_id: str, width: int, quality: int) -> str
```

---

## Module: `categories` — `/categories`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Get all categories as nested tree | ❌ |
| GET | `/categories/{slug}` | Single category + its products | ❌ |
| POST | `/categories` | Create category | ✅ Admin |
| PUT | `/categories/{id}` | Update category | ✅ Admin |
| DELETE | `/categories/{id}` | Delete category | ✅ Admin |

### `modules/categories/service.py`

```python
async def get_category_tree() -> list[CategoryNode]
async def get_category_with_products(slug: str) -> CategoryDetail
async def create_category(data: CategoryCreate) -> Category
async def update_category(id: str, data: CategoryUpdate) -> Category
async def delete_category(id: str) -> None
```

---

## Module: `cart` — `/cart`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get user's cart | ✅ |
| POST | `/cart/add` | Add item (product_id, variant_id, qty) | ✅ |
| PUT | `/cart/update` | Update item quantity | ✅ |
| DELETE | `/cart/remove/{item_id}` | Remove specific item | ✅ |
| DELETE | `/cart/clear` | Clear entire cart | ✅ |
| POST | `/cart/validate` | Validate against live stock | ✅ |
| POST | `/cart/merge` | Merge guest cart on login | ✅ |
| POST | `/cart/apply-coupon` | Apply coupon code | ✅ |

### `modules/cart/service.py`

```python
async def get_cart(user_id: str) -> Cart
async def add_item(user_id: str, item: CartItem) -> Cart
async def update_item(user_id: str, item_id: str, qty: int) -> Cart
async def remove_item(user_id: str, item_id: str) -> Cart
async def clear_cart(user_id: str) -> None
async def validate_stock(user_id: str) -> ValidationResult
async def merge_guest_cart(user_id: str, guest_items: list) -> Cart
async def apply_coupon(user_id: str, code: str) -> CartSummary
async def calculate_totals(cart: Cart, coupon: Coupon | None) -> CartSummary
```

---

## Module: `orders` — `/orders`

> **Note:** `orders.service` calls `inventory.service.deduct_stock()` on order creation — this is the primary cross-module call.

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Create order post payment verify | ✅ |
| GET | `/orders` | List user orders (paginated) | ✅ |
| GET | `/orders/{id}` | Single order detail | ✅ |
| PUT | `/orders/{id}/cancel` | Cancel order (if not shipped) | ✅ |
| POST | `/orders/{id}/return` | Request return / refund | ✅ |
| GET | `/orders/{id}/invoice` | Trigger invoice PDF (ARQ) | ✅ |
| PUT | `/orders/{id}/status` | Update order status | ✅ Vendor |

### `modules/orders/service.py`

```python
async def create_order(user_id: str, payment_id: str, address: Address) -> Order
    # internally calls: inventory.service.deduct_stock(order_items)
    # internally enqueues: email_tasks.send_order_confirmation (ARQ)

async def get_orders(user_id: str, filters: dict, page: int) -> PaginatedResult
async def get_order(order_id: str, user_id: str) -> Order
async def cancel_order(order_id: str, user_id: str) -> Order
async def request_return(order_id: str, user_id: str, reason: str) -> Order
async def update_status(order_id: str, status: str, actor_id: str) -> Order
async def get_invoice_url(order_id: str) -> str          # ARQ job → PDF → Cloudinary URL
```

---

## Module: `payments` — `/payments`

> **Note:** `payments.service.verify_payment()` calls `orders.service.create_order()` on success.

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/payments/create-order` | Create Razorpay order | ✅ |
| POST | `/payments/verify` | Verify HMAC signature, create order | ✅ |
| POST | `/payments/webhook` | Razorpay webhook handler | ❌ HMAC |
| POST | `/payments/refund` | Initiate refund | ✅ Admin |
| GET | `/payments/history` | User's transaction history | ✅ |

### `modules/payments/service.py`

```python
async def create_razorpay_order(amount: int, currency: str, receipt: str) -> dict
async def verify_payment(order_id: str, payment_id: str, signature: str) -> Order
    # calls: orders.service.create_order() on success

async def handle_webhook(payload: bytes, signature: str) -> None
async def process_refund(payment_id: str, amount: int, notes: str) -> dict
async def save_transaction(order_id: str, payment_data: dict) -> Transaction
async def get_transaction_history(user_id: str) -> list[Transaction]
```

---

## Module: `inventory` — `/inventory`

> **Note:** `inventory.service.deduct_stock()` is called by `orders.service` — never directly from a router.

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/inventory` | Vendor's full inventory | ✅ Vendor |
| GET | `/inventory/{product_id}` | Inventory for specific product | ✅ Vendor |
| PUT | `/inventory/{sku}` | Update stock for a SKU | ✅ Vendor |
| POST | `/inventory/bulk-update` | CSV bulk update | ✅ Vendor |
| GET | `/inventory/low-stock` | Items below threshold | ✅ Vendor |
| GET | `/inventory/logs` | Audit trail | ✅ Vendor |

### `modules/inventory/service.py`

```python
async def get_inventory(vendor_id: str) -> list[InventoryItem]
async def get_stock(product_id: str, variant_id: str) -> int
async def update_stock(sku: str, qty: int, reason: str, actor: str) -> InventoryItem
async def deduct_stock(order_items: list[OrderItem]) -> None     # called by orders.service
async def get_low_stock_items(vendor_id: str) -> list[InventoryItem]
async def get_audit_log(vendor_id: str) -> list[InventoryLog]
async def parse_csv_import(file: UploadFile) -> list[dict]
async def bulk_update(items: list[dict], vendor_id: str) -> int  # returns count updated
async def log_change(sku: str, old_qty: int, new_qty: int, changed_by: str) -> None
```

---

## Module: `recommendations` — `/recommendations`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/recommendations/home` | Personalized homepage recs | ✅ |
| GET | `/recommendations/similar/{product_id}` | Similar products | ❌ |
| GET | `/recommendations/trending` | Platform trending | ❌ |
| POST | `/recommendations/event` | Log user event (view/click/add-to-cart) | ✅ |

### `modules/recommendations/service.py`

```python
async def get_home_recommendations(user_id: str) -> list[Product]
    # checks Redis cache first → miss → build context → call Claude → cache → return

async def get_similar_products(product_id: str, limit: int) -> list[Product]
async def get_trending(limit: int, window_hours: int) -> list[Product]
async def log_event(user_id: str, event_type: str, product_id: str, meta: dict) -> None
async def build_user_context(user_id: str) -> dict
async def build_prompt(context: dict, catalog_sample: list) -> str
async def call_claude(prompt: str) -> list[str]             # returns product_ids
async def cache_recommendations(user_id: str, products: list) -> None
async def get_cached(user_id: str) -> list | None
```

---

## Module: `analytics` — `/analytics`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/analytics/vendor/sales` | Sales by date range | ✅ Vendor |
| GET | `/analytics/vendor/top-products` | Best sellers | ✅ Vendor |
| GET | `/analytics/vendor/orders` | Order status breakdown | ✅ Vendor |
| GET | `/analytics/admin/gmv` | Platform GMV | ✅ Admin |
| GET | `/analytics/admin/users` | User growth data | ✅ Admin |
| GET | `/analytics/admin/categories` | Revenue per category | ✅ Admin |
| GET | `/analytics/admin/funnel` | Conversion funnel | ✅ Admin |
| GET | `/analytics/admin/leaderboard` | Vendor leaderboard | ✅ Admin |

### `modules/analytics/service.py`

```python
async def get_vendor_sales(vendor_id: str, start: datetime, end: datetime) -> SalesData
async def get_top_products(vendor_id: str, limit: int) -> list[ProductStat]
async def get_order_breakdown(vendor_id: str) -> OrderBreakdown
async def get_platform_gmv(start: datetime, end: datetime) -> float
async def get_user_growth(granularity: Literal["daily", "monthly"]) -> list[GrowthPoint]
async def get_category_revenue() -> list[CategoryRevenue]
async def get_conversion_funnel() -> FunnelData
async def get_vendor_leaderboard(limit: int) -> list[VendorStat]
async def run_aggregation(pipeline: list[dict]) -> list[dict]  # shared MongoDB agg runner
```

---

## Module: `vendor` — `/vendor`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/vendor/apply` | Submit vendor application | ✅ |
| GET | `/vendor/profile` | Get store profile | ✅ Vendor |
| PUT | `/vendor/profile` | Update store details | ✅ Vendor |
| POST | `/vendor/kyc` | Submit KYC documents | ✅ Vendor |
| GET | `/vendor/earnings` | Earnings + payout history | ✅ Vendor |
| POST | `/vendor/payout` | Request withdrawal | ✅ Vendor |

### `modules/vendor/service.py`

```python
async def apply_as_vendor(user_id: str, data: VendorApply) -> Vendor
async def get_store_profile(vendor_id: str) -> Vendor
async def update_store(vendor_id: str, data: StoreUpdate) -> Vendor
async def submit_kyc(vendor_id: str, data: KYCData) -> Vendor
async def get_earnings(vendor_id: str) -> EarningsSummary
async def request_payout(vendor_id: str, amount: float) -> PayoutRequest
```

---

## Module: `admin` — `/admin`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/users` | List all users | ✅ Admin |
| PUT | `/admin/users/{id}/ban` | Ban / unban user | ✅ Admin |
| GET | `/admin/vendors` | List vendor applications | ✅ Admin |
| PUT | `/admin/vendors/{id}/approve` | Approve / reject KYC | ✅ Admin |
| GET | `/admin/products/pending` | Products awaiting moderation | ✅ Admin |
| PUT | `/admin/products/{id}/approve` | Approve / reject listing | ✅ Admin |
| POST | `/admin/coupons` | Create coupon | ✅ Admin |
| PUT | `/admin/coupons/{id}` | Update / deactivate coupon | ✅ Admin |
| PUT | `/admin/vendors/{id}/payout` | Approve vendor payout | ✅ Admin |

### `modules/admin/service.py`

```python
# Aggregates calls across modules — never duplicates logic
async def list_users(filters: dict, page: int) -> PaginatedResult
async def ban_user(user_id: str, banned: bool) -> User
async def approve_vendor(vendor_id: str, approved: bool, notes: str) -> Vendor
    # internally calls: vendor.service + enqueues email (ARQ)

async def approve_product(product_id: str, approved: bool) -> Product
async def create_coupon(data: CouponCreate) -> Coupon
async def approve_payout(payout_id: str) -> PayoutRequest
    # internally calls: vendor.service.process_payout()
```

---

## ARQ Workers — `workers/`

### `workers/email_tasks.py`
```python
async def send_otp_email(ctx, email: str, otp: str) -> None
async def send_password_reset(ctx, email: str, reset_url: str) -> None
async def send_order_confirmation(ctx, order_id: str) -> None
async def send_shipping_update(ctx, order_id: str, tracking: str) -> None
async def send_delivery_confirmation(ctx, order_id: str) -> None
async def send_low_stock_alert(ctx, vendor_email: str, items: list) -> None
async def send_payout_confirmation(ctx, vendor_email: str, amount: float) -> None
async def send_refund_email(ctx, order_id: str, amount: float) -> None
```

### `workers/pdf_tasks.py`
```python
async def generate_invoice_pdf(ctx, order_id: str) -> str  # returns Cloudinary URL
```

### `workers/inventory_tasks.py`
```python
async def check_low_stock(ctx, vendor_id: str) -> None
    # fetches low-stock items → enqueues send_low_stock_alert
```

### `workers/analytics_tasks.py`
```python
async def flush_event_buffer(ctx) -> None   # cron: every 5 min, batch write events to MongoDB
```

### `workers/arq_settings.py`
```python
class WorkerSettings:
    functions = [
        send_otp_email, send_order_confirmation, send_shipping_update,
        send_delivery_confirmation, send_low_stock_alert, send_payout_confirmation,
        send_refund_email, generate_invoice_pdf, check_low_stock, flush_event_buffer
    ]
    cron_jobs = [
        cron(flush_event_buffer, minute={0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55})
    ]
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
```
