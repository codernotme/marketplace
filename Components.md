# 🧩 Components.md
> Multi-Category Marketplace — Frontend Component Architecture
> Stack: Next.js 15 (App Router) + HeroUI v2 + Zustand
> Each component section maps to its corresponding backend module

---

## Component → Module Mapping

| Component Folder | Backend Module |
|---|---|
| `components/auth/` | `modules/auth/` |
| `components/product/` | `modules/products/` + `modules/categories/` |
| `components/cart/` | `modules/cart/` |
| `components/checkout/` | `modules/orders/` + `modules/payments/` |
| `components/vendor/` | `modules/vendor/` + `modules/inventory/` |
| `components/analytics/` | `modules/analytics/` |
| `components/admin/` | `modules/admin/` |
| `components/shared/` | `core/` (navbar, layout, guards) |

---

## App Router — Page Structure

```
app/
├── (auth)/
│   ├── login/page.tsx                   → <LoginForm />
│   ├── register/page.tsx                → <RegisterForm /> + <OTPInput />
│   └── forgot-password/page.tsx         → <ForgotPasswordForm />
│
├── (shop)/
│   ├── page.tsx                         → <HomePage /> (recommendations + trending)
│   ├── products/page.tsx                → <ProductListingPage />
│   ├── products/[slug]/page.tsx         → <ProductDetailPage />
│   ├── category/[slug]/page.tsx         → <CategoryPage />
│   ├── cart/page.tsx                    → <CartPage />
│   ├── checkout/page.tsx                → <CheckoutPage />
│   └── search/page.tsx                  → <SearchPage />
│
├── (user)/
│   ├── profile/page.tsx                 → <ProfilePage />
│   ├── orders/page.tsx                  → <OrdersPage />
│   └── wishlist/page.tsx                → <WishlistPage />
│
├── vendor/                              → Guarded: role === 'vendor'
│   ├── dashboard/page.tsx
│   ├── products/page.tsx
│   ├── orders/page.tsx
│   └── inventory/page.tsx
│
└── admin/                               → Guarded: role === 'admin'
    ├── dashboard/page.tsx
    ├── users/page.tsx
    ├── products/page.tsx
    ├── analytics/page.tsx
    └── settings/page.tsx
```

---

## Shared / Layout Components

### `<Navbar />`
**Path:** `components/shared/Navbar.tsx`

Subcomponents:
- `<NavLogo />` — Brand mark + home link
- `<NavSearch />` — Debounced full-text search with autocomplete dropdown
- `<NavCategories />` — Horizontal category pills / mega menu on hover
- `<NavCartIcon />` — Cart icon with item count badge (reads `cart.store`)
- `<NavUserMenu />` — Avatar dropdown: Profile, Orders, Wishlist, Logout
- `<NavAuthButtons />` — Login / Register (guest state only)

**HeroUI:** `Navbar`, `NavbarContent`, `Input`, `Badge`, `Dropdown`, `Avatar`, `Button`

---

### `<Footer />`
**Path:** `components/shared/Footer.tsx`

Sections: Logo + tagline, category quick links, policy links, social icons, newsletter input.

**HeroUI:** `Input`, `Button`, `Divider`, `Link`

---

### `<AuthGuard />`
**Path:** `components/shared/AuthGuard.tsx`

Client-side wrapper — reads `auth.store.isAuthenticated` and required role. Redirects to `/login` if not met. Used as a layout wrapper for `vendor/` and `admin/` route groups.

```tsx
<AuthGuard requiredRole="vendor">
  {children}
</AuthGuard>
```

---

### `<BreadCrumb />`
**Path:** `components/shared/BreadCrumb.tsx`

Auto-builds breadcrumb from `usePathname()`. Used on product and category pages.

**HeroUI:** `Breadcrumbs`, `BreadcrumbItem`

---

### `<PageWrapper />`
**Path:** `components/shared/PageWrapper.tsx`

Applies consistent `max-w-screen-xl mx-auto px-4` container. Wraps all page content.

---

## Auth Components
**API:** `modules/auth/` + `modules/users/`

### `<LoginForm />`
**Path:** `components/auth/LoginForm.tsx`

Fields: Email, Password, Remember me, Forgot Password link.
On submit → `POST /auth/login` → store tokens in `auth.store` → redirect to `/`.

**HeroUI:** `Input`, `Button`, `Checkbox`, `Link`, `Card`, `CardBody`

---

### `<RegisterForm />`
**Path:** `components/auth/RegisterForm.tsx`

Step 1: Name, Email, Password, Confirm Password → `POST /auth/register`
Step 2: OTP entry via `<OTPInput />` → `POST /auth/verify-otp`

---

### `<OTPInput />`
**Path:** `components/auth/OTPInput.tsx`

6 individual `<Input />` fields, auto-focus next on type, paste support, backspace navigation. Resend OTP link with 60s countdown.

---

### `<ForgotPasswordForm />`
**Path:** `components/auth/ForgotPasswordForm.tsx`

Email field → `POST /auth/forgot-password` → success state with "check your email" message.

---

## Product Components
**API:** `modules/products/` + `modules/categories/` + `modules/recommendations/`

### `<ProductCard />`
**Path:** `components/product/ProductCard.tsx`

**Props:** `product: Product, showVendor?: boolean`

Renders: Next.js `<Image />`, title, price (with strike-through if discounted), rating stars, badge chips (New / Trending / Sale), wishlist heart toggle, quick add-to-cart.

**HeroUI:** `Card`, `CardBody`, `CardFooter`, `Badge`, `Button`, `Chip`, `Tooltip`

---

### `<ProductGrid />`
**Path:** `components/product/ProductGrid.tsx`

**Props:** `products: Product[], loading: boolean, columns?: 2 | 3 | 4`

Responsive grid. Shows `<ProductSkeleton />` array during loading. Empty state illustration when `products.length === 0`.

---

### `<ProductSkeleton />`
**Path:** `components/product/ProductSkeleton.tsx`

Animated placeholder that mirrors `<ProductCard />` layout.

**HeroUI:** `Skeleton`, `Card`

---

### `<ProductImageGallery />`
**Path:** `components/product/ProductImageGallery.tsx`

**Props:** `images: string[]`

Desktop: thumbnail strip (left) + large image viewer with zoom on hover.
Mobile: swipeable carousel with dot indicators.

---

### `<ProductVariantSelector />`
**Path:** `components/product/ProductVariantSelector.tsx`

**Props:** `variants: Variant[], selected: Variant, onSelect: fn`

Color swatches (circle buttons), size chips. Out-of-stock variants shown with strikethrough and disabled cursor.

**HeroUI:** `Chip`, `Button`, `Tooltip`

---

### `<ProductRating />`
**Path:** `components/product/ProductRating.tsx`

**Props:** `rating: number, count: number, showCount?: boolean`

Half-star precision, review count link that scrolls to reviews section.

---

### `<ProductFilters />`
**Path:** `components/product/ProductFilters.tsx`

Sidebar filter panel. Sections: Category tree (accordion), Price range (slider), Brand (checkbox group), Rating (radio), In-Stock toggle.
On change → updates URL search params → triggers `useProducts()` refetch.

**HeroUI:** `Accordion`, `AccordionItem`, `Slider`, `Checkbox`, `CheckboxGroup`, `Switch`, `RadioGroup`

---

### `<SortDropdown />`
**Path:** `components/product/SortDropdown.tsx`

Options: Relevance, Price: Low→High, Price: High→Low, Top Rated, Newest.
Updates URL param `sort=` on select.

**HeroUI:** `Select`, `SelectItem`

---

### `<ReviewCard />`
**Path:** `components/product/ReviewCard.tsx`

Shows: avatar, reviewer name, rating, date, verified badge, review text, up to 3 images (lightbox on click), helpful vote count + button, vendor reply (if any).

---

### `<ReviewForm />`
**Path:** `components/product/ReviewForm.tsx`

Star picker (interactive), `<Textarea />`, image upload (up to 3 via Cloudinary), submit.
Only rendered when `useAuth()` confirms verified purchase for this product.

---

### `<RecommendationCarousel />`
**Path:** `components/product/RecommendationCarousel.tsx`

Horizontal scroll strip of `<ProductCard />` components.
Data source: `GET /recommendations/home` (personalized) or `GET /recommendations/trending` (guest).
Fires `POST /recommendations/event` on product card click.

---

## Cart Components
**API:** `modules/cart/`

### `<CartDrawer />`
**Path:** `components/cart/CartDrawer.tsx`

Slide-in panel from right. Contains: header with item count, `<CartItem />` list, `<CartSummary />`, Checkout CTA. Opens when `cart.store.isDrawerOpen === true`.

---

### `<CartItem />`
**Path:** `components/cart/CartItem.tsx`

**Props:** `item: CartItem`

Image, product name, selected variant labels, quantity stepper (+/−, min 1), line total, remove button. Calls `cart.store.updateQuantity()` and `cart.store.removeItem()`.

---

### `<CartSummary />`
**Path:** `components/cart/CartSummary.tsx`

Shows: Subtotal, `<CouponInput />`, Discount line (if applied), Estimated Tax, Shipping (Free / ₹X), Grand Total.

---

### `<CouponInput />`
**Path:** `components/cart/CouponInput.tsx`

Text input + Apply button → `POST /cart/apply-coupon`. Shows success (discount amount) or error inline.

**HeroUI:** `Input`, `Button`, `Chip`

---

## Checkout Components
**API:** `modules/orders/` + `modules/payments/`

### `<CheckoutStepper />`
**Path:** `components/checkout/CheckoutStepper.tsx`

Visual step indicator: Address → Shipping → Payment → Confirmation.
Each step is a separate component rendered conditionally by `CheckoutPage`.

---

### `<AddressStep />`
**Path:** `components/checkout/AddressStep.tsx`

Lists saved addresses as selectable radio cards. "Add New Address" expands `<AddressForm />` inline. Continues to next step on selection.

---

### `<AddressForm />`
**Path:** `components/checkout/AddressForm.tsx`

Fields: Full Name, Phone, Address Line 1, Line 2, City, State, Pincode, Type (Home / Work).
Validates with `zod`, submits to `POST /users/addresses`.

---

### `<ShippingStep />`
**Path:** `components/checkout/ShippingStep.tsx`

Radio cards: Standard (3–5 days, Free), Express (1–2 days, ₹99). Shows ETA per option.

---

### `<PaymentStep />`
**Path:** `components/checkout/PaymentStep.tsx`

Options: Razorpay (UPI, Cards, Wallets, Net Banking), COD.
On Razorpay select → `POST /payments/create-order` → `useRazorpay()` opens modal → on success → `POST /payments/verify`.

---

### `<OrderConfirmation />`
**Path:** `components/checkout/OrderConfirmation.tsx`

Lottie success animation, Order ID display, itemized summary, "Track Order" and "Continue Shopping" CTAs. Clears cart via `cart.store.clearCart()`.

---

## Vendor Components
**API:** `modules/vendor/` + `modules/inventory/` + `modules/products/`

### `<VendorSidebar />`
**Path:** `components/vendor/VendorSidebar.tsx`

Nav items: Dashboard, Products, Orders, Inventory, Earnings, Store Settings.
Highlights active route via `usePathname()`.

**HeroUI:** `Listbox`, `ListboxItem`

---

### `<ProductForm />`
**Path:** `components/vendor/ProductForm.tsx`

Multi-tab form: Basic Info, Variants, Images, Pricing & Inventory, SEO.
Submits to `POST /products` (create) or `PUT /products/{id}` (update).

**HeroUI:** `Tabs`, `Tab`, `Input`, `Textarea`, `Select`, `Switch`, `Button`

---

### `<VariantBuilder />`
**Path:** `components/vendor/VariantBuilder.tsx`

Vendor defines option types (e.g. Size: S/M/L, Color: Red/Blue). Component auto-generates all variant combinations as rows. Each row: SKU (auto-suggested), Price, Stock.

---

### `<ImageUploader />`
**Path:** `components/vendor/ImageUploader.tsx`

Drag-and-drop zone, preview thumbnails, drag-to-reorder, per-file upload progress bar. Uploads to Cloudinary via signed URL from `POST /products/{id}/images`.

---

### `<InventoryTable />`
**Path:** `components/vendor/InventoryTable.tsx`

Columns: Product, Variant, SKU, Stock, Threshold, Status chip (OK / Low / OOS).
Inline editable stock field — saves on blur via `PUT /inventory/{sku}`.

**HeroUI:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `Chip`, `Input`

---

### `<VendorOrdersTable />`
**Path:** `components/vendor/VendorOrdersTable.tsx`

Status filter tabs (All, Pending, Shipped, Delivered). Columns: Order ID, Customer, Items, Total, Status, Date.
Row actions: View Detail, Mark Shipped (opens tracking number input modal).

---

### `<EarningsCard />`
**Path:** `components/vendor/EarningsCard.tsx`

Shows: Total Revenue, Commission (%), Net Earnings, Pending Payout, "Request Payout" button → `POST /vendor/payout`.

---

## Analytics Components
**API:** `modules/analytics/`

### `<StatCard />`
**Path:** `components/analytics/StatCard.tsx`

**Props:** `label: string, value: string, trend: number, icon: ReactNode`

KPI metric card. Trend shows ↑ green / ↓ red arrow with percentage.

**HeroUI:** `Card`, `CardBody`

---

### `<SalesChart />`
**Path:** `components/analytics/SalesChart.tsx`

Recharts `<LineChart />`. X-axis: date, Y-axis: ₹ revenue. Toggle: Daily / Weekly / Monthly. Fetches from `GET /analytics/vendor/sales`.

---

### `<OrderStatusPieChart />`
**Path:** `components/analytics/OrderStatusPieChart.tsx`

Recharts `<PieChart />` (donut variant). Segments: Pending, Confirmed, Shipped, Delivered, Returned. Shows count + percentage on hover.

---

### `<TopProductsTable />`
**Path:** `components/analytics/TopProductsTable.tsx`

Ranked table: Rank, Product Image + Name, Units Sold, Revenue, Avg. Rating.

---

### `<FunnelChart />`
**Path:** `components/analytics/FunnelChart.tsx`

Horizontal stacked bars: Views → Add to Cart → Checkout Started → Purchased.
Shows conversion % between each step. Data from `GET /analytics/admin/funnel`.

---

## Admin Components
**API:** `modules/admin/`

### `<AdminSidebar />`
**Path:** `components/admin/AdminSidebar.tsx`

Nav: Dashboard, Users, Vendors, Products, Orders, Analytics, Coupons, Settings.

---

### `<UsersTable />`
**Path:** `components/admin/UsersTable.tsx`

Searchable, filterable. Columns: Avatar, Name, Email, Role chip, Status chip, Join Date.
Row actions: View Profile, Ban/Unban, Change Role.

---

### `<VendorApprovalCard />`
**Path:** `components/admin/VendorApprovalCard.tsx`

Shows KYC submission: store name, PAN, bank account, submitted documents.
Actions: Approve (green), Reject (opens reason modal) → `PUT /admin/vendors/{id}/approve`.

---

### `<ProductModerationCard />`
**Path:** `components/admin/ProductModerationCard.tsx`

Product preview: images, title, category, price, vendor info.
Actions: Approve / Reject with optional feedback note.

---

### `<CouponForm />`
**Path:** `components/admin/CouponForm.tsx`

Fields: Code, Type (flat / percent / free-shipping), Value, Min Order Amount, Max Uses, Expiry Date.

---

## Global State — Zustand Stores

### `store/auth.store.ts`
```ts
interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  role: 'customer' | 'vendor' | 'admin' | null
  login: (tokens: TokenPair, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}
```

### `store/cart.store.ts`
```ts
interface CartStore {
  items: CartItem[]
  itemCount: number
  isDrawerOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, qty: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
}
```

### `store/ui.store.ts`
```ts
interface UIStore {
  theme: 'light' | 'dark'
  isSearchOpen: boolean
  toggleTheme: () => void
  toggleSearch: () => void
}
```

---

## Custom Hooks

| Hook | Calls | Purpose |
|---|---|---|
| `useAuth()` | `auth.store` | Auth state + login/logout actions |
| `useCart()` | `cart.store` | Cart state + mutations |
| `useProducts(filters)` | `GET /products` | Fetch + paginate products |
| `useProduct(slug)` | `GET /products/{slug}` | Single product detail |
| `useRecommendations()` | `GET /recommendations/home` | Personalized recs |
| `useOrders(filters)` | `GET /orders` | User order list |
| `useInventory()` | `GET /inventory` | Vendor inventory data |
| `useAnalytics(range)` | `GET /analytics/*` | Dashboard chart data |
| `useRazorpay()` | Razorpay SDK | Init + open payment modal |
| `useDebounce(val, ms)` | — | Debounce search + filter inputs |
| `useInfiniteScroll(ref)` | — | Load more on scroll into view |
| `useVendorOrders()` | `GET /orders` (vendor) | Vendor order management |

---

## `lib/api.ts` — Axios Instance

```ts
// Automatically:
// 1. Attaches Authorization: Bearer <accessToken> from auth.store
// 2. On 401 → calls POST /auth/refresh → retries original request
// 3. On refresh failure → calls auth.store.logout() → redirects to /login

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

api.interceptors.request.use(attachToken)
api.interceptors.response.use(null, handleRefreshAndRetry)

export default api
```
