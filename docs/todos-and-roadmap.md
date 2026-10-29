# Master Roadmap & Actionable TODOs

This document maintains the canonical status of all development stages and granular module TODOs for themrktplace Standalone Omnichannel Retail Suite.

---

## Stage Progression Overview

```mermaid
graph LR
    S1["Stage 1<br/>Core Engine & REST API<br/>✅ Complete"]
    S2["Stage 2<br/>Flutter POS & Management<br/>✅ Complete"]
    S3["Stage 3<br/>Customer Web Storefront<br/>✅ Complete"]
    S4["Stage 4<br/>Logistics & Stock Transfers<br/>🚧 Active"]
    S5["Stage 5<br/>Omnichannel Growth<br/>& Marketplace Sync<br/>⏳ Planned"]

    S1 --> S2 --> S3 --> S4 --> S5
```

| Stage | Name | Target Capabilities | Status |
|---|---|---|---|
| **1** | Core Engine & REST API | Fastify REST API, PostgreSQL, Redis, Typesense, Standalone Schema | **100% Complete** |
| **2** | Flutter POS & Management Terminal | Dual-mode terminal: Register Mode (checkout, printer, shifts) and Management Mode (catalog, inventory, web orders, CRM, reports, settings) | **100% Complete** |
| **3** | Customer Web Storefront | Next.js 14 luxury apparel storefront, customer auth, account portal, bag, BOPIS and courier checkout | **100% Complete** |
| **4** | Logistics, Transfers & Carrier Sync | Store-to-store stock transfers, Shiprocket AWB generation, automated SMS/WhatsApp alerts | **Active Development** |
| **5** | Omnichannel Growth & Marketplace Sync | Amazon, Flipkart, Myntra catalog sync, WhatsApp Commerce bot | **Planned** |

---

## Stage 1: Core Engine & Flutter POS Terminal (Complete)

### Completion Summary

```mermaid
graph TD
    subgraph Foundation["1.1 Monorepo Foundation"]
        MONO["Turborepo monorepo ✅"]
        TS["TypeScript 5 strict ✅"]
        DOCKER["Docker Compose (Postgres, Redis, Typesense) ✅"]
        PRISMA["Prisma standalone schema ✅"]
    end

    subgraph Auth["1.2 Authentication & Security"]
        JWT["JWT access + refresh tokens ✅"]
        RBAC["Role-based authorization (OWNER, MANAGER, CASHIER) ✅"]
        PIN["Fast cashier 4-6 digit PIN login ✅"]
        MFA["TOTP MFA + 8 backup codes ✅"]
    end

    subgraph FlutterPOS["1.3 Flutter POS Terminal (apps/pos)"]
        UI["Dual-density obsidian luxury interface ✅"]
        GRID["Touch product grid + category chips ✅"]
        CART["Riverpod reactive cart & discount manager ✅"]
        TENDER["Split payment dialog (Cash, UPI, Card, Credit) ✅"]
        PRINTER["Raw ESC/POS 80mm thermal receipt builder ✅"]
        SHIFTS["Shift cash reconciliation & discrepancy modal ✅"]
        OFFLINE["Local SQLite offline sale queue & sync engine ✅"]
    end

    subgraph Backend["1.4 Fastify REST API (apps/api)"]
        PRODUCTS["Product & variant CRUD ✅"]
        STOCK["Multi-store inventory levels & movements ✅"]
        SALES["Transactional checkout & returns ✅"]
        REPORTS["End-of-day & inventory reports ✅"]
    end
```

### Detailed Checklist
- [x] Turborepo monorepo with apps (`api`, `storefront`, `pos`) and packages (`schema`, `ui`, `types`). Web admin dashboard consolidated into `apps/pos`.
- [x] Standalone Prisma schema with PostgreSQL 16 (removed all `tenantId` columns and multi-tenant overhead).
- [x] Docker Compose for local development (PostgreSQL, Redis, Typesense).
- [x] Fastify v4 API with JWT auth, rate limiting, and BullMQ worker queue.
- [x] Apparel variant matrix (Size, Color, SKU, Barcode, Cost, Selling Price).
- [x] Multi-store inventory levels and append-only inventory movement audit trail.
- [x] Split payment billing engine (Cash, Card, UPI, Store Credit, Loyalty Points).
- [x] Native Flutter cross-platform POS application (`apps/pos`) for Android, iOS, Windows, and macOS.
- [x] Touch-optimized product grid with live stock status chips and barcode search.
- [x] Raw ESC/POS thermal printing byte stream builder (80mm) with paper cut and cash drawer kick.
- [x] Cashier register shift opening and closing with cash denomination count and discrepancy tracking.
- [x] Customer CRM with loyalty points calculation and store credit balance management.

---

## Stage 2: Flutter POS & Operations Management (Complete)

All store, catalog, customer, and website management has been unified into the native Flutter POS terminal (`apps/pos`), eliminating the need for a separate browser admin dashboard.

### Module Progress

```mermaid
graph TD
    subgraph PosRegister["2.1 Register Mode (Cashier Checkout)"]
        TOUCH_GRID["Touch product grid + category chips ✅"]
        RIVERPOD_CART["Riverpod reactive cart & discount manager ✅"]
        SPLIT_TENDER["Split tender (Cash, UPI, Card, Store Credit) ✅"]
        THERMAL_PRINT["Raw 80mm ESC/POS thermal receipt builder ✅"]
        SHIFT_COUNT["Cash float & register reconciliation modal ✅"]
        PIN_LOCK["Fast cashier PIN lock & authorization ✅"]
    end

    subgraph PosManagement["2.2 Management Mode (Store Backoffice)"]
        OVERVIEW["Daily sales metrics & cashier float overview ✅"]
        PRODUCTS_MGT["Product & variant catalog + website toggle ✅"]
        INVENTORY_MGT["Stock levels & physical adjustment dialog ✅"]
        WEB_ORDERS["Web order tracker (PENDING to DELIVERED) ✅"]
        CRM["Customer CRM, loyalty points & store credit ✅"]
        REPORTS["Day-end Z-Report, GST liability & GSTR-1 export ✅"]
        STAFF_ROSTER["Staff roster & 4-digit PIN configuration ✅"]
        WEB_SETTINGS["Website announcement, BOPIS & COD controls ✅"]
    end
```

### Detailed Checklist

#### 2.1 Register Mode
- [x] Dual-density luxury Obsidian UI for compact touchscreens and wide desktop terminals.
- [x] Touch-optimized product grid with category chips and live stock indicators.
- [x] Riverpod reactive cart state with line item discounts and customer tagging.
- [x] Split tender payment modal supporting Cash, UPI QR, Card, and Store Credit.
- [x] Raw ESC/POS thermal printer byte stream generator for 80mm receipts.
- [x] Cashier shift opening, closing, cash denomination counting, and discrepancy logging.
- [x] Cashier PIN lock screen for rapid cashier handoffs.

#### 2.2 Management Mode (Unified Backoffice in POS)
- [x] Store Overview view with today's revenue, active online orders, and cashier float status.
- [x] Product Catalog view with apparel variant matrix and publish-to-website switch.
- [x] Inventory Management view with stock count by store, low-stock flags, and adjustment dialog.
- [x] Website Orders view for omnichannel order fulfillment (`PENDING`, `PACKED`, `SHIPPED`, `DELIVERED`).
- [x] Customer CRM view with purchase history, loyalty point rewards, and store credit balance.
- [x] Reports view with EOD Z-Report, GST tax liability, tender breakdown, and GSTR-1 export.
- [x] Staff Management view with staff roster, roles (`OWNER`, `MANAGER`, `CASHIER`), and PIN setup.
- [x] Website Settings view with announcement banner editor, BOPIS toggle, and COD controls.

---

## Stage 3: Customer Web Storefront & Omnichannel (Complete)

The web application (`apps/storefront`) is strictly customer-facing. It handles public catalog browsing, customer accounts, and order placement with zero admin or merchant overhead.

### Module Progress

```mermaid
graph TD
    subgraph CustomerPortal["3.1 Customer Shopping Experience"]
        HEADER["Announcement banner, search & bag badge ✅"]
        CATALOG["Luxury apparel catalog & category filters ✅"]
        VARIANTS["Size & color selector with store stock chips ✅"]
        BAG["Persistent shopping cart with quantity controls ✅"]
        CHECKOUT["Checkout with BOPIS Store Pickup or Delivery ✅"]
        PAYMENT["Razorpay online payment or Cash on Delivery ✅"]
    end

    subgraph CustomerAuth["3.2 Customer CRM Integration"]
        REGISTER["Customer registration with 100 bonus points ✅"]
        LOGIN["Customer password sign-in & instant demo access ✅"]
        ACCOUNT["Account portal: points, store credit & orders ✅"]
        ORDER_TRACK["Real-time fulfillment tracking (PENDING to DELIVERED) ✅"]
    end
```

### Detailed Checklist

#### 3.1 Customer Storefront (apps/storefront)
- [x] Next.js 14 App Router customer shopping portal with shadcn/ui "radix-maia" variant.
- [x] Global header with live announcement banner, brand mark, category nav, and cart counter.
- [x] Apparel catalog homepage with faceted category filtering and live store availability indicators.
- [x] Persistent shopping bag powered by Zustand with quantity selectors and line item removal.
- [x] Delivery mode switcher: BOPIS (Free Store Pickup at Indiranagar Flagship) vs Courier Home Delivery.
- [x] Streamlined checkout flow with shipping address input, GST calculation, and payment selection.
- [x] Order confirmation view with tracking ID and omnichannel store routing.

#### 3.2 Customer Authentication & Loyalty Portal
- [x] Customer sign-in page with email/password authentication via Fastify `/api/v1/website/customer/login`.
- [x] Customer registration page with automatic 100 loyalty points welcome credit.
- [x] Dedicated Customer Account dashboard displaying loyalty points, store credit balance, and past orders.
- [x] Live fulfillment status tracking (`PENDING`, `PACKED`, `SHIPPED`, `DELIVERED`) synced with POS actions.

---

## Stage 4: Logistics, Stock Transfers & Carrier Sync (Active)

#### Detailed Checklist
- [ ] Store-to-store stock transfer manifests and in-transit tracking (`StockTransfer` model).
- [ ] Shiprocket / Delhivery courier API integration for automated AWB generation.
- [ ] Automated SMS and WhatsApp order tracking updates via MSG91 / Meta Cloud API.
- [ ] Barcode verification during web order packing inside the POS terminal.
- [ ] Self-serve customer return portal on website with store credit refund option.

---

## Stage 5: Omnichannel Growth & Marketplace Sync (Planned)

#### Detailed Checklist
- [ ] Two-way catalog and inventory synchronization with Amazon India, Flipkart, and Myntra.
- [ ] Meta Commerce Manager integration for Instagram and Facebook Shop catalogs.
- [ ] Interactive WhatsApp shopping bot for order status queries and automated reordering.
- [ ] Public developer REST API with API key authentication and OpenAPI specification.

---

## Immediate Next Slices

```mermaid
flowchart LR
    S1["Slice 1<br/>Stock Transfer Engine<br/>(apps/api + schema)"]
    S2["Slice 2<br/>Carrier Logistics & AWB<br/>(Shiprocket / Delhivery)"]
    S3["Slice 3<br/>Offline Sync Queue<br/>(apps/pos SQLite)"]

    S1 --> S2 --> S3
```

| Slice | Module | Description | Impact |
|---|---|---|---|
| **Slice 1** | Stock Transfer Engine | Add `StockTransfer` Prisma model and dispatch/receive workflow in POS | Enables seamless inventory balancing between warehouse and retail stores |
| **Slice 2** | Carrier Logistics & AWB | Integrate Shiprocket API for courier pickup and automated AWB generation | Speeds up online order dispatch directly from store floor |
| **Slice 3** | POS Offline Sync Queue | Persist offline checkout transactions to local SQLite and sync with retry worker | Guarantees continuous billing during internet interruptions |
