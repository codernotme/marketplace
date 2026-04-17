# 📊 FEATURE_GAP_ANALYSIS.md — Current State vs. Target Architecture

This document provides a comprehensive audit of the features outlined in the `docs/` directory against the current backend implementation (primarily the Prisma database schema). It identifies completed features, missing backend capabilities, and potential future enhancements required to achieve a production-ready, multi-tenant eCommerce platform.

---

## 1. ✅ Completed Backend Features

The following features have core backend support (database schema, models, relationships) established in `packages/db/prisma/schema.prisma`.

### Authentication & Authorization
- **User Roles & Identity**: Configured via `User` model and `UserRole` enum (`PLATFORM_ADMIN`, `TENANT_OWNER`, `TENANT_ADMIN`, `STAFF`, `CUSTOMER`).
- **Authentication**: `Account`, `Session`, and `Verification` models structure supporting Better Auth/NextAuth implementations.

### Multi-Tenancy & Access
- **Organization Structure**: `Organization` model to support multi-tenancy.
- **Access Control**: `Member` and `Invitation` models to securely manage tenant onboarding and staff access.

### Core Commerce (Catalog)
- **Product Hierarchy**: `Product` model with draft/active/archived status states, tags, SEO JSON metadata.
- **Product Variants**: `ProductVariant` model handling SKU, pricing, weights, and specific option combinations.
- **Categories**: `Category` model utilizing a self-referencing relationship (Parent/Child) to support infinite-depth category trees.

### Cart & Orders
- **Shopping Cart**: `Cart` and `CartItem` models supporting both authenticated users and guest sessions (`sessionId`).
- **Order Management**: `Order` and `OrderItem` models capturing checkout totals, tax, shipping costs, discounts, and customer/shipping addresses.

---

## 2. ❌ Missing Backend Features (The To-Do List)

The features below are referenced in the documentation (e.g., `01_Features.md`, `11_Project_life.md`, `08_Api.md`) but currently lack the required database schema, backend services, or specific logic to support them.

### Catalog & Inventory Management
- **Multi-Location Inventory**: Schema missing `Location` or `Warehouse` models, and `InventoryLevel` pivot tables mapping variants to locations.
- **Product Media/Images**: Need a dedicated `ProductMedia` or `FileAsset` table connected to R2 storage (currently just a `featuredImage` URL field).
- **Product Reviews & Ratings**: Missing tables to capture customer feedback, rating scores, and verification status.
- **Collections / Smart Collections**: Missing custom grouping models distinct from hierarchical categories.

### Order Fulfillment & Shipping
- **Fulfillment Tracking**: Needed tracking IDs, carrier definitions, and `Fulfillment` models to split an order into multiple shipments.
- **Returns & Refunds**: Missing standard Return Merchandise Authorization (RMA) entities and `Refund` tracking logs.
- **Shipping Rates & Zones**: Missing schema to calculate zone-based or weight-based shipping dynamically.

### Marketing, CRM & Pricing
- **Discounts & Promotions**: Missing a robust rule engine schema (`DiscountCode`, `PromotionRule`) for percentages, fixed amounts, or BOGO features.
- **Wishlist**: Missing `Wishlist` and `WishlistItem` models for users saving products for later.
- **Customer Segmentation**: No specific support for RFM segmentation, Loyalty Points, or Gift Cards.

### Point of Sale (POS) Specifics
- **Registers & Terminals**: Missing hardware mapping (`Register`, `Terminal` models) tied to physical locations.
- **Shift Management**: Needs `Shift`, `DrawerSession`, and `ZReport` models to reconcile daily cash float.

### System & Infrastructure
- **Webhooks & Subscriptions**: Missing `WebhookEndpoint` and `WebhookDelivery` log models for external integration.
- **Audit Logs**: No system-wide `AuditLog` table capturing "who did what, and when" for compliance (PCI DSS/GDPR).

---

## 3. 🚀 Future Enhancements (Roadmap)

To elevate the platform beyond a standard setup and push it toward Enterprise B2B/B2C capabilities, these future features should be evaluated:

### Backend / Architecture
- **B2B Wholesale Portals**: Introduce custom `PriceList` and `Company/B2BAccount` models overriding default variant pricing for specific corporate customers.
- **Subscription Orders**: Expand the order engine to support recurring billing schedules (e.g., "Subscribe & Save" for FMCG products).
- **Supplier & Purchase Orders**: Create a Procurement module (`Supplier`, `PurchaseOrder`) to handle restocking inventory directly from the dashboard.
- **AI-Powered Data Structures**: Add models for `SearchSynonyms` and `RecommendationFeedback` to assist the Claude API and Typesense engines continually improving search relevance.
- **Tax Provider Integration**: Dedicated tables tracking localized tax rules configured independently per region or dynamically via external APIs (Stripe Tax, Avalara).

### Frontend / UI Modules
- **Visual Page Builder**: Implementing a headless CMS module rendering JSON-based pages, similar to Shopify's Theme Editor (drag-and-drop sections).
- **Advanced POS Offline Conflict Resolution UI**: A dedicated interface for store managers to manually resolve edge-case sync conflicts if indexedDB pushes fail during network restoration.
- **Interactive Analytics Funnel**: Upgrade standard dashboards to support drag-to-filter cohort matrices using the ClickHouse backend setup.
