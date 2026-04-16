# 🗄️ DATABASE_SCHEMA.md — Multi-Tenant Database Design

## Design Principles

1. **Schema-per-tenant** in shared PostgreSQL cluster
2. **Row Level Security (RLS)** as secondary defense
3. **ULID** primary keys (sortable, URL-safe, no hotspot)
4. **Soft deletes** via `deleted_at` on critical tables
5. **Audit timestamps** (`created_at`, `updated_at`) everywhere
6. **JSONB** for extensible attributes without schema migrations
7. **Optimistic concurrency** via `version` column

---

## Master Schema (themrktplace_master)

```sql
-- ============================================================
-- TENANTS
-- ============================================================
CREATE TABLE tenants (
  id            TEXT PRIMARY KEY,           -- ULID
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('pending', 'active', 'suspended', 'deleted')),
  plan_id       TEXT NOT NULL REFERENCES plans(id),
  db_schema     TEXT NOT NULL,              -- e.g. "tenant_01J3X..."
  custom_domain TEXT UNIQUE,
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_tenants_slug ON tenants(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenants_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;

-- ============================================================
-- PLANS & BILLING
-- ============================================================
CREATE TABLE plans (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,            -- Starter, Growth, Pro, Enterprise
  stripe_price_id TEXT,
  price_monthly   NUMERIC(10,2),
  price_yearly    NUMERIC(10,2),
  features        JSONB NOT NULL DEFAULT '{}',
  limits          JSONB NOT NULL DEFAULT '{}',  -- {products: 500, staff: 5, ...}
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id                  TEXT PRIMARY KEY,
  tenant_id           TEXT NOT NULL REFERENCES tenants(id),
  plan_id             TEXT NOT NULL REFERENCES plans(id),
  stripe_sub_id       TEXT UNIQUE,
  status              TEXT NOT NULL,         -- active, trialing, past_due, canceled
  trial_ends_at       TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end  TIMESTAMPTZ NOT NULL,
  canceled_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PLATFORM AUDIT LOG (immutable)
-- ============================================================
CREATE TABLE platform_audit_log (
  id          TEXT PRIMARY KEY,
  actor_id    TEXT NOT NULL,
  actor_type  TEXT NOT NULL,               -- 'admin' | 'tenant' | 'system'
  tenant_id   TEXT REFERENCES tenants(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Monthly partitions for audit log
CREATE TABLE platform_audit_log_2025_01 PARTITION OF platform_audit_log
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## Tenant Schema (tenant_{id})

```sql
-- ============================================================
-- USERS / STAFF
-- ============================================================
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  password_hash TEXT,                       -- NULL if OAuth only
  role          TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('owner', 'admin', 'manager', 'staff', 'cashier', 'analyst')),
  permissions   JSONB NOT NULL DEFAULT '{}',
  mfa_enabled   BOOLEAN DEFAULT false,
  mfa_secret    TEXT,
  last_login_at TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

CREATE TABLE user_sessions (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id),
  refresh_token  TEXT UNIQUE NOT NULL,
  device_info    JSONB,
  ip_address     INET,
  expires_at     TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  parent_id   TEXT REFERENCES categories(id),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  position    INT NOT NULL DEFAULT 0,
  metadata    JSONB NOT NULL DEFAULT '{}',  -- SEO, attributes, etc.
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

-- Closure table for category tree traversal O(1)
CREATE TABLE category_ancestors (
  ancestor_id   TEXT NOT NULL REFERENCES categories(id),
  descendant_id TEXT NOT NULL REFERENCES categories(id),
  depth         INT NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id)
);

-- ============================================================
-- PRODUCTS & VARIANTS
-- ============================================================
CREATE TABLE products (
  id              TEXT PRIMARY KEY,
  category_id     TEXT REFERENCES categories(id),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  description_html TEXT,
  short_description TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'active', 'archived')),
  product_type    TEXT NOT NULL DEFAULT 'physical'
                  CHECK (product_type IN ('physical', 'digital', 'service', 'bundle')),
  vendor          TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  attributes      JSONB NOT NULL DEFAULT '{}',  -- custom fields
  seo             JSONB NOT NULL DEFAULT '{}',  -- {title, description, og_image}
  options         JSONB NOT NULL DEFAULT '[]',  -- [{name: "Size", values: ["S","M","L"]}]
  version         INT NOT NULL DEFAULT 1,
  published_at    TIMESTAMPTZ,
  created_by      TEXT REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE product_variants (
  id            TEXT PRIMARY KEY,
  product_id    TEXT NOT NULL REFERENCES products(id),
  sku           TEXT UNIQUE NOT NULL,
  barcode       TEXT,
  title         TEXT NOT NULL,             -- e.g. "Red / L"
  option_values JSONB NOT NULL DEFAULT '{}', -- {color: "Red", size: "L"}
  price         NUMERIC(12,4) NOT NULL,
  compare_price NUMERIC(12,4),
  cost          NUMERIC(12,4),
  weight        NUMERIC(8,3),
  weight_unit   TEXT DEFAULT 'kg',
  requires_shipping BOOLEAN DEFAULT true,
  is_taxable    BOOLEAN DEFAULT true,
  image_id      TEXT,
  position      INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_media (
  id          TEXT PRIMARY KEY,
  product_id  TEXT NOT NULL REFERENCES products(id),
  variant_id  TEXT REFERENCES product_variants(id),
  url         TEXT NOT NULL,
  cdn_url     TEXT,
  alt         TEXT,
  type        TEXT DEFAULT 'image',        -- image | video | 3d_model
  width       INT,
  height      INT,
  position    INT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INVENTORY
-- ============================================================
CREATE TABLE inventory (
  id            TEXT PRIMARY KEY,
  variant_id    TEXT NOT NULL REFERENCES product_variants(id),
  location_id   TEXT NOT NULL REFERENCES locations(id),
  available     INT NOT NULL DEFAULT 0,    -- Available for sale
  committed     INT NOT NULL DEFAULT 0,    -- Reserved (in open orders)
  incoming      INT NOT NULL DEFAULT 0,    -- Expected PO quantity
  on_hand       INT GENERATED ALWAYS AS (available + committed) STORED,
  reorder_point INT NOT NULL DEFAULT 5,
  reorder_qty   INT NOT NULL DEFAULT 50,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (variant_id, location_id),
  CHECK (available >= 0),
  CHECK (committed >= 0)
);

CREATE TABLE inventory_transactions (
  id            TEXT PRIMARY KEY,
  variant_id    TEXT NOT NULL REFERENCES product_variants(id),
  location_id   TEXT NOT NULL REFERENCES locations(id),
  type          TEXT NOT NULL,             -- sale, return, adjustment, receive, transfer
  qty           INT NOT NULL,
  before_qty    INT NOT NULL,
  after_qty     INT NOT NULL,
  reason        TEXT,
  reference_id  TEXT,                      -- order_id, po_id, etc.
  reference_type TEXT,
  created_by    TEXT REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,              -- "Main Warehouse", "Downtown POS"
  type        TEXT NOT NULL,             -- warehouse | store | virtual
  address     JSONB,
  is_active   BOOLEAN DEFAULT true,
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id             TEXT PRIMARY KEY,
  email          TEXT UNIQUE,
  phone          TEXT,
  first_name     TEXT,
  last_name      TEXT,
  avatar_url     TEXT,
  birth_date     DATE,
  gender         TEXT,
  tax_id         TEXT,                    -- GST/VAT number
  accepts_marketing BOOLEAN DEFAULT false,
  total_orders   INT NOT NULL DEFAULT 0,
  total_spent    NUMERIC(14,4) NOT NULL DEFAULT 0,
  loyalty_points INT NOT NULL DEFAULT 0,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  notes          TEXT,
  metadata       JSONB NOT NULL DEFAULT '{}',
  rfm_segment    TEXT,
  rfm_score      TEXT,
  acquisition_source TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);

CREATE TABLE customer_addresses (
  id          TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  first_name  TEXT,
  last_name   TEXT,
  company     TEXT,
  address1    TEXT NOT NULL,
  address2    TEXT,
  city        TEXT NOT NULL,
  state       TEXT,
  zip         TEXT,
  country     TEXT NOT NULL DEFAULT 'IN',
  phone       TEXT,
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id              TEXT PRIMARY KEY,
  order_number    TEXT UNIQUE NOT NULL,    -- Human-readable: #10001
  customer_id     TEXT REFERENCES customers(id),
  email           TEXT NOT NULL,
  phone           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('draft','pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_status  TEXT NOT NULL DEFAULT 'pending'
                  CHECK (payment_status IN ('pending','paid','partially_paid','refunded','voided')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled'
                  CHECK (fulfillment_status IN ('unfulfilled','partial','fulfilled','restocked')),
  source          TEXT NOT NULL DEFAULT 'web'  -- web | pos | mobile | api
                  CHECK (source IN ('web', 'pos', 'mobile', 'api', 'manual')),
  currency        TEXT NOT NULL DEFAULT 'INR',
  subtotal        NUMERIC(14,4) NOT NULL,
  discount_amount NUMERIC(14,4) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(14,4) NOT NULL DEFAULT 0,
  tax_amount      NUMERIC(14,4) NOT NULL DEFAULT 0,
  total           NUMERIC(14,4) NOT NULL,
  total_weight    NUMERIC(8,3),
  shipping_address JSONB,
  billing_address  JSONB,
  notes           TEXT,
  internal_notes  TEXT,
  tags            TEXT[] DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  fraud_score     NUMERIC(3,2),
  ip_address      INET,
  user_agent      TEXT,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  created_by      TEXT REFERENCES users(id),  -- NULL for customer self-checkout
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status, payment_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE TABLE order_items (
  id            TEXT PRIMARY KEY,
  order_id      TEXT NOT NULL,             -- FK to partitioned table
  product_id    TEXT NOT NULL,
  variant_id    TEXT NOT NULL,
  sku           TEXT NOT NULL,
  title         TEXT NOT NULL,
  variant_title TEXT,
  quantity      INT NOT NULL,
  unit_price    NUMERIC(12,4) NOT NULL,
  discount_amount NUMERIC(12,4) NOT NULL DEFAULT 0,
  tax_amount    NUMERIC(12,4) NOT NULL DEFAULT 0,
  total         NUMERIC(12,4) NOT NULL,
  fulfillable_qty INT,
  fulfilled_qty INT NOT NULL DEFAULT 0,
  returned_qty  INT NOT NULL DEFAULT 0,
  requires_shipping BOOLEAN DEFAULT true,
  product_snapshot JSONB NOT NULL,         -- frozen product data at time of order
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PAYMENTS & TRANSACTIONS
-- ============================================================
CREATE TABLE payment_transactions (
  id              TEXT PRIMARY KEY,
  order_id        TEXT NOT NULL,
  gateway         TEXT NOT NULL,           -- stripe | razorpay | paypal
  gateway_txn_id  TEXT UNIQUE,
  type            TEXT NOT NULL,           -- sale | refund | void | capture | authorize
  status          TEXT NOT NULL,           -- pending | success | failed
  amount          NUMERIC(14,4) NOT NULL,
  currency        TEXT NOT NULL,
  gateway_response JSONB,
  error_code      TEXT,
  error_message   TEXT,
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DISCOUNTS & PROMOTIONS
-- ============================================================
CREATE TABLE discounts (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL,           -- percentage | fixed | free_shipping | bogo
  scope           TEXT NOT NULL,           -- order | product | shipping
  code            TEXT UNIQUE,             -- NULL for automatic
  value           NUMERIC(10,4),
  min_order_amount NUMERIC(12,4),
  min_qty         INT,
  max_uses        INT,
  uses_count      INT NOT NULL DEFAULT 0,
  max_uses_per_customer INT DEFAULT 1,
  applies_to      JSONB NOT NULL DEFAULT '{}',  -- {products: [], collections: [], customers: []}
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at         TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SHIPPING
-- ============================================================
CREATE TABLE shipping_zones (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  countries   TEXT[] NOT NULL DEFAULT '{}',
  states      TEXT[] NOT NULL DEFAULT '{}',
  zip_patterns TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shipping_rates (
  id            TEXT PRIMARY KEY,
  zone_id       TEXT NOT NULL REFERENCES shipping_zones(id),
  name          TEXT NOT NULL,
  carrier       TEXT,
  method        TEXT,
  type          TEXT NOT NULL,             -- flat | weight | price | calculated
  price         NUMERIC(10,4),
  min_weight    NUMERIC(8,3),
  max_weight    NUMERIC(8,3),
  min_order_amount NUMERIC(12,4),
  max_order_amount NUMERIC(12,4),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ANALYTICS EVENTS (fast write, batch to ClickHouse)
-- ============================================================
CREATE TABLE analytics_events (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL,
  customer_id TEXT,
  event_type  TEXT NOT NULL,              -- page_view | add_to_cart | purchase | etc.
  payload     JSONB NOT NULL DEFAULT '{}',
  page_url    TEXT,
  referrer    TEXT,
  device_type TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);
-- Partitioned monthly, old partitions migrated to ClickHouse weekly
```

---

## Drizzle ORM Schema (TypeScript)

```typescript
// packages/db/schema/products.ts
import { pgTable, pgSchema, text, numeric, boolean, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id:          text('id').primaryKey().$defaultFn(() => ulid()),
  categoryId:  text('category_id').references(() => categories.id),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  status:      text('status', { enum: ['draft', 'active', 'archived'] }).notNull().default('draft'),
  productType: text('product_type', { enum: ['physical', 'digital', 'service', 'bundle'] }).notNull().default('physical'),
  tags:        text('tags').array().notNull().default([]),
  seo:         jsonb('seo').notNull().$type<ProductSEO>().default({}),
  options:     jsonb('options').notNull().$type<ProductOption[]>().default([]),
  version:     integer('version').notNull().default(1),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at', { withTimezone: true }),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

---

## Database Indexes Strategy

```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_products_status_pub 
  ON products(status, published_at DESC) 
  WHERE deleted_at IS NULL AND status = 'active';

CREATE INDEX CONCURRENTLY idx_variants_product 
  ON product_variants(product_id) 
  WHERE is_active = true;

CREATE INDEX CONCURRENTLY idx_inventory_low_stock 
  ON inventory(variant_id, location_id, available) 
  WHERE available <= reorder_point;

CREATE INDEX CONCURRENTLY idx_orders_date_status 
  ON orders(created_at DESC, status, payment_status);

CREATE INDEX CONCURRENTLY idx_customers_email_lower 
  ON customers(lower(email));

-- Full-text search (fallback to Typesense outage)
CREATE INDEX idx_products_fts 
  ON products USING gin(
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))
  );
```

---

## Migration Strategy

```
packages/db/
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_analytics_events.sql
│   └── 0003_add_rfm_columns.sql
├── schema/
│   ├── master/   ← master schema tables
│   └── tenant/   ← tenant schema tables (applied to each)
└── seed/
    ├── plans.ts
    ├── categories.ts
    └── demo-tenant.ts
```

**Zero-downtime migration approach:**
1. Expand: Add new nullable columns / tables
2. Migrate: Backfill data (batched, rate-limited)
3. Switch: Deploy code that uses new schema
4. Contract: Drop old columns after deployment