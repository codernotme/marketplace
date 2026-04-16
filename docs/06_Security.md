# 🔒 SECURITY.md — Security Architecture & Threat Model

## Security Posture: Zero Trust + Defense in Depth

Every layer independently validates authentication, authorization, and data integrity. No implicit trust between services.

---

## 1. Authentication Architecture

### Multi-Credential Auth Flow

```
┌─────────┐     1. POST /auth/login          ┌──────────────┐
│  Client │ ──────────────────────────────→  │  Auth Service│
│         │ ←────────────────────────────── │              │
│         │     2. { accessToken (15min),    │  • Verify    │
│         │           refreshToken (7d) }     │    credentials│
│         │                                  │  • Issue JWT  │
│         │     3. API requests              │  • Log event │
│         │     Authorization: Bearer <AT>   └──────────────┘
│         │ ──────────────────────────────→  API Gateway
│         │                                  • Verify RS256 JWT
│         │     4. Access token expired      • Check revocation list
│         │     POST /auth/refresh           • Inject tenant context
└─────────┘     { refreshToken }
```

### JWT Structure (RS256)

```json
{
  "header": { "alg": "RS256", "typ": "JWT", "kid": "key-2025-01" },
  "payload": {
    "sub": "user_01J3XABCDEF",
    "tenantId": "tenant_01J3XABCDEF",
    "role": "admin",
    "permissions": ["products:write", "orders:read"],
    "sessionId": "sess_01J3XABCDEF",
    "iat": 1704067200,
    "exp": 1704068100,
    "iss": "themrktplace.io",
    "aud": "themrktplace-api"
  }
}
```

**Key rotation:** RS256 keypairs rotate every 90 days with 2-day overlap period.

### API Key Authentication

```typescript
// Format: nc_live_<tenantId>_<random32hex>
// Storage: SHA-256 hash stored in DB (never plaintext)

const API_KEY_REGEX = /^nc_(live|test)_[a-z0-9]{8}_[a-f0-9]{64}$/;

async function verifyApiKey(rawKey: string): Promise<ApiKeyRecord> {
  const hash = createHash('sha256').update(rawKey).digest('hex');
  const keyRecord = await db.query.apiKeys.findFirst({
    where: and(
      eq(apiKeys.keyHash, hash),
      eq(apiKeys.isActive, true),
      or(isNull(apiKeys.expiresAt), gt(apiKeys.expiresAt, new Date()))
    )
  });
  
  if (!keyRecord) throw new UnauthorizedError('Invalid API key');
  
  // Rate limit per key
  await enforceRateLimit(`apikey:${keyRecord.id}`, keyRecord.rateLimit);
  
  // Update last used (async, non-blocking)
  void db.update(apiKeys).set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, keyRecord.id));
  
  return keyRecord;
}
```

---

## 2. Authorization (CASL ABAC)

```typescript
// packages/auth/abilities.ts

import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  switch (user.role) {
    case 'owner':
      can('manage', 'all');
      break;

    case 'admin':
      can('manage', ['Product', 'Order', 'Customer', 'Discount', 'Report']);
      can('read', 'Settings');
      cannot('delete', 'User', { role: 'owner' });
      break;

    case 'manager':
      can(['read', 'create', 'update'], ['Product', 'Order', 'Customer']);
      can('read', ['Report', 'Discount']);
      cannot('delete', 'all');
      break;

    case 'cashier':
      can('create', 'Order', { source: 'pos' });
      can('read', ['Product', 'Customer', 'Order'], { source: 'pos' });
      cannot('update', 'Order', ['total', 'discount']);
      break;

    case 'analyst':
      can('read', ['Report', 'Analytics', 'Order', 'Customer', 'Product']);
      cannot(['create', 'update', 'delete'], 'all');
      break;
  }

  // Override with explicit custom permissions
  for (const perm of user.permissions ?? []) {
    if (perm.startsWith('!')) {
      cannot(...parsePermission(perm.slice(1)));
    } else {
      can(...parsePermission(perm));
    }
  }

  return build();
}
```

---

## 3. PostgreSQL Row Level Security

```sql
-- Tenant isolation at DB level
-- Even if app code has a bug, cross-tenant data access is blocked

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- App connects with tenant-scoped role
CREATE ROLE themrktplace_app;
CREATE POLICY tenant_isolation ON products
  USING (true);  -- Schema-per-tenant means all rows belong to tenant

-- Within schema: user-level access
CREATE POLICY staff_can_read_products ON products
  FOR SELECT
  USING (current_setting('app.user_role') IN ('owner','admin','manager','staff','analyst','cashier'));

CREATE POLICY staff_can_write_products ON products
  FOR ALL
  USING (current_setting('app.user_role') IN ('owner','admin','manager'));
```

**Setting tenant context in Drizzle middleware:**
```typescript
const db = drizzle(connection, {
  middleware: async (ctx, next) => {
    await ctx.execute(sql`SET LOCAL app.user_role = ${ctx.tenantContext.userRole}`);
    return next();
  }
});
```

---

## 4. Input Validation & Sanitization

```typescript
// All API inputs validated with Zod — no raw user data reaches DB

// Example: Product creation schema
const createProductSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  description: z.string().max(50000).optional(),
  price: z.number().positive().max(9999999),
  sku: z.string()
    .regex(/^[A-Z0-9_-]{1,100}$/, 'SKU must be alphanumeric')
    .transform(s => s.toUpperCase()),
  tags: z.array(z.string().max(50)).max(20).default([]),
  metadata: z.record(z.string(), z.unknown()).optional()
    .transform(obj => sanitizeCustomFields(obj)), // Remove dangerous keys
});

// HTML sanitization for rich text
import DOMPurify from 'isomorphic-dompurify';
const ALLOWED_TAGS = ['p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'img'];

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class'],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
  });
}
```

---

## 5. Rate Limiting

```typescript
// Multi-level rate limiting

const rateLimits = {
  // Per IP (unauthenticated)
  public: { windowMs: 60_000, max: 100 },
  
  // Per API key
  apiKey: { windowMs: 60_000, max: 600 },
  
  // Per user (authenticated)
  user: { windowMs: 60_000, max: 300 },
  
  // Per tenant (cumulative across all users)
  tenant: { windowMs: 60_000, max: 2000 },
  
  // Sensitive endpoints (stricter)
  auth: { windowMs: 60_000, max: 10 },
  passwordReset: { windowMs: 3_600_000, max: 3 },
  webhook: { windowMs: 60_000, max: 60 },
};

// Sliding window algorithm with Redis
async function checkRateLimit(key: string, limit: RateLimit): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - limit.windowMs;
  
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, '-inf', windowStart);   // Remove old entries
  pipeline.zadd(key, now, `${now}-${Math.random()}`);    // Add current
  pipeline.zcard(key);                                    // Count
  pipeline.expire(key, Math.ceil(limit.windowMs / 1000));
  
  const results = await pipeline.exec();
  const count = results[2][1] as number;
  
  return {
    allowed: count <= limit.max,
    remaining: Math.max(0, limit.max - count),
    resetAt: new Date(now + limit.windowMs),
  };
}
```

---

## 6. Payment Security

```typescript
// Stripe webhook signature verification
app.post('/webhooks/stripe', {
  config: { rawBody: true } // Must use raw body for signature
}, async (req, reply) => {
  const signature = req.headers['stripe-signature'] as string;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return reply.status(400).send({ error: 'Invalid signature' });
  }

  // Process event idempotently
  await processStripeEvent(event);
});

// PCI DSS compliance: Never log or store card data
const SENSITIVE_FIELDS = ['card_number', 'cvv', 'expiry', 'password', 'secret'];

function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.some(f => k.toLowerCase().includes(f)) ? '[REDACTED]' : v
    ])
  );
}
```

---

## 7. CSRF Protection

```typescript
// Double Submit Cookie pattern
// On every mutation, compare cookie token with request header token

const csrfPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return;
    
    const cookieToken = req.cookies['csrf-token'];
    const headerToken = req.headers['x-csrf-token'];
    
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return reply.status(403).send({ error: 'CSRF validation failed' });
    }
  });
};
```

---

## 8. Secret Management

```
# All secrets stored in Doppler — NEVER in:
# ❌ .env files committed to git
# ❌ Environment variables in Vercel/Railway dashboard
# ❌ Hardcoded in source code
# ❌ Docker images

# Doppler CLI injects secrets at runtime:
# doppler run -- node server.js

# Secret categories:
themrktplace_DB_URL                 # Master PostgreSQL URL
themrktplace_REDIS_URL              # Redis connection
themrktplace_JWT_PRIVATE_KEY        # RS256 signing key (base64)
themrktplace_JWT_PUBLIC_KEY         # RS256 verification key
STRIPE_SECRET_KEY              # Stripe secret (per environment)
STRIPE_WEBHOOK_SECRET          # Stripe webhook signing secret
SENDGRID_API_KEY               # Email sending
TWILIO_AUTH_TOKEN              # SMS
TYPESENSE_API_KEY              # Search
ANTHROPIC_API_KEY              # AI features
OPENAI_API_KEY                 # Embeddings
```

---

## 9. Security Headers

```typescript
// Fastify Helmet configuration
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-{NONCE}'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind requires this
      imgSrc: ["'self'", "data:", "*.cloudflare.com", "*.themrktplace.io"],
      connectSrc: ["'self'", "*.themrktplace.io", "*.stripe.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    camera: [], microphone: [], geolocation: ['self'],
  }
});
```

---

## 10. Security Scanning & CI/CD Gates

```yaml
# .github/workflows/security.yml

security-scan:
  runs-on: ubuntu-latest
  steps:
    - name: Dependency Audit
      run: pnpm audit --audit-level=high

    - name: SAST (Semgrep)
      uses: returntocorp/semgrep-action@v1
      with:
        config: "p/owasp-top-ten p/nodejs p/typescript"

    - name: Secret Scanning (Gitleaks)
      uses: gitleaks/gitleaks-action@v2

    - name: Container Scanning (Trivy)
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'image'
        severity: 'CRITICAL,HIGH'

    - name: OWASP ZAP Baseline
      uses: zaproxy/action-baseline@v0.10.0
      with:
        target: 'https://staging.themrktplace.io'
```

---

## 11. Compliance

| Standard | Status | Notes |
|----------|--------|-------|
| **GDPR** | Compliant | Data export, deletion, consent tracking |
| **PCI DSS Level 3** | Compliant | No card data stored; Stripe handles PCI |
| **SOC 2 Type II** | In Progress | Audit logging, access controls |
| **ISO 27001** | Roadmap | Q3 2025 |
| **DPDPA (India)** | Compliant | Digital Personal Data Protection Act |
| **CCPA** | Compliant | California consumer rights |

---

## 12. Incident Response Playbook

```
Severity 1 (Critical — data breach, system down):
  → Immediate: Page on-call engineer (PagerDuty)
  → 15min: Incident channel created in Slack
  → 30min: Executive notification
  → 1hr: Customer communication (if impacted)
  → 24hr: Post-mortem scheduled

Severity 2 (High — degraded service, security vulnerability):
  → 1hr: Engineer assigned
  → 4hr: Fix deployed or workaround communicated
  → 48hr: Root cause analysis

Severity 3 (Medium — isolated errors, non-critical):
  → 1 business day: Issue triaged
  → 1 week: Fix shipped
```