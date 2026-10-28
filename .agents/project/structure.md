# Structure: The Mrktplace

Summary: Monorepo folder tree, path aliases, module naming conventions, and file placement rules.

## Workspace Directory Map
```
marketplace/
├── apps/
│   ├── api/                   # Fastify backend service
│   │   ├── src/
│   │   │   ├── lib/           # Prisma, Redis, Typesense, BullMQ clients
│   │   │   ├── middleware/    # Auth, license, rate-limit guards
│   │   │   ├── modules/       # Domain modules (auth, inventory, sales, etc.)
│   │   │   ├── utils/         # Crypto, errors, response wrappers
│   │   │   └── workers/       # BullMQ background job consumers
│   │   └── test/              # Integration and unit tests
│   │
│   ├── dashboard/             # Merchant Admin + POS Terminal
│   │   ├── app/               # Next.js App Router (auth, dashboard, pos groups)
│   │   ├── components/        # App-specific layout shells (sidebar, topbar)
│   │   ├── hooks/             # App-wide hooks
│   │   ├── lib/               # Typed Axios client, queryClient
│   │   └── modules/           # Feature modules (pos, inventory, sales, staff, etc.)
│   │
│   ├── storefront/            # Next.js 14 customer storefront
│   └── internal-admin/        # Next.js 14 SaaS operator panel
│
└── packages/
    ├── schema/                # Central Prisma schema & Zod contracts
    ├── types/                 # Shared TypeScript interfaces & DTOs
    ├── ui/                    # shadcn/ui "radix-maia" primitives
    ├── eslint-config/         # Shared ESLint configuration
    └── typescript-config/     # Base tsconfig configurations
```

## Module Architecture Standard
Every domain feature lives inside `modules/{domain}/`:
```
modules/{domain}/
├── components/                # Domain-specific UI components
├── hooks/                     # TanStack Query data fetching & mutation hooks
├── store/                     # Domain Zustand slice (if client state is needed)
├── types/                     # Domain TypeScript types & interfaces
├── utils/                     # Domain transformation helpers
└── index.ts                   # Public barrel export
```

## Import Path Aliases
- `@/` -> Application root (e.g., `apps/dashboard/`)
- `@workspace/ui/` -> Shared UI package (`packages/ui/src/`)
- `@workspace/schema/` -> Shared schema package (`packages/schema/src/`)
- `@workspace/types/` -> Shared types package (`packages/types/src/`)

## Handoff Contract
- Decisions: All database queries and schema definitions live in `packages/schema`. Applications consume models through Prisma Client exports.
- Open: Component sharing between dashboard and storefront (Default: Only primitives in `packages/ui` are shared; domain components remain in respective app modules).
- Next agent needs: Never import cross-module internals directly. Always import via barrel `modules/{domain}/index.ts`.

