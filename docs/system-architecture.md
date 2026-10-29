# System Architecture & Technical Topology

themrktplace is structured as a high performance Standalone Omnichannel Retail Suite tailored for modern retail and fashion brands. It unites physical store point-of-sale terminals, a central operations backoffice, and customer-facing ecommerce into a unified real-time inventory engine.

---

## 1. High-Level System Topology

```mermaid
flowchart TD
    subgraph Clients["Client Terminals & Touchpoints"]
        POS["Flutter Native POS & Management Terminal<br/>apps/pos<br/>(Android, iOS, Windows, macOS)"]
        STORE["Next.js 14 D2C Website<br/>apps/storefront<br/>(Customer Ecommerce & Account Portal)"]
    end

    subgraph Edge["Edge & Security Layer"]
        CF["Cloudflare WAF + SSL + Global CDN"]
    end

    subgraph API_GATEWAY["Fastify v4 API Gateway (apps/api)"]
        CORS["CORS + Helmet"]
        RATE["Rate Limiter (Redis)"]
        AUTH["JWT Auth Guard"]
        ROLE["Role Authorization (OWNER, MANAGER, CASHIER, CUSTOMER)"]
        VALIDATE["Zod Schema Contract Validation"]
        HANDLER["Modular Route Handlers"]
    end

    subgraph Workers["Background Asynchronous Workers (BullMQ)"]
        W_NOTIF["Notifications Engine<br/>(Email via Resend, SMS via MSG91)"]
        W_STOCK["Low Stock Alerting"]
        W_SEARCH["Search Engine Sync<br/>(Typesense Indexer)"]
        W_REPORTS["Financial & GST Reports Generator"]
    end

    subgraph DataLayer["Persistence & Storage Layer"]
        PG["PostgreSQL 16<br/>Prisma ORM<br/>Single-Brand Multi-Store Architecture"]
        RD["Redis 7<br/>Cache, Sessions, BullMQ Queues,<br/>Rate Limits, Held Carts"]
        TS["Typesense<br/>Typo-tolerant Instant Search"]
        R2["Cloudflare R2 / S3<br/>Product Imagery & Invoices"]
    end

    POS --> CF
    STORE --> CF
    CF --> API_GATEWAY

    API_GATEWAY --> CORS --> RATE --> AUTH --> ROLE --> VALIDATE --> HANDLER
    HANDLER --> PG
    HANDLER --> RD
    HANDLER --> TS
    HANDLER --> Workers
    Workers --> PG
    Workers --> RD
    Workers --> R2
```

---

## 2. Omnichannel Architecture & Application Matrix

```mermaid
graph LR
    subgraph CorePlatform["Unified Core Platform"]
        API["Fastify API Engine<br/>apps/api"]
        DB["PostgreSQL (Prisma)<br/>Unified Inventory"]
    end

    POS_APP["Flutter POS & Management<br/>Register Mode + Backoffice Mode<br/>Full Catalog, Stock & Web Settings"] -->|REST / JWT| API
    STORE_APP["Customer Website<br/>D2C Brand Commerce<br/>Shopper Account & Orders"] -->|REST / Public API| API

    API --> DB
```

| Application | Technology | Primary Audience | Key Responsibilities |
|---|---|---|---|
| **POS & Management Terminal** (`apps/pos`) | Flutter 3.13+ (Dart 3) | Store Owners, Managers & Cashiers | Register billing mode (tenders, ESC/POS printing, shifts) + Management mode (products, stock, web order fulfillment, reports, staff, website banner). |
| **Customer Storefront** (`apps/storefront`) | Next.js 14, Tailwind CSS, shadcn/ui | Direct-to-Consumer Shoppers | Fast browse, faceted filter, shopping bag, checkout, BOPIS store pickup, customer account login. |
| **Backend API** (`apps/api`) | Fastify v4, TypeScript, BullMQ | Internal & Client Applications | High throughput REST endpoints, staff & customer authentication, inventory locking, transaction safety, audit trail. |

---

## 3. Database Schema & Architecture Shift

The architecture has eliminated all multi-tenant isolation overhead (`tenantId` columns, `Tenant` tables, SaaS license validation) in favor of a direct **Single-Brand Omnichannel Model**:

1. **Brand Configuration**: Stored in `BusinessSettings` table (`id: "default"`), holding company legal identity, GSTIN, and global retail defaults.
2. **Multi-Store Capability**: The brand can operate multiple physical store locations (`Store` table) such as Retail Stores, Outlets, and Warehouses.
3. **Inventory Isolation per Store**: Stock levels (`InventoryLevel`) and stock adjustments (`InventoryMovement`) are tracked strictly per store variant pair (`variantId`, `storeId`).
4. **Unified Product Catalog**: Products and categories are managed brand-wide, allowing instantaneous visibility across both physical POS terminals and web storefronts.

```mermaid
erDiagram
    BusinessSettings ||--o{ Store : operates
    Store ||--o{ Staff : employs
    Store ||--o{ StaffShift : registers
    Store ||--o{ InventoryLevel : holds
    Store ||--o{ Sale : processes
    Product ||--|{ ProductVariant : defines
    ProductVariant ||--o{ InventoryLevel : tracks
    ProductVariant ||--o{ SaleItem : sold_in
    Sale ||--|{ SaleItem : includes
    Sale ||--|{ SalePayment : settles
    Sale ||--o{ Return : returns
    Customer ||--o{ Sale : purchases
```

---

## 4. Edge and Offline Resilience Strategy

```mermaid
sequenceDiagram
    autonumber
    actor Cashier
    participant POS as Flutter POS App
    participant LocalDB as SQLite Offline Cache
    participant API as Fastify API (apps/api)
    participant Redis as Redis Queue

    Cashier->>POS: Scans Barcode / Adds Item to Cart
    POS->>POS: Recalculates subtotal, discounts, and taxes locally
    Cashier->>POS: Confirms Payment (Cash / UPI / Card)
    
    alt Network Online
        POS->>API: POST /api/v1/sales (Transactional)
        API->>Redis: Deduct inventory & enqueue notifications
        API-->>POS: 201 Created (Invoice Generated)
        POS->>Cashier: Print 80mm ESC/POS Thermal Receipt
    else Network Offline
        POS->>LocalDB: Store Sale in Local SQLite Queue
        POS->>POS: Optimistically deduct local stock cache
        POS->>Cashier: Print Offline Receipt with Local Sequential Sequence
        Note over POS,API: Background Worker monitors network connection
        POS->>API: Sync queued sales via POST /api/v1/sales/bulk-sync
        API-->>POS: Confirm sync & update sync state
    end
```

---

## 5. Security & Cryptographic Standards

- **Password Storage**: Passwords hashed using bcrypt with cost factor 12.
- **PIN Storage**: Cashier staff PINs hashed using bcrypt with cost factor 12.
- **Session Tokens**: Short-lived stateless JWT access tokens (15 minute expiration) paired with cryptographically secure, SHA-256 hashed refresh tokens persisted in Redis/PostgreSQL.
- **MFA Security**: TOTP standards (RFC 6238) with AES-256 encrypted server secrets and 8 emergency single-use backup recovery codes.
- **Strict Role-Based Access Control**:
  - `OWNER`: Full business authority, tax settings, staff compensation, and financial exports.
  - `MANAGER`: Store branch management, inventory adjustments, purchase order receipt, and shift approvals.
  - `CASHIER`: Point of sale checkout, held carts, and register shift drawer balancing.
