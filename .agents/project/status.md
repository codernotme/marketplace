# Status: themrktplace (Standalone Omnichannel Retail Suite)

Type: app | Standalone Omnichannel Retail Suite (Single Brand, Multi-Store)
Budget: INR bootstrapped | Stack: Fastify v4 + Flutter 3 + Next.js 14 + PostgreSQL + Redis + Prisma
Owner approvals needed: Deployment, production secrets, payments

## Locked decisions
- D1 Architecture: Turborepo monorepo with apps (`api`, `storefront`, `pos`) and packages (`ui`, `schema`, `types`). Web admin dashboard (`apps/dashboard`) has been removed and consolidated into Management Mode inside `apps/pos`.
- D2 UI Stack:
  - POS & Management Terminal: Native Flutter 3.13+ (Dart 3) with Obsidian Luxury theme and Riverpod reactive state. Dual-mode terminal (Register Mode and Store Management Mode).
  - Customer Web Storefront: shadcn/ui "radix-maia" variant, Tailwind CSS v3, @hugeicons/react, Inter font (Customer-only auth, catalog, cart, checkout, account).
- D3 Data Layer: PostgreSQL 16 via Prisma ORM (Standalone single-brand schema), Redis 7 for cache/sessions/queues, Typesense for product search.
- D4 State:
  - POS: Riverpod StateNotifier for cart, shifts, and hardware status; local management state for store operations.
  - Storefront: Zustand for customer auth and cart state, TanStack Query for server state.
- D5 Architecture Scope: Standalone single-brand omnichannel suite with multi-store capability (no SaaS licensing or multi-tenant complexity). Web login is strictly customer-facing. All store and website management is performed via the POS terminal.
- D6 Forms: TanStack Form + Zod + @workspace/ui field components with client and server schema parity.

## Assumptions (ASSUMED)
- A1 Primary deployment target is Linux VPS (API, DB, Redis) + Vercel (Frontends) + Local Terminals (Flutter POS for Android, Windows, macOS).
- A2 Default payment gateway is Razorpay for India with INR currency.
- A3 Barcode scanners connect via USB HID keyboard emulation or Bluetooth HID.
- A4 Receipt printers are 80mm ESC/POS thermal printers connected via USB, Bluetooth, or Network IP.

## Open blockers
- None currently blocking development.

## Parking lot (not in scope for current wave)
- Multi-brand wholesale B2B vendor portal.
- Custom apparel textile manufacturing cutting-floor CAM automation.

## Ledger files
| File | Agent | State | Summary (one line) |
| --- | --- | --- | --- |
| status.md | orchestrator | locked | Project ledger index and operational status. |
| discovery.md | brainstorm | locked | Business context, target apparel retail customer, INR pricing. |
| blueprint.md | blueprint | locked | App boundaries, domain registry, route map, and delivery slices. |
| design.md | tsz-design-system | locked | Brand personality, luxury obsidian tokens, typography, and states. |
| data.md | data | locked | PostgreSQL Prisma models, access rules, indexes, and local SQLite schema. |
| logic.md | logic | locked | POS checkout, cashier shift reconciliation, and offline sync engine. |
| stack.md | stack | locked | Full technology stack, rationale, and monthly INR costing. |
| structure.md | structure | locked | Monorepo folder tree, path aliases, and module encapsulation rules. |
| antislop.md | tsz-antislop | locked | Zero tells, zero smells, full-pass anti-slop verification. |
| docs/README.md | orchestrator | locked | Central master documentation portal with architecture diagrams. |
| docs/apps-breakdown.md | orchestrator | locked | Exhaustive breakdown of each individual app, module, and package. |
| docs/design-scheme.md | tsz-design-system | locked | Exhaustive design scheme, OKLCH tokens, and component standards. |
| docs/schema-documentation.md | data | locked | Exhaustive Prisma models, Zod validation, and ER diagrams. |
| docs/system-architecture.md | structure | locked | Technical topology, Fastify pipeline, and state flow diagrams. |
| docs/todos-and-roadmap.md | blueprint | locked | Five-stage implementation roadmap and module checklists. |
| docs/improvisations-and-enhancements.md | stack | locked | Upgrades, raw ESC/POS printing, dual-density UI, and modern tech terms. |
| docs/ai-agent-guidelines.md | antislop | locked | Operational rules and onboarding protocol for AI assistants. |

## Slices
| Slice | Domain | State | Notes |
| --- | --- | --- | --- |
| S01 | Foundation & Auth | done | Turborepo, Prisma standalone schema, Fastify auth, JWT sessions, MFA. |
| S02 | Flutter POS & Management | done | Dual-mode terminal (Register Mode with Riverpod cart, printer, shifts; Management Mode for backoffice). |
| S03 | Inventory & Catalog | done | Products, variants, multi-store stock levels, purchase orders, low-stock alerts. |
| S04 | Store Backoffice UI | done | Fully consolidated into apps/pos Management Mode (products, inventory, CRM, staff, website settings). |
| S05 | Analytics & Reporting | done | Built in apps/pos Reports view (EOD Z-Report, GST liability, tender channel breakdown). |
| S06 | Omnichannel Storefront | done | Next.js 14 customer-only storefront, cart, BOPIS or courier checkout, customer account portal. |
| S07 | Multi-Store Logistics | planned | Store-to-store transfer manifests, Shiprocket courier integration. |
