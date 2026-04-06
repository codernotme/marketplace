# Ecommerce Web + Mobile — Client Features & Workflows

Both web (Next.js) and mobile (React Native/Expo) share the same backend API and most business logic. UI differs, parity is feature-complete.

---

## Pages / Screens

### Web (Next.js App Router) — Full Route Map
```
/                          → Home
/products                  → Product listing
/products/[slug]           → Product detail
/category/[slug]           → Category page
/search                    → Search results
/cart                      → Cart
/checkout                  → Checkout (multi-step)
/checkout/success          → Order confirmation
/wishlist                  → Wishlist
/login                     → Login
/register                  → Register
/forgot-password           → Forgot password
/account                   → Account hub
/account/orders            → My orders
/account/orders/[id]       → Order detail + tracking
/account/profile           → Edit profile
/account/addresses         → Manage addresses
/account/wishlist          → Wishlist (signed-in view)
/account/notifications     → Notification preferences
/about                     → About page
/contact                   → Contact / Query form
/blog                      → Blog list
/blog/[slug]               → Blog post
/faq                       → FAQ
/privacy                   → Privacy policy
/refund                    → Refund policy
/terms                     → Terms
/track                     → Order tracking (no login needed)
```

---

## 1. Home Page

**Sections (order configurable in admin):**

1. **Announcement Bar** — top ticker (discount message, free shipping threshold)
2. **Hero Slider** — full-width banner carousel (from admin banners)
3. **Category Strip** — horizontally scrollable category icons/cards
4. **New Arrivals** — horizontal product scroll row
5. **Featured Collection** — grid of hand-picked products
6. **Mid Banner** — full-width promotional image (linkable)
7. **Trending Now** — products flagged as trending
8. **Best Sellers** — products by sales rank
9. **Brands Strip** — brand logos (optional)
10. **Deals / Flash Sale** — countdown timer + discounted products
11. **Second Mid Banner** — second promotional slot
12. **Recently Viewed** — personalized (from localStorage / user history)
13. **Customer Reviews** — top rated review snippets carousel
14. **Blog Posts** — latest 3 blog cards
15. **Footer** — links, social, newsletter signup

---

## 2. Product Listing Page (`/products`, `/category/[slug]`)

### Filters (sidebar on web, bottom sheet on mobile)
- Category (multi-select tree)
- Price range (slider)
- Brand (multi-select)
- Rating (4+ / 3+ / all)
- Availability (In Stock / All)
- Tags / Attributes (dynamic, from product data)
- Discount (10%+ / 20%+ / etc.)

### Sort Options
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Newest First
- Rating
- Best Sellers

### Display
- Grid view (2 col mobile, 3-4 col desktop)
- List view toggle (web)
- Product cards showing: image, title, price, compare price (% off badge), rating stars, Add to Cart button
- Badges: NEW / TRENDING / BESTSELLER / % OFF

### Pagination
- Infinite scroll (mobile)
- Load More button or numbered pagination (web, configurable)

---

## 3. Product Detail Page (`/products/[slug]`)

**Sections:**

**Image Gallery**
- Main image + thumbnail rail
- Zoom on hover (web)
- Swipe gallery (mobile)
- Video embed if set

**Product Info**
- Breadcrumb (Home > Category > Product)
- Title, Brand
- Rating summary (stars + count, click → scroll to reviews)
- Price + Compare Price (% discount badge)
- Short description
- Stock badge: "In Stock" / "Only 3 left!" / "Out of Stock"

**Variant Selector**
- Per option group: Color swatches / Size buttons / dropdown
- Variant images update main gallery on selection
- Price updates if variant has override

**Quantity + Add to Cart**
- Qty stepper
- Add to Cart (adds to Zustand cart store)
- Buy Now (adds to cart → direct to checkout)
- Add to Wishlist (heart icon)

**Product Details Tabs**
- Description (rich HTML)
- Specifications (attributes table)
- Shipping Info
- Return Policy

**Related Products** — horizontal scroll row
**Upsell Products** — "You Might Also Like"

**Reviews Section**
- Average rating breakdown (5-star bar chart)
- Filter reviews (All / 5⭐ / 4⭐ etc.)
- Review cards (author, rating, date, body, images)
- "Write a Review" (authenticated, purchased customers only)
- Admin reply shown below review if set

---

## 4. Search

- Global search bar (Navbar, always visible)
- Instant suggestions as you type (debounced, hits `/search/suggest`)
- Full results page with filters (same as listing page)
- Empty state with recommendations
- Recent searches (localStorage)

---

## 5. Cart

### Cart Drawer (slide-in, web)
- Line items: image, title, variant, price, qty stepper, remove
- Cart subtotal
- "View Cart" + "Checkout" CTA buttons

### Full Cart Page
- Same items as drawer
- Coupon code input
- Order summary: subtotal, estimated shipping, discount, total
- Saved items / move to wishlist
- Continue Shopping link

**Cart State (Zustand):**
```ts
{
  items: CartItem[],
  coupon: Coupon | null,
  pricing: CartPricing,
  actions: { addItem, removeItem, updateQty, applyCoupon, clearCart }
}
```

---

## 6. Checkout (Multi-Step)

### Step 1 — Contact & Address
- If logged in: pre-fill from profile, or select saved address
- Guest: fill name, email, phone
- Address form with pincode auto-fill (city/state)
- Add new address option

### Step 2 — Shipping Method
- Available methods for the pincode (from shipping zones)
- Display name, estimated delivery, price
- Free shipping badge if eligible

### Step 3 — Order Review
- Items list, pricing breakdown
- Coupon code input (if not applied in cart)
- Final total

### Step 4 — Payment
- Razorpay Checkout widget (handles UPI, cards, netbanking, wallets)
- COD option (if enabled by shop)
- On payment success → verify signature → create order → redirect to `/checkout/success`

### Success Page
- Order number displayed prominently
- "View Order" and "Continue Shopping" buttons
- Email confirmation note

**Checkout Flow (with state machine):**
```
Address → Shipping → Review → Payment → Verify → Success
                                       → Failure → Retry / Back to cart
```

---

## 7. Wishlist
- Save products (heart toggle, works for guests via localStorage, synced on login)
- View wishlist grid
- Add to Cart from wishlist
- Remove from wishlist

---

## 8. User Account

### My Orders
- List with: order#, date, items count, total, status badge, track button
- Filter by status

### Order Detail
- All order info
- Live tracking (tracking number, courier link)
- Order timeline (stepper from backend data)
- Reorder button
- Cancel order (if still pending)
- Return/Refund request button

### Profile
- Edit name, phone, avatar upload
- Change email (OTP verification required)
- Change password

### Saved Addresses
- List of saved addresses
- Add / Edit / Delete
- Set default

---

## 9. Order Tracking (Public, `/track`)
- Enter order number + email
- Shows fulfillment status + timeline
- Tracking URL button if set
- No login required

---

## 10. Contact / Query Form
- Name, email, phone
- Category dropdown (Order Issue, Product Query, Payment, General)
- Order number (optional)
- Message
- Submits to backend → creates `queries` record → sends acknowledgement email

---

## 11. Blog
- Grid of posts (image, title, excerpt, date, tags)
- Individual post with rich content
- Category / tag filter
- Share buttons

---

## 12. Notifications (In-App)
- Bell icon in navbar
- Shows: order updates, new promotions, review approvals
- Mark as read
- Push notifications (mobile via Expo Notifications)

---

## 13. Mobile-Specific Features (React Native / Expo)

**Screens map mirrors web routes.**

**Native extras:**
- Push Notifications (Expo Notifications → FCM/APNs)
- Biometric login (Face ID / Fingerprint)
- Deep links (`themrktplace://products/[slug]`)
- Pull to refresh on all list screens
- Haptic feedback on cart add / order success
- Native share sheet for product sharing
- Bottom Tab Navigation: Home | Shop | Cart | Account
- Offline cart (AsyncStorage persistence)
- App Store review prompt after successful order #3

**Bottom Tab Bar:**
```
🏠 Home  |  🛍 Shop  |  🛒 Cart (badge)  |  👤 Account
```

---

## 14. Performance & SEO (Web)

- All product/category pages are SSR (for SEO)
- Home page is ISR (revalidate 60s)
- Structured data (JSON-LD) for products
- Open Graph meta tags per page
- Sitemap auto-generated from products + categories
- Image optimization via Next.js `<Image />`
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1

---

## 15. Analytics Events (Tracked to Backend)

| Event | Trigger |
|-------|---------|
| `page_view` | Any page load |
| `product_view` | Product detail page |
| `add_to_cart` | Add to cart action |
| `remove_from_cart` | Remove item |
| `checkout_started` | Step 1 of checkout |
| `checkout_completed` | Order success page |
| `search` | Search query submitted |
| `banner_click` | Banner link clicked |
| `coupon_applied` | Coupon code success |
