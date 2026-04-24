# 🛍️ The Mrktplace — Stage 1 Documentation

This document outlines the database details, workflows, and backend API functionality completed during Stage 1 of development.

## 🗄️ Database Schema & Details

The database schema (`packages/schema/src/prisma/schema.prisma`) has been entirely redesigned to support a true multi-tenant POS application with complete tracking.

### Core Tables
1. **`tenants`**: The core business record. Holds `businessName`, `gstRegistered`, `currency`.
2. **`stores`**: Multiple stores belong to a tenant. Holds `storeType`, `receiptHeader`, `defaultTaxRate`.
3. **`licenses` & `license_installations`**: Governs what modules a tenant can access. Used by the Fastify middleware `license-guard`.

### Auth & Staff
1. **`users`**: Global login credentials. Stores `passwordHash`, `role` (`OWNER`, `MANAGER`, `CASHIER`), and verification flags.
2. **`active_sessions`**: Session management table mapped to JWTs and Refresh Tokens to easily revoke devices.
3. **`staff` & `staff_shifts`**: Tied to `users`. Holds `pinHash` for quick POS terminal logins, tracking `openingCash` and `closingCash` for shifts.

### Products & Inventory
1. **`products` & `product_variants`**: Handles size/color matrix. Each variant has a distinct `sku`, `price`, `costPrice`, and `barcode`.
2. **`inventory_levels`**: Maps `variantId` to `storeId` holding precise quantity records.
3. **`inventory_movements`**: An audit log for every single stock change. Reasons include `SALE`, `RETURN`, `MANUAL_ADJUSTMENT`, `PURCHASE_RECEIPT`.

### Sales & Customers
1. **`sales` & `sale_items`**: The invoice record. Calculates and stores absolute values for `subtotal`, `discountAmount`, `taxAmount`, and `grandTotal` to prevent historical data mutation if product prices change.
2. **`returns` & `return_items`**: Tied directly to original sales.
3. **`customers`**: Tied to `tenantId`. Tracks `totalSpend`, `loyaltyPoints`, and `storeCredit`.

---

## ⚙️ Backend Workflows Completed

### 1. Registration & Provisioning (`POST /api/v1/auth/register`)
- **Workflow**: 
  1. Checks if the `businessEmail` or `phoneNumber` already exist globally.
  2. Opens a PostgreSQL `$transaction`.
  3. Creates `Tenant`, `User` (Owner), `Store` (Default), and `License` (STARTER plan, POS_CORE active).
  4. Generates an Email Verification token (UUID) and SMS OTP (6-digits).
  5. Saves tokens to Redis with TTLs (24h and 10m respectively).
  6. Sends responses simulating Resend and MSG91 API calls.

### 2. POS Login & Security (`POST /api/v1/auth/login`)
- **Workflow**:
  1. Validates credentials.
  2. Increments Redis attempt counter (`login-attempts:email`). If > 5, locks account for 15 minutes.
  3. If MFA is active, issues an intermediate `mfaSessionToken`.
  4. Generates standard JWTs and records an `active_session` in the DB.

### 3. Inventory Management (`AdjustInventory` & `ReceivePO`)
- **Workflow**:
  1. Looks up `inventoryLevel` by `variantId` and `storeId`.
  2. Creates or increments/decrements quantity safely inside a `$transaction`.
  3. Forces the creation of an `inventory_movement` record indicating who made the change (`staffId`) and why (`reason`).
  4. Triggers BullMQ alerting if `updatedLevel.quantity <= product.lowStockAlert`.

### 4. Sale Completion & Held Carts (`CreateSale`)
- **Workflow**:
  1. Validates the `storeId` against `tenantId`.
  2. Deducts inventory from `inventory_levels` and writes `inventory_movements` (Reason: `SALE`).
  3. Calculates tax per-item based on the Product's `TaxRate` or Store's default.
  4. Evaluates and applies discounts.
  5. Creates the `sale` record and `sale_payments`.
  6. Calculates earned loyalty points and updates `Customer.loyaltyPoints` and `loyalty_point_log`.
  7. If a `heldCartId` was provided, the cart is purged from Redis upon successful checkout.

### 5. Offline Sync & Local Persistence
- **Workflow**:
  1. The POS Terminal uses `Dexie.js` (IndexedDB) to store orders locally if the connection is lost.
  2. When connectivity is restored, the system checks for `synced: false` records in the `orders` table.
  3. Unsynced orders are queued and pushed sequentially to the `/api/v1/sales` endpoint.
  4. Once acknowledged by the server, records are marked as `synced: true`.

---

## 🛠️ Functions Completed

The following core business logic functions have been successfully engineered under `apps/api/src/modules/`:

| Function | Module | Description |
|---|---|---|
| `registerTenant` | **Auth** | Full business provisioning & token generation |
| `loginUser` | **Auth** | Rate-limited JWT generation |
| `verifyEmail` / `verifyPhone` | **Auth** | Redis-backed OTP/Token verification |
| `resetPassword` | **Auth** | Token lookups and session invalidation |
| `pinLogin` | **Auth** | 4-6 digit quick login for POS cashiers |
| `createProduct` | **Product** | Creates variants, attributes, default inventory, and syncs to Meilisearch |
| `adjustInventory` | **Inventory**| Deducts/adds stock, records movement log, triggers Low Stock Alerts |
| `receivePurchaseOrder`| **Inventory**| Receives partial/full POs and auto-updates stock |
| `createSale` | **Sales** | Calculates taxes/discounts, creates invoice, updates customer loyalty |
| `processReturn` | **Sales** | Calculates refunds, returns items to stock, creates store credit if needed |
| `holdCart` / `getHeldCarts`| **Sales** | Redis-backed cart state storage per device (TTL: 24h) |
| `saveOrder` (Local) | **Offline** | Persists order to IndexedDB via Dexie |
| `getUnsyncedOrders` | **Offline** | Retrieves pending local orders for background sync |
| `useLicense` | **Auth** | Client-side hook to verify plan and active modules |

---

## 🎨 Frontend Design & UI

The dashboard and POS terminal have been built using a **luxury, refined aesthetic** as per the requirements.

### Design Tokens (packages/ui/src/styles/globals.css)
- **Typography**: `Inter` as the primary sans-serif font for maximum clarity and professionalism.
- **Theme**: Dark mode by default with deep obsidian backgrounds (`#0a0a0a`) and subtle gold/champagne accents for primary actions.
- **Icons**: `@hugeicons/react` for a modern, high-fidelity icon set.
- **Hierarchy**: 
  - Page Titles: `text-2xl font-semibold`
  - Section Headings: `text-lg font-medium`
  - Labels: `text-sm font-medium text-muted-foreground`

### Completed Frontend Modules
1. **Auth Screens**: Login, Registration, and Email Verification with Zod validation.
2. **Onboarding Wizard**: Business provisioning flow for new tenants.
3. **POS Terminal**: Modular header, category sidebar, product grid, and interactive cart.
4. **Inventory Management**: Data-rich product tables with stock status indicators.
5. **Sales & Returns History**: Detailed order tracking and status management.
6. **Customer CRM**: Management of profiles, loyalty points, and spending history.
7. **Staff Management**: Role-based access control and shift tracking UI.
8. **Business Intelligence**: Real-time summary cards and report category navigation.
9. **Settings Panel**: Centralized store configuration and security management.

---

## ✅ Stage 1 Complete

Stage 1 is now fully engineered from backend database schema to high-fidelity frontend UI, with 100% strict TypeScript compliance across all workspaces.

**Infrastructure Ready:**
- Full Monorepo Type Safety achieved.
- Docker Compose configurations provided for DB, Redis, and Typesense.
- Centralized environment variables (`.env.example`) and `DEPLOYMENT.md` guide established.
- Onboarding & Settings forms are synced with backend APIs.

**To proceed to Stage 2 (Real-time features & advanced analytics):**
1. Follow the `DEPLOYMENT.md` guide to spin up local infrastructure.
2. Connect the `TanStack Query` hooks to the active backend endpoints for any remaining modules.
