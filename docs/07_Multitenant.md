# 🏢 MULTI_TENANCY.md — Multi-Tenant System Design

## Tenancy Model: Schema-per-Tenant

| Model | Isolation | Cost | Complexity | Our Choice |
|-------|-----------|------|-----------|-----------|
| Shared table (tenant_id column) | Low | Low | Low | ❌ |
| Schema-per-tenant (shared cluster) | Medium | Medium | Medium | ✅ Default |
| DB-per-tenant (dedicated instance) | High | High | High | ✅ Enterprise |

---

## 1. Tenant Lifecycle

```
                 ┌─────────────────┐
                 │   Registration  │
                 │  (signup form)  │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │   Provisioning  │ ← Async job (~30 seconds)
                 │  (create schema,│
                 │   search index, │
                 │   storage ns)   │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │     Trial       │ ← 14-day free trial
                 │  (plan limits   │
                 │   enforced)     │
                 └────────┬────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
     ┌────────▼────────┐   ┌─────────▼────────┐
     │    Subscribed   │   │     Expired Trial  │
     │   (paid plan)   │   │   → grace period   │
     └────────┬────────┘   └─────────┬──────────┘
              │                       │
              │             ┌─────────▼────────┐
              │             │    Suspended      │
              │             │  (data preserved  │
              │             │   for 30 days)    │
              │             └─────────┬──────────┘
              │                       │
              └───────────┬───────────┘
                          │
                 ┌────────▼────────┐
                 │    Deleted      │ ← Schema dropped after 30d
                 │  (soft delete   │
                 │   → purge job)  │
                 └─────────────────┘
```

---

## 2. Tenant Provisioning Service

```typescript
// services/tenants/provisioning.ts

export class TenantProvisioningService {
  
  async provision(input: NewTenantInput): Promise<ProvisionedTenant> {
    const tenantId = ulid();
    const schemaName = `tenant_${tenantId.toLowerCase()}`;
    
    const provisioningJob = await bullmq.add('provision-tenant', {
      tenantId,
      schemaName,
      input,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });

    return { tenantId, jobId: provisioningJob.id, status: 'provisioning' };
  }

  // Job processor (runs in worker)
  async processProvisioning(job: Job<ProvisioningJobData>) {
    const { tenantId, schemaName, input } = job.data;
    const steps = [
      'db_schema',
      'db_migrations', 
      'seed_defaults',
      'search_collection',
      'redis_namespace',
      'storage_prefix',
      'domain_config',
      'initial_email',
    ];

    for (const step of steps) {
      await job.updateProgress({ step, status: 'running' });
      await this.executeStep(step, { tenantId, schemaName, input });
      await this.recordStepComplete(tenantId, step);
      await job.updateProgress({ step, status: 'done' });
    }

    // Mark tenant as active in master DB
    await masterDb.update(tenants)
      .set({ status: 'active', provisionedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    // Emit provisioning complete event
    await eventBus.emit('tenant.provisioned', { tenantId });
  }

  private async executeStep(step: string, ctx: ProvisioningContext): Promise<void> {
    switch (step) {
      case 'db_schema':
        await this.createSchema(ctx.schemaName);
        break;
      case 'db_migrations':
        await this.runMigrations(ctx.schemaName);
        break;
      case 'seed_defaults':
        await this.seedDefaultData(ctx.tenantId, ctx.input);
        break;
      case 'search_collection':
        await this.createTypesenseCollection(ctx.tenantId);
        break;
      case 'redis_namespace':
        await this.initRedisKeys(ctx.tenantId);
        break;
      case 'domain_config':
        if (ctx.input.customDomain) {
          await this.configureDomain(ctx.tenantId, ctx.input.customDomain);
        }
        break;
    }
  }
}
```

---

## 3. Tenant Context Injection (Middleware)

```typescript
// services/api-gateway/plugins/tenant.ts

const tenantPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', async (req, reply) => {
    const tenantId = resolveTenantId(req);
    if (!tenantId) return; // Public endpoints

    // Fetch tenant with 5-minute cache
    const tenant = await getTenantCached(tenantId);
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found' });
    if (tenant.status === 'suspended') return reply.status(402).send({ error: 'Account suspended' });

    // Inject tenant context into request
    req.tenant = tenant;
    req.tenantDb = getTenantDatabase(tenant.schemaName);
    req.tenantRedis = getTenantRedisNamespace(tenantId);
  });
};

function resolveTenantId(req: FastifyRequest): string | null {
  // Priority order:
  // 1. x-tenant-id header (internal services, API keys)
  // 2. Subdomain (abc.themrktplace.io → abc)
  // 3. Custom domain lookup
  // 4. JWT tenant claim

  if (req.headers['x-tenant-id']) return req.headers['x-tenant-id'] as string;

  const host = req.headers.host ?? '';
  const subdomainMatch = host.match(/^([^.]+)\.themrktplace\.io$/);
  if (subdomainMatch) return subdomainMatch[1];

  if (!host.includes('themrktplace.io')) {
    return tenantByDomainCache.get(host) ?? null;
  }

  return req.user?.tenantId ?? null;
}
```

---

## 4. Plan Limits Enforcement

```typescript
// packages/auth/plan-limits.ts

interface PlanLimits {
  products: number;       // -1 = unlimited
  staff: number;
  locations: number;
  monthlyOrders: number;
  apiCallsPerMonth: number;
  storageGb: number;
  customDomains: number;
  webhooks: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  starter: {
    products: 100, staff: 2, locations: 1,
    monthlyOrders: 500, apiCallsPerMonth: 10_000,
    storageGb: 5, customDomains: 1, webhooks: 2,
  },
  growth: {
    products: 1_000, staff: 10, locations: 3,
    monthlyOrders: 5_000, apiCallsPerMonth: 100_000,
    storageGb: 50, customDomains: 3, webhooks: 10,
  },
  pro: {
    products: 10_000, staff: 50, locations: 10,
    monthlyOrders: 50_000, apiCallsPerMonth: 1_000_000,
    storageGb: 500, customDomains: 10, webhooks: 50,
  },
  enterprise: {
    products: -1, staff: -1, locations: -1,
    monthlyOrders: -1, apiCallsPerMonth: -1,
    storageGb: -1, customDomains: -1, webhooks: -1,
  },
};

class PlanLimitEnforcer {
  async check(tenantId: string, resource: keyof PlanLimits): Promise<void> {
    const tenant = await getTenant(tenantId);
    const limits = PLAN_LIMITS[tenant.plan];
    const limit = limits[resource];

    if (limit === -1) return; // Unlimited

    const current = await this.getCurrentUsage(tenantId, resource);
    if (current >= limit) {
      throw new PlanLimitExceededError(resource, limit, tenant.plan);
    }
  }

  async getCurrentUsage(tenantId: string, resource: keyof PlanLimits): Promise<number> {
    const db = getTenantDatabase(tenantId);
    switch (resource) {
      case 'products':
        return db.select({ count: count() }).from(products)
          .where(isNull(products.deletedAt))
          .then(r => r[0].count);
      case 'staff':
        return db.select({ count: count() }).from(users)
          .where(isNull(users.deletedAt))
          .then(r => r[0].count);
      // ... etc
    }
  }
}
```

---

## 5. Feature Flags (Per-Tenant)

```typescript
// Feature flags with Unleash

type FeatureFlag =
  | 'ai_descriptions'
  | 'advanced_analytics'
  | 'multi_currency'
  | 'pos_offline'
  | 'marketplace_sync'
  | 'custom_domain'
  | 'ar_tryOn';

class FeatureFlagService {
  async isEnabled(flag: FeatureFlag, tenant: Tenant): Promise<boolean> {
    // Check plan inclusion first
    if (!this.isPlanFeature(flag, tenant.plan)) return false;

    // Then check Unleash for A/B tests / gradual rollouts
    return unleash.isEnabled(flag, {
      userId: tenant.id,
      properties: {
        plan: tenant.plan,
        country: tenant.country,
        gmv: tenant.monthlyGmv.toString(),
      }
    });
  }

  private isPlanFeature(flag: FeatureFlag, plan: string): boolean {
    const planFeatures: Record<string, FeatureFlag[]> = {
      starter: ['pos_offline'],
      growth: ['pos_offline', 'multi_currency', 'ai_descriptions'],
      pro: ['pos_offline', 'multi_currency', 'ai_descriptions', 'advanced_analytics', 'marketplace_sync'],
      enterprise: Object.values(FeatureFlag), // All features
    };
    return planFeatures[plan]?.includes(flag) ?? false;
  }
}
```

---

## 6. Tenant Data Isolation Testing

```typescript
// tests/integration/tenant-isolation.test.ts

describe('Tenant Data Isolation', () => {
  let tenant1Db: TenantDb;
  let tenant2Db: TenantDb;

  beforeAll(async () => {
    tenant1Db = await provisionTestTenant('tenant_a');
    tenant2Db = await provisionTestTenant('tenant_b');
    await seedTestProducts(tenant1Db, 5);
  });

  it('tenant cannot access another tenant products via API', async () => {
    const tenant2Token = await getAuthToken('tenant_b');
    const tenant1ProductId = await getFirstProductId(tenant1Db);
    
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/products/${tenant1ProductId}`,
      headers: {
        authorization: `Bearer ${tenant2Token}`,
        'x-tenant-id': 'tenant_b',
      }
    });

    expect(res.statusCode).toBe(404); // Not found (not 403 — don't reveal existence)
  });

  it('direct DB query is isolated by schema', async () => {
    const tenant2Products = await tenant2Db.select().from(products);
    expect(tenant2Products).toHaveLength(0); // Tenant B sees no products
  });
});
```

---

## 7. White-Label Configuration

```typescript
// Tenant white-labeling config stored in JSONB

interface TenantBranding {
  storeName: string;
  logo: { light: string; dark: string };
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;   // Google Font name
    body: string;
  };
  customCss?: string;  // Injected into storefront
  socialLinks: Record<string, string>;
  footerText: string;
  supportEmail: string;
  emailFrom: { name: string; address: string };
}
```

---

## 8. Tenant Metrics & SLA

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API p95 latency | < 200ms | > 500ms |
| API p99 latency | < 500ms | > 1000ms |
| Uptime per tenant | 99.9% | < 99.5% |
| DB query p95 | < 50ms | > 200ms |
| Search p95 | < 30ms | > 100ms |
| Sync latency (POS) | < 2s | > 5s |

**SLA guarantees by plan:**
- Starter: 99.5% uptime
- Growth: 99.9% uptime  
- Pro: 99.95% uptime
- Enterprise: 99.99% uptime + dedicated SLA