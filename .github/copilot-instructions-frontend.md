# theMrktPlace Frontend — Copilot Instructions

This file provides context for GitHub Copilot and other AI coding assistants working on the frontend apps.

**For the complete frontend guide, also reference [.cursorrules-frontend](../../.cursorrules-frontend).**

---

## Quick Start

You are building **theMrktPlace** frontend—one of four Next.js/Expo apps:
- **`saas/`** — SaaS admin (platform owner) — manages tenants, plans, billing
- **`admin/`** — Shop admin dashboard — shop owners manage their store
- **`web/`** — Ecommerce storefront — customers shop here
- **`mobile/`** — React Native / Expo — mobile shopping app

**Before writing code:**
1. Determine which app you're in (look at file path)
2. Read the corresponding schema doc (`01`-`06`)
3. Check `05-backend-api.md` for exact endpoint signatures
4. All data must come from API, never hardcoded

---

## App-by-App Checklists

### `saas/` (SaaS Admin Portal)
- Stack: Next.js + ShadcnUI + Zustand + TailwindCSS
- Auth: JWT (`role: superadmin | support`), no tenant context
- API: `GET/POST /api/saas/...`
- **Routes to build:**
  - `/` → Dashboard KPIs
  - `/tenants` → List + search + filter
  - `/tenants/[id]` → Detail + config editor
  - `/plans`, `/announcements`, `/admins`, `/settings`, `/audit`
- **Stores:** `store/saas-auth.store.ts` (user, JWT, role)
- **Never import from:** `admin/`, `web/`, `mobile/`

### `admin/` (Shop Admin Dashboard)
- Stack: Next.js + ShadcnUI + Zustand
- Auth: JWT (`role: shop_admin | ...`), **always has `tenant_id`**
- **Key header:** `X-Tenant-ID: {tenantId}` (from auth store) on EVERY request
- API: `GET/POST /api/shop/admin/...` (admin routes), or `/api/shop/...` (shared)
- **Main sections:**
  - Inventory (products, categories, stock logs)
  - Orders (list, detail, fulfillment, invoices)
  - Customers (list, detail, profiles, segments)
  - Marketing (banners, coupons, featured products)
  - Emails (templates, broadcasts, logs)
  - Analytics (sales charts, customer insights, funnel)
  - Finance (sales reports, invoices, payment logs)
  - Settings (shop info, branding, payments, team)
- **Sidebar:** Dynamic based on role. Collapses on mobile.
- **Guards:** All routes must check auth + onboarding complete.
- **Check docs:** `03-admin-dashboard-features.md` for each sidebar section

### `web/` (Ecommerce Storefront)
- Stack: Next.js + HeroUI + Zustand + TailwindCSS
- Auth: JWT (`role: customer`), guest checkout allowed
- **Key header:** `X-Tenant-ID` (resolved from env or subdomain)
- API: `GET/POST /api/shop/...` (shop routes only — no admin)
- **Rendering:**
  - Home → ISR (revalidate: 60)
  - Product detail → SSR (for SEO)
  - Category → SSR
  - Account pages → CSR (auth-only)
- **Key pages:**
  - Home, Products, Product Detail, Category, Search
  - Cart, Checkout (multi-step), Order Success
  - Wishlist, Account, Order Tracking
  - Auth: Login, Register, Forgot Password
  - Static: FAQ, Privacy, Terms, etc.
- **Stores:** `auth`, `cart`, `ui` (all client-side state)
- **Analytics:** Fire `track_event()` on key actions

### `mobile/` (Expo App)
- Stack: Expo + React Navigation + Zustand + NativeWind
- Same API as web (all `/api/shop/` routes)
- Same stores as web but use `AsyncStorage` not localStorage
- **Navigation:** Bottom tabs (Home, Shop, Cart, Account) + modals
- **Native features:**
  - Push notifications (Expo Notifications)
  - Biometric login (`expo-local-authentication`)
  - Deep links (`themrktplace://products/[slug]`)
  - Haptics, pull-to-refresh, native share

---

## Data & Auth Flow

### Where Tenant ID Comes From
| App | Source | How | Required |
|------|--------|-----|----------|
| `saas/` | N/A | No tenant context — you manage all tenants | No |
| `admin/` | Auth store | User logged in → `user.tenant_id` | **Yes** — on every request |
| `web/` | Env var OR subdomain | `NEXT_PUBLIC_TENANT_ID` env var | **Yes** — resolved once |
| `mobile/` | Env var | Same as web | **Yes** |

### API Request Pattern
```typescript
// Always use lib/api.ts wrapper
const response = await apiClient.get('/products', {
  headers: {
    'X-Tenant-ID': tenantId  // for admin/ and web
    // Already injected by interceptor in app-specific lib/api.ts
  }
})
```

---

## Component Architecture

### `saas/` & `admin/` — ShadcnUI
```
components/
├── ui/                    # ShadcnUI primitives (button, input, modal, etc.)
├── shared/
│   ├── AuthGuard.tsx      # Wrap protected routes
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── LoadingSpinner.tsx
├── dashboard/             # Dashboard-specific (KPI cards, charts, etc.)
├── products/              # Product form, list, detail panes
├── orders/                # Order list, detail, fulfillment
└── [domain]/              # Domain-specific UI
```

### `web/` & `mobile/` — HeroUI
```
components/
├── shared/
│   ├── AuthGuard.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LoadingSpinner.tsx
├── product/               # Product cards, detail, variants, reviews
├── cart/                  # Cart drawer, items, coupon input
├── checkout/              # Multi-step form (address, shipping, payment)
├── auth/                  # Login, register, OTP forms
└── [domain]/              # Domain-specific
```

---

## Key Patterns

### Form Pattern (All Apps)
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email(),
})

export function MyForm() {
  const { register, handleSubmit, formState: { errors, isLoading } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    const result = await apiClient.post('/endpoint', data)
    // Handle result
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <button disabled={isLoading}>Submit</button>
    </form>
  )
}
```

### Data Fetching (React Query)
```typescript
// Never use Zustand for server data
import { useQuery } from '@tanstack/react-query'

export function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { category: 'electronics' }],
    queryFn: () => apiClient.get('/products?category=electronics')
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorBoundary error={error} />

  return <ProductGrid items={data} />
}
```

### Client State (Zustand)
```typescript
// Only client-side UI state — never for server data
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}))
```

---

## Testing Checklist

- [ ] API endpoint exists in `05-backend-api.md`
- [ ] All forms use `react-hook-form` + `zod`
- [ ] No raw `fetch` calls — use `lib/api.ts`
- [ ] `X-Tenant-ID` header included where needed (admin/, web/, mobile/)
- [ ] 401 errors trigger refresh → retry logic
- [ ] Loading states shown (buttons disabled, spinners visible)
- [ ] Error states have user-friendly messages
- [ ] Analytics events fired on critical actions
- [ ] SSR/ISR applied correctly (`web/` product detail is SSR)
- [ ] Mobile respects breakpoints + touch-friendly sizing

---

## Documentation Map

| Topic | File |
|-------|------|
| SaaS admin features & data | `01-saas-admin-schema.md` |
| All data models (product, order, user) | `02-ecommerce-schema.md` |
| Admin dashboard sections & workflows | `03-admin-dashboard-features.md` |
| Storefront pages & customer features | `04-ecommerce-client-features.md` |
| All API endpoints & algorithms | `05-backend-api.md` |
| Auth flows, OTP, onboarding | `06-auth-onboarding-flows.md` |
| Full system architecture | `.cursorrules-frontend` |

---

**Questions?** Refer to the schema docs or the `.cursorrules-frontend` file.
