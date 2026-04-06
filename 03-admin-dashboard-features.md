# Shop Admin Dashboard — Features, Sidebar & Workflows

The Admin Dashboard is the **shop owner's control center**. It is a separate Next.js app (not the storefront). Each shop owner logs in with their credentials and manages their entire store from here.

---

## Sidebar Navigation (Full)

```
📊  Dashboard
📦  Inventory
    ├── Products
    │    ├── All Products
    │    ├── Add Product
    │    └── Bulk Import (CSV)
    ├── Categories
    ├── Brands
    └── Inventory Logs

🛒  Orders
    ├── All Orders
    ├── Pending
    ├── Processing
    ├── Shipped
    ├── Delivered
    ├── Cancelled / Returns
    └── Bulk Fulfilment

👥  Customers
    ├── All Customers
    ├── Customer Detail
    └── Segments / Tags

💬  Customer Queries
    ├── Open Tickets
    ├── In Progress
    └── Resolved

📣  Marketing
    ├── Banners & Ads
    ├── Discounts & Coupons
    ├── New Arrivals Config
    └── Featured / Best Sellers

📧  Mails
    ├── Email Templates
    ├── Broadcast Campaign
    └── Sent Logs

📈  Analytics
    ├── Sales Overview
    ├── Product Performance
    ├── Customer Insights
    └── Traffic & Conversion

💰  Finance
    ├── Sales Report
    ├── Invoices
    └── Payment Logs

🚚  Delivery
    ├── Shipping Zones
    └── Courier Settings

🤖  Telegram Bot
    ├── Bot Config
    ├── Alert Settings
    └── Test Alerts

⚙️  Settings
    ├── General
    ├── Branding
    ├── Policies
    ├── Payments
    ├── Notifications
    ├── Team Members
    └── API / Integrations
```

---

## 1. Dashboard (KPIs)

**Widgets:**
- Today's Revenue / Orders
- This Week vs Last Week (sparkline)
- This Month Revenue (bar chart)
- Top Products (by sales volume)
- Recent Orders feed
- Low Stock Alerts
- Pending Queries count
- Telegram Bot status indicator

**Quick Actions:**
- Add Product
- Create Coupon
- View Pending Orders

---

## 2. Inventory — Products

### Product List
- Paginated table with search + filter (category, status, stock level, vendor)
- Columns: image, title, SKU, price, stock, status, updated_at
- Inline stock edit
- Bulk: activate / archive / delete / export CSV

### Add / Edit Product
Multi-section form:

**Section 1 — Basic Info**
- Title, Slug (auto-generated, editable)
- Short Description (plain text, for cards)
- Description (rich text editor — Tiptap/Quill)
- Category (searchable dropdown, with sub-category)
- Brand, Tags

**Section 2 — Media**
- Multi-image upload (drag + drop, reorder, set primary)
- Video URL (optional, embedded)

**Section 3 — Pricing**
- Price, Compare Price (strike-through)
- Cost Price (for margin display)
- Tax Rate, Tax Inclusive toggle

**Section 4 — Variants**
- Add option groups: Color, Size, Material, etc.
- Auto-generate variant combinations
- Per-variant: price override, stock, SKU, image

**Section 5 — Inventory**
- Track inventory toggle
- Stock quantity
- Low stock threshold
- Allow backorder toggle

**Section 6 — Shipping**
- Weight, Dimensions
- Is Digital toggle (skip shipping)

**Section 7 — SEO**
- Meta title, description, keywords
- Preview snippet

**Section 8 — Flags**
- Is New, Is Trending, Is Featured, Is Best Seller
- Visibility: Public / Hidden

**Section 9 — Related & Upsell**
- Related products (multi-search picker)
- Upsell products

**Workflow:**
```
Draft → Fill sections → Preview → Publish
                                → Schedule publish
```

### Bulk Import
- Download CSV template
- Upload filled CSV
- Preview import (show errors per row)
- Confirm import

---

## 3. Categories

- Tree view (parent → child → grandchild up to 3 levels)
- Add / Edit / Delete categories
- Upload category image + icon
- Set sort order (drag & drop)
- Toggle active/inactive
- SEO fields per category

---

## 4. Orders

### Order List
- Filter by: status, date range, payment method, source
- Search by order number, customer name, email
- Columns: #, customer, items count, total, payment status, fulfillment status, date
- Bulk update status (e.g. mark 50 orders as shipped)

### Order Detail
**Header:** Order number, date, source badge (web/mobile/admin)

**Sections:**
- Customer info + link to customer profile
- Order items (with product images, variant, qty, unit price, subtotal)
- Pricing breakdown (subtotal, shipping, tax, coupon, total)
- Payment info (method, status, Razorpay IDs, timestamp)
- Shipping address
- Fulfillment section:
  - Update status (dropdown)
  - Enter tracking number + courier + tracking URL
  - Estimated delivery date
- Admin notes
- Order timeline (auto-appended on each status change)
- Actions: Print Invoice, Issue Refund, Cancel Order

### Fulfillment Workflow
```
Pending → Processing → Packed → Shipped → Out for Delivery → Delivered
                                                           → Returned
       → Cancelled (any point before shipped)
```
On each status change:
- Timeline entry appended
- Customer notified via email (Resend) + optional Telegram alert

---

## 5. Customers

### Customer List
- Filter by: joined date, total orders, total spent, tags
- Search by name, email, phone
- Tags visible as badges
- Bulk tag / export

### Customer Detail
- Profile info + avatar
- All orders (table, filterable)
- Total spent, order count, avg order value
- Saved addresses
- Wishlist items
- Admin notes field
- Add/remove tags
- Send email directly

---

## 6. Customer Queries

### Ticket List
- Tabs: Open | In Progress | Resolved
- Filter by: category, priority
- Search by email, subject

### Ticket Detail
- Customer info + linked order (if any)
- Full message thread
- Reply box (rich text, internal note toggle)
- Change status / priority
- Email sent automatically on admin reply via Resend

---

## 7. Marketing

### Banners & Ads

Placements managed:
- **Hero Slider** — main homepage carousel
- **Mid-Banner** — full-width strip mid-page
- **Sidebar Banner** — small square/rectangle
- **Popup** — timed modal on homepage
- **Announcement Bar** — top ticker strip

Per banner:
- Upload desktop + mobile image
- Set link (product / category / external URL)
- Set active date range
- Sort order (drag & drop)
- View click/impression stats

### Discounts & Coupons

**Create Coupon:**
- Code (auto-generate or manual)
- Type: Percentage | Fixed Amount | Free Shipping | Buy X Get Y
- Value
- Minimum order value
- Maximum discount cap (for %)
- Applicable to: All / Category / Product
- Usage limits (total + per user)
- Active date range
- Toggle active/inactive

**Coupon List:**
- Columns: code, type, value, used/limit, expiry, status
- Quick toggle active

### New Arrivals Config
- Select which products appear in "New Arrivals" section
- Set max display count
- Auto-mode: show products created in last N days

### Featured / Best Sellers
- Manually curate featured products
- Best sellers: auto by sales count OR manual override

---

## 8. Mails

### Email Templates
Pre-built templates (editable):
- Order Confirmed
- Order Shipped (with tracking)
- Order Delivered
- Order Cancelled
- Refund Initiated
- Password Reset
- OTP Verification
- Welcome Email

Per template:
- Subject line editor
- HTML body editor (with variable placeholders like `{{customer_name}}`, `{{order_number}}`)
- Preview with dummy data
- Send test email

### Broadcast Campaign
- Audience: All customers | by tag | by purchase history
- Subject + body
- Schedule or send immediately
- View sent stats (opens/clicks via Resend webhooks)

---

## 9. Analytics

### Sales Overview
- Date range picker
- Revenue chart (daily/weekly/monthly toggle)
- Orders count chart
- AOV (Average Order Value) trend
- Compare periods

### Product Performance
- Top 10 products by revenue
- Top 10 by units sold
- Most returned products
- Products with zero sales in period

### Customer Insights
- New vs returning customers
- Customer lifetime value distribution
- Geographic distribution (by state)
- Cohort retention (monthly)

### Traffic & Conversion
- (Fed by frontend tracking events sent to backend)
- Pageviews, sessions, bounce rate
- Conversion funnel: visited → added to cart → checkout → paid

---

## 10. Finance

### Sales Report
- Filterable by date range, product, category
- Columns: order#, date, customer, items, subtotal, tax, discount, total, payment method
- Export as CSV / PDF invoice

### Invoices
- Auto-generated per order (GST-compliant format)
- Bulk download
- Send to customer email

### Payment Logs
- All Razorpay transactions (synced via webhook)
- Status: captured | refunded | failed
- Filter by date, status, amount range

---

## 11. Delivery

### Shipping Zones
- Add zones by state or pincode range
- Per zone: add multiple shipping methods (Standard, Express, Same Day)
- Per method: flat rate / free above threshold / weight-based
- Estimated delivery days text

### Courier Settings
- Integrate courier APIs (Shiprocket, Delhivery, etc.) — webhook + API key
- Auto-fetch tracking on order update
- Manual tracking entry fallback

---

## 12. Telegram Bot

### Config
- Bot token (pre-filled from onboarding)
- Chat ID for alerts
- Test connection button

### Alert Settings
Toggle on/off per event:
- New order placed
- Order payment failed
- Low stock alert
- New customer query
- Daily sales summary (scheduled 9 PM)
- New review posted

### Test Alerts
- Trigger a test message for each alert type

---

## 13. Settings

### General
- Shop name, tagline, currency, timezone, language

### Branding
- Logo, favicon
- Primary / secondary color pickers
- Social links

### Policies
- Rich text editors for: Return Policy, Shipping Policy, Privacy Policy, Terms & Conditions

### Payments
- Razorpay Key ID + Secret (masked display, edit modal)
- Toggle: COD enabled, Online payment enabled, UPI enabled

### Notifications
- Resend API key
- Default "from" name + email
- Toggle which emails fire on which events

### Team Members
- Invite team member (email)
- Roles: admin | manager | support | viewer
- Revoke access

### API / Integrations
- View tenant API key (for headless or mobile)
- Webhook URL config
- Connected integrations list
