# theMrktPlace — Full Suite Overview

## What This Is

A multi-tenant ecommerce SaaS platform where:
- A **SaaS Admin** (you) manages tenants/shops
- Each **Shop Owner** gets an **Admin Dashboard** to run their store
- Customers use the **Ecommerce Web** or **Ecommerce Mobile** app

---

## Apps in the Suite

| App | Stack | Who Uses It |
|-----|-------|-------------|
| SaaS Admin Portal | Next.js + ShadcnUI | Platform owner (you) |
| Shop Admin Dashboard | Next.js + ShadcnUI | Shop owners |
| Ecommerce Web | Next.js + HeroUI | End customers |
| Ecommerce Mobile | React Native / Expo | End customers |

---

## Backend (Shared)

- **Framework**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **Email**: Resend API
- **Payments**: Razorpay
- **Notifications**: Telegram Bot API
- **Config Source**: All environment variables / config fetched from DB (per-tenant)

---

## Data Hierarchy

```
SaaS Platform (your infra)
  └── Tenant / Shop (one per shop owner)
        ├── Shop Config (branding, settings, creds)
        ├── Products / Catalogue
        ├── Orders
        ├── Customers
        └── Analytics
```

---

## File Index

| File | Contents |
|------|----------|
| `01-saas-admin-schema.md` | SaaS admin data models, features, workflows |
| `02-ecommerce-schema.md` | Core shared data models (products, orders, users…) |
| `03-admin-dashboard-features.md` | Shop Admin portal — all sections + workflows |
| `04-ecommerce-client-features.md` | Web + Mobile customer-facing features |
| `05-backend-api.md` | All FastAPI endpoints + algorithms |
| `06-auth-onboarding-flows.md` | Auth flows, onboarding steps, OTP, guards |
