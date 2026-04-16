# 🎯 FEATURES.md — Complete Feature Matrix

## Product 1: Master Admin (SaaS Control Plane)

### 🏢 Tenant Management
- [ ] Tenant onboarding wizard (3-step: profile → plan → store config)
- [ ] Tenant listing with health indicators (revenue, uptime, activity)
- [ ] Per-tenant feature flags & plan gating
- [ ] Tenant suspension / reinstatement workflows
- [ ] Bulk tenant operations (notifications, config push)
- [ ] Tenant cloning (duplicate a store config for new tenant)
- [ ] White-label branding per tenant (logo, colors, domain)
- [ ] Custom domain mapping with SSL auto-provisioning (Let's Encrypt)
- [ ] Tenant audit log (all actions, impersonation sessions)

### 💳 Billing & Subscriptions
- [ ] Plan builder (create/edit pricing tiers with feature bundles)
- [ ] Stripe Billing integration (subscriptions, usage-based, invoices)
- [ ] Trial management (duration, auto-conversion, grace periods)
- [ ] Revenue dashboard (MRR, ARR, churn rate, LTV, ARPU)
- [ ] Proration handling on plan upgrades/downgrades
- [ ] Coupon & discount code management
- [ ] Invoice generation & PDF export
- [ ] Failed payment dunning workflows
- [ ] Add-on module billing (per-module charges)

### 📊 Platform Analytics
- [ ] Real-time platform GMV dashboard
- [ ] Tenant performance leaderboard
- [ ] Cross-tenant trend analysis
- [ ] Cohort analysis (tenant activation, retention)
- [ ] Alert rules (low activity, spike detection, error thresholds)
- [ ] Exportable reports (CSV, Excel, PDF)
- [ ] Custom report builder with drag-and-drop

### 🔧 Platform Configuration
- [ ] Global tax rule templates
- [ ] Supported payment gateway registry
- [ ] Shipping carrier registry & rate cards
- [ ] Email template library (global defaults)
- [ ] Global product category taxonomy
- [ ] Platform-wide announcement system
- [ ] Maintenance mode (per-tenant or global)

### 👤 Super Admin User Management
- [ ] Role-based access (Super Admin, Support, Finance, Read-only)
- [ ] MFA enforcement for all master admin users
- [ ] Session management & device tracking
- [ ] Impersonation mode (log in as any tenant)
- [ ] Admin activity log

---

## Product 2: Tenant Admin (Merchant Dashboard)

### 🛍️ Product Management
- [ ] Product CRUD with rich text description (TipTap editor)
- [ ] Variant engine (size, color, material — unlimited dimensions)
- [ ] Bulk product import/export (CSV, Excel, Shopify format)
- [ ] Digital products support (file delivery, license keys)
- [ ] Product bundles & kits
- [ ] Tiered pricing (wholesale, VIP, volume)
- [ ] Dynamic pricing rules (time-based, stock-based)
- [ ] Product tags, collections, and custom attributes
- [ ] SEO fields (meta title, description, OG image, structured data)
- [ ] AI product description generator
- [ ] Product duplication & templates
- [ ] Barcode / SKU generator
- [ ] Multi-warehouse inventory tracking
- [ ] Low stock alerts & reorder points
- [ ] Inventory audit logs
- [ ] Draft / published / archived states

### 📦 Order Management
- [ ] Order listing with advanced filters
- [ ] Order timeline (status history with timestamps)
- [ ] Manual order creation
- [ ] Order editing (pre-fulfillment)
- [ ] Partial fulfillment & split shipments
- [ ] Return & refund workflows (full / partial)
- [ ] Automated order routing rules
- [ ] Bulk order actions (fulfill, cancel, export)
- [ ] Order notes (internal + customer-facing)
- [ ] Fraud score display (Stripe Radar / custom ML)
- [ ] Packing slips & shipping labels (PDF)
- [ ] Order export (CSV, API webhook)

### 👥 Customer Management
- [ ] Customer profiles with purchase history
- [ ] Customer segmentation (RFM, tags, custom rules)
- [ ] Address book management
- [ ] Customer notes & internal tags
- [ ] Customer groups (wholesale, VIP, etc.)
- [ ] Loyalty points management
- [ ] Customer communication history (email, SMS)
- [ ] GDPR/data export & deletion tools
- [ ] Customer import (CSV)

### 💰 Marketing & Promotions
- [ ] Discount engine (percentage, fixed, BOGO, free shipping)
- [ ] Coupon code generator (single / bulk)
- [ ] Automated campaigns (abandoned cart, win-back, birthday)
- [ ] Email marketing (native or Klaviyo/Mailchimp integration)
- [ ] SMS campaigns (Twilio integration)
- [ ] Push notification campaigns (web + mobile)
- [ ] Referral program builder
- [ ] Loyalty program configuration
- [ ] Affiliate management
- [ ] Flash sale scheduler
- [ ] Upsell / cross-sell rule builder
- [ ] Pop-up & banner builder
- [ ] Gift cards (generation, tracking, redemption)

### 💳 Payments & Payouts
- [ ] Payment gateway configuration (Stripe, Razorpay, PayPal, etc.)
- [ ] Multi-currency support with auto FX rates
- [ ] Payment method management
- [ ] Payout schedule configuration
- [ ] Transaction history & reconciliation
- [ ] Chargeback management

### 🚚 Shipping & Fulfillment
- [ ] Carrier integration (FedEx, UPS, DHL, USPS, Shiprocket)
- [ ] Real-time rate calculation
- [ ] Shipping zone builder
- [ ] Free shipping threshold rules
- [ ] Click-and-collect (in-store pickup)
- [ ] Dropshipping supplier integration
- [ ] Fulfillment center routing
- [ ] Packaging profiles

### 📈 Analytics & Reports
- [ ] Sales dashboard (revenue, AOV, units sold)
- [ ] Product performance reports
- [ ] Customer acquisition & LTV reports
- [ ] Conversion funnel visualization
- [ ] Inventory valuation reports
- [ ] Tax reports (GST, VAT ready)
- [ ] Custom report builder
- [ ] Scheduled report delivery (email)

### ⚙️ Store Settings
- [ ] Store profile (name, address, logo, timezone)
- [ ] Tax configuration (rules, exemptions, GST/VAT modes)
- [ ] Notification templates (email, SMS, push)
- [ ] Staff user management (roles, permissions, 2FA)
- [ ] API key management (webhooks, integrations)
- [ ] Storefront theme customizer
- [ ] Navigation & menu builder
- [ ] Custom pages (CMS)
- [ ] App marketplace (install/uninstall modules)

---

## Product 3: POS / In-Store Storefront

### 🖥️ Point of Sale Core
- [ ] Fast product search (barcode scan + keyword)
- [ ] Cart management (qty, discount, remove)
- [ ] Hold & retrieve transactions
- [ ] Multiple payment methods per transaction (split payment)
- [ ] Cash drawer integration
- [ ] Receipt printer integration (thermal, PDF, email)
- [ ] Customer lookup & profile attach to sale
- [ ] Staff login / cashier switching
- [ ] Shift management (open/close, cash count)
- [ ] End-of-day report (Z-report)
- [ ] Kitchen display / order routing (restaurant mode)

### 📴 Offline Mode
- [ ] Full functionality without internet (IndexedDB)
- [ ] Local product & inventory cache (synced on connect)
- [ ] Offline transaction queue
- [ ] Conflict resolution on reconnect (CRDT-based)
- [ ] Sync status indicator
- [ ] Offline receipt printing

### 🎨 In-Store Kiosk / Self-Checkout
- [ ] Customer-facing display mode
- [ ] QR code product lookup
- [ ] Self-checkout flow
- [ ] Digital signage mode (screensaver when idle)

### 🏪 Multi-Register
- [ ] Register management (name, hardware profile)
- [ ] Per-register float tracking
- [ ] Cross-register sales reports

---

## Product 4: eCommerce Storefront (Website)

### 🛒 Shopping Experience
- [ ] Blazing-fast product listing (ISR + streaming)
- [ ] Advanced filtering (faceted search)
- [ ] Product detail page with image gallery, 360 view, video
- [ ] Real-time stock indicator
- [ ] Guest checkout & account checkout
- [ ] Persistent cart (cross-device)
- [ ] Wishlist / save for later
- [ ] Product comparison tool
- [ ] Recently viewed products
- [ ] "Customers also bought" recommendations (ML)
- [ ] Predictive search with instant results
- [ ] QR code sharing per product

### 🎨 Theming & Customization
- [ ] Visual theme editor (colors, fonts, spacing)
- [ ] Section-based page builder (drag & drop)
- [ ] Mobile-first responsive layouts
- [ ] Dark mode support
- [ ] Custom CSS injection
- [ ] A/B testing support (split layouts)

### 🔍 SEO & Performance
- [ ] Automatic sitemap generation
- [ ] Structured data (JSON-LD for products, breadcrumbs)
- [ ] Canonical URL management
- [ ] Image optimization (WebP, AVIF, lazy load)
- [ ] Core Web Vitals optimized (LCP < 2.5s, CLS < 0.1)
- [ ] Edge caching per tenant

### 📱 Mobile App (Expo)
- [ ] Native iOS & Android (Expo Router)
- [ ] Biometric login (Face ID, fingerprint)
- [ ] Push notifications
- [ ] Deep linking (product, order, promo)
- [ ] Offline browse (cached catalog)
- [ ] Apple Pay / Google Pay
- [ ] Order tracking with map
- [ ] Loyalty card display
- [ ] Barcode scanner (product lookup)
- [ ] AR try-on (optional, ARKit/ARCore)

---

## Cross-Cutting Features

### 🤖 AI / Smart Features
- [ ] AI-powered product description generation (Claude API)
- [ ] Smart search (semantic + keyword hybrid)
- [ ] Personalized product recommendations
- [ ] Dynamic pricing suggestions
- [ ] Demand forecasting (inventory)
- [ ] Fraud detection scoring
- [ ] Customer sentiment analysis (reviews)
- [ ] Auto-tagging products from images
- [ ] Chatbot (customer support + product finder)
- [ ] Automated SEO meta generation

### 🔌 Integrations
- [ ] ERP (SAP, Odoo, Tally)
- [ ] Accounting (QuickBooks, Xero, Zoho Books)
- [ ] CRM (HubSpot, Salesforce)
- [ ] Marketing (Klaviyo, Mailchimp, Brevo)
- [ ] Analytics (Google Analytics 4, Meta Pixel)
- [ ] Review platforms (Judge.me, Yotpo, Okendo)
- [ ] Inventory (Linnworks, Cin7)
- [ ] Marketplace sync (Amazon, Flipkart, eBay)
- [ ] Social commerce (Instagram Shopping, TikTok Shop)
- [ ] Zapier / Make (no-code automation)

### 🌍 Internationalization
- [ ] Multi-language store (i18n/next-intl)
- [ ] Multi-currency display & checkout
- [ ] RTL layout support (Arabic, Hebrew)
- [ ] Regional tax rules (GST, VAT, HST)
- [ ] Locale-aware date/number formatting
- [ ] Translation management UI