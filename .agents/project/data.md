# Data: The Mrktplace

Summary: PostgreSQL Prisma schema, indexing strategy, tenant isolation, and offline Dexie schema.

## Core Data Entities
| Entity | Model Name | Primary Key | Relations / Scope |
| --- | --- | --- | --- |
| Tenant | `Tenant` | CUID | Root entity. Scopes stores, users, products, sales, licenses. |
| Store | `Store` | CUID | Belongs to Tenant. Scopes inventory, shifts, sales, staff. |
| License | `License` | CUID | Belongs to Tenant. Defines planCode and modules[]. |
| User | `User` | CUID | Belongs to Tenant. Role: OWNER, MANAGER, CASHIER. |
| Staff | `Staff` | CUID | 1:1 with User, bound to Store. Holds pinHash and commissionRate. |
| Product | `Product` | CUID | Belongs to Tenant. Has category, taxRate, hsnCode, attributes. |
| Variant | `ProductVariant` | CUID | Belongs to Product. Has unique SKU, barcode, price, cost. |
| Inventory | `InventoryLevel` | CUID | Unique per variantId + storeId. Holds physical quantity. |
| Movement | `InventoryMovement` | CUID | Append-only audit log for stock changes. |
| Sale | `Sale` | CUID | Invoice record. Holds subtotal, discounts, taxes, grandTotal. |
| Payment | `SalePayment` | CUID | Split tender records (CASH, CARD, UPI, STORE_CREDIT, LOYALTY). |
| Customer | `Customer` | CUID | Scoped to Tenant by phone/email. Holds totalSpend, loyalty, credit. |

## Tenant Isolation Rules
- Every business query must include `where: { tenantId }`.
- Composite uniqueness enforced: `@@unique([tenantId, email])`, `@@unique([tenantId, phone])`.
- Financial values must use `Decimal(12, 2)`. Floating point for currency is prohibited.

## Offline Dexie.js Schema
```typescript
db.version(1).stores({
  products: 'id, sku, barcode, name, categoryId, price',
  customers: 'id, phone, name, loyaltyPoints, storeCredit',
  pendingSales: '++localId, invoiceNumber, createdAt, synced',
  activeShift: 'id, staffId, storeId, openedAt',
  cachedLicense: 'tenantId, planCode, expiresAt'
});
```

## Handoff Contract
- Decisions: Use append-only `inventory_movements` for every stock mutation. Physical quantity is never directly overwritten without an audit row.
- Open: Soft delete vs hard delete for product catalog (Default: `isActive: false` soft delete).
- Next agent needs: Source of truth schema file is `packages/schema/src/prisma/schema.prisma`.

