# Blueprint: The Mrktplace

Summary: Domain map, application boundaries, route hierarchy, and delivery slices.

## Application Boundaries
| App | Target Users | Technology | Port |
| --- | --- | --- | --- |
| `apps/dashboard` | Store owners, managers, cashiers | Next.js 14 App Router, shadcn/ui, Dexie.js | 3000 |
| `apps/api` | API consumer for all frontends | Fastify v4, Prisma ORM, BullMQ, Redis | 3001 |
| `apps/storefront` | End customers (ecommerce shoppers) | Next.js 14 App Router (SSR), Tailwind | 3002 |
| `apps/internal-admin` | Platform operators, superadmins | Next.js 14 App Router, shadcn/ui | 3003 |

## Domains & Module Registry
| Domain | Module Code | Scope |
| --- | --- | --- |
| Auth & Security | Core | Registration, JWT sessions, MFA, POS PIN login |
| POS Billing | `POS_CORE` | Rapid checkout, split tender, held carts, offline Dexie |
| Inventory | `POS_CORE` / `MULTISTORE` | Products, attributes, variants, stock movements, POs |
| Sales & Invoices | `POS_CORE` | Invoice ledger, returns, refunds, thermal receipts |
| Staff & Shifts | `POS_CORE` / `STAFF_PRO` | Cashier shifts, register counting, sales commissions |
| Customers & CRM | `CRM_PRO` | Profiles, purchase history, loyalty points, store credit |
| Promotions | `PROMO_PRO` | Discount rules, coupon codes, category deals |
| Analytics | `ANALYTICS_PRO` | Day-end reports, category revenue, inventory turnover |
| Storefront | `ECOM_STORE` | Public online catalog, cart, checkout, order tracking |
| Licensing | Core / Internal | Tenant plans, module flags, device activations |

## Delivery Slices
- S01: Monorepo foundation, PostgreSQL schema, Fastify auth (Done).
- S02: POS terminal interface, offline Dexie sync, split billing, shift manager (Done).
- S03: Clothing product variant matrix, inventory movements, low stock alerts (Done).
- S04: Merchant admin dashboard, customer CRM, staff management (In Progress).
- S05: Visual reports, Recharts analytics, GSTR-1 accounting export (In Progress).
- S06: Next.js customer storefront, public catalog API, inventory reservation (Planned).
- S07: Internal admin control panel, license key generator, self-serve billing (Planned).

## Handoff Contract
- Decisions: Keep POS terminal inside `apps/dashboard` under `(pos)/pos` route group to share auth tokens and UI primitives while maintaining dedicated full-screen layout.
- Open: Subdomain multi-tenancy vs path-based routing for storefront (Default: Subdomain `tenant.mrktplace.com`).
- Next agent needs: Domain module structure must follow `modules/{domain}/{components,hooks,store,types,utils}`.

