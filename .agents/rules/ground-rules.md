---
trigger: always_on
---

These rules apply to EVERY agent. Non-negotiable.

[ HEROUI v3 RULES ]
1. ALWAYS read the docs at .heroui-docs/react/ before using any component
2. v3 component APIs differ from v2 — your training data has wrong prop names
3. Import paths: verify from docs (may be @heroui/react or @heroui/[package])
4. Never guess prop names — if unsure, read the component's .mdx file
5. Components to read before using: Modal, Drawer, Tabs, Select, Autocomplete, Table, 
   Chip, Badge, Toast, Skeleton, NumberField, DateRangePicker, InputOtp

[ PRISMA RULES ]
1. Never use prisma.user.findMany() without a where clause that includes tenantId
2. Always use select or include to avoid over-fetching
3. Use transactions for operations that modify multiple tables
4. Never expose passwordHash in API responses (use select to exclude it)
5. Add database indexes for all frequently-filtered fields

[ BETTER AUTH RULES ]
1. Server actions and API routes must always verify session first
2. Use getServerSession() in server components (not useSession hook)
3. useSession() only in "use client" components
4. All sensitive operations log to AuditLog table
5. Never trust client-provided userId — always use session.user.id

[ NEXT.JS APP ROUTER RULES ]
1. Read node_modules/next/dist/docs/ for current conventions
2. Default to Server Components — add "use client" only when required
3. Server actions in separate action files (app/actions/[module].ts)
4. Route handlers in app/api/[module]/route.ts
5. loading.tsx for every route segment with meaningful Skeleton
6. error.tsx for every route segment
7. Use next/navigation for routing (not next/router)

[ TYPESCRIPT RULES ]
1. strict: true in tsconfig.json
2. No any — use unknown + type guards or proper Prisma types
3. All API response types defined in types/api.ts
4. All form values typed with Zod schemas

[ MODAL RULES (from spec) ]
Quick create (<6 fields): Modal size="md"
Edit small record: Modal size="md" or "lg"  
Delete confirmation: Modal size="sm" with danger Button
Bulk action confirmation: Modal size="sm"
View-only detail: Modal size="xl" or "2xl"
Receipt/invoice preview: Modal size="3xl" with print Button
Complex multi-step create: Full page with Tabs stepper (NOT Modal)
Large data entry (CMS, email templates): Full page (NOT Modal)
Filter panel on mobile: Modal size="full"

[ UX NON-NEGOTIABLES ]
1. Every destructive action requires a confirmation Modal
2. Every CRUD operation shows a Toast (success or error)
3. Every data table shows Skeleton during loading
4. Every empty table/list has an illustrated empty state
5. No page shows a blank white screen on error (error.tsx required)
6. Mobile sidebar is always accessible via Drawer