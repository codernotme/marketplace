# 🔌 API_DESIGN.md — API Architecture & Contracts

## API Strategy

| API Type | Used By | Protocol | Auth |
|----------|---------|---------|------|
| **tRPC** | Admin apps (Next.js) | HTTP/2 + JSON | JWT |
| **GraphQL** | Storefront, Mobile | HTTP/WS | JWT |
| **REST** | External integrations, webhooks | HTTP | API Key |
| **WebSocket** | POS, Real-time dashboard | WS | JWT |

---

## 1. tRPC Router (Admin Apps)

```typescript
// services/api-gateway/routers/index.ts

export const appRouter = router({
  products: productRouter,
  orders:   orderRouter,
  customers: customerRouter,
  inventory: inventoryRouter,
  analytics: analyticsRouter,
  settings:  settingsRouter,
  tenants:   tenantsRouter,    // Master admin only
  billing:   billingRouter,
});

export type AppRouter = typeof appRouter;

// apps/tenant-admin/lib/trpc.ts
import { createTRPCNext } from '@trpc/next';
export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers: () => ({ 'x-tenant-id': getTenantId() }),
      }),
    ],
  }),
});
```

**Example tRPC router:**
```typescript
// services/api-gateway/routers/products.ts

export const productRouter = router({
  list: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      status: z.enum(['draft', 'active', 'archived']).optional(),
      categoryId: z.string().optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'price']).default('createdAt'),
      sortDir: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ ctx, input }) => {
      return productService.list(ctx.tenant.id, input);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await productService.findById(ctx.tenant.id, input.id);
      if (!product) throw new TRPCError({ code: 'NOT_FOUND' });
      return product;
    }),

  create: protectedProcedure
    .use(requirePermission('products:write'))
    .use(enforcePlanLimit('products'))
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      return productService.create(ctx.tenant.id, ctx.user.id, input);
    }),

  update: protectedProcedure
    .use(requirePermission('products:write'))
    .input(z.object({ id: z.string(), data: updateProductSchema }))
    .mutation(async ({ ctx, input }) => {
      return productService.update(ctx.tenant.id, input.id, input.data);
    }),

  bulkImport: protectedProcedure
    .use(requirePermission('products:write'))
    .input(z.object({ fileKey: z.string(), format: z.enum(['csv', 'shopify']) }))
    .mutation(async ({ ctx, input }) => {
      const jobId = await importQueue.add('import-products', {
        tenantId: ctx.tenant.id,
        ...input,
      });
      return { jobId };
    }),
});
```

---

## 2. GraphQL Schema (Storefront)

```graphql
# services/api-gateway/graphql/schema.graphql

type Query {
  # Products
  products(
    search: String
    categorySlug: String
    tags: [String!]
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    sortBy: ProductSortBy
    page: Int
    limit: Int
  ): ProductConnection!
  
  product(slug: String, id: ID): Product
  
  # Recommendations
  relatedProducts(productId: ID!, limit: Int): [Product!]!
  recommendedProducts(limit: Int): [Product!]!
  
  # Cart & Checkout
  cart: Cart
  checkoutSession(token: String!): CheckoutSession
  
  # Customer
  me: Customer
  myOrders(page: Int, limit: Int): OrderConnection!
  order(id: ID!): Order
}

type Mutation {
  # Cart
  cartAdd(variantId: ID!, quantity: Int!): Cart!
  cartUpdate(lineId: ID!, quantity: Int!): Cart!
  cartRemove(lineId: ID!): Cart!
  cartApplyCoupon(code: String!): Cart!
  
  # Checkout
  checkoutCreate(input: CheckoutInput!): CheckoutSession!
  checkoutComplete(token: String!, paymentIntentId: String!): Order!
  
  # Customer
  register(input: RegisterInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  logout: Boolean!
  updateProfile(input: UpdateProfileInput!): Customer!
  
  # Wishlist
  wishlistAdd(productId: ID!): Wishlist!
  wishlistRemove(productId: ID!): Wishlist!
}

type Subscription {
  orderStatusChanged(orderId: ID!): OrderStatusUpdate!
  inventoryUpdated(variantId: ID!): InventoryUpdate!
}

type Product {
  id: ID!
  name: String!
  slug: String!
  description: String
  descriptionHtml: String
  vendor: String
  tags: [String!]!
  status: ProductStatus!
  
  variants: [ProductVariant!]!
  defaultVariant: ProductVariant!
  
  media: [ProductMedia!]!
  featuredImage: ProductMedia
  
  relatedProducts: [Product!]!
  
  seo: ProductSEO!
  
  priceRange: PriceRange!
  
  category: Category
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ProductVariant {
  id: ID!
  sku: String!
  title: String!
  price: Money!
  compareAtPrice: Money
  optionValues: JSON!
  image: ProductMedia
  
  inventoryQuantity: Int!
  availableForSale: Boolean!
  
  weight: Float
  requiresShipping: Boolean!
}
```

---

## 3. REST API (External / Public)

```typescript
// Base URL: https://api.themrktplace.io/v1
// Auth: Bearer <api_key>
// Headers: x-tenant-id: <tenant_id>

// ============================================================
// PRODUCTS
// ============================================================

// GET /v1/products
// Query params: search, status, category_id, page, limit, sort, fields
// Response: { data: Product[], pagination: Pagination }

// POST /v1/products
// Body: CreateProductInput
// Response: Product

// GET /v1/products/:id
// Response: Product

// PATCH /v1/products/:id
// Body: Partial<CreateProductInput>
// Response: Product

// DELETE /v1/products/:id
// Response: 204

// POST /v1/products/bulk
// Body: { products: CreateProductInput[] }
// Response: { created: number, failed: BulkError[] }

// ============================================================
// ORDERS
// ============================================================

// GET /v1/orders
// Query: status, customer_id, from, to, page, limit
// Response: { data: Order[], pagination: Pagination }

// POST /v1/orders
// Body: CreateOrderInput  
// Response: Order

// GET /v1/orders/:id
// Response: Order

// POST /v1/orders/:id/fulfill
// Body: { items: { variant_id, quantity }[], tracking_number?, carrier? }
// Response: Fulfillment

// POST /v1/orders/:id/cancel
// Body: { reason: string }
// Response: Order

// POST /v1/orders/:id/refund
// Body: { amount: number, line_items?: RefundLineItem[], reason?: string }
// Response: Refund

// ============================================================
// INVENTORY
// ============================================================

// GET /v1/inventory
// Query: location_id, variant_id, low_stock (boolean)
// Response: { data: InventoryLevel[] }

// POST /v1/inventory/adjustments
// Body: { variant_id, location_id, quantity, reason }
// Response: InventoryTransaction

// ============================================================
// CUSTOMERS
// ============================================================

// GET /v1/customers
// Query: email, phone, segment, page, limit
// Response: { data: Customer[], pagination: Pagination }

// POST /v1/customers
// Body: CreateCustomerInput
// Response: Customer

// GET /v1/customers/:id/orders
// Response: { data: Order[] }
```

**Standardized Response Format:**
```typescript
// Success
{
  "data": { ... } | [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "requestId": "req_01J3X...",
    "processingTime": 42
  }
}

// Error
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with id 'xyz' not found",
    "field": null,                    // Field-level errors
    "details": { ... }               // Additional context
  },
  "meta": { "requestId": "req_01J3X..." }
}
```

---

## 4. WebSocket Events (Real-Time)

```typescript
// Client connection
const ws = new WebSocket(`wss://api.themrktplace.io/ws?token=${jwt}`);

// Client → Server: Subscribe to channels
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['orders', 'inventory', 'notifications']
}));

// Server → Client event types:

// New order notification
{
  "type": "order.created",
  "data": {
    "orderId": "ord_01J3X...",
    "orderNumber": "#10042",
    "total": 2499,
    "customer": { "name": "Priya Sharma" },
    "itemCount": 3
  },
  "timestamp": "2025-01-15T10:30:00Z"
}

// Inventory update (POS sync)
{
  "type": "inventory.updated",
  "data": {
    "variantId": "var_01J3X...",
    "locationId": "loc_01J3X...",
    "available": 23,
    "committed": 5
  },
  "timestamp": "2025-01-15T10:30:05Z"
}

// Payment received
{
  "type": "payment.received",
  "data": {
    "orderId": "ord_01J3X...",
    "amount": 2499,
    "method": "upi",
    "gateway": "razorpay"
  }
}
```

---

## 5. Webhook System (Outbound)

```typescript
// Tenant-configured webhooks dispatched on events

// Webhook payload format:
{
  "id": "wh_01J3X...",             // Unique delivery ID
  "tenantId": "tenant_01J3X...",
  "event": "order.created",
  "apiVersion": "2025-01",
  "createdAt": "2025-01-15T10:30:00Z",
  "data": { ... },                  // Full event payload
  "signature": "sha256=abc123..."   // HMAC-SHA256 of body
}

// Retry logic: Exponential backoff
// Attempt 1: immediate
// Attempt 2: 5 min
// Attempt 3: 30 min
// Attempt 4: 2 hours
// Attempt 5: 8 hours
// → After 5 failures: disable + notify tenant

// Events available for webhooks:
const WEBHOOK_EVENTS = [
  'order.created', 'order.updated', 'order.cancelled', 'order.fulfilled',
  'order.refunded',
  'product.created', 'product.updated', 'product.deleted',
  'customer.created', 'customer.updated',
  'inventory.low_stock', 'inventory.out_of_stock',
  'payment.received', 'payment.failed',
  'subscription.activated', 'subscription.cancelled',
] as const;
```

---

## 6. API Versioning Strategy

```
URL versioning: /api/v1/..., /api/v2/...

Version lifecycle:
  v1: Supported (current stable)
  v2: Beta (new features)

Breaking changes require new version.
Non-breaking changes added to current version.

Sunset policy:
  - 6 months notice before version deprecation
  - Sunset-Date header in responses from deprecated versions
  - Email notification to API key owners
```

---

## 7. OpenAPI Specification

```yaml
# services/api-gateway/openapi.yaml
openapi: "3.1.0"
info:
  title: themrktplace API
  version: "2025-01"
  description: |
    themrktplace eCommerce Platform API.
    Authentication: Bearer token (JWT) or API Key.
  contact:
    email: api@themrktplace.io
    url: https://docs.themrktplace.io

servers:
  - url: https://api.themrktplace.io/v1
    description: Production
  - url: https://api.staging.themrktplace.io/v1
    description: Staging
  - url: http://localhost:4000/v1
    description: Local development

security:
  - bearerAuth: []
  - apiKeyAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    apiKeyAuth:
      type: apiKey
      in: header
      name: Authorization
      description: "Format: ApiKey nc_live_..."
```