# 🏗️ Architecture.md
> Multi-Category Marketplace — System Architecture (Modular Monolith)

---

## Architectural Decision

| Decision | Choice | Reason |
|---|---|---|
| Backend Pattern | **Modular Monolith** | 2-person team, bootstrapped, fast iteration |
| Frontend Pattern | Feature-based App Router | Clean separation, co-located logic |
| Deployment | Vercel + Railway/Azure | Independent scaling per layer |
| Async Jobs | ARQ + Redis worker | Non-blocking emails, PDFs, alerts |
| Inter-module comms | Direct Python function calls | No HTTP overhead within the API |
| Frontend ↔ Backend | REST over HTTPS | Simple, well-understood, debuggable |
| Future escape hatch | Lift module → microservice | Clean module boundaries make this easy later |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + HeroUI v2 |
| Backend | FastAPI (Python 3.11+) — Modular Monolith |
| Background Jobs | ARQ (async Redis Queue) |
| Database | MongoDB (via Motor async driver) |
| Cache / Queue | Redis (sessions, rate limiting, cart, job queue) |
| Auth | Custom JWT (access + refresh tokens) |
| Email | Resend (transactional emails) |
| Payments | Razorpay (orders, webhooks, refunds) |
| AI | Claude Sonnet API (product recommendations) |
| Storage | Cloudinary (product images, CDN delivery) |
| Deployment | Vercel (frontend) + Railway / Azure VM (FastAPI + ARQ worker) |

---

## High-Level System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│              Next.js 15 App Router + HeroUI v2                   │
│       [Customer UI]   [Vendor Dashboard]   [Admin Panel]         │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼─────────────────────────────────────────┐
│                 FASTAPI — MODULAR MONOLITH                        │
│                (single process, clean modules)                    │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐    │
│  │   auth   │ │ products │ │  orders  │ │    payments      │    │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────────────┤    │
│  │  vendor  │ │inventory │ │analytics │ │ recommendations  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘    │
│                                                                   │
│              core/ (db, redis, config, dependencies)             │
└──────┬──────────────────────────┬────────────────────────────────┘
       │                          │ enqueue jobs
┌──────▼──────┐           ┌───────▼──────┐
│   MongoDB   │           │    Redis     │◄──────────────────┐
│  (Motor)    │           │              │                   │
│             │           │  Sessions    │         ┌─────────▼──────┐
│ users       │           │  Cart        │         │  ARQ Worker    │
│ products    │           │  Rate Limit  │         │  (background   │
│ orders      │           │  OTP Store   │         │   process)     │
│ inventory   │           │  Reco Cache  │         │                │
│ analytics   │           │  Job Queue   │         │ send emails    │
│ vendors     │           └──────────────┘         │ generate PDFs  │
└─────────────┘                                    │ low-stock check│
                                                   │ analytics flush│
                                           ┌───────┴────────────────┤
                                           │   External Services    │
                                           │  Razorpay  Resend      │
                                           │  Cloudinary Claude AI  │
                                           └────────────────────────┘
```

---

## Repo Structure

```
marketplace/                         ← root (monorepo or two separate repos)
├── marketplace-web/                 ← Next.js  →  deploys to Vercel
└── marketplace-api/                 ← FastAPI + ARQ  →  deploys to Railway/Azure
```

> **Rule:** `marketplace-web` and `marketplace-api` communicate **only** via HTTP REST.
> No shared code, no shared DB connections — they are completely independent deployable units.

---

## Frontend Folder Structure — Next.js 15

```
marketplace-web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (shop)/
│   │   ├── page.tsx                     # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx                 # Product listing
│   │   │   └── [slug]/page.tsx          # Product detail
│   │   ├── category/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── search/page.tsx
│   ├── (user)/
│   │   ├── profile/page.tsx
│   │   ├── orders/page.tsx
│   │   └── wishlist/page.tsx
│   ├── vendor/
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── orders/page.tsx
│   │   └── inventory/page.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── products/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── shared/                          # Navbar, Footer, BreadCrumb, AuthGuard
│   ├── auth/                            # LoginForm, RegisterForm, OTPInput
│   ├── product/                         # ProductCard, ProductGrid, Filters
│   ├── cart/                            # CartDrawer, CartItem, CartSummary
│   ├── checkout/                        # CheckoutStepper, steps, Confirmation
│   ├── vendor/                          # ProductForm, InventoryTable, etc.
│   ├── analytics/                       # SalesChart, StatCard, FunnelChart
│   └── admin/                           # UsersTable, VendorApprovalCard, etc.
│
├── lib/
│   ├── api.ts                           # Axios instance + JWT interceptors
│   ├── auth.ts                          # Token helpers
│   └── razorpay.ts                      # Payment utils
│
├── hooks/                               # All custom React hooks
├── store/                               # Zustand global stores
│   ├── auth.store.ts
│   ├── cart.store.ts
│   └── ui.store.ts
├── types/                               # TypeScript interfaces (mirroring API schemas)
├── middleware.ts                        # Next.js route protection
└── next.config.ts
```

---

## Backend Folder Structure — FastAPI Modular Monolith

```
marketplace-api/
├── app/
│   ├── main.py                          # FastAPI app init — registers all module routers
│   │
│   ├── core/                            # Shared infrastructure — ZERO business logic here
│   │   ├── config.py                    # Pydantic BaseSettings (reads .env)
│   │   ├── database.py                  # Motor async MongoDB client + db reference
│   │   ├── redis.py                     # aioredis connection pool
│   │   ├── dependencies.py              # FastAPI Depends(): get_current_user, require_role
│   │   └── exceptions.py               # Global HTTP exception handlers
│   │
│   ├── modules/                         # ← THE MODULAR MONOLITH
│   │   │
│   │   ├── auth/
│   │   │   ├── router.py               # Registers routes: POST /auth/*
│   │   │   ├── service.py              # login, register, token logic
│   │   │   ├── models.py               # MongoDB User document definition
│   │   │   └── schemas.py              # Pydantic: RegisterRequest, LoginResponse, etc.
│   │   │
│   │   ├── users/
│   │   │   ├── router.py               # GET/PUT /users/*, wishlist routes
│   │   │   ├── service.py              # Profile, address, wishlist logic
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── products/
│   │   │   ├── router.py               # GET/POST/PUT/DELETE /products/*
│   │   │   ├── service.py              # CRUD, search, slug, image upload
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── categories/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Tree builder, CRUD
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── cart/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Add, update, merge, validate stock
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── orders/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Create, status update, cancel, return
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── payments/
│   │   │   ├── router.py               # create-order, verify, webhook
│   │   │   ├── service.py              # Razorpay API calls, HMAC verify
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── inventory/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Stock CRUD, deduct, bulk import, audit log
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── vendor/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Store, KYC, earnings, payout
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── recommendations/
│   │   │   ├── router.py
│   │   │   ├── service.py              # Claude API, Redis cache, event logging
│   │   │   └── schemas.py
│   │   │
│   │   ├── analytics/
│   │   │   ├── router.py
│   │   │   ├── service.py              # MongoDB aggregation pipelines
│   │   │   └── schemas.py
│   │   │
│   │   ├── reviews/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   │
│   │   └── admin/
│   │       ├── router.py
│   │       └── service.py              # Cross-module admin operations
│   │
│   ├── workers/                         # ARQ background job workers
│   │   ├── arq_settings.py             # WorkerSettings, Redis pool, job list
│   │   ├── email_tasks.py              # send_otp, send_order_email, send_shipping_email
│   │   ├── pdf_tasks.py                # generate_invoice_pdf
│   │   ├── inventory_tasks.py          # check_low_stock, send_alert_email
│   │   └── analytics_tasks.py          # flush_event_buffer to MongoDB
│   │
│   └── utils/
│       ├── jwt_utils.py                # create_access_token, verify_token
│       ├── password_utils.py           # bcrypt hash + verify
│       ├── slug_utils.py               # generate_slug()
│       ├── cloudinary_utils.py         # upload_image(), delete_image()
│       └── pagination.py              # Reusable paginate() helper
│
├── requirements.txt
├── Dockerfile
└── .env
```

---

## Module Interaction Rules

```
✅ ALLOWED — cross-module service calls:
   orders.service     → calls → inventory.service.deduct_stock()
   payments.service   → calls → orders.service.create_order()
   auth.service       → enqueues ARQ → email_tasks.send_otp_email()

❌ FORBIDDEN:
   products.router    → imports → orders.models       (cross-model coupling)
   orders.service     → queries → products collection directly (bypass service layer)
   two modules        → import each other             (circular dependency)
```

> **Golden Rule:** Modules speak to each other only through `service.py` public functions. Routers, models, and schemas are private to their own module.

---

## ARQ Background Worker

```
FastAPI Request (returns immediately)
     │
     ├── Sync path  → DB write → return 200/201
     │
     └── Async path → redis.enqueue_job('task_name', **kwargs)
                              │
                    ┌─────────▼──────────────────────┐
                    │      ARQ Worker Process         │
                    │  (same server, separate PID)    │
                    │                                 │
                    │  email_tasks.py                 │
                    │    send_otp_email()             │
                    │    send_order_confirmation()    │
                    │    send_shipping_update()       │
                    │                                 │
                    │  pdf_tasks.py                   │
                    │    generate_invoice_pdf()       │
                    │                                 │
                    │  inventory_tasks.py             │
                    │    check_low_stock()            │
                    │    send_low_stock_alert()       │
                    │                                 │
                    │  analytics_tasks.py             │
                    │    flush_event_buffer()         │
                    └─────────────────────────────────┘
```

---

## MongoDB Collections

```
marketplace_db/
├── users           { _id, name, email, password_hash, role, addresses[], created_at }
├── products        { _id, title, slug, vendor_id, category_id, variants[], price, images[], ratings_avg }
├── categories      { _id, name, slug, parent_id, icon, is_active }
├── orders          { _id, user_id, items[], status, payment, shipping_address, timestamps }
├── cart            { _id, user_id, items[], updated_at }
├── inventory       { _id, product_id, vendor_id, sku, quantity, low_stock_threshold }
├── inventory_logs  { _id, sku, old_qty, new_qty, changed_by, reason, timestamp }
├── reviews         { _id, product_id, user_id, rating, body, images[], verified_purchase }
├── vendors         { _id, user_id, store_name, kyc_status, bank_details, commission_rate }
├── transactions    { _id, order_id, razorpay_payment_id, amount, status, refund_id }
├── coupons         { _id, code, type, value, min_order, max_uses, used_count, expiry }
├── notifications   { _id, user_id, type, message, read, created_at }
└── events          { _id, user_id, event_type, product_id, metadata, timestamp }
```

---

## Auth Flow

```
Register → bcrypt hash → save user → enqueue send_otp_email (ARQ) → 201
     ↓
POST /auth/verify-otp → validate OTP from Redis → activate user → issue tokens
     ↓
Login → verify password → Access Token (15m) + Refresh Token (7d, stored in Redis)
     ↓
Protected Route → Bearer token → dependencies.py: get_current_user() → user injected
     ↓
Token Expiry → POST /auth/refresh → verify Redis refresh token → new access token
     ↓
Logout → delete refresh token from Redis (instant invalidation)
```

---

## Payment Flow (Razorpay)

```
POST /payments/create-order → Razorpay order → return { razorpay_order_id, amount }
     ↓
Frontend opens Razorpay modal → user pays → success callback
     ↓
POST /payments/verify → HMAC-SHA256 signature check
     ├── VALID   → payments.service calls orders.service.create_order()
     │                → orders.service calls inventory.service.deduct_stock()
     │                → enqueue send_order_confirmation (ARQ)
     │                → return order
     └── INVALID → 400 Bad Request
     ↓
Razorpay Webhook → POST /payments/webhook → handle late captures / refunds
```

---

## AI Recommendation Flow

```
GET /recommendations/home
     ↓
Check Redis cache (key: reco:{user_id}, TTL: 1hr)
     ├── HIT  → return cached product_ids instantly
     └── MISS → recommendations.service.build_context(user_id)
                    → aggregate: purchases + views + wishlist (last 30d)
                    → build prompt with user context + catalog sample
                    → POST to Claude Sonnet API
                    → parse product_id list from response
                    → cache in Redis (TTL: 1hr)
                    → return products
```

---

## Deployment Architecture

```
Vercel (frontend)                  Railway / Azure VM (backend)
─────────────────                  ────────────────────────────────────
marketplace-web/                   marketplace-api/
Next.js SSR + SSG                  ┌──────────────────────────────┐
Edge CDN globally                  │ gunicorn + uvicorn (PORT 8000)│
                                   │ FastAPI Modular Monolith      │
                                   │                              │
                                   │ ARQ Worker (separate PID)    │
                                   │ background jobs only         │
                                   └──────────────┬───────────────┘
                                                  │
                                   ┌──────────────▼───────────────┐
                                   │  MongoDB Atlas  +  Redis     │
                                   │  (managed cloud services)    │
                                   └──────────────────────────────┘
```

---

## Environment Variables

### Frontend — `.env.local`
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
```

### Backend — `.env`
```env
APP_ENV=production
API_PREFIX=/api/v1
ALLOWED_ORIGINS=https://yourdomain.com

MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

JWT_SECRET=super_secret_key
JWT_REFRESH_SECRET=refresh_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RESEND_API_KEY=re_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
CLOUDINARY_URL=cloudinary://key:secret@cloud_name
```
