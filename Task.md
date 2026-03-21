# ✅ Task.md
> Multi-Category Marketplace — Development Roadmap & Task Tracker
> Architecture: Modular Monolith (FastAPI) + Next.js 15 + ARQ Workers

---

## Phase 0 — Project Setup & Infrastructure

### Repository & Tooling
- [ ] Create root workspace (monorepo or two sibling repos: `frontend/`, `backend/`)
- [ ] Initialize Next.js 15 project with App Router + TypeScript in `frontend/`
- [ ] Install HeroUI v2 + configure `NextUIProvider` in `app/layout.tsx`
- [ ] Configure Tailwind CSS with HeroUI theme tokens
- [ ] Set up ESLint + Prettier for Next.js
- [ ] Initialize FastAPI project with full modular folder structure in `backend/`
- [ ] Install core Python deps: `fastapi`, `uvicorn`, `motor`, `pydantic[email]`, `python-jose[cryptography]`, `passlib[bcrypt]`, `aioredis`, `arq`, `razorpay`, `anthropic`, `cloudinary`, `resend`
- [ ] Set up Black + isort + Ruff for FastAPI
- [ ] Initialize Git, configure `.gitignore` for both projects

### Infrastructure Connections
- [ ] Create MongoDB Atlas cluster, set up `marketplace_db`, verify Motor async connection in `core/database.py`
- [ ] Set up Redis (Upstash or Railway Redis), verify `aioredis` connection in `core/redis.py`
- [ ] Create Cloudinary account, get API credentials
- [ ] Create Resend account, verify sending domain, get API key
- [ ] Create Razorpay test account, get Key ID + Secret

### Core Layer (`app/core/`)
- [ ] `config.py` — Pydantic `BaseSettings` loading all `.env` values
- [ ] `database.py` — Motor client singleton, `get_db()` dependency
- [ ] `redis.py` — aioredis pool, `get_redis()` dependency
- [ ] `dependencies.py` — `get_current_user()`, `require_role()` FastAPI Depends
- [ ] `exceptions.py` — global HTTP exception handlers (404, 401, 422, 500)
- [ ] `main.py` — FastAPI app init, register all module routers, CORS config, rate limiter middleware

### Frontend Foundation
- [ ] Set up Zustand stores: `auth.store.ts`, `cart.store.ts`, `ui.store.ts`
- [ ] Build `lib/api.ts` — Axios instance with JWT interceptors + refresh logic
- [ ] Define all TypeScript interfaces in `types/` (mirroring API schemas)
- [ ] Build `middleware.ts` — Next.js route protection for `vendor/` and `admin/`
- [ ] Build `<AuthGuard />` component with role check
- [ ] Build `<PageWrapper />` and `<BreadCrumb />` shared components

---

## Phase 1 — Auth Module

### `modules/auth/`
- [ ] `models.py` — User MongoDB document (name, email, password_hash, role, addresses, created_at)
- [ ] `schemas.py` — RegisterRequest, LoginRequest, TokenPair, OTPVerifyRequest, ResetPasswordRequest
- [ ] `utils/password_utils.py` — `hash_password()`, `verify_password()` (bcrypt)
- [ ] `utils/jwt_utils.py` — `create_access_token()`, `create_refresh_token()`, `verify_token()`, `blacklist_token()`
- [ ] `service.py` — `register_user()`, `verify_otp()`, `login()`, `refresh_access_token()`, `logout()`, `request_password_reset()`, `reset_password()`
- [ ] `router.py` — all 8 `/auth/*` endpoints
- [ ] Register `auth.router` in `main.py`

### `workers/email_tasks.py` (Phase 1 portion)
- [ ] `send_otp_email()` — called by `auth.service.register_user()` via ARQ enqueue
- [ ] `send_password_reset()` — called by `auth.service.request_password_reset()` via ARQ

### `workers/arq_settings.py`
- [ ] `WorkerSettings` with Redis config + initial function list

### Frontend — Auth
- [ ] Build `<LoginForm />` with react-hook-form + zod validation
- [ ] Build `<RegisterForm />` multi-step with OTP
- [ ] Build `<OTPInput />` 6-digit with auto-focus + paste
- [ ] Build `<ForgotPasswordForm />`
- [ ] Implement `useAuth()` hook
- [ ] Wire Zustand `auth.store` to login/logout
- [ ] Build `/login`, `/register`, `/forgot-password` pages

---

## Phase 2 — Product Catalog & Categories

### `modules/categories/`
- [ ] `models.py`, `schemas.py`, `service.py` (tree builder, CRUD)
- [ ] `router.py` — 5 endpoints, register in `main.py`

### `modules/products/`
- [ ] `models.py` — Product with embedded variants sub-documents
- [ ] `schemas.py` — ProductCreate, ProductUpdate, ProductResponse, PaginatedProducts
- [ ] Set up MongoDB text index on `title`, `description`, `tags`
- [ ] `utils/slug_utils.py` — `generate_slug()`, `ensure_unique_slug()`
- [ ] `utils/cloudinary_utils.py` — `upload_image()`, `delete_image()`, `get_optimized_url()`
- [ ] `service.py` — `list_products()`, `get_by_slug()`, `search()`, `get_trending()`, `create_product()`, `update_product()`, `soft_delete()`, `upload_images()`, `recalculate_rating()`
- [ ] `router.py` — all 10 `/products/*` endpoints, register in `main.py`
- [ ] `utils/pagination.py` — reusable `paginate()` helper

### Frontend — Products
- [ ] Build `<ProductCard />` with wishlist toggle + quick add-to-cart
- [ ] Build `<ProductGrid />` with responsive columns
- [ ] Build `<ProductSkeleton />` loading state
- [ ] Build `<ProductFilters />` sidebar
- [ ] Build `<SortDropdown />`
- [ ] Build `<ProductImageGallery />` with zoom
- [ ] Build `<ProductVariantSelector />`
- [ ] Build `<ProductRating />`
- [ ] Build `ProductListingPage` (filters + sort + pagination)
- [ ] Build `ProductDetailPage` (gallery, variants, add-to-cart, reviews section)
- [ ] Build `CategoryPage`
- [ ] Build `SearchPage` with URL param handling
- [ ] Build `<Navbar />` with search autocomplete
- [ ] Implement `useProducts(filters)` and `useProduct(slug)` hooks

---

## Phase 3 — Cart & Wishlist

### `modules/cart/`
- [ ] `models.py`, `schemas.py`
- [ ] `service.py` — `get_cart()`, `add_item()`, `update_item()`, `remove_item()`, `clear_cart()`, `validate_stock()`, `merge_guest_cart()`, `apply_coupon()`, `calculate_totals()`
- [ ] `router.py` — 8 endpoints, register in `main.py`

### `modules/users/` (wishlist portion)
- [ ] `service.py` — `get_wishlist()`, `toggle_wishlist()`
- [ ] Wishlist routes added to `users/router.py`

### Frontend — Cart & Wishlist
- [ ] Build `<CartDrawer />` slide-in panel
- [ ] Build `<CartItem />` with quantity stepper
- [ ] Build `<CartSummary />` with totals
- [ ] Build `<CouponInput />`
- [ ] Build `CartPage`
- [ ] Build `WishlistPage`
- [ ] Implement `useCart()` hook
- [ ] Implement guest cart (localStorage) with login merge
- [ ] Wire cart icon badge to `cart.store.itemCount`

---

## Phase 4 — Checkout & Orders

### `modules/orders/`
- [ ] `models.py` — Order with items[], status enum, timestamps
- [ ] `schemas.py` — OrderCreate, OrderResponse, StatusUpdate
- [ ] `service.py` — `create_order()` (calls `inventory.service.deduct_stock()` + enqueues ARQ email), `get_orders()`, `get_order()`, `cancel_order()`, `request_return()`, `update_status()`, `get_invoice_url()`
- [ ] `router.py` — 7 endpoints, register in `main.py`

### `modules/payments/`
- [ ] `models.py` — Transaction document
- [ ] `schemas.py` — CreateOrderRequest, VerifyPaymentRequest, WebhookPayload
- [ ] `service.py` — `create_razorpay_order()`, `verify_payment()` (calls `orders.service.create_order()`), `handle_webhook()`, `process_refund()`, `save_transaction()`, `get_transaction_history()`
- [ ] `router.py` — 5 endpoints (including webhook), register in `main.py`
- [ ] Razorpay webhook signature verification (HMAC-SHA256)

### `workers/email_tasks.py` + `workers/pdf_tasks.py`
- [ ] `send_order_confirmation()`, `send_shipping_update()`, `send_delivery_confirmation()`
- [ ] `generate_invoice_pdf()` → upload to Cloudinary → return URL

### Frontend — Checkout & Orders
- [ ] Build `<CheckoutStepper />`
- [ ] Build `<AddressStep />` + `<AddressForm />`
- [ ] Build `<ShippingStep />`
- [ ] Build `<PaymentStep />` with Razorpay modal trigger
- [ ] Build `<OrderConfirmation />`
- [ ] Build `CheckoutPage` orchestrating all steps
- [ ] Add Razorpay `<Script />` loader to `app/layout.tsx`
- [ ] Build `OrdersPage` with status filter tabs
- [ ] Build single Order detail page with status timeline
- [ ] Implement `useRazorpay()` hook
- [ ] Implement `useOrders()` hook

---

## Phase 5 — Inventory Module

### `modules/inventory/`
- [ ] `models.py` — Inventory + InventoryLog documents
- [ ] `schemas.py` — InventoryItem, StockUpdate, BulkUpdateRow
- [ ] `service.py` — `get_inventory()`, `get_stock()`, `update_stock()`, `deduct_stock()`, `get_low_stock_items()`, `get_audit_log()`, `parse_csv_import()`, `bulk_update()`, `log_change()`
- [ ] `router.py` — 6 endpoints, register in `main.py`
- [ ] Verify `deduct_stock()` is called from `orders.service` only (enforce module boundary)

### `workers/inventory_tasks.py`
- [ ] `check_low_stock()` — query inventory → enqueue `send_low_stock_alert()`
- [ ] `send_low_stock_alert()` added to `email_tasks.py`
- [ ] Add `check_low_stock` as ARQ cron job (daily) in `arq_settings.py`

### Frontend — Inventory
- [ ] Build `<InventoryTable />` with inline stock edit
- [ ] Build CSV upload component for bulk import
- [ ] Build `VendorInventoryPage`
- [ ] Low-stock alert banner in vendor dashboard sidebar

---

## Phase 6 — Vendor Module & Dashboard

### `modules/vendor/`
- [ ] `models.py` — Vendor document (store info, KYC fields, commission_rate)
- [ ] `schemas.py` — VendorApply, StoreUpdate, KYCData, EarningsSummary
- [ ] `service.py` — `apply_as_vendor()`, `get_store_profile()`, `update_store()`, `submit_kyc()`, `get_earnings()`, `request_payout()`
- [ ] `router.py` — 6 endpoints, register in `main.py`

### Frontend — Vendor Dashboard
- [ ] Build `<VendorSidebar />`
- [ ] Build `VendorDashboardPage` (summary stat cards)
- [ ] Build `<ProductForm />` with tabs (Basic, Variants, Images, Pricing, SEO)
- [ ] Build `<VariantBuilder />` with auto-combination generator
- [ ] Build `<ImageUploader />` with drag & drop + Cloudinary
- [ ] Build `VendorProductsPage` (list + create/edit/delete)
- [ ] Build `<VendorOrdersTable />`
- [ ] Build `VendorOrdersPage`
- [ ] Build `<EarningsCard />` with payout request button
- [ ] Build KYC submission form

---

## Phase 7 — AI Recommendations

### `modules/recommendations/`
- [ ] `schemas.py` — EventLog, RecommendationResponse
- [ ] `service.py` — `get_home_recommendations()`, `get_similar_products()`, `get_trending()`, `log_event()`, `build_user_context()`, `build_prompt()`, `call_claude()`, `cache_recommendations()`, `get_cached()`
- [ ] `router.py` — 4 endpoints, register in `main.py`
- [ ] Redis cache strategy: key `reco:{user_id}`, TTL 3600s
- [ ] Cold-start fallback: category-based products for new users

### Frontend — Recommendations
- [ ] Build `<RecommendationCarousel />` (horizontal scroll strip)
- [ ] Add personalized section to `HomePage` (fetches `/recommendations/home`)
- [ ] Add trending section to `HomePage` (fetches `/recommendations/trending`)
- [ ] Add "You may also like" to `ProductDetailPage` (`/recommendations/similar/{id}`)
- [ ] Fire `POST /recommendations/event` on product card view and click
- [ ] Implement `useRecommendations()` hook

---

## Phase 8 — Analytics Module

### `modules/analytics/`
- [ ] `schemas.py` — SalesData, ProductStat, OrderBreakdown, FunnelData, GrowthPoint
- [ ] `service.py` — all 8 aggregation functions using `run_aggregation()`
- [ ] `router.py` — 8 endpoints (vendor + admin split), register in `main.py`
- [ ] MongoDB indexes on `events.timestamp`, `orders.created_at` for aggregation performance

### `workers/analytics_tasks.py`
- [ ] `flush_event_buffer()` — batch write cached events to MongoDB
- [ ] Add as cron job in `arq_settings.py` (every 5 minutes)

### Frontend — Analytics
- [ ] Build `<StatCard />` KPI widget
- [ ] Build `<SalesChart />` (Recharts LineChart)
- [ ] Build `<OrderStatusPieChart />` (Recharts PieChart donut)
- [ ] Build `<TopProductsTable />`
- [ ] Build `<FunnelChart />` (horizontal bars, Recharts)
- [ ] Build date range picker component (shared by all charts)
- [ ] Wire vendor analytics to `VendorDashboardPage`
- [ ] Build `AdminAnalyticsPage` with all admin charts + leaderboard
- [ ] Implement `useAnalytics(range)` hook

---

## Phase 9 — Reviews, Admin & Emails

### `modules/reviews/`
- [ ] `models.py`, `schemas.py`
- [ ] `service.py` — `submit_review()` (verified purchase check), `get_reviews()`, `vote_helpful()`, `add_vendor_reply()`
- [ ] `router.py` — register in `main.py`
- [ ] Review submission triggers `recalculate_rating()` in `products.service`

### `modules/admin/`
- [ ] `service.py` — aggregates calls across modules, never duplicates logic
- [ ] `router.py` — all 9 admin endpoints, register in `main.py`
- [ ] Coupon model + `coupons` collection + CRUD in admin service
- [ ] Coupon validation logic wired into `cart.service.apply_coupon()`

### `workers/email_tasks.py` (remaining tasks)
- [ ] `send_refund_email()`, `send_payout_confirmation()`
- [ ] Build all Resend HTML email templates (order, shipping, delivery, refund, payout, low-stock)

### Frontend — Reviews & Admin
- [ ] Build `<ReviewCard />` and `<ReviewForm />`
- [ ] Integrate reviews section into `ProductDetailPage`
- [ ] Build `<AdminSidebar />`
- [ ] Build `AdminDashboardPage`
- [ ] Build `<UsersTable />`
- [ ] Build `<VendorApprovalCard />`
- [ ] Build `<ProductModerationCard />`
- [ ] Build `<CouponForm />`
- [ ] Build all admin pages (users, vendors, products, analytics, coupons)

---

## Phase 10 — Security, SEO & Deployment

### Security
- [ ] Redis rate limiter on `POST /auth/login` (5 req/min) and `POST /auth/register`
- [ ] Pydantic validation on every FastAPI request body (auto via schemas)
- [ ] CORS: whitelist frontend domain only in `main.py`
- [ ] Razorpay webhook HMAC validation already in place (verify in Phase 4)
- [ ] HTTPS enforced on both Vercel and Railway/Azure
- [ ] Sensitive fields (password_hash) excluded from all response schemas
- [ ] Add `X-Content-Type-Options`, `X-Frame-Options` headers via middleware

### SEO & Performance
- [ ] `generateMetadata()` on all product and category pages
- [ ] `app/sitemap.ts` route handler for auto-generated sitemap
- [ ] `app/robots.ts` for robots.txt
- [ ] Audit all pages with Lighthouse (target: LCP < 2.5s, CLS < 0.1)
- [ ] Add skeleton loaders to every async data component
- [ ] Implement infinite scroll on product listing pages
- [ ] Confirm all images use Next.js `<Image />` with Cloudinary CDN transforms

### Deployment
- [ ] Write `Dockerfile` for FastAPI (multi-stage, slim Python image)
- [ ] Configure gunicorn + uvicorn workers in Dockerfile CMD
- [ ] Add ARQ worker start command (separate process on same container or Railway service)
- [ ] Deploy FastAPI to Railway / Azure VM — set all production env vars
- [ ] Deploy Next.js to Vercel — set all `NEXT_PUBLIC_*` env vars
- [ ] Configure MongoDB Atlas IP allowlist (Railway/Azure outbound IP)
- [ ] Test full payment flow end-to-end in Razorpay test mode
- [ ] Switch Razorpay to live mode after testing
- [ ] Set up Uptime Kuma for health monitoring on API
- [ ] Set up Sentry error tracking in both Next.js and FastAPI
- [ ] Final smoke test: register → browse → cart → checkout → payment → order confirmation

---

## Milestone Summary

| Milestone | Phases | Target |
|---|---|---|
| 🔐 Auth MVP | 0 + 1 | Week 1–2 |
| 🛍️ Catalog MVP | 2 + 3 | Week 3–4 |
| 💳 Checkout MVP | 4 | Week 5 |
| 📦 Inventory + Vendor | 5 + 6 | Week 6–7 |
| 🤖 AI + Analytics | 7 + 8 | Week 8–9 |
| 🛡️ Reviews + Admin | 9 | Week 10 |
| 🚀 Launch Ready | 10 | Week 11–12 |

---

## Module Completion Tracker

| Module | Backend | Frontend | Workers | Done |
|---|---|---|---|---|
| `core/` | ☐ | ☐ | — | ☐ |
| `auth/` | ☐ | ☐ | ☐ | ☐ |
| `users/` | ☐ | ☐ | — | ☐ |
| `categories/` | ☐ | ☐ | — | ☐ |
| `products/` | ☐ | ☐ | — | ☐ |
| `cart/` | ☐ | ☐ | — | ☐ |
| `orders/` | ☐ | ☐ | ☐ | ☐ |
| `payments/` | ☐ | ☐ | — | ☐ |
| `inventory/` | ☐ | ☐ | ☐ | ☐ |
| `vendor/` | ☐ | ☐ | ☐ | ☐ |
| `recommendations/` | ☐ | ☐ | — | ☐ |
| `analytics/` | ☐ | ☐ | ☐ | ☐ |
| `reviews/` | ☐ | ☐ | — | ☐ |
| `admin/` | ☐ | ☐ | — | ☐ |
