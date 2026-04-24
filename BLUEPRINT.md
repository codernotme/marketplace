# 🛍️ POS + Ecommerce SaaS Platform — Complete Blueprint

> **Unified modular platform for clothing businesses** — one dashboard, one inventory, every channel.

---

## 📋 Table of Contents

1. [Final Tech Stack](#1-final-tech-stack)
2. [License System](#2-license-system)
3. [Authentication Workflows](#3-authentication-workflows)
4. [Onboarding Workflow](#4-onboarding-workflow)
5. [Other Key Workflows](#5-other-key-workflows)

---

## 1. Final Tech Stack

### 🔧 Backend

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js 22 LTS + TypeScript 5 | Stable, fast, full-stack TS |
| Framework | **Fastify v4** | Faster than Express, JSON Schema validation built-in, plugin architecture |
| ORM | **Prisma** | Best TypeScript integration, clean migrations, readable schema |
| Validation | Fastify JSON Schema + Zod | Schema on routes, Zod for service-layer business logic |
| Auth | fastify-jwt | JWT handling as a Fastify plugin |
| WebSockets | fastify-socket.io | Reconnection, tenant rooms, Redis adapter for multi-instance |
| Job Queue | **BullMQ + Redis** | Background jobs — emails, marketplace sync, report generation |
| File Upload | fastify-multipart → Cloudflare R2 | Stream directly to R2 via S3-compatible SDK |
| API Docs | fastify-swagger | Auto-generates OpenAPI from existing JSON Schema — zero extra work |

---

### 🗄️ Databases

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
│                                                             │
│  ┌──────────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │ PostgreSQL 16│  │ Redis 7  │  │   Meilisearch      │   │
│  │              │  │          │  │                    │   │
│  │ All core     │  │ Cache    │  │ Product search     │   │
│  │ transactional│  │ Sessions │  │ Typo-tolerant      │   │
│  │ data via     │  │ Queues   │  │ POS + Storefront   │   │
│  │ Prisma ORM   │  │ Pub/Sub  │  │                    │   │
│  └──────────────┘  └──────────┘  └────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │ TimescaleDB  │  │      Cloudflare R2               │   │
│  │              │  │                                  │   │
│  │ Time-series  │  │ Product images, Invoice PDFs     │   │
│  │ analytics    │  │ Shipping labels, Receipts        │   │
│  │ events       │  │ No egress fees, S3-compatible    │   │
│  └──────────────┘  └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

| Database | Usage | Hosting |
|---|---|---|
| PostgreSQL 16 | All transactional data | Supabase or AWS RDS |
| Redis 7 | Cache, sessions, BullMQ, Socket.io adapter | Upstash (serverless) |
| Meilisearch | Product search, POS + storefront | Meilisearch Cloud or self-hosted |
| TimescaleDB | Time-series analytics events | PostgreSQL extension (same or separate instance) |
| Cloudflare R2 | All file storage | Cloudflare (no egress fees) |

---

### 🖥️ Frontend

| App | Tech | Notes |
|---|---|---|
| **POS Terminal + Admin Dashboard** | React 18 + TypeScript + Next.js | Single codebase, POS is a full-screen mode inside the dashboard |
| **Ecommerce Storefront** | Next.js 14 App Router | SSR for SEO, per-merchant subdomain routing |
| **Internal SaaS Admin** | React 18 + TypeScript + Next.js | Separate app, your team only |
| State (client) | **Zustand** | Cart, user session, license permissions, active store |
| State (server) | **TanStack Query** | Fetching, caching, mutations, background refetch |
| Real-time | Socket.io client | Hooks into TanStack Query cache invalidation |
| Offline Storage | **Dexie.js** (IndexedDB) | Product catalog, pending transactions, license cache |
| Styling | **Tailwind CSS v3** | Custom design tokens in config |
| Components | **Shadcn/ui + Radix UI** | Copy-paste primitives, zero runtime overhcead |
| Charts | Recharts | Admin dashboard charts |
| Forms | React Hook Form + Zod | Consistent validation across all forms |
| Icons | Lucide React | |

---

### 🏗️ Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                               │
│                                                                 │
│   Users ──→ Cloudflare (CDN + DDoS + WAF + SSL)               │
│                        │                                        │
│          ┌─────────────┴──────────────┐                        │
│          ▼                            ▼                         │
│   ┌─────────────┐            ┌──────────────┐                  │
│   │   Vercel    │            │  Hetzner VPS │                  │
│   │             │            │              │                  │
│   │  Dashboard  │            │  Fastify API │                  │
│   │  Storefront │            │  (2 instances│                  │
│   │  (Next.js)  │            │  + LB)       │                  │
│   └─────────────┘            └──────┬───────┘                  │
│                                     │                           │
│                    ┌────────────────┼────────────────┐         │
│                    ▼                ▼                ▼          │
│             ┌──────────┐   ┌──────────┐   ┌──────────┐        │
│             │PostgreSQL│   │  Redis   │   │Meilisearch│        │
│             └──────────┘   └──────────┘   └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

| Service | Tool | Purpose |
|---|---|---|
| Backend hosting | Hetzner Cloud CPX31 (2 instances) | 4 vCPU, 8GB RAM, cost-effective |
| Frontend hosting | Vercel | Zero-config, edge CDN |
| CDN + Security | **Cloudflare** | DNS, SSL, DDoS, WAF, bot protection |
| CI/CD | GitHub Actions | Test → Build → Push image → Deploy on merge |
| Containers | Docker + Docker Compose | Local dev spins up everything in one command |
| Error tracking | Sentry | Frontend + backend |
| Metrics | Grafana + Prometheus | Server and app metrics |
| Logs | Grafana Loki | Log aggregation |
| Uptime | UptimeRobot | Alerts |
| Email | **Resend** | Transactional + lifecycle emails, React Email templates |
| SMS | **MSG91** | Indian OTPs and campaigns |
| WhatsApp | Meta WABA via Interakt | Indian reseller, good support |
| Payments | **Razorpay** (India) / Stripe (international) | Subscriptions + one-time |

---

### 📦 Monorepo Structure

```
root/ (Turborepo)
├── apps/
│   ├── api/                 ← Fastify backend
│   ├── dashboard/           ← React admin + POS terminal
│   ├── storefront/          ← Next.js ecommerce (per merchant)
│   └── internal-admin/      ← Your SaaS control panel
│
└── packages/
    ├── types/               ← Shared TypeScript types
    ├── schema/              ← Shared Zod schemas + Prisma schema
    ├── ui/                  ← Shared UI components
    └── config/              ← ESLint, TypeScript, Tailwind configs
```

---

## 2. License System

### Module Codes

```
┌─────────────────────────────────────────────────────────────┐
│                    MODULE TREE                              │
│                                                             │
│  ✅ POS_CORE          Always active — cannot be removed    │
│  │                                                          │
│  ├── 🏪 MULTISTORE    Multiple stores, transfers           │
│  ├── 🎯 PROMO_PRO     Advanced promotions engine           │
│  ├── 👥 CRM_PRO       Segmentation, bulk campaigns         │
│  ├── 👔 STAFF_PRO     Targets, leaderboard, commissions    │
│  │                                                          │
│  ├── 🌐 ECOM_STORE    Online storefront                    │
│  │   ├── 📦 ECOM_ORDER       Online order management       │
│  │   ├── 🚚 ECOM_SHIPPING    Courier integration           │
│  │   └── 📣 ECOM_MARKETING   Abandoned cart, campaigns     │
│  │                                                          │
│  ├── 📊 ANALYTICS_PRO  Real-time ops, forecasting         │
│  ├── 🛒 MARKETPLACE    Amazon, Flipkart, Myntra sync      │
│  ├── 💬 WHATSAPP_COMMERCE  WA catalog + orders            │
│  ├── 🔌 API_ACCESS     Public REST API                     │
│  └── 🏢 FRANCHISE      Corporate chain controls           │
└─────────────────────────────────────────────────────────────┘
```

---

### Plans & Pricing

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Price | ₹999/mo | ₹2,999/mo | ₹7,999/mo |
| POS_CORE | ✅ | ✅ | ✅ |
| MULTISTORE | ❌ | ✅ (5 stores) | ✅ (20 stores) |
| PROMO_PRO | ❌ | ✅ | ✅ |
| CRM_PRO | ❌ | ✅ | ✅ |
| STAFF_PRO | ❌ | ✅ | ✅ |
| ECOM_* | Add-on | Add-on | Add-on |
| ANALYTICS_PRO | Add-on | Add-on | Add-on |
| Max Users | 3 | 25 | Unlimited |
| Max Products | 500 | 5,000 | Unlimited |

**Add-on Pricing**

| Add-on | Price |
|---|---|
| ECOM_STORE + ECOM_ORDER bundle | ₹1,499/mo |
| ANALYTICS_PRO | ₹999/mo |
| MARKETPLACE | ₹1,999/mo |
| WHATSAPP_COMMERCE | ₹999/mo |
| API_ACCESS | ₹1,999/mo |

---

### License Database Schema

```sql
-- Core license record
licenses
├── id                    UUID, PK
├── tenant_id             UUID, FK → tenants
├── plan_code             ENUM (STARTER, PROFESSIONAL, ENTERPRISE, CUSTOM)
├── modules               TEXT[]         ← array of active module codes
├── max_stores            INTEGER
├── max_users             INTEGER
├── max_products          INTEGER
├── max_monthly_orders    INTEGER        ← null = unlimited
├── issued_at             TIMESTAMP
├── starts_at             TIMESTAMP
├── expires_at            TIMESTAMP      ← null = lifetime
├── grace_period_days     INTEGER        ← default 7
├── status                ENUM (ACTIVE, EXPIRED, GRACE, SUSPENDED, REVOKED)
├── is_trial              BOOLEAN
├── trial_ends_at         TIMESTAMP
├── created_by            UUID           ← your internal admin user
└── notes                 TEXT

-- Actual key storage (never store plain key)
license_keys
├── id                    UUID, PK
├── license_id            UUID, FK → licenses
├── key_hash              TEXT           ← bcrypt hash of plain key
├── key_prefix            TEXT           ← first 8 chars plain (for fast lookup)
│                                          e.g. "CLTH-A3B4"
├── issued_at             TIMESTAMP
├── revoked_at            TIMESTAMP
└── revoked_reason        TEXT

-- Device activations
license_installations
├── id                    UUID, PK
├── license_id            UUID, FK → licenses
├── device_fingerprint    TEXT           ← hash of device identifiers
├── device_name           TEXT           ← "Main Counter iPad"
├── platform              TEXT           ← web / android / windows
├── activated_at          TIMESTAMP
├── last_seen_at          TIMESTAMP
├── is_active             BOOLEAN
└── deactivated_at        TIMESTAMP

-- Full audit trail
license_audit_log
├── id                    UUID, PK
├── license_id            UUID
├── event_type            ENUM (VALIDATED, ACTIVATED, EXPIRED, REVOKED,
│                               UPGRADED, RENEWED, GRACE_STARTED, LOCKED)
├── device_fingerprint    TEXT
├── ip_address            TEXT
├── metadata              JSONB
└── created_at            TIMESTAMP
```

---

### Key Generation Flow

```
Your Admin Panel
      │
      │  1. Select tenant, plan, modules, limits, expiry
      ▼
License DB Record created (status: ACTIVE)
      │
      │  2. Generate 16 random bytes → Base58 encode → format
      ▼
 Plain Key:  CLTH-A3B4-C5D6-E7F8-G9H0
      │
      ├──→ Shown ONCE to your admin, emailed to merchant
      │
      └──→ bcrypt(key) stored in license_keys.key_hash
           key_prefix "CLTH-A3B4" stored plain for fast lookup


Merchant enters key in app
      │
      ▼
POST /api/v1/license/activate
  { key, device_fingerprint }
      │
      │  3. Extract prefix → find license_keys by prefix
      │  4. bcrypt compare submitted key vs stored hash
      │  5. Check status = ACTIVE, not expired
      │  6. Check installation count ≤ max_installations
      │  7. Create license_installations record
      │  8. Log to license_audit_log
      ▼
Sign JWT with RSA-2048 private key
  payload: { tenant_id, modules[], max_stores,
             max_users, expires_at (+48h), issued_at }
      │
      ▼
App stores JWT encrypted in localStorage
(encrypted with key derived from device fingerprint)

RSA public key bundled in app for offline verification
      │
      ▼
Every 24h → silent re-validation → fresh JWT
```

---

### License Validation Middleware (Fastify)

```
Every API Request
      │
      ▼
Extract Authorization JWT  →  Verify signature
      │
      ▼
Read tenant license from Redis cache
(key: license:{tenant_id}, TTL: 1 hour)
      │
      ├── Cache HIT  →  use cached permissions
      └── Cache MISS →  fetch from PostgreSQL → repopulate Redis
      │
      ▼
Check route's requiredModule in active modules[]
      │
      ├── ✅ Module active  →  pass request through to handler
      └── ❌ Module missing →  return 403
                                { error: "MODULE_NOT_ACTIVE",
                                  module: "ECOM_ORDER",
                                  upgradeUrl: "..." }
```

---

### License Expiry Handling

```
License expires
      │
      ▼
Day 0–7 (Grace Period)
  ├── App still fully functional
  └── Persistent warning banner shown in dashboard

Day 8–30 (Soft Lock)
  ├── Read-only mode
  ├── Can view all data, reports, history
  └── Cannot make new sales or changes

Day 30+ (Hard Lock)
  └── Full lock — renewal required to regain access
```

---

## 3. Authentication Workflows

### 3.1 Owner Registration

```
Registration Form Fields
─────────────────────────────────────────────────
  Full name                [required]
  Business email           [required, unique, format validated]
  Phone number             [required, Indian format]
  Password                 [required, min 8 chars,
                            must have: uppercase, lowercase,
                            number, special character]
  Confirm password         [required, must match]
  Business name            [required]
  Terms & Privacy checkbox [required]
─────────────────────────────────────────────────

        Submit
          │
          ▼
  Frontend validation (React Hook Form + Zod)
          │
          ▼
  POST /api/v1/auth/register
          │
  Server validates all fields again
          │
  ┌───────┴────────┐
  │ Email exists?  │
  └───────┬────────┘
          │ No
          ▼
  Create tenant record
  Create owner user (bcrypt password, cost 12)
  Create default store
  Assign POS_CORE license
          │
          ├──→ Generate email verification token (UUID, 24h TTL)
          │    Send verification email via Resend
          │
          └──→ Generate phone OTP (6-digit, Redis, 10min TTL)
               Send via MSG91
          │
          ▼
  Return success → redirect to "Check your email" screen
```

---

### 3.2 Merchant Login

```
Login Form Fields
─────────────────────────────────────────────────
  Email          [required]
  Password       [required]
  Remember me    [checkbox — 7 day vs 30 day refresh token]
─────────────────────────────────────────────────

        Submit
          │
          ▼
  POST /api/v1/auth/login
          │
  Find user by email
          │
  ┌───────┴──────────────┐
  │ Wrong password?      │──→ 401 generic error
  │ Not verified?        │──→ resend verification + specific error
  │ Suspended?           │──→ account suspended error
  └───────┬──────────────┘
          │ Valid
          ▼
  ┌────────────────────────────┐
  │ 5 failed attempts in 10min │──→ Lock 15min + alert email
  └────────────────────────────┘
          │
          ▼
  Generate access token  (JWT, 15min, contains user_id,
                          tenant_id, role, store_ids)
  Generate refresh token (opaque UUID, DB-stored,
                          7 or 30 days)
          │
          ├──→ Refresh token in HTTP-only secure cookie
          └──→ Access token in response body
          │
          ▼
  Log to auth_audit_log
  Redirect to dashboard
```

---

### 3.3 Staff / Cashier POS Login

```
POS Terminal Screen
─────────────────────────────────────────────────
  Step 1:  Select name from staff list (no typing)
  Step 2:  Enter 4 or 6 digit PIN
─────────────────────────────────────────────────

  Device itself has a pre-authenticated device token
          │
          ▼
  bcrypt verify PIN against stored hash
          │
          ▼
  Issue staff session token
    ├── Expiry: 4 hours (or until shift ends)
    ├── Scoped to that staff member's permissions
    └── Attached to all POS operations
        (sales, returns, adjustments all tagged with staff ID)
        → used for commission tracking and audit
```

---

### 3.4 Token Refresh Flow

```
Any API call returns 401
          │
          ▼
  Axios interceptor fires automatically
          │
          ▼
  POST /api/v1/auth/refresh
  (refresh token from HTTP-only cookie)
          │
  ┌───────┴────────────────┐
  │ Token valid?           │
  │  ├── Check DB exists   │
  │  ├── Not expired       │
  │  └── Not revoked       │
  └───────┬────────────────┘
          │ Valid
          ▼
  Issue new access token
  Rotate refresh token (old one invalidated)
  Retry original request
          │
          └── If refresh also invalid → logout → redirect to /login
```

---

### 3.5 Password Reset

```
Forgot Password Form
  Email [required]
          │
          ▼
  POST /api/v1/auth/forgot-password
  Generate reset token (UUID, hashed in DB, 1hr TTL)
  Send email with reset link
          │
          ▼
  User clicks link → Reset Password Page

  Reset Password Form Fields
  ─────────────────────────────────────────────
    New password         [required, same rules as registration]
    Confirm new password [required, must match]
  ─────────────────────────────────────────────
          │
          ▼
  POST /api/v1/auth/reset-password
  { token, new_password }
          │
  Validate token → not expired → not used
          │
  Update password hash
  Mark token as used
  Invalidate ALL existing refresh tokens for this user
  Send confirmation email
```

---

### 3.6 Two-Factor Authentication (2FA)

```
SETUP FLOW
──────────
  Settings → Security → Enable 2FA
          │
          ▼
  Server generates TOTP secret + QR code
  User scans with Google Authenticator
          │
          ▼
  Enter 6-digit code to confirm
  Server verifies → marks 2FA enabled
          │
          ▼
  Generate 8 backup codes (stored hashed, single-use)
  Show backup codes ONCE to user


LOGIN FLOW WITH 2FA
───────────────────
  Valid email + password
          │
          ▼
  Return partial response:
  { mfa_required: true, mfa_session_token: "..." }
  (mfa_session_token expires in 5 minutes)
          │
          ▼
  User enters 6-digit TOTP code

  POST /api/v1/auth/mfa/verify
  { mfa_session_token, code }
          │
          ▼
  Issue full access + refresh tokens
```

---

### Session Management

```sql
-- Active sessions table
active_sessions
├── id                UUID, PK
├── user_id           UUID, FK
├── refresh_token_hash TEXT
├── device_name       TEXT        ← "Chrome on MacBook"
├── ip_address        TEXT
├── user_agent        TEXT
├── created_at        TIMESTAMP
├── last_active_at    TIMESTAMP
├── expires_at        TIMESTAMP
└── revoked_at        TIMESTAMP
```

Users can view all sessions in Settings and revoke any individual session or all sessions except the current one.

---

## 4. Onboarding Workflow

```
Email verified
      │
      ▼
┌─────────────────────────────────────────┐
│        ONBOARDING WIZARD                │
│                                         │
│  Step 1 ──→ Step 2 ──→ Step 3          │
│  Business    Store      Team            │
│  Profile     Setup      Invite          │
│                         (skippable)     │
│      ──→ Step 4 ──→ Step 5 ──→ Step 6 │
│          Products   Payments   Go Live  │
│          (skippable)            Check   │
└─────────────────────────────────────────┘
```

---

### Step 1 — Business Profile

```
Fields
──────────────────────────────────────────────────────────
  Business name          [required, pre-filled from signup]
  Business type          [dropdown]
                           Single Store
                           Multi-Store Chain
                           Online Only
                           Omnichannel
  GST registered?        [radio: Registered / Unregistered]
  GSTIN                  [text, 15-char format, shown if registered]
  Address line 1         [required]
  Address line 2         [optional]
  City                   [required]
  State                  [required, Indian states dropdown]
  Pincode                [required, 6-digit]
  Country                [default: India]
  Business phone         [pre-filled, editable]
  Business email         [pre-filled, editable]
  Logo                   [image upload, optional, used on invoices]
  Currency               [default: INR]
  Financial year start   [dropdown: April / January]
──────────────────────────────────────────────────────────
→ Creates complete tenant profile + default store record
```

---

### Step 2 — Store Setup

```
Fields
──────────────────────────────────────────────────────────
  Store name             [required, e.g. "Main Branch"]
  Store type             [dropdown]
                           Retail Store
                           Warehouse
                           Pop-up
                           Online Fulfillment Center
  Store address          [all fields, pre-filled from step 1]
  Store phone            [required]
  Store email            [optional]
  Receipt header         [text, e.g. "Thank you for shopping!"]
  Receipt footer         [text, e.g. "Exchange within 7 days with bill"]
  Default tax rate       [%, pre-filled from GST status]
  Round-off bills        [toggle, rounds to nearest ₹]
──────────────────────────────────────────────────────────
```

---

### Step 3 — Invite Team *(skippable)*

```
Per invite row
──────────────────────────────────────────────────────────
  Staff name             [required]
  Email or phone         [required]
  Role                   [dropdown: Manager / Cashier /
                           Inventory Manager]
  Store assignment       [dropdown, default: store from step 2]
  Send invite via        [radio: Email / WhatsApp]
──────────────────────────────────────────────────────────
  + Add another row button
→ Creates pending staff records + sends invite links
```

---

### Step 4 — Add Products *(skippable but nudged)*

```
Two options presented:
  ┌────────────────────┐  ┌────────────────────┐
  │  📥 Import CSV     │  │  ✏️ Add Manually   │
  │                    │  │                    │
  │  Download template │  │  Quick form below  │
  │  Fill and upload   │  │                    │
  └────────────────────┘  └────────────────────┘


Manual Add Fields
──────────────────────────────────────────────────────────
  Product name           [required]
  Category               [dropdown]
                           Tops / Bottoms / Dresses
                           Outerwear / Footwear
                           Accessories / Custom
  Selling price          [required, ₹]
  Cost price             [optional, ₹]
  Has variants?          [toggle]
    └── If ON:
        Attribute 1 name   [e.g. "Size"]
        Attribute 1 values [e.g. "S, M, L, XL"]
        Attribute 2 name   [e.g. "Color"]
        Attribute 2 values [e.g. "Red, Blue, Black"]
        → System generates all variant combinations
        Opening stock per variant per store [integer, default 0]
  Barcode / SKU          [optional, auto-generated if empty]
──────────────────────────────────────────────────────────


CSV Template Columns
──────────────────────────────────────────────────────────
  product_name | category | sku | barcode | selling_price
  cost_price | tax_rate | attribute_1_name | attribute_1_values
  attribute_2_name | attribute_2_values | opening_stock
──────────────────────────────────────────────────────────
```

---

### Step 5 — Configure Payments

```
POS Payment Methods (checkboxes)
──────────────────────────────────────────────────────────
  ☑ Cash
  ☑ Card            (manual entry, no integration needed)
  ☑ UPI             (manual, cashier shows printed QR)
  ☐ Razorpay        [Connect Razorpay → OAuth button]
  ☑ Store Credit / Loyalty Points

Loyalty Configuration (shown if loyalty enabled)
──────────────────────────────────────────────────────────
  Earn rate          [e.g. 1 point per ₹10 spent]
  Redeem rate        [e.g. 10 points = ₹1 discount]
  Minimum to redeem  [e.g. 100 points]
  Points validity    [e.g. 365 days]
──────────────────────────────────────────────────────────
```

---

### Step 6 — Go Live Checklist

```
Checklist
──────────────────────────────────────────────────────────
  ✅  Business profile complete
  ✅  First store set up
  ✅  At least one product added
  ✅  Payment method configured
  ⬜  Receipt header and footer set        [→ quick link]
  ⬜  GST configuration complete           [→ quick link]
  ⬜  At least one staff invited           [→ quick link, optional]
  ⬜  Logo uploaded                        [→ quick link, optional]
  ⬜  Make a test sale                     [→ opens POS terminal]
──────────────────────────────────────────────────────────

  When first 4 items are complete:
  ┌──────────────────────────────┐
  │   🚀  Launch POS Terminal   │
  └──────────────────────────────┘
```

After launch, a collapsible onboarding widget stays on the dashboard home until 100% complete.

---

### Post-Onboarding Automated Nudges

| Day | Trigger | Channel | Message |
|---|---|---|---|
| 0 | Signup complete | Email | Welcome + getting started guide + video |
| 1 | No sale made yet | Email + WhatsApp | "You're all set. Try your first sale." |
| 3 | < 3 products added | Email | "Add more products or import via CSV" |
| 7 | No staff invited | Email | "Invite your team to the dashboard" |
| 14 | Always | Email | First 2-week business review |
| 30 | On Starter, high usage | Email | Plan upgrade suggestion |

---

## 5. Other Key Workflows

### Tenant Provisioning (On Signup or Manual Creation)

```
Trigger: new merchant signup OR internal admin creates account
          │
          ▼   (all steps inside a DB transaction — if any fails, full rollback)
          │
          ├── 1. Create tenant record
          │       (id, name, slug for subdomain, status, plan_code)
          │
          ├── 2. Create license record
          │       (modules[], limits, expiry)
          │
          ├── 3. Create owner user record
          │       (email, bcrypt password, role: OWNER)
          │
          ├── 4. Create default store record
          │
          ├── 5. Create default roles with preset permissions
          │       (Owner, Manager, Cashier)
          │
          ├── 6. Seed clothing product categories
          │
          ├── 7. Create Meilisearch index for this tenant
          │
          ├── 8. If ECOM_STORE active → provision subdomain
          │       (merchantslug.yourplatform.com)
          │
          ├── 9. Send welcome email via Resend
          │
          └── 10. Log provisioning event
```

---

### Plan Upgrade Workflow

```
Merchant clicks upgrade (from billing settings or locked feature prompt)
          │
          ▼
  Plan comparison modal
  (shows current plan vs available upgrades + add-ons)
          │
  Merchant selects new plan / add-on
          │
          ▼
  Razorpay processes:
    - Pro-rated charge for remainder of billing cycle
    - New plan recurring amount
          │
  ┌───────┴──────────────────────┐
  │ Payment success?             │
  └───────┬──────────────────────┘
          │ Yes
          ▼
  Update license.modules[] and limits in DB
  Delete Redis license cache (license:{tenant_id})
  Next API call fetches fresh permissions automatically
          │
          ▼
  New sidebar sections appear in dashboard immediately
  No reinstall, no migration, no new login required
```

---

### Payment Failure Workflow

```
Recurring payment fails
          │
          ▼
  Day 0:  Show warning banner in dashboard
          Send payment failure email + WhatsApp
          │
  Day 3:  Send reminder email
          │
  Day 7:  Switch to read-only mode
          (can view data, cannot make new sales)
          Show persistent lock screen on POS terminal
          │
  Merchant updates payment method + pays
          │
          ▼
  Account unlocks immediately
  Banner cleared
  Full access restored
```

---

### Module Add-on Activation (Self-Serve)

```
Merchant goes to Settings → Modules
          │
  Sees locked modules with price and feature list
          │
  Clicks "Add [Module Name]"
          │
  Confirms payment (one-click if card saved)
          │
  Razorpay charges add-on price
          │
  license.modules[] updated in DB
  Redis cache cleared
          │
  Dashboard sidebar updates instantly:
    → New sections appear
    → No page refresh needed
    → Merchant starts using the feature immediately
```

---

*Last updated: 2026 · Built for clothing retail SaaS*