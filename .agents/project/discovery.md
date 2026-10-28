# Discovery: The Mrktplace

Summary: Omnichannel POS and SaaS platform for modern apparel and retail brands.

## Business Context
- Problem: Clothing businesses juggle separate systems for in-store POS, inventory, online sales, and customer data. Disconnected stock causes overselling and reconciliation errors.
- Target Customer: Boutique clothing stores, multi-outlet fashion retail chains, and direct-to-consumer apparel brands in India and emerging markets.
- Primary Currency: INR (₹) with Indian GST compliance (HSN codes, GSTR-1 export, SGST/CGST/IGST breakdown).

## Scope & Boundaries
- In Scope: Fast offline-resilient POS terminal, inventory matrix (size/color/SKU), barcode scanning, split billing, customer CRM, staff shifts, merchant analytics, multi-tenant SaaS licensing.
- Out of Scope for Wave 1-2: Native mobile apps (React Native/Flutter), automated garment manufacturing assembly ERP, non-retail warehousing.

## Value Proposition
- Single source of truth for inventory across counter sales and future web sales.
- Sub-200ms cashier billing speed with offline operation during connectivity loss.
- Flexible modular licensing allowing merchants to start small (₹999/mo) and scale up.

## Handoff Contract
- Decisions: Target apparel retail first (apparel matrix variants are the hardest retail challenge, solving it solves general retail).
- Open: Self-serve Razorpay payment gateway onboarding vs manual key entry (Default: Manual key entry in Stage 1-2, automated in Stage 4).
- Next agent needs: 4-tier plan model (Starter, Professional, Enterprise, Custom) and module list (POS_CORE, MULTISTORE, PROMO_PRO, CRM_PRO, STAFF_PRO, ECOM_STORE).

