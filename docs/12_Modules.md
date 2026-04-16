# 🧩 MODULES.md — Plugin & Module System

## Philosophy

Every themrktplace feature is a **module** — a self-contained unit of functionality that can be:
- Enabled/disabled per tenant
- Configured independently
- Developed and shipped independently
- Monetized as a separate add-on

---

## 1. Module Architecture

```
Module = {
  manifest   (metadata, dependencies, config schema)
  backend    (API routes, services, DB migrations)
  frontend   (UI components, navigation entries)
  hooks      (lifecycle hooks into core events)
}
```

```typescript
// packages/types/module.ts

export interface themrktplaceModule {
  /** Unique module identifier */
  id: string;

  /** Display information */
  meta: {
    name: string;
    description: string;
    version: string;
    author: string;
    icon: string;          // Lucide icon name or URL
    category: ModuleCategory;
    tags: string[];
    screenshots?: string[];
    docsUrl?: string;
  };

  /** Plans that include this module */
  plans: ('starter' | 'growth' | 'pro' | 'enterprise')[];

  /** Additional billing (if add-on) */
  pricing?: {
    monthly: number;
    yearly: number;
    currency: string;
  };

  /** Module dependencies (other module IDs) */
  dependencies?: string[];

  /** Config schema (rendered as settings form) */
  configSchema: z.ZodObject<any>;

  /** Default config values */
  defaultConfig: Record<string, unknown>;

  /** Module lifecycle hooks */
  hooks?: ModuleHooks;

  /** API routes added by this module */
  routes?: ModuleRoute[];

  /** Navigation entries in admin sidebar */
  navigation?: NavigationEntry[];

  /** DB migrations for this module */
  migrations?: string[];   // File paths

  /** Permissions introduced by this module */
  permissions?: string[];
}

export interface ModuleHooks {
  onInstall?: (tenantId: string, config: unknown) => Promise<void>;
  onUninstall?: (tenantId: string) => Promise<void>;
  onConfigChange?: (tenantId: string, oldConfig: unknown, newConfig: unknown) => Promise<void>;
  onOrderCreated?: (tenantId: string, order: Order) => Promise<void>;
  onOrderFulfilled?: (tenantId: string, order: Order) => Promise<void>;
  onProductCreated?: (tenantId: string, product: Product) => Promise<void>;
  onCustomerRegistered?: (tenantId: string, customer: Customer) => Promise<void>;
  onPaymentReceived?: (tenantId: string, payment: PaymentTransaction) => Promise<void>;
}
```

---

## 2. Core Modules (Always Included)

| Module ID | Name | Description |
|-----------|------|-------------|
| `core-products` | Products | Product & variant management |
| `core-orders` | Orders | Order lifecycle management |
| `core-customers` | Customers | Customer profiles & addresses |
| `core-inventory` | Inventory | Stock tracking |
| `core-payments` | Payments | Payment gateway integration |
| `core-shipping` | Shipping | Shipping zones & rates |
| `core-settings` | Settings | Store configuration |
| `core-auth` | Auth | Staff users & permissions |
| `core-storefront` | Storefront | Public ecom website |

---

## 3. Feature Modules (Plan-gated or Add-ons)

### 📊 Analytics Module
```typescript
// modules/analytics/manifest.ts

export const analyticsModule: themrktplaceModule = {
  id: 'analytics',
  meta: {
    name: 'Advanced Analytics',
    description: 'Deep insights into your store performance with ClickHouse-powered reports',
    version: '1.0.0',
    author: 'themrktplace',
    icon: 'BarChart3',
    category: 'analytics',
    tags: ['reports', 'data', 'insights'],
  },
  plans: ['growth', 'pro', 'enterprise'],
  configSchema: z.object({
    retentionDays: z.number().int().min(30).max(730).default(365),
    enableRealtime: z.boolean().default(true),
    reportSchedule: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
    reportEmails: z.array(z.string().email()).default([]),
  }),
  defaultConfig: {
    retentionDays: 365,
    enableRealtime: true,
    reportSchedule: 'weekly',
    reportEmails: [],
  },
  navigation: [
    {
      label: 'Analytics',
      icon: 'BarChart3',
      href: '/analytics',
      badge: 'New',
      children: [
        { label: 'Overview', href: '/analytics/overview' },
        { label: 'Sales', href: '/analytics/sales' },
        { label: 'Products', href: '/analytics/products' },
        { label: 'Customers', href: '/analytics/customers' },
        { label: 'Reports', href: '/analytics/reports' },
      ]
    }
  ],
  permissions: ['analytics:read', 'analytics:export'],
};
```

### 💌 Email Marketing Module
```typescript
export const emailMarketingModule: themrktplaceModule = {
  id: 'email-marketing',
  meta: {
    name: 'Email Marketing',
    description: 'Send campaigns and automations directly from your store',
    icon: 'Mail',
    category: 'marketing',
    tags: ['email', 'campaigns', 'automation'],
  },
  plans: ['growth', 'pro', 'enterprise'],
  configSchema: z.object({
    provider: z.enum(['native', 'klaviyo', 'mailchimp', 'brevo']).default('native'),
    apiKey: z.string().optional(),
    listId: z.string().optional(),
    fromName: z.string().default(''),
    fromEmail: z.string().email().optional(),
  }),
  hooks: {
    onCustomerRegistered: async (tenantId, customer) => {
      if (customer.acceptsMarketing) {
        await emailMarketingService.addToWelcomeSeries(tenantId, customer);
      }
    },
    onOrderFulfilled: async (tenantId, order) => {
      await emailMarketingService.triggerPostPurchaseFlow(tenantId, order);
    },
  },
};
```

### 🤖 AI Features Module
```typescript
export const aiModule: themrktplaceModule = {
  id: 'ai-features',
  meta: {
    name: 'AI Assistant',
    description: 'AI-powered product descriptions, smart search, and recommendations',
    icon: 'Sparkles',
    category: 'productivity',
    tags: ['ai', 'ml', 'recommendations', 'search'],
  },
  plans: ['pro', 'enterprise'],
  pricing: { monthly: 29, yearly: 290, currency: 'USD' }, // Add-on
  configSchema: z.object({
    enableDescriptionGeneration: z.boolean().default(true),
    enableSemanticSearch: z.boolean().default(true),
    enableRecommendations: z.boolean().default(true),
    enableChatbot: z.boolean().default(false),
    language: z.string().default('en'),
    tone: z.enum(['professional', 'friendly', 'luxury', 'minimal']).default('professional'),
  }),
  hooks: {
    onProductCreated: async (tenantId, product) => {
      const config = await getModuleConfig(tenantId, 'ai-features');
      if (config.enableSemanticSearch) {
        await aiService.generateEmbedding(tenantId, product);
      }
    },
  },
};
```

### 🏷️ Loyalty Program Module
```typescript
export const loyaltyModule: themrktplaceModule = {
  id: 'loyalty',
  meta: {
    name: 'Loyalty Program',
    description: 'Reward customers with points, tiers, and exclusive perks',
    icon: 'Star',
    category: 'marketing',
  },
  plans: ['growth', 'pro', 'enterprise'],
  configSchema: z.object({
    pointsPerRupee: z.number().min(0.01).max(100).default(1),
    redemptionRate: z.number().min(0.01).default(0.01), // 1 point = ₹0.01
    tiers: z.array(z.object({
      name: z.string(),
      minPoints: z.number().int(),
      multiplier: z.number(),
      color: z.string(),
    })).default([
      { name: 'Silver', minPoints: 0, multiplier: 1, color: '#94a3b8' },
      { name: 'Gold', minPoints: 5000, multiplier: 1.5, color: '#f59e0b' },
      { name: 'Platinum', minPoints: 20000, multiplier: 2, color: '#8b5cf6' },
    ]),
    expiryDays: z.number().int().optional(),
  }),
  hooks: {
    onOrderCreated: async (tenantId, order) => {
      if (order.customer) {
        await loyaltyService.awardPoints(tenantId, order);
      }
    },
    onOrderFulfilled: async (tenantId, order) => {
      // Confirm points on fulfillment (prevent fraud)
      await loyaltyService.confirmPoints(tenantId, order.id);
    },
  },
};
```

---

## 4. Third-Party Integration Modules

```typescript
// Example: Razorpay Payment Gateway

export const razorpayModule: themrktplaceModule = {
  id: 'razorpay',
  meta: {
    name: 'Razorpay',
    description: 'Accept UPI, Net Banking, Cards, Wallets, and EMI via Razorpay',
    icon: 'https://cdn.themrktplace.io/integrations/razorpay.svg',
    category: 'payments',
  },
  plans: ['starter', 'growth', 'pro', 'enterprise'],
  configSchema: z.object({
    keyId: z.string().startsWith('rzp_').min(10),
    keySecret: z.string().min(10),
    mode: z.enum(['test', 'live']).default('test'),
    enableUPI: z.boolean().default(true),
    enableEMI: z.boolean().default(false),
    webhookSecret: z.string().optional(),
  }),
  hooks: {
    onInstall: async (tenantId, config) => {
      await razorpayService.validateCredentials(config);
      await razorpayService.registerWebhook(tenantId, config);
    },
    onUninstall: async (tenantId) => {
      await razorpayService.deregisterWebhook(tenantId);
    },
  },
  routes: [
    { method: 'POST', path: '/webhooks/razorpay', handler: 'razorpayWebhookHandler' },
  ],
};
```

---

## 5. Module Registry & App Marketplace

```typescript
// Registry of all available modules
// services/api-gateway/modules/registry.ts

class ModuleRegistry {
  private modules = new Map<string, themrktplaceModule>();

  register(module: themrktplaceModule) {
    this.validateModule(module);
    this.modules.set(module.id, module);
  }

  getAll(): themrktplaceModule[] {
    return Array.from(this.modules.values());
  }

  getByCategory(category: ModuleCategory): themrktplaceModule[] {
    return this.getAll().filter(m => m.meta.category === category);
  }

  async install(tenantId: string, moduleId: string, config: unknown): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) throw new Error(`Module '${moduleId}' not found`);

    // Validate config
    const validatedConfig = module.configSchema.parse(config);

    // Check dependencies
    for (const depId of module.dependencies ?? []) {
      const isInstalled = await this.isInstalled(tenantId, depId);
      if (!isInstalled) throw new Error(`Dependency '${depId}' must be installed first`);
    }

    // Run DB migrations for module
    await this.runModuleMigrations(tenantId, module);

    // Call install hook
    await module.hooks?.onInstall?.(tenantId, validatedConfig);

    // Save installation record
    await db.insert(moduleInstallations).values({
      tenantId,
      moduleId,
      version: module.meta.version,
      config: validatedConfig,
      installedAt: new Date(),
    });

    // Enable module features
    await featureFlags.enable(tenantId, moduleId);
  }

  async uninstall(tenantId: string, moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) return;

    // Check no other installed module depends on this
    const dependents = await this.getDependents(tenantId, moduleId);
    if (dependents.length > 0) {
      throw new Error(`Cannot uninstall: ${dependents.join(', ')} depend on this module`);
    }

    await module.hooks?.onUninstall?.(tenantId);
    await featureFlags.disable(tenantId, moduleId);
    await db.delete(moduleInstallations)
      .where(and(eq(moduleInstallations.tenantId, tenantId), eq(moduleInstallations.moduleId, moduleId)));
  }
}

// Bootstrap: Register all modules
registry.register(analyticsModule);
registry.register(emailMarketingModule);
registry.register(aiModule);
registry.register(loyaltyModule);
registry.register(razorpayModule);
// ... all modules
```

---

## 6. Module Categories

| Category | Description | Example Modules |
|----------|-------------|-----------------|
| `payments` | Payment gateways | Stripe, Razorpay, PayPal |
| `shipping` | Shipping carriers | Shiprocket, Delhivery, FedEx |
| `marketing` | Customer engagement | Email, SMS, Loyalty, Affiliate |
| `analytics` | Reporting & insights | Analytics, Heatmaps, A/B Test |
| `operations` | Store operations | POS, Dropshipping, PO |
| `integrations` | External systems | ERP, CRM, Accounting |
| `storefront` | Website features | Reviews, Wishlist, Live Chat |
| `productivity` | Workflow tools | AI, Automation, Bulk ops |
| `compliance` | Legal & regulatory | GDPR tools, Tax (GST/VAT) |

---

## 7. Module Development Guide

```bash
# Scaffold a new module
pnpm themrktplace-cli create-module my-module --category marketing

# This generates:
# modules/my-module/
# ├── manifest.ts          ← Module definition
# ├── service.ts           ← Business logic
# ├── routes.ts            ← API routes (optional)
# ├── migrations/          ← DB migrations (optional)
# │   └── 0001_init.sql
# ├── components/          ← Admin UI components (optional)
# │   └── Settings.tsx
# └── index.ts             ← Exports

# Test the module
pnpm test --filter=my-module

# Register in main registry
# Add to: services/api-gateway/modules/registry.ts
```