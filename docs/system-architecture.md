# System Architecture & Technical Topology

The Mrktplace is structured as a distributed, multi-tenant cloud platform with an offline-resilient edge terminal.

---

## 1. High-Level System Topology

```mermaid
flowchart TD
    subgraph Edge["Edge & Security Layer"]
        DEVICES["Client Devices<br/>(POS Tablets, Laptops, Mobile)"]
        CF["Cloudflare<br/>WAF + SSL + CDN + DDoS Shield"]
    end

    subgraph Hosting["Application Hosting"]
        direction LR
        VERCEL["Vercel Edge<br/>Dashboard, Storefront, Admin"]
        HETZNER["Hetzner VPS x2<br/>Fastify API (Load Balanced)"]
    end

    subgraph API_LAYER["Fastify v4 API Gateway"]
        CORS["CORS + Helmet"]
        RATE["Rate Limiter"]
        AUTH["JWT Auth Guard"]
        ROLE["Role Authorization"]
        LIC["License Guard"]
        VALIDATE["Schema Validation"]
        HANDLER["Route Handler"]
    end

    subgraph Workers["Background Workers (BullMQ)"]
        W_NOTIF["Notifications<br/>(Email via Resend, SMS via MSG91)"]
        W_STOCK["Low Stock<br/>Alerting Engine"]
        W_SEARCH["Search Sync<br/>(Typesense Index)"]
        W_REPORT["Report<br/>Generation"]
    end

    subgraph DataLayer["Persistence Layer"]
        PG["PostgreSQL 16<br/>Prisma ORM<br/>Multi-tenant Isolation"]
        RD["Redis 7<br/>Cache, Sessions, Queues,<br/>Rate Limits, Pub/Sub"]
        TS["Typesense<br/>Typo-tolerant<br/>Product Search"]
        R2["Cloudflare R2<br/>Images, PDFs,<br/>Shipping Labels"]
    end

    DEVICES --> CF
    CF --> VERCEL
    CF --> HETZNER

    HETZNER --> CORS --> RATE --> AUTH --> ROLE --> LIC --> VALIDATE --> HANDLER
    HANDLER --> PG & RD & TS
    HANDLER --> Workers
    Workers --> PG & RD & R2
```

---

## 2. API Request Lifecycle

Every HTTP request to the Fastify API undergoes a strict sequential middleware pipeline before reaching the route handler.

```mermaid
sequenceDiagram
    participant C as Client
    participant CF as Cloudflare WAF
    participant F as Fastify API
    participant R as Redis
    participant DB as PostgreSQL
    participant Q as BullMQ

    C->>CF: HTTPS Request
    CF->>F: Forwarded (WAF + SSL terminated)

    Note over F: 1. CORS & Security Headers
    F->>R: 2. Rate Limit Check
    R-->>F: Under limit

    Note over F: 3. JWT Authentication
    F->>R: Verify session (cache hit)
    R-->>F: Session valid, inject req.user

    Note over F: 4. Role Authorization
    F->>F: Check role permissions (OWNER/MANAGER/CASHIER)

    Note over F: 5. License Guard
    F->>R: Lookup license:{tenant_id}
    R-->>F: Modules: [POS_CORE, MULTISTORE, ...]

    Note over F: 6. Schema Validation (Zod/JSON Schema)
    F->>DB: 7. Prisma $transaction
    DB-->>F: Result

    F->>Q: 8. Queue async jobs (email, search sync)
    F-->>C: 9. JSON Response Envelope
```

### Middleware Stack Details

| Order | Middleware | Source File | Purpose |
|---|---|---|---|
| 1 | CORS + Security | `@fastify/cors`, `@fastify/helmet` | Cross-origin policy, security headers, CSP |
| 2 | Rate Limiter | `@fastify/rate-limit` | Redis-backed request throttling per IP and tenant |
| 3 | Authentication | `middleware/authenticate.ts` | JWT signature verification, session state check, injects `req.user` |
| 4 | Authorization | `middleware/authorize.ts` | Role-based access control (`OWNER`, `MANAGER`, `CASHIER`) |
| 5 | License Guard | `middleware/license-guard.ts` | Module flag check against tenant license, Redis cache with DB fallback |
| 6 | Validation | Fastify JSON Schema + Zod | Request params, query, and body validated before handler |
| 7 | Handler | Route-specific service | Prisma transactional operations |
| 8 | Async Queue | BullMQ | Side effects dispatched to background workers |

---

## 3. Background Workers (BullMQ)

Heavy operations and asynchronous events are decoupled from the HTTP thread:

```mermaid
flowchart LR
    subgraph Triggers["Event Triggers"]
        SALE["Sale Completed"]
        STOCK_CHANGE["Stock Changed"]
        PRODUCT_UPDATE["Product Updated"]
        AUTH_EVENT["Auth Event"]
    end

    subgraph Queue["Redis BullMQ Queues"]
        Q_NOTIF["notifications"]
        Q_STOCK["stock-alerts"]
        Q_SEARCH["search-sync"]
    end

    subgraph Workers["Worker Processes"]
        W_NOTIF["Notifications Worker<br/>Resend (email) + MSG91 (SMS)"]
        W_STOCK["Stock Alert Worker<br/>Low stock threshold check"]
        W_SEARCH["Search Sync Worker<br/>Typesense index update"]
    end

    SALE --> Q_NOTIF
    AUTH_EVENT --> Q_NOTIF
    STOCK_CHANGE --> Q_STOCK
    PRODUCT_UPDATE --> Q_SEARCH

    Q_NOTIF --> W_NOTIF
    Q_STOCK --> W_STOCK
    Q_SEARCH --> W_SEARCH
```

---

## 4. Frontend Architecture

### 4.1 Dashboard Route Map

```mermaid
graph TD
    ROOT["/ (Root)"]

    subgraph AuthGroup["(auth) Group - Unauthenticated"]
        LOGIN["/login"]
        REGISTER["/register"]
        VERIFY["/verify-email"]
    end

    subgraph DashGroup["(dashboard) Group - Authenticated"]
        HOME["/ Home<br/>Business intelligence overview"]
        ONBOARD["/onboarding<br/>6-step setup wizard"]
        INVENTORY["/inventory<br/>Products, variants, stock"]
        SALES["/sales<br/>History, returns, invoices"]
        CUSTOMERS["/customers<br/>CRM, loyalty, credit"]
        STAFF["/staff<br/>Employees, PINs, commissions"]
        REPORTS["/reports<br/>Day-end, GST, analytics"]
        SETTINGS["/settings<br/>Store config, tax, modules"]
    end

    subgraph POSGroup["(pos) Group - Full-screen Terminal"]
        POS["/pos<br/>Rapid checkout interface"]
    end

    ROOT --> AuthGroup
    ROOT --> DashGroup
    ROOT --> POSGroup
```

### 4.2 State Management Architecture

Frontend state is deliberately separated by lifecycle and source of truth to prevent cross-contamination and enable offline resilience:

```mermaid
flowchart TD
    subgraph Zustand["Zustand v5 (Client State)"]
        CART["Active POS Cart"]
        SHIFT["Current Shift"]
        PIN["Cashier Session"]
        ACTIVE_STORE["Active Store Selection"]
        HELD["Held/Parked Carts"]
    end

    subgraph TanStack["TanStack Query v5 (Server State)"]
        PRODUCTS["Products & Variants"]
        SALES_DATA["Sales History"]
        CUSTOMERS_DATA["Customer Profiles"]
        STAFF_DATA["Staff & Shifts"]
        REPORTS_DATA["Report Aggregates"]
    end

    subgraph Dexie["Dexie.js / IndexedDB (Offline)"]
        LOCAL_CATALOG["Cached Product Catalog"]
        LOCAL_CUSTOMERS["Cached Customer Balances"]
        PENDING["Pending Unsynced Sales"]
        LOCAL_LICENSE["Cached License State"]
    end

    CART --> |"Checkout"| TanStack
    TanStack --> |"Background sync"| Dexie
    Dexie --> |"Offline fallback"| Zustand
```

| Layer | Library | What it holds | Persistence |
|---|---|---|---|
| Client UI State | Zustand v5 | Active cart, current shift, cashier PIN, held carts, active store | In-memory (lost on refresh) |
| Server State | TanStack Query v5 | Products, sales, customers, staff, reports | Auto-cached with stale-while-revalidate |
| Offline Persistence | Dexie.js (IndexedDB) | Product catalog, customer balances, pending sales, license cache | Persistent across sessions |

---

## 5. Offline-First POS Sync Engine

The POS terminal is engineered to function continuously even during internet outages.

```mermaid
stateDiagram-v2
    [*] --> Online: Terminal boots

    Online --> Selling: Cashier opens shift
    Selling --> Selling: Sale completed (saved to server)

    Selling --> Offline: Network connection lost
    state Offline {
        [*] --> LocalSale: Customer checks out
        LocalSale --> IndexedDB: Save with synced=false
        IndexedDB --> Receipt: Print via local printer
        Receipt --> [*]: Ready for next customer
    }

    Offline --> Syncing: Network restored
    state Syncing {
        [*] --> Dequeue: Read oldest unsynced sale
        Dequeue --> Push: POST /api/v1/sales
        Push --> Confirm: Server acknowledges
        Confirm --> MarkSynced: Set synced=true
        MarkSynced --> CheckMore: More pending?
        CheckMore --> Dequeue: Yes
        CheckMore --> [*]: No, all clear
    }

    Syncing --> Online: Sync complete
```

### Sync Rules
1. **Catalog pull**: Every 15 minutes (and on manual trigger), the terminal pulls updated products and customer balances into IndexedDB.
2. **Offline sales**: If network drops, sales are saved to IndexedDB with `synced: false`. Receipts print via local USB/Bluetooth thermal printer.
3. **FIFO sync**: On reconnection, pending sales are pushed in chronological order. Each sale is confirmed before the next is sent.
4. **Conflict resolution**: Server-side timestamp comparison prevents duplicate invoice numbers.

---

## 6. Licensing & Feature-Flag Security

Modules are licensed individually. A store owner cannot access premium features unless their tenant license includes the respective module code.

```mermaid
flowchart TD
    REQ["Incoming Request<br/>/api/v1/promotions"]
    GUARD["license-guard middleware"]
    REDIS["Redis Cache<br/>license:{tenant_id}"]
    DB["PostgreSQL Fallback"]

    REQ --> GUARD
    GUARD --> REDIS
    REDIS -->|"Cache HIT"| CHECK
    REDIS -->|"Cache MISS"| DB
    DB --> REPOPULATE["Repopulate Redis<br/>TTL: 1 hour"]
    REPOPULATE --> CHECK

    CHECK{"Has PROMO_PRO?"}
    CHECK -->|"Yes"| ALLOW["Proceed to Handler"]
    CHECK -->|"No"| DENY["403 MODULE_NOT_ACTIVE<br/>{module, upgradeUrl}"]
```

**Frontend enforcement**: The `useLicense` hook gates UI sections client-side:
```tsx
const { hasModule } = useLicense();

if (!hasModule("PROMO_PRO")) {
  return <UpgradePrompt module="PROMO_PRO" />;
}
```

---

## 7. Monorepo Package Dependency Graph

```mermaid
graph TD
    API["apps/api"] --> SCHEMA["packages/schema<br/>(Prisma + Zod)"]
    DASH["apps/dashboard"] --> SCHEMA
    STORE["apps/storefront"] --> SCHEMA
    IADMIN["apps/internal-admin"] --> SCHEMA

    DASH --> UI["packages/ui<br/>(shadcn radix-maia)"]
    STORE --> UI
    IADMIN --> UI

    API --> TYPES["packages/types"]
    DASH --> TYPES
    STORE --> TYPES
    IADMIN --> TYPES

    subgraph Config["Shared Configuration"]
        ESL["packages/eslint-config"]
        TSC["packages/typescript-config"]
    end

    API --> ESL & TSC
    DASH --> ESL & TSC
    STORE --> ESL & TSC
    IADMIN --> ESL & TSC
    SCHEMA --> TSC
    UI --> TSC
```

### Build Pipeline (Turborepo)

```mermaid
flowchart LR
    LINT["lint"] --> BUILD["build"]
    TYPE["typecheck"] --> BUILD
    BUILD --> DEPLOY["deploy"]

    subgraph Parallel["Parallel Tasks"]
        LINT
        TYPE
    end
```

Turborepo caches build outputs and only rebuilds packages whose source files (or dependencies) have changed.
