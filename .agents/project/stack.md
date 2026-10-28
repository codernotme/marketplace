# Stack: The Mrktplace

Summary: Production tech stack, rationale, and operational cost in INR.

## Technology Stack

| Layer | Technology | Version | Rationale |
| --- | --- | --- | --- |
| Monorepo | Turborepo | 2.8+ | Zero-config caching, workspace task orchestration |
| Backend Runtime | Node.js LTS | 22.x | Native fetch, performance, full ESM support |
| API Framework | Fastify | 4.x | 3x faster than Express, native JSON schema validation |
| Database | PostgreSQL | 16.x | ACID compliance, multi-tenant relational integrity |
| ORM | Prisma | 5.x / 6.x | Strict TypeScript types, migration engine |
| Cache & Queues | Redis + BullMQ | 7.x | Sub-millisecond sessions, rate limits, async background jobs |
| Search Engine | Typesense | 26.x | Sub-30ms typo-tolerant apparel catalog search |
| Object Storage | Cloudflare R2 | S3 API | Zero egress fees for images and invoice PDFs |
| Frontend Framework | Next.js App Router | 14.x | SSR for storefront SEO, SPA for dashboard/POS |
| UI Primitives | shadcn/ui (radix-maia) | Latest | Accessible, headless Radix primitives, unopinionated |
| Styling | Tailwind CSS | 3.x | Custom OKLCH design tokens, no runtime CSS overhead |
| Icons | @hugeicons/react | Latest | Consistent high-fidelity stroke icon set |
| Client State | Zustand | 5.x | Minimal footprint, shallow selectors for checkout |
| Server State | TanStack Query | 5.x | Automatic caching, optimistic mutations, refetching |
| Offline Storage | Dexie.js | 4.x | High-performance IndexedDB wrapper |
| Form Validation | TanStack Form + Zod | Latest | Type-safe form inputs with backend schema parity |

## Monthly Infrastructure Cost (INR)

| Service | Provider | Specs | Estimated Cost (INR/mo) |
| --- | --- | --- | --- |
| API & Background Workers | Hetzner Cloud (CPX31 x 2) | 4 vCPU, 8GB RAM each | ₹2,400 |
| Managed PostgreSQL | Supabase Pro / RDS | 8GB storage, daily backups | ₹2,100 |
| Managed Redis | Upstash Serverless | Pay-per-request / 100k cmds/day | ₹800 |
| Search Hosting | Self-hosted on Hetzner / Typesense Cloud | Embedded in cluster | ₹0 (included) |
| Frontends & CDN | Vercel Pro + Cloudflare | Edge CDN, global DNS | ₹1,700 |
| Transactional Email | Resend | 50,000 emails/mo | ₹1,700 |
| SMS & OTP | MSG91 | ₹0.20 per transaction SMS | Pay-as-you-go |
| Total Base Infrastructure | - | - | ~₹8,700/mo |

## Handoff Contract
- Decisions: Use Fastify v4 over Express (Fastify schema validation provides automated serialization performance boost).
- Open: Self-hosted Typesense container vs managed Typesense Cloud (Default: Self-hosted in Docker for dev/staging, managed in prod).
- Next agent needs: Development environment uses `docker-compose.yml` for Postgres, Redis, and Typesense.

