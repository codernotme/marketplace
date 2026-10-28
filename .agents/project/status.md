# Status: The Mrktplace (POS + Ecommerce SaaS)

Type: app | multi-tenant SaaS + POS PWA
Budget: INR bootstrapped | Stack: Fastify v4 + Next.js 14 + PostgreSQL + Redis + Prisma
Owner approvals needed: Deployment, production secrets, payments

## Locked decisions
- D1 Architecture: Turborepo monorepo with apps (api, dashboard, storefront, internal-admin) and packages (ui, schema, types).
- D2 UI Stack: shadcn/ui "radix-maia" variant, Tailwind CSS v3, @hugeicons/react, Inter font, dark mode obsidian default.
- D3 Data Layer: PostgreSQL 16 via Prisma ORM, Redis 7 for cache/sessions/queues, Typesense/Meilisearch for product search.
- D4 State: Zustand for client state, TanStack Query for server state, Dexie.js for offline POS IndexedDB.
- D5 Licensing: Module code flags (POS_CORE, MULTISTORE, CRM_PRO, etc.) verified via Fastify middleware and client hooks.
- D6 Forms: TanStack Form + Zod + @workspace/ui field components with client and server schema parity.

## Assumptions (ASSUMED)
- A1 Primary deployment target is Hetzner VPS (API/DB/Redis) + Vercel (Frontends) + Cloudflare CDN.
- A2 Default payment gateway is Razorpay for India with INR currency.
- A3 Barcode scanners connect via standard USB HID keyboard emulation or Bluetooth HID.

## Open blockers
- None currently blocking development.

## Parking lot (not in scope for current wave)
- Native mobile apps via React Native or Flutter (web PWA prioritized first).
- Complex custom ERP manufacturing assembly workflows.

## Ledger files
| File | Agent | State | Summary (one line) |
| --- | --- | --- | --- |
| status.md | orchestrator | locked | Project ledger index and operational status. |
| discovery.md | brainstorm | locked | Business context, target apparel retail customer, INR pricing. |
| blueprint.md | blueprint | locked | App boundaries, domain registry, route map, and delivery slices. |
| design.md | tsz-design-system | locked | Brand personality, luxury obsidian tokens, typography, and states. |
| data.md | data | locked | PostgreSQL Prisma models, access rules, indexes, and Dexie schema. |
| logic.md | logic | locked | POS checkout, cashier shift reconciliation, and offline sync engine. |
| stack.md | stack | locked | Full technology stack, rationale, and monthly INR costing (~₹8,700/mo). |
| structure.md | structure | locked | Monorepo folder tree, path aliases, and module encapsulation rules. |
| antislop.md | tsz-antislop | locked | Zero tells, zero smells, full-pass anti-slop verification. |
| docs/README.md | orchestrator | locked | Central master documentation portal with architecture diagrams. |
| docs/design-scheme.md | tsz-design-system | locked | Exhaustive design scheme, OKLCH tokens, and component standards. |
| docs/schema-documentation.md | data | locked | Exhaustive Prisma models, Zod validation, and ER diagrams. |
| docs/system-architecture.md | structure | locked | Technical topology, Fastify pipeline, and state flow diagrams. |
| docs/todos-and-roadmap.md | blueprint | locked | Five-stage implementation roadmap and module checklists. |
| docs/improvisations-and-enhancements.md | stack | locked | Upgrades, WebUSB ESC/POS printing, dual-screen, and terms. |
| docs/ai-agent-guidelines.md | antislop | locked | Operational rules and onboarding protocol for AI assistants. |

## Slices
| Slice | Domain | State | Notes |
| --- | --- | --- | --- |
| S01 | Foundation & Auth | done | Turborepo, Prisma schema, Fastify auth, registration, JWT sessions. |
| S02 | Core POS Terminal | done | Offline Dexie sync, cart, split payments, receipts, shift management. |
| S03 | Inventory & Catalog | done | Products, attributes, variants, stock movements, low-stock alerts. |
| S04 | Merchant Dashboard UI | in_progress | Onboarding wizard, customer CRM, staff management, sales ledger. |
| S05 | Analytics & Reporting | in_progress | Day-end reports, category performance, staff commissions. |
| S06 | Omnichannel Ecommerce | planned | Storefront app, public APIs, cart, checkout, inventory reservation. |
| S07 | SaaS Admin & Billing | planned | Internal admin app, key provisioning, Razorpay subscription webhooks. |
