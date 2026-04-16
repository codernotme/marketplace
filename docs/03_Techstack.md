# 🏗️ ARCHITECTURE.md — System Architecture

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENTS / CONSUMERS                          │
├────────────┬───────────────┬─────────────────┬──────────────────────────┤
│ Master     │  Tenant Admin │  POS Terminal   │  Storefront   │  Mobile  │
│ Admin      │  (Next.js 15) │  (Next.js PWA)  │  (Next.js 15) │  (Expo)  │
│ (Next.js)  │               │                 │               │          │
└────────────┴───────────────┴─────────────────┴───────────────┴──────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │        Cloudflare (CDN/WAF)       │
                    │   DDoS · Rate Limit · Bot Filter  │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │          API Gateway              │
                    │   (Fastify · tRPC · GraphQL)      │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │   Auth Middleware            │  │
                    │  │   • JWT verification         │  │
                    │  │   • API Key validation       │  │
                    │  │   • Tenant resolution        │  │
                    │  │   • Rate limiting (Redis)    │  │
                    │  └─────────────────────────────┘  │
                    └────────────┬─────────────────────┘
                                 │
         ┌───────────────────────┼──────────────────────────┐
         │                       │                          │
         ▼                       ▼                          ▼
┌─────────────────┐   ┌────────────────────┐   ┌──────────────────────┐
│  Core Services  │   │  Async Services    │   │  External Services   │
│                 │   │                    │   │                      │
│ • Catalog       │   │ • Notification Svc │   │ • Stripe             │
│ • Orders        │   │ • Analytics Svc    │   │ • Razorpay           │
│ • Customers     │   │ • Search Indexer   │   │ • Twilio             │
│ • Inventory     │   │ • Webhook Dispatch │   │ • SendGrid           │
│ • Payments      │   │ • Email Renderer   │   │ • Typesense          │
│ • Shipping      │   │ • Report Builder   │   │ • Cloudflare R2      │
│ • Auth/Users    │   │ • Scheduler (cron) │   │ • AWS SES            │
│ • Tenants       │   │ • Event Processor  │   │ • Shiprocket         │
└────────┬────────┘   └──────────┬─────────┘   └──────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Data Layer                                     │
├──────────────────┬──────────────────┬──────────────┬────────────────────┤
│  PostgreSQL 16   │   Redis 7.2      │  Typesense   │   Cloudflare R2   │
│  (per-tenant DB  │   (cache,        │  (full-text  │   (media, docs,   │
│   or schema)     │    pub/sub,      │   semantic   │    exports, PDFs) │
│                  │    sessions,     │   search)    │                   │
│  + Neon for      │    rate limits)  │              │                   │
│  serverless      │                  │              │                   │
└──────────────────┴──────────────────┴──────────────┴────────────────────┘
```

---

## 2. Multi-Tenancy Architecture

We use a **hybrid isolation model** — separate PostgreSQL schemas per tenant within a shared cluster, with optional dedicated DB for enterprise tenants.

```
PostgreSQL Cluster
├── themrktplace_master          # Platform schema (tenants, plans, billing)
│   ├── tenants
│   ├── plans
│   ├── subscriptions
│   └── platform_events
├── tenant_abc123           # Schema per tenant
│   ├── products
│   ├── orders
│   ├── customers
│   └── ...
├── tenant_xyz789
│   └── ...
└── tenant_enterprise_co    # Optional dedicated DB (own connection string)
```

**Tenant Resolution Flow:**
```
Request → Extract subdomain OR x-tenant-id header
       → Resolve to tenant record in master schema
       → Set search_path = tenant_<id>
       → All queries auto-scoped via Drizzle middleware
```

---

## 3. Application Architecture (Next.js Apps)

Each Next.js app follows the **App Router with Server Components** architecture:

```
app/
├── (auth)/                  # Route group — auth pages
├── (dashboard)/             # Route group — authenticated
│   ├── layout.tsx           # Shell with sidebar
│   ├── @notifications/      # Parallel route for notifications
│   └── products/
│       ├── page.tsx         # Server component (RSC)
│       ├── [id]/
│       │   ├── page.tsx
│       │   └── loading.tsx  # Streaming skeleton
│       └── _components/     # Co-located components
├── api/                     # Route handlers
└── actions/                 # Server Actions (form mutations)
```

**Data Fetching Strategy:**
```
Static data     → generateStaticParams + ISR (revalidate: 60)
User-specific  → Server Components with cookies
Real-time      → Client Component + SWR / React Query
Mutations      → Server Actions + optimistic updates
WebSocket data → zustand store + WS subscription
```

---

## 4. API Gateway Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Fastify API Gateway                    │
│                                                          │
│  Plugins (registered in order):                          │
│  1. @fastify/helmet          (security headers)          │
│  2. @fastify/cors            (CORS)                      │
│  3. @fastify/rate-limit      (per-tenant limits)         │
│  4. fastify-jwt              (JWT verify)                │
│  5. api-key-plugin           (API key auth)              │
│  6. tenant-plugin            (tenant context injection)  │
│  7. @trpc/server/adapters    (tRPC routes)               │
│  8. @as-integrations/fastify (Apollo GraphQL)            │
│  9. @fastify/swagger         (OpenAPI docs)              │
│                                                          │
│  Route Namespaces:                                       │
│  /api/v1/...     → REST (public + webhooks)              │
│  /trpc/...       → tRPC (admin apps)                     │
│  /graphql        → GraphQL (storefront + mobile)         │
│  /ws             → WebSocket (real-time events)          │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Event-Driven Architecture

Events flow through a Redis Streams-based pub/sub system:

```
Producer (API Handler)
    │
    ▼
Redis Stream: themrktplace.events
    │
    ├──→ Consumer Group: notifications
    │        └─ Sends email/SMS/push
    ├──→ Consumer Group: analytics
    │        └─ Aggregates to analytics DB
    ├──→ Consumer Group: search-indexer
    │        └─ Updates Typesense index
    ├──→ Consumer Group: webhooks
    │        └─ Dispatches to tenant webhooks
    └──→ Consumer Group: audit-log
             └─ Writes to immutable audit table
```

**Event Schema:**
```typescript
interface themrktplaceEvent {
  id: string;          // ULID
  tenantId: string;
  type: EventType;     // e.g., "order.created"
  payload: unknown;
  metadata: {
    userId?: string;
    source: "api" | "pos" | "storefront" | "system";
    timestamp: string; // ISO 8601
    traceId: string;   // OpenTelemetry trace ID
  };
}
```

---

## 6. POS Offline Architecture

The POS uses a **local-first** design with CRDT-based conflict resolution:

```
POS Browser
├── IndexedDB (Dexie.js)
│   ├── products_cache        (synced catalog, TTL: 1hr)
│   ├── inventory_cache       (synced inventory, TTL: 5min)
│   ├── pending_transactions  (offline queue)
│   └── settings              (register config)
│
├── Service Worker
│   ├── Intercept API calls → serve from IndexedDB if offline
│   ├── Background sync (retry pending_transactions)
│   └── Push notification handling
│
└── Sync Engine
    ├── Online: Real-time sync via WebSocket
    ├── Offline: Queue writes to pending_transactions
    └── Reconnect: Upload queue → resolve conflicts → apply
```

**Conflict Resolution (CRDT):**
- Inventory counts → Last-Write-Wins with server timestamp authority
- Order creation → Idempotent with client-generated ULID
- Price changes → Server always wins

---

## 7. Search Architecture

```
Product write → Drizzle (PostgreSQL) → Event: product.updated
                                              │
                                              ▼
                                    Search Indexer Service
                                              │
                                              ▼
                                   Typesense Collection
                                   (full-text + vector)
                                              │
                          ┌───────────────────┤
                          │                   │
                          ▼                   ▼
                   Keyword Search      Semantic Search
                   (BM25 ranking)    (Embedding via
                                      OpenAI/Cohere)
                          │                   │
                          └─────────┬─────────┘
                                    ▼
                             Hybrid Reranking
                             (RRF algorithm)
                                    │
                                    ▼
                              Personalization
                              (user click data
                               boost signals)
```

---

## 8. Caching Strategy

| Layer | Tool | TTL | Scope |
|-------|------|-----|-------|
| Edge CDN | Cloudflare | 1-24hr | Static assets, ISR pages |
| API Response | Redis | 30-300s | Product lists, categories |
| Session | Redis | 7d | Auth sessions |
| Rate Limits | Redis | 1min/1hr | Per IP + per tenant |
| DB Query | Drizzle cache | 60s | Expensive aggregations |
| Search Results | Redis | 10min | Repeated queries |
| Tenant Config | Redis | 5min | Plan, settings, flags |

---

## 9. Real-Time Architecture (WebSocket)

```
Client (POS / Admin)
    │
    ▼ WS handshake + JWT
Fastify WS Server
    │
    ▼ Subscribe to tenant channel
Redis Pub/Sub: tenant:{id}:events
    │
    ├─ inventory.updated → push to POS terminals
    ├─ order.created    → push to admin dashboard
    ├─ payment.received → push to cashier display
    └─ stock.low        → push alert to all admins
```

---

## 10. Security Architecture

See [`SECURITY.md`](./SECURITY.md) for full details.

```
Internet → Cloudflare WAF → API Gateway
                                │
                          ┌─────▼─────┐
                          │  Auth     │
                          │  Layer    │
                          └─────┬─────┘
                                │
                     JWT / API Key validated
                                │
                          ┌─────▼─────────┐
                          │ Tenant Context │
                          │ Injected       │
                          └─────┬──────────┘
                                │
                    PostgreSQL RLS (Row Level Security)
                    All queries auto-filtered by tenant_id
```

---

## 11. Deployment Architecture

```
Production
├── Vercel Edge Network
│   ├── master-admin.themrktplace.io
│   ├── {tenant}.themrktplace.io          (storefront, tenant admin)
│   └── pos.themrktplace.io
│
├── Railway / Fly.io (Backend Services)
│   ├── api-gateway (Fastify)
│   ├── notification-service
│   ├── analytics-service
│   └── webhook-dispatcher
│
├── Neon (Serverless PostgreSQL)
├── Upstash (Serverless Redis)
├── Typesense Cloud
└── Cloudflare R2 (Object Storage)
```

**Scalability:**
- Horizontal scaling via stateless services
- DB read replicas for analytics queries
- Redis cluster for high-throughput tenants
- Queue-based async processing prevents cascade failures