# Master Admin Panel — Full Feature Specification
> E-commerce + Master Admin · HeroUI · Prisma DB · Full Flows & Automations

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Theme & Design System](#2-theme--design-system)
3. [Authentication & Access Control](#3-authentication--access-control)
4. [Dashboard & Analytics](#4-dashboard--analytics)
5. [Product Management](#5-product-management)
6. [Inventory Management](#6-inventory-management)
7. [Order Management](#7-order-management)
8. [Customer Management](#8-customer-management)
9. [Vendor & Supplier Management](#9-vendor--supplier-management)
10. [Promotions & Marketing](#10-promotions--marketing)
11. [Shipping & Fulfillment](#11-shipping--fulfillment)
12. [Returns & Refunds](#12-returns--refunds)
13. [Finance & Accounting](#13-finance--accounting)
14. [Notifications & Automations](#14-notifications--automations)
15. [Content Management](#15-content-management)
16. [Reviews & Ratings](#16-reviews--ratings)
17. [Support & Helpdesk](#17-support--helpdesk)
18. [Settings & Configuration](#18-settings--configuration)
19. [Master Admin Panel (Super Admin)](#19-master-admin-panel-super-admin)
20. [Print & Export Flows](#20-print--export-flows)
21. [Prisma Database Schema](#21-prisma-database-schema)

---

## 1. Architecture Overview

The system is a **single unified database** (PostgreSQL via Prisma) shared between:

- **E-commerce Admin Panel** — store-level management (orders, products, customers, inventory)
- **Master Admin Panel** — platform-level management (tenants, billing, system health, all stores)

Both panels are separate Next.js route groups (`/admin` and `/master`) running on the same app, authenticated via role-based JWT. The `User` model's `role` field gates which panel a user can access.

Navigation structure uses a persistent **left sidebar** (`SidebarLayout` from HeroUI) with collapsible sections, a **top Navbar** for global search, notifications bell, and user avatar dropdown.

---

## 2. Theme & Design System

### Color Tokens in Use

| Token | Use Case |
|---|---|
| `--accent` | Primary CTAs, active nav links, focus rings |
| `--background` | Page background |
| `--surface` | Cards, panels, modals |
| `--surface-secondary` | Table rows alt, input backgrounds |
| `--foreground` | Body text |
| `--muted` | Secondary labels, timestamps, placeholder text |
| `--success` | Order complete badges, stock healthy indicators |
| `--warning` | Low stock, pending states |
| `--danger` | Errors, out of stock, delete actions |
| `--border` | Dividers, card borders, table separators |

### HeroUI Components Used Throughout

- **Layout**: `SidebarLayout`, `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`, `Divider`
- **Data Display**: `Table`, `TableHeader`, `TableColumn`, `TableBody`, `TableRow`, `TableCell`, `Chip`, `Avatar`, `Badge`, `Card`, `CardHeader`, `CardBody`, `CardFooter`, `Tooltip`, `User`
- **Feedback**: `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `Popover`, `PopoverContent`, `PopoverTrigger`, `Skeleton`, `Progress`, `Spinner`, `Alert`
- **Forms**: `Input`, `Textarea`, `Select`, `SelectItem`, `Switch`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Radio`, `DatePicker`, `DateRangePicker`, `NumberInput`, `Form`
- **Navigation**: `Tabs`, `Tab`, `Breadcrumbs`, `BreadcrumbItem`, `Pagination`, `Accordion`, `AccordionItem`
- **Actions**: `Button`, `ButtonGroup`, `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownSection`
- **Charts**: Use `recharts` wrapped in HeroUI `Card` containers

### Modal Usage Rules

| Scenario | Use Modal |
|---|---|
| Quick create (single entity, <6 fields) | Yes — `Modal size="md"` |
| Edit small record | Yes — `Modal size="md"` or `"lg"` |
| Delete confirmation | Yes — `Modal size="sm"` with danger `Button` |
| Bulk action confirmation | Yes — `Modal size="sm"` |
| View-only detail preview | Yes — `Modal size="xl"` or `"2xl"` |
| Complex multi-step create (product, order) | No — use dedicated full page with stepper `Tabs` |
| Filter panel on mobile | Yes — `Modal size="full"` |
| Large data entry (CMS page, email template) | No — full page |
| Receipt / invoice preview | Yes — `Modal size="3xl"` with print button |

### Drawer / Slide-over Rules

Use HeroUI `Modal` with custom positioning class for slide-over:

- Order detail quick view → right slide-over `Modal`
- Customer detail → right slide-over `Modal`
- Notification center → right slide-over

---

## 3. Authentication & Access Control

### Roles

| Role | Scope |
|---|---|
| `MASTER_ADMIN` | All tenants, system settings, billing |
| `STORE_ADMIN` | Single store, all features |
| `STORE_MANAGER` | Orders, inventory, customers — no finance/settings |
| `SUPPORT_AGENT` | Orders read, customer messaging, returns |
| `WAREHOUSE_STAFF` | Inventory, picking, packing, shipping |
| `FINANCE_MANAGER` | Finance, payouts, refunds, reports |
| `MARKETING_MANAGER` | Promotions, coupons, CMS, email campaigns |
| `VENDOR` | Own products, own orders, own payouts |

### Pages & Flows

**Login Page** (`/auth/login`)
- `Input` for email, `Input` type password
- `Button` — Sign In → JWT issued, redirect by role
- "Forgot Password" link → sends reset email
- On failed login 5x → account temporarily locked, `Alert` shown

**Forgot Password** (`/auth/forgot-password`)
- `Input` email → API sends reset link → success `Alert`

**Reset Password** (`/auth/reset-password?token=...`)
- Two `Input` fields (new password + confirm)
- Token validated server-side on submit

**Two-Factor Auth** (`/auth/2fa`)
- OTP `Input` (6 digits) shown after first-factor success
- "Resend code" `Button` (rate-limited)

**My Profile** (`/admin/profile`)
- `Avatar` upload, name/email `Input`, password change section
- 2FA toggle `Switch`
- Active sessions `Table` with revoke `Button`

### Permission Guards

- All admin routes wrapped in server-side role check middleware
- UI uses `isAllowed(user, permission)` helper to conditionally render `Button`, nav items
- Unauthorized attempt → `Alert` with explanation, not blank page

### Automations

- Session expiry auto-logout after 2h inactivity (configurable in Settings)
- Email on new admin user invite
- Email on password reset
- Audit log entry on every login, logout, failed attempt

---

## 4. Dashboard & Analytics

### Main Dashboard (`/admin/dashboard`)

**Layout:** 2-column grid on desktop, stacked on mobile

#### KPI Cards (top row)
Four `Card` components, each with:
- Metric title (`--muted` color)
- Large number (`--foreground`, bold)
- Delta `Chip` (green `--success` for positive, red `--danger` for negative) showing % vs previous period
- Sparkline mini-chart

KPIs: Total Revenue, Total Orders, New Customers, Average Order Value

**Date range selector**: `DateRangePicker` in `Navbar` top-right, persisted in URL params, affects all dashboard widgets.

Preset chips: Today / This Week / This Month / Last 30 Days / Custom

#### Charts Section

- **Revenue Over Time** — `LineChart` (recharts) in `Card`, daily/weekly/monthly `ButtonGroup` toggle
- **Orders by Status** — `BarChart` grouped (pending, processing, shipped, delivered, cancelled)
- **Top Products** — horizontal `BarChart` (top 10 by revenue)
- **Sales by Category** — `PieChart` / `DonutChart`
- **Traffic & Conversion Funnel** — stacked `BarChart` (visits → add to cart → checkout → purchase)
- **Geographic Sales Map** — choropleth map (Leaflet or Mapbox) in `Card`
- **Customer Acquisition** — `AreaChart` (new vs returning)
- **Cohort Retention Table** — `Table` with color-coded cells (`--success` / `--warning` / `--danger` by retention %)

#### Live Feed (right column)
- Recent Orders list (last 10) — each row: `Avatar`, order ID, customer name, amount, `Chip` status
- Recent Signups list
- Low Stock Alerts list — product name, current stock, `Badge` "Low"

#### Automations & Real-time
- WebSocket connection updates live feed without page refresh
- If revenue drops >20% vs same day last week → `Badge` alert in sidebar nav "Revenue Alert"
- Daily summary email sent to `STORE_ADMIN` at 8am

### Analytics Module (`/admin/analytics`)

#### Sub-pages via `Tabs`

**Sales Analytics**
- Revenue breakdown by period (table + chart)
- Gross vs net revenue, discount impact, refund impact
- Revenue by channel (web, mobile, API)
- Revenue by payment method

**Product Analytics**
- Best sellers `Table` (sortable by revenue, units, margin)
- Worst performers
- Product page views vs purchases (conversion per product)
- Cart abandonment by product

**Customer Analytics**
- LTV (Lifetime Value) distribution `Histogram`
- Churn rate trend `LineChart`
- RFM segmentation (Recency, Frequency, Monetary) matrix
- New vs returning customer ratio

**Traffic Analytics**
- Sessions, bounce rate, avg session duration (from analytics integration)
- UTM source breakdown

**Financial Analytics**
- P&L summary
- COGS vs revenue margin
- Tax collected by region

**Export**: Every analytics view has an `Export CSV` and `Export PDF` `Button` in card header

---

## 5. Product Management

### Product List (`/admin/products`)

**Toolbar**:
- `Input` with search icon — debounced search (300ms)
- `Select` — filter by Category, `Select` — filter by Status (Active/Draft/Archived), `Select` — filter by Vendor
- `Button` — Add Product (navigates to `/admin/products/new`)
- `Dropdown` — Bulk Actions (activate, deactivate, delete, export)
- `Button` — Import CSV

**Table columns**: Thumbnail `Avatar`, Name, SKU, Category, Price, Stock, Status `Chip`, Vendor, Last Updated, Actions `Dropdown`

**Row Actions Dropdown**: Edit, View on Store, Duplicate, Archive, Delete

- **Delete** → confirmation `Modal size="sm"` — "This will permanently remove the product. Are you sure?"
- **Duplicate** → duplicates with status Draft, shows success `Alert` toast
- **Archive** → status set to Archived, product hidden from store

**Bulk Select**: `Checkbox` on each row + header `Checkbox` → floating action bar appears at bottom with bulk action `Button`s

**Pagination**: HeroUI `Pagination` component, `Select` for page size (25/50/100)

### Add / Edit Product (`/admin/products/new` & `/admin/products/[id]/edit`)

Full page with `Tabs` stepper:

**Tab 1: Basic Info**
- `Input` — Product Name
- `Textarea` — Short Description
- Rich text editor — Full Description (TipTap or Quill wrapped in `Card`)
- `Select` — Category (multi-level, searchable)
- `Select` — Tags (multi-select creatable)
- `Select` — Brand
- `Switch` — Featured Product
- `Switch` — Active / Draft

**Tab 2: Pricing**
- `NumberInput` — Base Price
- `NumberInput` — Compare-at Price (strikethrough on storefront)
- `NumberInput` — Cost Price (used for margin calculation, shown privately)
- Margin % auto-calculated display
- `Select` — Tax Class
- `Switch` — Taxable
- Pricing schedules (sale price + date range via `DateRangePicker`)

**Tab 3: Inventory**
- `Input` — SKU (auto-generated, editable)
- `Input` — Barcode (UPC/EAN)
- `Switch` — Track Inventory
- `NumberInput` — Quantity
- `NumberInput` — Low Stock Threshold (triggers alert)
- `Select` — Warehouse location
- `Switch` — Allow backorders
- `Switch` — Sold individually (max 1 per order)

**Tab 4: Variants**
- Add variant options (e.g., Color, Size) via `Input` + `Button` — Add Option
- Option values added as `Chip`s (removable)
- Auto-generates variant matrix `Table` with per-variant: SKU, Price, Stock, Image override
- `Button` — Generate All Variants
- Inline edit cells in variant table

**Tab 5: Media**
- Drag-and-drop image uploader (multiple)
- Image order via drag-and-drop (primary image = first)
- `Button` — Add from URL
- Video URL `Input`
- Alt text `Input` per image (accessibility)

**Tab 6: Shipping**
- `Switch` — Physical Product (shows weight/dimensions if on)
- `NumberInput` — Weight, with `Select` unit (kg/lb)
- Dimensions: Length, Width, Height `NumberInput`s with `Select` unit
- `Select` — Shipping Class

**Tab 7: SEO**
- `Input` — SEO Title (character count indicator)
- `Textarea` — Meta Description (character count indicator)
- `Input` — URL Slug (auto-generated from name, editable)
- Preview card showing how it appears in Google

**Tab 8: Related Products**
- Search & add related products (autocomplete `Input`)
- Up-sells / Cross-sells separate sections
- Drag-to-reorder

**Save Actions (sticky footer bar)**:
- `Button` primary — Save & Publish
- `Button` variant="flat" — Save as Draft
- `Button` variant="light" — Preview (opens storefront in new tab)
- `Button` color="danger" variant="light" — Discard Changes

### Categories (`/admin/products/categories`)

- Tree view of category hierarchy (`Accordion` nested)
- Inline `Button` — Add Subcategory
- Row actions: Edit (inline or `Modal size="md"`), Delete (confirmation `Modal`)
- `Input` per category: Name, Slug, Description, Image upload, Parent Category `Select`, Sort Order
- Drag-and-drop reorder
- SEO fields per category

### Brands (`/admin/products/brands`)
- `Table` list, `Modal size="md"` for add/edit
- Fields: Name, Slug, Logo upload, Description, Active `Switch`

### Tags (`/admin/products/tags`)
- Simple `Table` list with inline edit
- `Modal size="sm"` for add

### Product Import / Export
- CSV template downloadable
- Upload `Input type="file"` → preview `Table` with validation errors highlighted
- `Button` — Confirm Import → shows progress `Progress` bar
- Export: filtered product list → CSV or XLSX

---

## 6. Inventory Management

### Inventory Overview (`/admin/inventory`)

**KPI Cards row**: Total SKUs, Total Units, Low Stock Items, Out of Stock Items, Inventory Value

**Inventory Table**:
- Columns: Product, SKU, Variant, Warehouse, Current Stock, Reserved (in open orders), Available, Reorder Point, Reorder Qty, Last Updated
- Color-coded stock `Chip`: Green (healthy), Yellow (low), Red (out of stock)
- Inline edit for stock quantity (click cell → `NumberInput` popover)
- Filter `Select`: Warehouse, Category, Stock Status
- `Input` search by SKU or product name

**Stock Adjustment** (`Modal size="lg"`):
- `Select` — Product/Variant
- `Select` — Adjustment Type (Add Stock, Remove Stock, Damage, Loss, Return to Supplier)
- `NumberInput` — Quantity
- `Textarea` — Reason/Note
- `Input` — Reference #
- On submit: creates `InventoryMovement` record

**Bulk Stock Update**:
- Upload CSV with SKU + quantity columns → preview + confirm

### Warehouses (`/admin/inventory/warehouses`)
- `Table` list of warehouses
- Add/Edit `Modal size="lg"`: Name, Address, Contact, Active `Switch`
- Stock split view — see stock levels per warehouse for each product

### Inventory Movements (`/admin/inventory/movements`)
- Full audit trail `Table`: Date, Product, SKU, Movement Type, Qty Delta, Before, After, Reason, User
- Filter by type, date range, product, warehouse
- Export CSV

### Low Stock Alerts (`/admin/inventory/alerts`)
- `Table` of products below reorder point
- `Button` — Create Purchase Order (navigates to `/admin/inventory/purchase-orders/new` pre-filled)
- `Switch` — Enable Auto-Reorder (creates draft PO automatically when threshold hit)

### Purchase Orders (`/admin/inventory/purchase-orders`)
- `Table` list: PO #, Supplier, Created Date, Expected Date, Items Count, Total Cost, Status `Chip`
- Status flow: Draft → Sent → Confirmed → Partially Received → Received → Closed / Cancelled
- Row click → detail page

**PO Detail Page**:
- Header: PO #, Supplier, Dates, Status
- Line items `Table`: Product, SKU, Ordered Qty, Received Qty, Unit Cost, Total
- `Button` — Receive Stock → `Modal` to input quantities received per line (partial receive supported)
- On receive: inventory automatically incremented, `InventoryMovement` records created
- `Button` — Print PO (PDF generation in new tab)
- `Button` — Mark as Sent (sends email to supplier with PDF attachment)

### Automations
- Cron job every hour: check stock vs reorder points → generate alerts
- If `autoReorder = true` and stock < reorderPoint → auto-create Draft PO for configured supplier
- Email to `STORE_ADMIN` and `WAREHOUSE_STAFF` daily low stock digest
- Webhook to supplier API if integration configured

---

## 7. Order Management

### Orders List (`/admin/orders`)

**KPI row**: Today's Orders, Pending, Processing, Shipped, Revenue Today

**Table columns**: Order # (link), Date, Customer (with `Avatar`), Items, Total, Payment Status `Chip`, Fulfillment Status `Chip`, Channel, Actions

**Payment Status `Chip` colors**:
- Paid → `--success`
- Pending → `--warning`
- Refunded → `--muted`
- Failed → `--danger`
- Partially Refunded → `--warning`

**Fulfillment Status `Chip` colors**:
- Unfulfilled → `--warning`
- Partially Fulfilled → `--accent`
- Fulfilled → `--success`
- Shipped → `--accent`
- Delivered → `--success`
- Cancelled → `--danger`

**Filters**:
- `DateRangePicker` — date range
- `Select` — Payment Status
- `Select` — Fulfillment Status
- `Select` — Channel (web, mobile, POS, API)
- `Input` — Search by order #, customer email, product

**Bulk Actions**: Mark as Processing, Mark as Shipped, Print Labels, Print Packing Slips, Export CSV, Cancel Orders

**Row Actions**: View, Edit, Print Receipt, Print Packing Slip, Duplicate, Cancel, Refund

### Order Detail Page (`/admin/orders/[id]`)

**Layout**: 2-column (main 70% + sidebar 30%)

**Main Column**:

Section 1 — Order Items `Card`:
- Line items `Table`: Product image, Name+Variant, SKU, Qty, Unit Price, Discount, Total
- `Chip` for each item: Fulfilled / Unfulfilled / Returned
- Order summary rows: Subtotal, Discount, Shipping, Tax, Total

Section 2 — Fulfillment `Card`:
- Fulfillment timeline (items fulfilled, tracking added, delivered)
- `Button` — Fulfill Items → `Modal size="xl"` with per-item quantity selection + carrier select + tracking # `Input`
- Tracking # display with external link to carrier tracking page
- `Button` — Add Tracking Number (if already fulfilled but tracking added later)

Section 3 — Returns `Card`:
- List of any return/refund requests
- `Button` — Create Return → navigates to `/admin/orders/[id]/return`

Section 4 — Timeline / Activity Log `Card`:
- Chronological list of all events: order placed, payment captured, email sent, note added, status changed
- `Textarea` + `Button` — Add Internal Note (visible only to staff)

**Sidebar Column**:

Customer `Card`:
- `Avatar` + name + email + phone
- Link to full customer profile
- "Order count" and "LTV" shown
- `Button` — Email Customer → `Modal size="md"` with message `Textarea`

Payment `Card`:
- Payment method, last 4, amount paid
- Authorization ID, transaction ID
- `Button` — Capture Payment (if authorized but not captured)
- `Button` — Refund → navigates to refund flow

Shipping Address `Card`:
- Full address display
- `Button` — Edit (inline `Modal size="sm"`) — only before fulfillment

Billing Address `Card`:
- Same as above

Order Tags `Card`:
- Multi-select `Select` for internal tags
- `Input` — Add custom tag

Risk Assessment `Card` (fraud detection):
- Risk score `Progress` bar (0-100)
- Risk factors listed
- Manual override: `Select` — Mark as (Safe / Suspicious / Fraudulent)

**Order Actions (sticky top bar)**:
- `Button` primary — Fulfill Order
- `Dropdown` — More Actions: Edit Order, Duplicate, Cancel Order, Archive
- `Button` — Print Receipt, Print Packing Slip, Print Shipping Label

### Edit Order (`/admin/orders/[id]/edit`)
- Only available for unfulfilled/pending orders
- Add/remove items, adjust quantities
- Change discount, shipping cost
- Change shipping address
- Note: editing creates `OrderEditHistory` record for audit

### Create Order Manually (`/admin/orders/new`)
- Product search `Input` → add items `Table`
- Customer search `Input` or guest `Input`s (name, email, phone)
- Shipping address form fields
- Shipping method `Select`
- Apply coupon `Input`
- Payment: `Select` — Payment method (mark as paid, send invoice, charge card)
- `Button` — Create Order

### Abandoned Cart Recovery (`/admin/orders/abandoned-carts`)
- `Table`: Customer, Items, Cart Value, Created, Last Activity, Recovery Status
- `Button` — Send Recovery Email (per row or bulk)
- Recovery email template customizable in Settings

### Automations
- Order placed → payment captured → confirmation email sent automatically
- Order status change → customer email notification (configurable per status)
- Order placed + high risk score → flag for manual review, email to `STORE_ADMIN`
- Daily report: unprocessed orders > 24h old → email to `STORE_MANAGER`
- Auto-cancel orders with pending payment after X days (configurable)
- Fulfillment created → tracking email sent to customer
- Delivery confirmed (carrier webhook) → delivery confirmation email sent

---

## 8. Customer Management

### Customer List (`/admin/customers`)

**KPI Cards**: Total Customers, New This Month, Repeat Customers %, Average LTV

**Table columns**: `Avatar`+Name, Email, Phone, Orders Count, Total Spent, Last Order Date, Status `Chip`, Registered Date, Tags

**Status `Chip`**: Active (green), Inactive (muted), Banned (danger)

**Filters**: Status, Date range (registered), `Input` search, Tags `Select`, Min/Max spend

**Row Actions**: View Profile, Edit, Send Email, Ban/Unban, Delete

**Bulk Actions**: Export CSV, Tag Customers, Send Email Campaign, Ban, Delete

### Customer Profile (`/admin/customers/[id]`)

**Layout**: 2-column

**Main Column**:

Orders `Tab`:
- Full order history `Table` (same as orders list but filtered to this customer)
- Total orders count, total spend displayed

Activity `Tab`:
- Login history, page views, cart events timeline

Notes `Tab`:
- Staff notes `Textarea` + submit
- History of all notes with author + date

**Sidebar Column**:

- `Avatar` (upload), full name, email, phone
- Account status `Chip`
- Registration date
- Email `Switch` — Marketing opt-in
- Customer Tags multi-select
- Groups/Segments `Chip`s
- `Button` — Reset Password (sends reset email to customer)
- `Button` — Impersonate (login as this customer on storefront — `STORE_ADMIN` only)
- `Button` — Ban Customer → `Modal size="sm"` with reason `Textarea`
- `Button` — Delete Account → confirmation `Modal size="sm"` (GDPR compliant, anonymizes data)

Addresses Card:
- All saved addresses listed
- `Button` — Add Address → `Modal size="md"`
- Default address badge

### Customer Segments (`/admin/customers/segments`)

- `Table` of segments with customer count
- `Button` — Create Segment → `Modal size="lg"` with rule builder (AND/OR conditions):
  - Field `Select` (e.g., Total Spent, Order Count, Location, Tag, Last Order Date)
  - Operator `Select` (greater than, equals, contains, etc.)
  - Value `Input`
- Segments auto-update nightly via cron
- Use segments for: email campaigns, discount targeting, analytics filtering

### Automations
- New customer registered → welcome email
- Customer inactive 90 days → win-back email campaign trigger
- Customer spends over threshold → upgrade to "VIP" tag automatically
- Birthday email (if DOB collected) 3 days before birthday

---

## 9. Vendor & Supplier Management

### Vendors (`/admin/vendors`)
- Marketplace-style multi-vendor support
- `Table`: Name, Email, Products Count, Total Sales, Commission Rate, Status `Chip`, Payout Balance
- Row Actions: View Dashboard, Edit, Suspend, Delete

### Vendor Profile (`/admin/vendors/[id]`)
- Business info: Company Name, Tax ID, Contact, Bank Details
- `Tab` — Products (their product `Table`)
- `Tab` — Orders (orders containing their products)
- `Tab` — Payouts (payout history `Table`)
- `Tab` — Documents (uploaded docs: business license, tax forms)
- Commission rate `NumberInput` (override global default)
- `Switch` — Auto-approve products
- `Button` — Initiate Payout → `Modal size="md"` with amount + method

### Vendor Onboarding Flow
- Vendor applies via storefront form
- Application appears in Vendors list with status "Pending"
- `STORE_ADMIN` reviews → `Button` Approve or Reject
- Approve → vendor receives email with login credentials for Vendor Portal
- Reject → `Modal size="sm"` with reason `Textarea` → rejection email sent

### Suppliers (for Purchase Orders)
- Separate from Vendors (suppliers = who you buy from, vendors = who sells on your marketplace)
- `Table`: Name, Contact, Email, Active POs, Last PO Date
- Add/Edit `Modal size="lg"`: Company, Contact name, Email, Phone, Address, Payment Terms, Notes
- Link products to preferred supplier

---

## 10. Promotions & Marketing

### Coupons & Discounts (`/admin/promotions/coupons`)

**Table columns**: Code, Type, Value, Usage / Limit, Starts, Expires, Status `Chip`, Actions

**Add/Edit Coupon** → `Modal size="xl"`:
- `Input` — Code (or `Button` — Generate Random)
- `Select` — Type: Percentage Off, Fixed Amount Off, Free Shipping, Buy X Get Y
- `NumberInput` — Value
- `Select` — Applies To: Entire Order, Specific Products, Specific Categories, Specific Customers
- Product/Category/Customer picker (searchable multi-select)
- `NumberInput` — Minimum Order Value
- `NumberInput` — Maximum Discount Amount (cap for % discounts)
- `NumberInput` — Usage Limit (total)
- `NumberInput` — Usage Limit per Customer
- `DateRangePicker` — Active Period
- `Switch` — Combine with other discounts
- `Switch` — First-time customers only

### Automatic Discounts (`/admin/promotions/automatic`)
- Rule-based discounts (no code needed)
- Same fields as coupons plus: trigger conditions (`Select` — cart total, product qty, etc.)
- Priority `NumberInput` (higher = evaluated first)

### Flash Sales (`/admin/promotions/flash-sales`)
- `Table` of timed sales events
- Add `Modal size="lg"`: Name, `DateRangePicker`, Product selection, Discount %, Max units per sale
- Countdown timer shown on storefront automatically
- Auto-reverts prices on end date/time (cron job)

### Gift Cards (`/admin/promotions/gift-cards`)
- Generate single or bulk gift cards
- Bulk generate: quantity, value, expiry → download CSV of codes
- `Table` — issued cards with balance remaining, purchase history
- `Input` — Check Balance by code

### Loyalty Program (`/admin/promotions/loyalty`)
- `NumberInput` — Points per $1 spent
- `NumberInput` — Points redemption rate ($1 per X points)
- `Select` — Points expiry (never, 6 months, 1 year)
- Customer points `Table` (view per customer in their profile)
- Points history log

### Email Campaigns (`/admin/marketing/campaigns`)
- `Table` list: Campaign Name, Status `Chip`, Recipients, Sent, Open Rate, Click Rate, Revenue Attributed
- `Button` — Create Campaign → full page with:
  - `Input` — Campaign Name
  - `Select` — Audience Segment
  - Email template builder (drag-and-drop blocks: header, text, image, button, product grid, footer)
  - `Input` — Subject Line + Preview Text
  - `DatePicker` — Schedule or `Button` — Send Now
  - A/B test toggle: two subject lines or content variants, split `NumberInput` %
- After send: real-time stats update (opens, clicks, unsubscribes)

### Automations
- Coupon expiry 3 days → reminder email to customers who received it but haven't used it
- Flash sale start/end → automatic price update on all variants in sale
- Gift card purchased → delivery email with code sent to recipient
- Loyalty points earned → confirmation email / push notification
- Campaign performance report sent to `MARKETING_MANAGER` after 48h

---

## 11. Shipping & Fulfillment

### Shipping Zones & Rates (`/admin/shipping/zones`)
- `Table` of zones: Name, Regions Covered, Rates Count
- Add/Edit Zone → `Modal size="xl"`:
  - `Input` — Zone Name
  - Country/Region multi-select
  - Rates section: add multiple rate rows
    - `Input` — Rate Name (e.g., Standard, Express)
    - `Select` — Rate Type: Flat Rate, Weight-Based, Price-Based, Free
    - Condition ranges for weight/price-based
    - `NumberInput` — Price
    - `Select` — Carrier (UPS, FedEx, USPS, DHL, Custom)
    - Estimated delivery days range `NumberInput`s

### Shipping Carriers (`/admin/shipping/carriers`)
- Enable/disable carrier integrations (`Switch` per carrier)
- API credentials `Input`s per carrier (stored encrypted)
- Real-time rate fetching test tool
- Carriers: UPS, FedEx, USPS, DHL, ShipStation integration

### Fulfillment Settings (`/admin/shipping/fulfillment`)
- `Select` — Default fulfillment location (warehouse)
- `Switch` — Auto-fulfill digital products immediately on payment
- `Switch` — Auto-fulfill on payment capture
- `NumberInput` — Handling time (days added to delivery estimate)
- `Switch` — Enable split fulfillment (orders can ship from multiple warehouses)

### Packing Slips & Labels
- Templates customizable (logo, message, fields shown)
- Print single or bulk from order list
- Label format `Select`: 4x6, letter, A4
- Carrier label auto-generation via carrier API (QR/barcode included)

### Shipping Automations
- Order fulfilled → tracking number fetched from carrier API → customer email sent
- Carrier webhook (delivery event) → order status updated to Delivered → customer email
- Return shipping label auto-generated on return approval

---

## 12. Returns & Refunds

### Returns List (`/admin/returns`)
- `Table`: Return # (link), Order #, Customer, Items, Return Reason, Status `Chip`, Requested Date, Resolved Date
- Status: Requested → Approved → Item Received → Inspected → Refund Issued / Exchange Sent / Rejected
- Filter by status, date range, `Input` search

### Return Detail (`/admin/returns/[id]`)
- Linked order details
- Items to return `Table` with quantity and condition on receipt
- Return reason and customer note
- Staff inspection notes `Textarea`
- `Button` — Approve Return → `Modal size="sm"` with optional restocking notes
- `Button` — Reject → `Modal size="sm"` with reason
- `Button` — Receive Items → log received qty and condition
- `Button` — Inspect Items → mark as Restockable / Damaged
- `Button` — Issue Refund → `Modal size="lg"`:
  - `Select` — Refund Method: Original Payment, Store Credit, Gift Card
  - `NumberInput` — Refund Amount (prefilled, editable for partial)
  - `Switch` — Restock items (adds back to inventory)
  - `Textarea` — Customer-facing reason
- `Button` — Send Exchange → search and pick replacement product

### Return Settings (`/admin/settings/returns`)
- `NumberInput` — Return window (days)
- `Switch` — Auto-approve returns under $X
- `CheckboxGroup` — Valid return reasons
- `Textarea` — Return policy text (shown to customers)
- `Switch` — Customer-initiated returns (allow/disallow from customer portal)
- `Select` — Who pays return shipping (customer, store, depends)

### Automations
- Return requested → confirmation email to customer
- Return approved → return label generated and emailed to customer (if store pays shipping)
- Refund issued → bank notification sent, balance updated, confirmation email sent
- Restocked items → inventory automatically incremented

---

## 13. Finance & Accounting

### Finance Overview (`/admin/finance`)
- KPI Cards: Gross Revenue, Net Revenue, Refunds Issued, Pending Payouts, Tax Collected
- Revenue `LineChart` with gross/net/refunds toggle
- Payout schedule overview

### Transactions (`/admin/finance/transactions`)
- All financial movements `Table`: Date, Type (Sale/Refund/Payout/Fee/Tax), Order #, Amount, Status
- Filter by type, date range, status
- Export CSV / XLSX

### Payouts (`/admin/finance/payouts`)
- Balance summary `Card`: Available, Pending, In Transit, Paid Out
- Payout history `Table`: Date, Amount, Method, Status `Chip`, Reference
- `Button` — Initiate Payout → `Modal size="md"`: amount, bank account `Select`, note
- Scheduled payout settings (daily/weekly/monthly)

### Tax Management (`/admin/finance/tax`)
- Tax rates `Table` by region: Country, State/Province, Rate %, Tax Name
- Add/Edit `Modal size="md"`
- `Switch` — Auto-calculate tax via TaxJar / Avalara integration
- Tax exemptions: customer-level `Switch` on customer profile, order-level override
- Tax reports by period

### Invoices (`/admin/finance/invoices`)
- Auto-generated per order (PDF)
- Custom invoice for manual/B2B orders
- `Table` list, search, download PDF, send via email
- Invoice template customization (logo, footer text, payment terms)

### Expense Tracking (`/admin/finance/expenses`)
- Log non-order expenses: shipping costs, ad spend, platform fees
- `Table`: Date, Category, Description, Amount, Receipt attachment
- Add `Modal size="md"`: Category `Select`, Amount `NumberInput`, `DatePicker`, `Textarea`, file upload

### P&L Report (`/admin/finance/pnl`)
- Period `Select` (monthly/quarterly/annually)
- Revenue, COGS, Gross Profit, Operating Expenses, Net Profit displayed in structured `Table` and `BarChart`
- Export PDF

### Automations
- Stripe/PayPal webhooks → auto-reconcile payments to orders
- Tax auto-calculate on every order creation
- Monthly P&L report auto-emailed to `FINANCE_MANAGER` and `STORE_ADMIN`
- Low balance alert → email if payout balance drops below threshold
- Failed payout → alert email + retry after 24h

---

## 14. Notifications & Automations

### Notification Center (right slide-over `Modal`)
- Grouped by type: Orders, Inventory, Returns, System, Marketing
- Each notification: icon, title, description, timestamp, link to relevant page
- `Button` — Mark All Read
- `Switch` — Mute specific categories

### Email Templates (`/admin/settings/email-templates`)
- List of all system emails: Order Confirmation, Shipping Update, Delivery, Return Approved, Refund Issued, Welcome, Password Reset, Abandoned Cart, etc.
- Click → open template editor (full page):
  - Subject `Input`
  - Preview Text `Input`
  - Drag-and-drop block editor
  - Variable reference sidebar (e.g., `{{customer.name}}`, `{{order.total}}`)
  - `Button` — Send Test Email to myself
  - Mobile preview toggle

### Automation Rules (`/admin/settings/automations`)
- Visual rule builder `Table`: Trigger → Condition → Action
- Add Rule → `Modal size="xl"`:
  - `Select` — Trigger event (Order Placed, Stock Below Threshold, Customer Inactive X days, etc.)
  - `Select` + value — Optional condition filter
  - `Select` — Action (Send Email, Send SMS, Add Tag, Create Task, Webhook, Change Status)
  - `Switch` — Active
- Rules list: Name, Trigger, Action, Status `Chip`, Last triggered

### SMS Notifications (`/admin/settings/sms`)
- Twilio / AWS SNS integration credentials
- Enable/disable SMS per event type `Switch`
- SMS templates per event `Textarea`
- Opt-in tracking per customer

### Push Notifications
- Web push and mobile push configuration
- Per-event toggle `Switch` (order updates, promotions, back in stock)

### Webhooks (`/admin/settings/webhooks`)
- Outbound webhooks: URL `Input`, events `CheckboxGroup`, secret `Input`
- Delivery log `Table`: timestamp, event, status code, response time
- `Button` — Resend failed

### Scheduled Reports (`/admin/settings/scheduled-reports`)
- Add report `Modal size="lg"`: Report type `Select`, frequency `Select`, recipients `Input` (email list), format `Select` (PDF/CSV)
- Active schedules `Table` with next run date

---

## 15. Content Management

### Pages (`/admin/cms/pages`)
- `Table`: Title, Slug, Status `Chip`, Last Updated
- Add/Edit → full page with TipTap rich text editor
- SEO fields panel in sidebar
- `Switch` — Published / Draft
- `DatePicker` — Scheduled Publish

### Blog (`/admin/cms/blog`)
**Posts `Table`**: Title, Category, Author `Avatar`, Status `Chip`, Published Date, Views

**Add/Edit Post** → full page:
- `Input` — Title (slug auto-generated)
- Rich text editor body
- `Select` — Category, `Select` — Tags
- Featured image upload
- `Select` — Author
- SEO panel
- `Switch` — Published
- `DatePicker` — Publish Date (future = scheduled)
- Comments `Select` — Allowed / Disabled

**Categories**: `Modal size="md"` add/edit

### Navigation Menus (`/admin/cms/menus`)
- Drag-and-drop menu builder
- Add items: Page, Category, URL, Blog Post
- Nested items for dropdown menus
- Multiple menus (Header, Footer, Mobile)

### Banners & Sliders (`/admin/cms/banners`)
- `Table` of banners: Image preview, Title, Link, Position, Active `Switch`, Sort Order
- Add/Edit `Modal size="lg"`: Image upload, Title, Subtitle, CTA text, CTA link, `DateRangePicker` active period, position `Select`, sort `NumberInput`

### Announcement Bar (`/admin/cms/announcements`)
- `Textarea` — Message text (supports HTML)
- `Select` — Background color
- `Switch` — Show close button
- `DateRangePicker` — Active period
- Preview strip shown at top of form

---

## 16. Reviews & Ratings

### Reviews List (`/admin/reviews`)
- `Table`: Product, Customer, Rating (star display), Review Title, Review Body (truncated), Date, Status `Chip`
- Status: Pending, Approved, Rejected, Spam
- Filter by status, rating, date, product

### Review Detail (`Modal size="xl"`)
- Full review text
- Product info
- Customer info
- `Button` — Approve
- `Button` — Reject → `Modal size="sm"` with reason
- `Button` — Mark as Spam
- `Textarea` — Store Reply (reply shown publicly under review on storefront)
- `Button` — Send Reply

### Review Settings (`/admin/settings/reviews`)
- `Switch` — Auto-approve reviews from verified purchasers
- `Switch` — Require approval for all reviews
- `Switch` — Allow reviews only from verified purchasers
- `Switch` — Notify `STORE_ADMIN` on new review
- `NumberInput` — Auto-request review email delay (days after delivery)

### Automations
- Order delivered → after X days → auto-send review request email
- New 1-star review → alert email to `STORE_ADMIN`
- Auto-approve if verified purchaser + `autoApprove` setting on

---

## 17. Support & Helpdesk

### Tickets (`/admin/support/tickets`)
- `Table`: Ticket #, Subject, Customer, Assigned To, Priority `Chip`, Status `Chip`, Created, Last Reply
- Filter: status, priority, assigned agent, channel
- `Button` — Create Ticket → `Modal size="lg"`

### Ticket Detail (`/admin/support/tickets/[id]`)
- Conversation thread (messages from customer and staff)
- `Textarea` + `Button` — Reply
- `Button` — Add Note (internal, not visible to customer)
- Sidebar: Customer info, Order links, Ticket metadata
- `Select` — Assign to agent
- `Select` — Priority (Low/Normal/High/Urgent)
- `Select` — Status (Open/Pending/Resolved/Closed)
- `Select` — Tags
- `Button` — Merge Ticket (merge with another ticket by #)
- Canned Responses: `Select` from saved replies, auto-fills `Textarea`

### Canned Responses (`/admin/support/canned-responses`)
- `Table` of saved reply templates
- Add/Edit `Modal size="md"`: Title, Body (with variable support), Tags `Select`

### Live Chat (`/admin/support/chat`)
- Embedded chat widget (integration: Crisp, Intercom, Tidio, or custom WebSocket)
- Queue display of waiting visitors
- Active conversations list in left sidebar
- Chat window main area

### FAQ / Help Center (`/admin/support/faq`)
- `Accordion` of FAQ items in admin
- Add/Edit `Modal size="md"`: Question, Answer (rich text), Category, Sort Order
- Published FAQs shown on storefront help center page

### Automations
- New ticket → auto-assign to agent by round-robin (configurable)
- Ticket open > 48h without response → escalation email to `STORE_MANAGER`
- Customer replies to closed ticket → auto-reopen
- Satisfaction survey sent 24h after ticket closed

---

## 18. Settings & Configuration

### General Settings (`/admin/settings/general`)
- Store name, tagline `Input`
- Store email, phone `Input`
- Timezone `Select`, Currency `Select`, Language `Select`
- Logo upload, Favicon upload
- Store address form

### Payment Settings (`/admin/settings/payments`)
- Payment gateways: `Card` per gateway with `Switch` enable, credentials `Input`s
- Supported: Stripe, PayPal, Razorpay, Square, Bank Transfer, COD
- `Select` — Default gateway
- Manual payment instructions `Textarea`

### Tax Settings → see Finance section

### Legal Pages (`/admin/settings/legal`)
- `Textarea` / rich editor for: Privacy Policy, Terms of Service, Refund Policy, Cookie Policy
- Auto-linked in storefront footer

### Integrations (`/admin/settings/integrations`)
- `Card` grid of available integrations with `Switch` connected status
- Categories: Analytics (GA4, Mixpanel), Email (Mailchimp, Klaviyo, SendGrid), Shipping (ShipStation), Accounting (QuickBooks, Xero), ERP, CRM
- Click `Card` → `Modal size="lg"` with API key `Input`s and configuration options

### API Keys (`/admin/settings/api-keys`)
- `Table`: Key Name, Prefix, Permissions `Chip`s, Created, Last Used
- `Button` — Create Key → `Modal size="md"`: name `Input`, permissions `CheckboxGroup`
- Key secret shown once on creation in a `Modal` with copy `Button`
- `Button` — Revoke (confirmation `Modal size="sm"`)

### Audit Logs (`/admin/settings/audit-log`)
- `Table`: Timestamp, User, Action, Resource Type, Resource ID, IP, Details
- Filter by user, action type, date range
- Export CSV
- Retention policy `NumberInput` (days)

### Store Appearance (`/admin/settings/appearance`)
- Primary color picker (hex `Input`)
- Font `Select`
- Layout settings
- Custom CSS `Textarea`
- Preview link

---

## 19. Master Admin Panel (Super Admin)

### Master Dashboard (`/master/dashboard`)
- Platform-wide KPIs: Total Tenants, Active Tenants, Total GMV (all stores), MRR, New Signups This Month
- Platform health `Card`s: API response time p95, DB query time, Error rate
- Top stores by GMV `Table` (sortable)
- Recent signups list
- System alerts (any tenant over resource limit, failed payments, etc.)

### Tenant Management (`/master/tenants`)
- `Table`: Store Name, Owner, Plan `Chip`, Status `Chip`, GMV (30d), Products, Customers, Created
- `Input` search, `Select` filter by Plan, Status

**Tenant Detail (`/master/tenants/[id]`)**:
- Store info: name, owner, contact, domain
- Current plan + usage metrics (products count vs limit, orders count, storage used)
- Usage charts `LineChart` (orders/day, API calls/day)
- `Tab` — Billing History
- `Tab` — Support Tickets (all tickets from this tenant)
- `Tab` — Audit Log (actions taken by master admin on this tenant)
- `Button` — Impersonate Tenant Admin (log in as their `STORE_ADMIN` for support)
- `Button` — Suspend Tenant → `Modal size="sm"` with reason
- `Button` — Reactivate
- `Button` — Delete Tenant → `Modal size="sm"` multi-confirm ("type store name to confirm")
- `Button` — Change Plan → `Modal size="md"` with plan `Select`

### Plans & Pricing (`/master/plans`)
- `Table` of subscription plans: Name, Price/mo, Features, Tenants Count
- Add/Edit `Modal size="xl"`:
  - `Input` — Plan Name
  - `NumberInput` — Monthly Price, Annual Price
  - Feature limits: Products `NumberInput`, Orders/month `NumberInput`, Staff Accounts `NumberInput`, Storage GB `NumberInput`
  - Feature toggles: `Switch` per feature (multi-vendor, API access, custom domain, analytics, etc.)
- `Switch` — Active / Hidden

### Billing & Subscriptions (`/master/billing`)
- `Table`: Tenant, Plan, Status `Chip`, Next Billing Date, MRR
- Subscription status: Active, Trial, Past Due, Cancelled
- `Button` — Apply Discount → `Modal size="md"` (coupon or direct %)
- `Button` — Extend Trial → `Modal size="sm"` with days `NumberInput`
- `Button` — Force Cancel → `Modal size="sm"`
- Revenue charts: MRR trend, Churn rate, Plan distribution `PieChart`

### Platform Analytics (`/master/analytics`)
- All stores aggregate: GMV trend, order volume, customer growth
- Per-store comparison `Table` (sortable)
- Infrastructure metrics: DB connections, cache hit rate, queue depth
- Error rates by store (identify problematic tenants)

### Feature Flags (`/master/feature-flags`)
- `Table`: Feature, Description, % Rollout `Progress`, Enabled For `Chip`
- Add/Edit `Modal size="lg"`:
  - `Input` — Feature key
  - `Switch` — Globally enabled
  - `NumberInput` — Rollout % (0-100)
  - Multi-select — Specific tenants to enable/disable
- Changes take effect within 60 seconds (cached)

### System Health (`/master/system`)
- Real-time metrics: CPU, Memory, DB connections `Progress` bars
- Queue status: pending jobs, failed jobs `Table`
- `Button` — Retry Failed Jobs
- `Button` — Clear Cache → confirmation `Modal size="sm"`
- Cron job status `Table`: name, last run, next run, status `Chip`
- Error logs `Table`: timestamp, level `Chip`, message, trace
- `Button` — Download Error Logs

### Master Admin Users (`/master/users`)
- `Table` of master admin accounts
- Add `Modal size="md"`: email `Input`, role `Select` (MASTER_ADMIN / SUPPORT_STAFF / BILLING_ADMIN)
- Revoke access `Button`

### Announcements (`/master/announcements`)
- System-wide announcements shown to all tenant admins in their dashboard
- Add `Modal size="lg"`: Title, Body, Type `Select` (Info/Warning/Maintenance), `DateRangePicker` active period
- Maintenance mode: `Switch` globally + scheduled downtime time range

---

## 20. Print & Export Flows

### Receipt (`Order Receipt`)
Trigger: `Button` — Print Receipt on Order list row or Order detail page

Flow:
1. Click → `Modal size="3xl"` opens with styled receipt preview
2. Receipt contains: store logo, store address, order # and date, customer info, itemized line items table, subtotal/discount/shipping/tax/total, payment method, footer message
3. `Button` — Print (calls `window.print()` with modal content)
4. `Button` — Download PDF (server-side PDF generation, download)
5. `Button` — Send to Customer Email → confirmation `Modal size="sm"`

### Packing Slip
Trigger: `Button` — Print Packing Slip

Same modal flow, content: order #, ship-to address, items with qty (no prices), barcode of order #, notes for packer

### Shipping Label
Trigger: `Button` — Print Label

Opens carrier-formatted label (4x6 PDF from carrier API). If no carrier integration: generate generic label with QR code.

### Invoice (B2B)
Trigger: `Button` — Generate Invoice on Order detail or Finance → Invoices

Modal preview → Download PDF or Email to customer

### Purchase Order Print
Trigger on PO detail page → PDF generated: PO #, vendor info, line items, delivery address, payment terms

### Export Rules (all tables)
- `Button` — Export in toolbar of every major `Table`
- `Dropdown` options: Export CSV, Export XLSX, Export PDF (first 500 rows)
- Date range and active filters applied to export
- Large exports (>1000 rows): queued job → download link emailed when ready

---

## 21. Prisma Database Schema

```prisma
// schema.prisma
// Single database for Master Admin + E-commerce
// PostgreSQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// MASTER ADMIN DOMAIN
// ─────────────────────────────────────────────

model Tenant {
  id                String             @id @default(cuid())
  name              String
  slug              String             @unique
  domain            String?            @unique
  customDomain      String?            @unique
  ownerId           String
  owner             User               @relation("TenantOwner", fields: [ownerId], references: [id])
  planId            String
  plan              Plan               @relation(fields: [planId], references: [id])
  status            TenantStatus       @default(TRIAL)
  trialEndsAt       DateTime?
  suspendedAt       DateTime?
  suspendedReason   String?
  settings          Json               @default("{}")
  logo              String?
  favicon           String?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  // E-commerce relations scoped to tenant
  users             User[]
  products          Product[]
  categories        Category[]
  orders            Order[]
  customers         Customer[]
  vendors           Vendor[]
  warehouses        Warehouse[]
  coupons           Coupon[]
  campaigns         Campaign[]
  shippingZones     ShippingZone[]
  taxRates          TaxRate[]
  pages             Page[]
  blogPosts         BlogPost[]
  tickets           SupportTicket[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  subscriptions     Subscription[]
  featureFlagOverrides TenantFeatureFlag[]
  announcements     TenantAnnouncement[]
  apiKeys           ApiKey[]
  webhooks          Webhook[]
  emailTemplates    EmailTemplate[]
  automationRules   AutomationRule[]
  segments          CustomerSegment[]
  giftCards         GiftCard[]
  loyaltySettings   LoyaltySettings?
  reviews           Review[]
  brands            Brand[]
  tags              ProductTag[]
  menus             Menu[]
  banners           Banner[]
  payouts           Payout[]
  expenses          Expense[]
  purchaseOrders    PurchaseOrder[]
  returns           Return[]

  @@map("tenants")
}

model Plan {
  id                    String    @id @default(cuid())
  name                  String
  slug                  String    @unique
  monthlyPrice          Decimal   @db.Decimal(10, 2)
  annualPrice           Decimal   @db.Decimal(10, 2)
  maxProducts           Int?
  maxOrdersPerMonth     Int?
  maxStaffAccounts      Int?
  storageGb             Int?
  multiVendor           Boolean   @default(false)
  apiAccess             Boolean   @default(false)
  customDomain          Boolean   @default(false)
  advancedAnalytics     Boolean   @default(false)
  prioritySupport       Boolean   @default(false)
  isActive              Boolean   @default(true)
  isPublic              Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  tenants               Tenant[]
  subscriptions         Subscription[]

  @@map("plans")
}

model Subscription {
  id              String             @id @default(cuid())
  tenantId        String
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
  planId          String
  plan            Plan               @relation(fields: [planId], references: [id])
  status          SubscriptionStatus @default(ACTIVE)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean         @default(false)
  cancelledAt     DateTime?
  stripeSubId     String?            @unique
  discount        Decimal?           @db.Decimal(5, 2)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@map("subscriptions")
}

model FeatureFlag {
  id             String               @id @default(cuid())
  key            String               @unique
  description    String?
  enabled        Boolean              @default(false)
  rolloutPercent Int                  @default(0)
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt
  tenantOverrides TenantFeatureFlag[]

  @@map("feature_flags")
}

model TenantFeatureFlag {
  tenantId      String
  tenant        Tenant      @relation(fields: [tenantId], references: [id])
  featureFlagId String
  featureFlag   FeatureFlag @relation(fields: [featureFlagId], references: [id])
  enabled       Boolean

  @@id([tenantId, featureFlagId])
  @@map("tenant_feature_flags")
}

model SystemAnnouncement {
  id          String                  @id @default(cuid())
  title       String
  body        String
  type        AnnouncementType        @default(INFO)
  startsAt    DateTime
  endsAt      DateTime?
  createdAt   DateTime                @default(now())
  tenants     TenantAnnouncement[]

  @@map("system_announcements")
}

model TenantAnnouncement {
  tenantId        String
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
  announcementId  String
  announcement    SystemAnnouncement @relation(fields: [announcementId], references: [id])
  readAt          DateTime?

  @@id([tenantId, announcementId])
  @@map("tenant_announcements")
}

// ─────────────────────────────────────────────
// AUTH & USERS
// ─────────────────────────────────────────────

model User {
  id              String      @id @default(cuid())
  tenantId        String?
  tenant          Tenant?     @relation(fields: [tenantId], references: [id])
  email           String      @unique
  passwordHash    String
  firstName       String
  lastName        String
  avatar          String?
  role            UserRole    @default(STORE_MANAGER)
  isActive        Boolean     @default(true)
  twoFactorSecret String?
  twoFactorEnabled Boolean    @default(false)
  lastLoginAt     DateTime?
  lastLoginIp     String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  ownedTenants    Tenant[]    @relation("TenantOwner")
  sessions        UserSession[]
  auditLogs       AuditLog[]
  orderNotes      OrderNote[]
  ticketMessages  TicketMessage[]
  assignedTickets SupportTicket[]
  campaigns       Campaign[]
  blogPosts       BlogPost[]
  staffNotes      CustomerNote[]
  inventoryMovements InventoryMovement[]

  @@map("users")
}

model UserSession {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  token       String    @unique
  ipAddress   String?
  userAgent   String?
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  revokedAt   DateTime?

  @@map("user_sessions")
}

model ApiKey {
  id          String    @id @default(cuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  name        String
  keyPrefix   String
  keyHash     String    @unique
  permissions String[]
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  revokedAt   DateTime?

  @@map("api_keys")
}

// ─────────────────────────────────────────────
// AUDIT & NOTIFICATIONS
// ─────────────────────────────────────────────

model AuditLog {
  id           String    @id @default(cuid())
  tenantId     String
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  userId       String?
  user         User?     @relation(fields: [userId], references: [id])
  action       String
  resourceType String
  resourceId   String?
  oldValue     Json?
  newValue     Json?
  ipAddress    String?
  createdAt    DateTime  @default(now())

  @@index([tenantId, createdAt])
  @@map("audit_logs")
}

model Notification {
  id         String           @id @default(cuid())
  tenantId   String
  tenant     Tenant           @relation(fields: [tenantId], references: [id])
  type       NotificationType
  title      String
  body       String
  link       String?
  isRead     Boolean          @default(false)
  readAt     DateTime?
  createdAt  DateTime         @default(now())

  @@index([tenantId, isRead])
  @@map("notifications")
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

model Category {
  id          String     @id @default(cuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id])
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  name        String
  slug        String
  description String?
  image       String?
  sortOrder   Int        @default(0)
  seoTitle    String?
  seoDesc     String?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  products    ProductCategory[]

  @@unique([tenantId, slug])
  @@map("categories")
}

model Brand {
  id        String    @id @default(cuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id])
  name      String
  slug      String
  logo      String?
  description String?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]

  @@unique([tenantId, slug])
  @@map("brands")
}

model ProductTag {
  id        String    @id @default(cuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id])
  name      String
  slug      String
  products  ProductTagRelation[]

  @@unique([tenantId, slug])
  @@map("product_tags")
}

model Product {
  id               String     @id @default(cuid())
  tenantId         String
  tenant           Tenant     @relation(fields: [tenantId], references: [id])
  vendorId         String?
  vendor           Vendor?    @relation(fields: [vendorId], references: [id])
  brandId          String?
  brand            Brand?     @relation(fields: [brandId], references: [id])
  name             String
  slug             String
  shortDescription String?
  description      String?
  status           ProductStatus @default(DRAFT)
  isFeatured       Boolean    @default(false)
  taxClassId       String?
  taxClass         TaxClass?  @relation(fields: [taxClassId], references: [id])
  isPhysical       Boolean    @default(true)
  weight           Decimal?   @db.Decimal(10, 3)
  weightUnit       String?
  length           Decimal?   @db.Decimal(10, 2)
  width            Decimal?   @db.Decimal(10, 2)
  height           Decimal?   @db.Decimal(10, 2)
  dimensionUnit    String?
  shippingClassId  String?
  seoTitle         String?
  seoDesc          String?
  urlSlug          String?
  avgRating        Decimal?   @db.Decimal(3, 2)
  reviewCount      Int        @default(0)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  categories   ProductCategory[]
  tags         ProductTagRelation[]
  images       ProductImage[]
  options      ProductOption[]
  variants     ProductVariant[]
  reviews      Review[]
  orderItems   OrderItem[]
  wishlistItems WishlistItem[]
  relatedProducts ProductRelation[] @relation("Product")
  relatedTo    ProductRelation[]    @relation("RelatedProduct")
  cartItems    CartItem[]

  @@unique([tenantId, slug])
  @@index([tenantId, status])
  @@map("products")
}

model ProductCategory {
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([productId, categoryId])
  @@map("product_categories")
}

model ProductTagRelation {
  productId String
  product   Product    @relation(fields: [productId], references: [id])
  tagId     String
  tag       ProductTag @relation(fields: [tagId], references: [id])

  @@id([productId, tagId])
  @@map("product_tag_relations")
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  url       String
  altText   String?
  sortOrder Int      @default(0)

  @@map("product_images")
}

model ProductOption {
  id        String               @id @default(cuid())
  productId String
  product   Product              @relation(fields: [productId], references: [id])
  name      String
  sortOrder Int                  @default(0)
  values    ProductOptionValue[]

  @@map("product_options")
}

model ProductOptionValue {
  id        String        @id @default(cuid())
  optionId  String
  option    ProductOption @relation(fields: [optionId], references: [id])
  value     String
  sortOrder Int           @default(0)

  @@map("product_option_values")
}

model ProductVariant {
  id              String   @id @default(cuid())
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  sku             String
  barcode         String?
  price           Decimal  @db.Decimal(10, 2)
  compareAtPrice  Decimal? @db.Decimal(10, 2)
  costPrice       Decimal? @db.Decimal(10, 2)
  options         Json
  image           String?
  isDefault       Boolean  @default(false)
  weight          Decimal? @db.Decimal(10, 3)
  trackInventory  Boolean  @default(true)
  allowBackorder  Boolean  @default(false)
  soldIndividually Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  inventoryLevels InventoryLevel[]
  orderItems      OrderItem[]
  cartItems       CartItem[]

  @@unique([productId, sku])
  @@map("product_variants")
}

model ProductRelation {
  productId        String
  product          Product @relation("Product", fields: [productId], references: [id])
  relatedProductId String
  relatedProduct   Product @relation("RelatedProduct", fields: [relatedProductId], references: [id])
  type             String  // "related", "upsell", "crosssell"

  @@id([productId, relatedProductId, type])
  @@map("product_relations")
}

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────

model Warehouse {
  id         String           @id @default(cuid())
  tenantId   String
  tenant     Tenant           @relation(fields: [tenantId], references: [id])
  name       String
  address    Json
  contact    String?
  email      String?
  isDefault  Boolean          @default(false)
  isActive   Boolean          @default(true)
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt
  inventory  InventoryLevel[]

  @@map("warehouses")
}

model InventoryLevel {
  id              String   @id @default(cuid())
  variantId       String
  variant         ProductVariant @relation(fields: [variantId], references: [id])
  warehouseId     String
  warehouse       Warehouse @relation(fields: [warehouseId], references: [id])
  quantity        Int      @default(0)
  reserved        Int      @default(0)
  reorderPoint    Int      @default(0)
  reorderQty      Int      @default(0)
  autoReorder     Boolean  @default(false)
  location        String?
  updatedAt       DateTime @updatedAt

  @@unique([variantId, warehouseId])
  @@map("inventory_levels")
}

model InventoryMovement {
  id          String        @id @default(cuid())
  variantId   String
  warehouseId String
  userId      String?
  user        User?         @relation(fields: [userId], references: [id])
  type        MovementType
  quantity    Int
  before      Int
  after       Int
  reason      String?
  reference   String?
  orderId     String?
  createdAt   DateTime      @default(now())

  @@index([variantId])
  @@map("inventory_movements")
}

model Supplier {
  id             String          @id @default(cuid())
  tenantId       String
  name           String
  contactName    String?
  email          String?
  phone          String?
  address        Json?
  paymentTerms   String?
  notes          String?
  isActive       Boolean         @default(true)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  purchaseOrders PurchaseOrder[]

  @@map("suppliers")
}

model PurchaseOrder {
  id           String      @id @default(cuid())
  tenantId     String
  tenant       Tenant      @relation(fields: [tenantId], references: [id])
  supplierId   String
  supplier     Supplier    @relation(fields: [supplierId], references: [id])
  poNumber     String      @unique
  status       POStatus    @default(DRAFT)
  expectedDate DateTime?
  receivedDate DateTime?
  notes        String?
  totalCost    Decimal     @db.Decimal(10, 2) @default(0)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  items        POItem[]

  @@map("purchase_orders")
}

model POItem {
  id             String        @id @default(cuid())
  purchaseOrderId String
  purchaseOrder  PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  variantId      String
  orderedQty     Int
  receivedQty    Int           @default(0)
  unitCost       Decimal       @db.Decimal(10, 2)
  totalCost      Decimal       @db.Decimal(10, 2)

  @@map("po_items")
}

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────

model Customer {
  id               String    @id @default(cuid())
  tenantId         String
  tenant           Tenant    @relation(fields: [tenantId], references: [id])
  email            String
  passwordHash     String?
  firstName        String?
  lastName         String?
  phone            String?
  avatar           String?
  birthDate        DateTime?
  gender           String?
  taxExempt        Boolean   @default(false)
  marketingOptIn   Boolean   @default(false)
  status           CustomerStatus @default(ACTIVE)
  bannedAt         DateTime?
  bannedReason     String?
  loyaltyPoints    Int       @default(0)
  totalSpent       Decimal   @db.Decimal(10, 2) @default(0)
  orderCount       Int       @default(0)
  tags             String[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  addresses        Address[]
  orders           Order[]
  carts            Cart[]
  wishlists        Wishlist[]
  reviews          Review[]
  notes            CustomerNote[]
  tickets          SupportTicket[]
  loyaltyHistory   LoyaltyTransaction[]
  giftCardUsages   GiftCardUsage[]
  segmentMemberships CustomerSegmentMember[]

  @@unique([tenantId, email])
  @@map("customers")
}

model Address {
  id          String    @id @default(cuid())
  customerId  String
  customer    Customer  @relation(fields: [customerId], references: [id])
  firstName   String
  lastName    String
  company     String?
  line1       String
  line2       String?
  city        String
  state       String?
  zip         String
  country     String
  phone       String?
  isDefault   Boolean   @default(false)
  createdAt   DateTime  @default(now())

  @@map("addresses")
}

model CustomerNote {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id])
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  body       String
  createdAt  DateTime @default(now())

  @@map("customer_notes")
}

model CustomerSegment {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  rules     Json
  count     Int      @default(0)
  updatedAt DateTime @updatedAt
  members   CustomerSegmentMember[]
  campaigns Campaign[]

  @@map("customer_segments")
}

model CustomerSegmentMember {
  segmentId  String
  segment    CustomerSegment @relation(fields: [segmentId], references: [id])
  customerId String
  customer   Customer        @relation(fields: [customerId], references: [id])
  addedAt    DateTime        @default(now())

  @@id([segmentId, customerId])
  @@map("customer_segment_members")
}

// ─────────────────────────────────────────────
// CART & WISHLIST
// ─────────────────────────────────────────────

model Cart {
  id         String     @id @default(cuid())
  tenantId   String
  customerId String?
  customer   Customer?  @relation(fields: [customerId], references: [id])
  sessionId  String?
  items      CartItem[]
  couponId   String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  abandonedAt DateTime?
  recoveryEmailSentAt DateTime?

  @@map("carts")
}

model CartItem {
  id        String         @id @default(cuid())
  cartId    String
  cart      Cart           @relation(fields: [cartId], references: [id])
  productId String
  product   Product        @relation(fields: [productId], references: [id])
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  price     Decimal        @db.Decimal(10, 2)

  @@map("cart_items")
}

model Wishlist {
  id         String         @id @default(cuid())
  customerId String
  customer   Customer       @relation(fields: [customerId], references: [id])
  name       String         @default("Wishlist")
  items      WishlistItem[]
  createdAt  DateTime       @default(now())

  @@map("wishlists")
}

model WishlistItem {
  id         String   @id @default(cuid())
  wishlistId String
  wishlist   Wishlist @relation(fields: [wishlistId], references: [id])
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  addedAt    DateTime @default(now())

  @@map("wishlist_items")
}

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

model Order {
  id               String        @id @default(cuid())
  tenantId         String
  tenant           Tenant        @relation(fields: [tenantId], references: [id])
  orderNumber      String        @unique
  customerId       String?
  customer         Customer?     @relation(fields: [customerId], references: [id])
  guestEmail       String?
  guestName        String?
  guestPhone       String?
  paymentStatus    PaymentStatus @default(PENDING)
  fulfillmentStatus FulfillmentStatus @default(UNFULFILLED)
  channel          String        @default("web")
  currency         String        @default("USD")
  subtotal         Decimal       @db.Decimal(10, 2)
  discountAmount   Decimal       @db.Decimal(10, 2) @default(0)
  shippingAmount   Decimal       @db.Decimal(10, 2) @default(0)
  taxAmount        Decimal       @db.Decimal(10, 2) @default(0)
  total            Decimal       @db.Decimal(10, 2)
  couponId         String?
  coupon           Coupon?       @relation(fields: [couponId], references: [id])
  shippingAddress  Json
  billingAddress   Json
  shippingMethodId String?
  shippingMethod   ShippingRate? @relation(fields: [shippingMethodId], references: [id])
  notes            String?
  tags             String[]
  riskScore        Int?
  riskLevel        String?
  ipAddress        String?
  userAgent        String?
  cancelledAt      DateTime?
  cancelReason     String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  items         OrderItem[]
  fulfillments  Fulfillment[]
  transactions  Transaction[]
  returns       Return[]
  notes_        OrderNote[]
  editHistory   OrderEditHistory[]

  @@index([tenantId, createdAt])
  @@index([tenantId, paymentStatus])
  @@map("orders")
}

model OrderItem {
  id          String         @id @default(cuid())
  orderId     String
  order       Order          @relation(fields: [orderId], references: [id])
  productId   String
  product     Product        @relation(fields: [productId], references: [id])
  variantId   String
  variant     ProductVariant @relation(fields: [variantId], references: [id])
  vendorId    String?
  name        String
  sku         String
  options     Json
  quantity    Int
  unitPrice   Decimal        @db.Decimal(10, 2)
  discount    Decimal        @db.Decimal(10, 2) @default(0)
  taxAmount   Decimal        @db.Decimal(10, 2) @default(0)
  total       Decimal        @db.Decimal(10, 2)
  fulfilledQty Int           @default(0)
  returnedQty  Int           @default(0)

  fulfillmentItems FulfillmentItem[]
  returnItems      ReturnItem[]

  @@map("order_items")
}

model OrderNote {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  body      String
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("order_notes")
}

model OrderEditHistory {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  changes   Json
  editedBy  String
  createdAt DateTime @default(now())

  @@map("order_edit_history")
}

model Fulfillment {
  id              String            @id @default(cuid())
  orderId         String
  order           Order             @relation(fields: [orderId], references: [id])
  carrier         String?
  trackingNumber  String?
  trackingUrl     String?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  status          FulfillmentStatus @default(UNFULFILLED)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  items           FulfillmentItem[]

  @@map("fulfillments")
}

model FulfillmentItem {
  id             String      @id @default(cuid())
  fulfillmentId  String
  fulfillment    Fulfillment @relation(fields: [fulfillmentId], references: [id])
  orderItemId    String
  orderItem      OrderItem   @relation(fields: [orderItemId], references: [id])
  quantity       Int

  @@map("fulfillment_items")
}

model Transaction {
  id          String            @id @default(cuid())
  orderId     String
  order       Order             @relation(fields: [orderId], references: [id])
  type        TransactionType
  amount      Decimal           @db.Decimal(10, 2)
  currency    String            @default("USD")
  status      TransactionStatus @default(PENDING)
  gateway     String
  gatewayId   String?
  gatewayData Json?
  createdAt   DateTime          @default(now())

  @@map("transactions")
}

// ─────────────────────────────────────────────
// RETURNS & REFUNDS
// ─────────────────────────────────────────────

model Return {
  id          String       @id @default(cuid())
  tenantId    String
  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  orderId     String
  order       Order        @relation(fields: [orderId], references: [id])
  customerId  String?
  returnNumber String      @unique
  reason      String
  status      ReturnStatus @default(REQUESTED)
  refundAmount Decimal?    @db.Decimal(10, 2)
  refundMethod String?
  staffNotes  String?
  rejectedReason String?
  requestedAt DateTime     @default(now())
  approvedAt  DateTime?
  receivedAt  DateTime?
  resolvedAt  DateTime?
  items       ReturnItem[]

  @@map("returns")
}

model ReturnItem {
  id          String    @id @default(cuid())
  returnId    String
  return      Return    @relation(fields: [returnId], references: [id])
  orderItemId String
  orderItem   OrderItem @relation(fields: [orderItemId], references: [id])
  quantity    Int
  condition   String?
  restocked   Boolean   @default(false)

  @@map("return_items")
}

// ─────────────────────────────────────────────
// SHIPPING
// ─────────────────────────────────────────────

model ShippingZone {
  id        String         @id @default(cuid())
  tenantId  String
  tenant    Tenant         @relation(fields: [tenantId], references: [id])
  name      String
  countries String[]
  regions   String[]
  isActive  Boolean        @default(true)
  rates     ShippingRate[]

  @@map("shipping_zones")
}

model ShippingRate {
  id            String       @id @default(cuid())
  zoneId        String
  zone          ShippingZone @relation(fields: [zoneId], references: [id])
  name          String
  type          String
  price         Decimal      @db.Decimal(10, 2)
  minOrderValue Decimal?     @db.Decimal(10, 2)
  maxOrderValue Decimal?     @db.Decimal(10, 2)
  minWeight     Decimal?     @db.Decimal(10, 3)
  maxWeight     Decimal?     @db.Decimal(10, 3)
  carrier       String?
  estimatedDaysMin Int?
  estimatedDaysMax Int?
  isActive      Boolean      @default(true)
  orders        Order[]

  @@map("shipping_rates")
}

// ─────────────────────────────────────────────
// TAX
// ─────────────────────────────────────────────

model TaxClass {
  id       String    @id @default(cuid())
  name     String
  products Product[]

  @@map("tax_classes")
}

model TaxRate {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  country   String
  state     String?
  zip       String?
  rate      Decimal  @db.Decimal(6, 4)
  isDefault Boolean  @default(false)
  isActive  Boolean  @default(true)

  @@map("tax_rates")
}

// ─────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────

model Coupon {
  id                  String     @id @default(cuid())
  tenantId            String
  tenant              Tenant     @relation(fields: [tenantId], references: [id])
  code                String
  type                CouponType
  value               Decimal    @db.Decimal(10, 2)
  maxDiscount         Decimal?   @db.Decimal(10, 2)
  minOrderValue       Decimal?   @db.Decimal(10, 2)
  usageLimit          Int?
  usageCount          Int        @default(0)
  usageLimitPerCustomer Int?
  appliesTo           String     @default("order")
  productIds          String[]
  categoryIds         String[]
  customerIds         String[]
  segmentId           String?
  firstTimeOnly       Boolean    @default(false)
  combineDiscounts    Boolean    @default(false)
  startsAt            DateTime?
  expiresAt           DateTime?
  isActive            Boolean    @default(true)
  createdAt           DateTime   @default(now())
  orders              Order[]

  @@unique([tenantId, code])
  @@map("coupons")
}

model GiftCard {
  id          String          @id @default(cuid())
  tenantId    String
  tenant      Tenant          @relation(fields: [tenantId], references: [id])
  code        String          @unique
  initialValue Decimal        @db.Decimal(10, 2)
  balance     Decimal         @db.Decimal(10, 2)
  expiresAt   DateTime?
  isActive    Boolean         @default(true)
  purchasedByCustomerId String?
  recipientEmail String?
  createdAt   DateTime        @default(now())
  usages      GiftCardUsage[]

  @@map("gift_cards")
}

model GiftCardUsage {
  id         String    @id @default(cuid())
  giftCardId String
  giftCard   GiftCard  @relation(fields: [giftCardId], references: [id])
  customerId String?
  customer   Customer? @relation(fields: [customerId], references: [id])
  orderId    String?
  amount     Decimal   @db.Decimal(10, 2)
  usedAt     DateTime  @default(now())

  @@map("gift_card_usages")
}

model LoyaltySettings {
  id              String   @id @default(cuid())
  tenantId        String   @unique
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  pointsPerDollar Int      @default(1)
  pointsValue     Decimal  @db.Decimal(10, 4)
  expiryDays      Int?
  isActive        Boolean  @default(true)

  @@map("loyalty_settings")
}

model LoyaltyTransaction {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id])
  type       String
  points     Int
  balance    Int
  orderId    String?
  reason     String?
  createdAt  DateTime @default(now())

  @@map("loyalty_transactions")
}

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────

model Payout {
  id         String       @id @default(cuid())
  tenantId   String
  tenant     Tenant       @relation(fields: [tenantId], references: [id])
  vendorId   String?
  vendor     Vendor?      @relation(fields: [vendorId], references: [id])
  amount     Decimal      @db.Decimal(10, 2)
  currency   String       @default("USD")
  method     String
  status     PayoutStatus @default(PENDING)
  reference  String?
  notes      String?
  createdAt  DateTime     @default(now())
  processedAt DateTime?

  @@map("payouts")
}

model Expense {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  category    String
  description String
  amount      Decimal  @db.Decimal(10, 2)
  date        DateTime
  receipt     String?
  createdAt   DateTime @default(now())

  @@map("expenses")
}

// ─────────────────────────────────────────────
// VENDOR
// ─────────────────────────────────────────────

model Vendor {
  id              String       @id @default(cuid())
  tenantId        String
  tenant          Tenant       @relation(fields: [tenantId], references: [id])
  companyName     String
  contactName     String
  email           String
  phone           String?
  taxId           String?
  bankDetails     Json?
  commissionRate  Decimal      @db.Decimal(5, 2) @default(0)
  autoApprove     Boolean      @default(false)
  status          VendorStatus @default(PENDING)
  documents       Json?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  products        Product[]
  payouts         Payout[]

  @@map("vendors")
}

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

model Review {
  id          String       @id @default(cuid())
  tenantId    String
  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  productId   String
  product     Product      @relation(fields: [productId], references: [id])
  customerId  String?
  customer    Customer?    @relation(fields: [customerId], references: [id])
  rating      Int
  title       String?
  body        String?
  reply       String?
  repliedAt   DateTime?
  status      ReviewStatus @default(PENDING)
  isVerified  Boolean      @default(false)
  helpfulCount Int         @default(0)
  createdAt   DateTime     @default(now())

  @@map("reviews")
}

// ─────────────────────────────────────────────
// SUPPORT
// ─────────────────────────────────────────────

model SupportTicket {
  id          String         @id @default(cuid())
  tenantId    String
  tenant      Tenant         @relation(fields: [tenantId], references: [id])
  ticketNumber String        @unique
  subject     String
  status      TicketStatus   @default(OPEN)
  priority    TicketPriority @default(NORMAL)
  channel     String         @default("email")
  customerId  String?
  customer    Customer?      @relation(fields: [customerId], references: [id])
  assignedToId String?
  assignedTo  User?          @relation(fields: [assignedToId], references: [id])
  tags        String[]
  orderId     String?
  satisfactionScore Int?
  closedAt    DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  messages    TicketMessage[]
  cannedResponseUsages CannedResponseUsage[]

  @@map("support_tickets")
}

model TicketMessage {
  id        String        @id @default(cuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id])
  authorId  String?
  author    User?         @relation(fields: [authorId], references: [id])
  body      String
  isInternal Boolean      @default(false)
  attachments String[]
  createdAt DateTime      @default(now())

  @@map("ticket_messages")
}

model CannedResponse {
  id        String   @id @default(cuid())
  tenantId  String
  title     String
  body      String
  tags      String[]
  createdAt DateTime @default(now())
  usages    CannedResponseUsage[]

  @@map("canned_responses")
}

model CannedResponseUsage {
  id              String        @id @default(cuid())
  cannedResponseId String
  cannedResponse  CannedResponse @relation(fields: [cannedResponseId], references: [id])
  ticketId        String
  ticket          SupportTicket  @relation(fields: [ticketId], references: [id])
  usedAt          DateTime       @default(now())

  @@map("canned_response_usages")
}

// ─────────────────────────────────────────────
// MARKETING
// ─────────────────────────────────────────────

model Campaign {
  id          String         @id @default(cuid())
  tenantId    String
  tenant      Tenant         @relation(fields: [tenantId], references: [id])
  name        String
  segmentId   String?
  segment     CustomerSegment? @relation(fields: [segmentId], references: [id])
  subject     String?
  previewText String?
  body        Json
  status      CampaignStatus @default(DRAFT)
  scheduledAt DateTime?
  sentAt      DateTime?
  createdById String
  createdBy   User           @relation(fields: [createdById], references: [id])
  stats       CampaignStats?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("campaigns")
}

model CampaignStats {
  campaignId    String   @id
  campaign      Campaign @relation(fields: [campaignId], references: [id])
  sent          Int      @default(0)
  delivered     Int      @default(0)
  opened        Int      @default(0)
  clicked       Int      @default(0)
  unsubscribed  Int      @default(0)
  revenue       Decimal  @db.Decimal(10, 2) @default(0)
  updatedAt     DateTime @updatedAt

  @@map("campaign_stats")
}

// ─────────────────────────────────────────────
// CMS
// ─────────────────────────────────────────────

model Page {
  id          String    @id @default(cuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  title       String
  slug        String
  body        Json
  status      PageStatus @default(DRAFT)
  seoTitle    String?
  seoDesc     String?
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([tenantId, slug])
  @@map("pages")
}

model BlogPost {
  id          String     @id @default(cuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id])
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  title       String
  slug        String
  excerpt     String?
  body        Json
  featuredImage String?
  status      PageStatus @default(DRAFT)
  allowComments Boolean  @default(true)
  tags        String[]
  seoTitle    String?
  seoDesc     String?
  viewCount   Int        @default(0)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([tenantId, slug])
  @@map("blog_posts")
}

model Menu {
  id       String     @id @default(cuid())
  tenantId String
  tenant   Tenant     @relation(fields: [tenantId], references: [id])
  name     String
  location String
  items    MenuItem[]

  @@map("menus")
}

model MenuItem {
  id        String     @id @default(cuid())
  menuId    String
  menu      Menu       @relation(fields: [menuId], references: [id])
  parentId  String?
  parent    MenuItem?  @relation("MenuItemTree", fields: [parentId], references: [id])
  children  MenuItem[] @relation("MenuItemTree")
  label     String
  type      String
  resourceId String?
  url       String?
  target    String?
  sortOrder Int        @default(0)

  @@map("menu_items")
}

model Banner {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  title     String?
  subtitle  String?
  image     String
  ctaText   String?
  ctaLink   String?
  position  String
  sortOrder Int      @default(0)
  startsAt  DateTime?
  endsAt    DateTime?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("banners")
}

// ─────────────────────────────────────────────
// AUTOMATIONS & WEBHOOKS
// ─────────────────────────────────────────────

model AutomationRule {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  trigger     String
  conditions  Json     @default("[]")
  action      String
  actionData  Json     @default("{}")
  isActive    Boolean  @default(true)
  lastTriggeredAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("automation_rules")
}

model EmailTemplate {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  key       String
  subject   String
  previewText String?
  body      Json
  isActive  Boolean  @default(true)
  updatedAt DateTime @updatedAt

  @@unique([tenantId, key])
  @@map("email_templates")
}

model Webhook {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  url       String
  events    String[]
  secret    String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  deliveries WebhookDelivery[]

  @@map("webhooks")
}

model WebhookDelivery {
  id         String   @id @default(cuid())
  webhookId  String
  webhook    Webhook  @relation(fields: [webhookId], references: [id])
  event      String
  statusCode Int?
  responseMs Int?
  success    Boolean
  payload    Json
  createdAt  DateTime @default(now())

  @@map("webhook_deliveries")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum UserRole {
  MASTER_ADMIN
  STORE_ADMIN
  STORE_MANAGER
  SUPPORT_AGENT
  WAREHOUSE_STAFF
  FINANCE_MANAGER
  MARKETING_MANAGER
  VENDOR
}

enum TenantStatus {
  TRIAL
  ACTIVE
  SUSPENDED
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  TRIALING
}

enum ProductStatus {
  ACTIVE
  DRAFT
  ARCHIVED
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  BANNED
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  PARTIALLY_REFUNDED
  REFUNDED
  FAILED
  CANCELLED
}

enum FulfillmentStatus {
  UNFULFILLED
  PARTIALLY_FULFILLED
  FULFILLED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum TransactionType {
  SALE
  REFUND
  PAYOUT
  FEE
  TAX
  ADJUSTMENT
}

enum TransactionStatus {
  PENDING
  SUCCESS
  FAILED
}

enum ReturnStatus {
  REQUESTED
  APPROVED
  REJECTED
  ITEM_RECEIVED
  INSPECTED
  REFUND_ISSUED
  EXCHANGE_SENT
  CLOSED
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
  BUY_X_GET_Y
}

enum VendorStatus {
  PENDING
  ACTIVE
  SUSPENDED
  REJECTED
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  SPAM
}

enum TicketStatus {
  OPEN
  PENDING
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  CANCELLED
}

enum PageStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

enum MovementType {
  PURCHASE_RECEIVED
  SALE
  RETURN
  ADJUSTMENT_ADD
  ADJUSTMENT_REMOVE
  DAMAGE
  LOSS
  TRANSFER
}

enum POStatus {
  DRAFT
  SENT
  CONFIRMED
  PARTIALLY_RECEIVED
  RECEIVED
  CLOSED
  CANCELLED
}

enum PayoutStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
}

enum NotificationType {
  ORDER
  INVENTORY
  RETURN
  REVIEW
  SYSTEM
  MARKETING
  SUPPORT
}

enum AnnouncementType {
  INFO
  WARNING
  MAINTENANCE
  SUCCESS
}
```

---

*End of Specification — Version 1.0*
*Stack: Next.js 14 App Router · HeroUI · Prisma ORM · PostgreSQL · Tailwind CSS*