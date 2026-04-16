# ⚡ themrktplace — Full-Stack eCommerce SaaS Suite

> **Multi-tenant · Modular · Edge-first · AI-powered**

themrktplace is an enterprise-grade, white-label eCommerce SaaS platform consisting of four tightly integrated products sharing a single unified backend. Built for agencies, merchants, and enterprise clients who need to launch, manage, and scale online retail operations.

---

## 🗂️ Documentation Index

| File | Purpose |
|------|---------|
| [`FEATURES.md`](./FEATURES.md) | Complete feature matrix per product |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System & micro-service architecture |
| [`TECH_STACK.md`](./TECH_STACK.md) | Full technology decisions & rationale |
| [`ALGORITHMS.md`](./ALGORITHMS.md) | Core algorithms (search, pricing, routing) |
| [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) | Multi-tenant DB design & ERD |
| [`API_DESIGN.md`](./API_DESIGN.md) | REST + GraphQL + WebSocket API contracts |
| [`SECURITY.md`](./SECURITY.md) | Threat model, auth flows, compliance |
| [`MULTI_TENANCY.md`](./MULTI_TENANCY.md) | Tenant isolation, provisioning, billing |
| [`MODULES.md`](./MODULES.md) | Modular plugin system design |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | CI/CD, infra-as-code, observability |
| [`PROJECT_LIFECYCLE.md`](./PROJECT_LIFECYCLE.md) | Roadmap, sprints, SDE lifecycle |
| [`UI_DESIGN_SYSTEM.md`](./UI_DESIGN_SYSTEM.md) | Design tokens, component library, themes |

---

## 🏗️ The Four Products

```
┌─────────────────────────────────────────────────────────────────────┐
│                         themrktplace Platform                            │
├──────────────────┬──────────────────┬──────────────┬───────────────┤
│  Master Admin    │   Tenant Admin   │   POS /      │  Storefront   │
│  (SaaS Control) │  (Per-store mgmt)│  Store Front  │  Mobile App  │
│                  │                  │              │               │
│  • Tenant mgmt   │  • Products      │  • Checkout  │  • PWA + App  │
│  • Billing       │  • Orders        │  • Inventory │  • Cart       │
│  • Analytics     │  • Customers     │  • Offline   │  • Orders     │
│  • Config        │  • Marketing     │  • Receipts  │  • Tracking   │
└──────────────────┴──────────────────┴──────────────┴───────────────┘
                            │
              ┌─────────────▼──────────────┐
              │    Unified themrktplace API     │
              │  REST · GraphQL · WS · gRPC│
              └─────────────┬──────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
    PostgreSQL          Redis              S3/R2
    (per-tenant)     (cache/pub-sub)    (assets/CDN)
```

---

## 🚀 Quick Start (Development)

```bash
# Prerequisites: Node 20+, pnpm 9+, Docker, Postgres 16

git clone https://github.com/your-org/themrktplace
cd themrktplace
pnpm install

# Start infrastructure
docker compose up -d

# Bootstrap DB (creates master schema + seed tenant)
pnpm db:migrate && pnpm db:seed

# Start all apps in parallel
pnpm dev
```

### App URLs (dev)
| App | URL |
|-----|-----|
| Master Admin | http://localhost:3000 |
| Tenant Admin | http://localhost:3001 |
| POS | http://localhost:3002 |
| Storefront | http://localhost:3003 |
| API Gateway | http://localhost:4000 |
| GraphQL Playground | http://localhost:4000/graphql |

---

## 📦 Monorepo Structure

```
themrktplace/
├── apps/
│   ├── master-admin/        # Next.js 15 — Platform control panel
│   ├── tenant-admin/        # Next.js 15 — Per-merchant dashboard
│   ├── pos/                 # Next.js 15 — Point of Sale / Storefront
│   ├── storefront/          # Next.js 15 — Public ecom website
│   └── mobile/              # Expo (React Native) — Mobile app
├── packages/
│   ├── ui/                  # Shared shadcn/ui component library
│   ├── api-client/          # Type-safe API client (tRPC + REST)
│   ├── db/                  # Drizzle ORM schemas + migrations
│   ├── auth/                # Auth.js v5 shared config
│   ├── config/              # Shared ESLint, TS, Tailwind configs
│   ├── types/               # Global TypeScript types
│   └── utils/               # Shared utilities
├── services/
│   ├── api-gateway/         # Fastify API gateway
│   ├── search/              # Typesense search service
│   ├── notifications/       # Email/SMS/push notification service
│   ├── analytics/           # Event ingestion + aggregation
│   └── webhooks/            # Outbound webhook dispatcher
├── infra/
│   ├── terraform/           # AWS / GCP infra-as-code
│   ├── k8s/                 # Kubernetes manifests
│   └── docker/              # Dockerfiles
├── docs/                    # This documentation
└── tools/
    ├── cli/                 # themrktplace CLI for tenant ops
    └── scripts/             # Dev + deployment scripts
```

---

## 🔑 Core Principles

1. **Multi-tenant by default** — Every data model is tenant-scoped with row-level security
2. **Offline-first POS** — POS works without internet; syncs on reconnect
3. **Edge-ready** — All hot paths deployable to Cloudflare Workers / Vercel Edge
4. **Plugin architecture** — Every feature is a swappable module
5. **AI-augmented** — Smart pricing, search, recommendations baked in
6. **Zero-trust security** — mTLS between services, JWT + API key auth, RLS everywhere
7. **Observable** — OpenTelemetry traces, structured logs, real-time metrics

---

## 👥 Team & Roles (Recommended)

| Role | Count | Responsibilities |
|------|-------|-----------------|
| Tech Lead / Architect | 1 | Architecture, code review, technical decisions |
| Backend Engineers | 3 | API, DB, services |
| Frontend Engineers | 3 | Admin apps, storefront |
| Mobile Engineer | 1 | Expo app |
| DevOps / Platform | 1 | Infra, CI/CD, observability |
| QA Engineer | 1 | Testing, automation |
| Product Designer | 1 | UI/UX, design system |

---

## 📄 License

Commercial License — See [`LICENSE`](./LICENSE) for details.