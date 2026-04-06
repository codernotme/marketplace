# SaaS Admin — Schema, Features & Workflows

The SaaS Admin is **your** master control layer. It manages all tenants (shop owners), their configs, billing, and platform-wide settings. Shop owners never touch this layer.

---

## 1. MongoDB Collections (SaaS Layer)

### `saas_admins`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "role": "superadmin | support",
  "created_at": "datetime",
  "last_login": "datetime"
}
```

### `tenants`
```json
{
  "_id": "ObjectId",
  "shop_name": "string",
  "shop_slug": "string (unique, URL-safe)",
  "owner_name": "string",
  "owner_email": "string",
  "owner_phone": "string",
  "logo_url": "string",
  "brand_color": "#hex",
  "status": "pending | active | suspended | deleted",
  "plan": "free | starter | pro | enterprise",
  "onboarding_step": 1-5,
  "onboarding_complete": "boolean",
  "created_at": "datetime",
  "activated_at": "datetime",
  "suspended_at": "datetime | null",
  "suspension_reason": "string | null"
}
```

### `tenant_configs`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId (ref: tenants)",
  "razorpay_key_id": "string (encrypted)",
  "razorpay_key_secret": "string (encrypted)",
  "resend_api_key": "string (encrypted)",
  "telegram_bot_token": "string (encrypted)",
  "telegram_chat_id": "string",
  "mongodb_uri": "string (encrypted, optional — for dedicated DB tenants)",
  "smtp_host": "string | null",
  "smtp_port": "number | null",
  "smtp_user": "string | null",
  "smtp_pass": "string (encrypted) | null",
  "custom_domain": "string | null",
  "custom_domain_verified": "boolean",
  "updated_at": "datetime"
}
```

### `plans`
```json
{
  "_id": "ObjectId",
  "name": "free | starter | pro | enterprise",
  "display_name": "string",
  "price_monthly": "number",
  "price_yearly": "number",
  "limits": {
    "products": "number (-1 = unlimited)",
    "orders_per_month": "number",
    "storage_gb": "number",
    "team_members": "number",
    "custom_domain": "boolean",
    "telegram_bot": "boolean",
    "analytics": "basic | advanced",
    "ads_module": "boolean"
  },
  "is_active": "boolean"
}
```

### `tenant_subscriptions`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "plan_id": "ObjectId",
  "billing_cycle": "monthly | yearly",
  "status": "active | past_due | cancelled | trialing",
  "trial_ends_at": "datetime | null",
  "current_period_start": "datetime",
  "current_period_end": "datetime",
  "razorpay_subscription_id": "string | null",
  "created_at": "datetime"
}
```

### `platform_announcements`
```json
{
  "_id": "ObjectId",
  "title": "string",
  "body": "string",
  "type": "info | warning | maintenance | feature",
  "visible_to": "all | plan:pro | plan:enterprise",
  "published_at": "datetime",
  "expires_at": "datetime | null",
  "created_by": "ObjectId"
}
```

### `audit_logs` (SaaS layer)
```json
{
  "_id": "ObjectId",
  "actor_id": "ObjectId",
  "actor_role": "saas_admin | tenant_admin",
  "tenant_id": "ObjectId | null",
  "action": "string (e.g. 'tenant.suspended', 'plan.changed')",
  "meta": "object",
  "ip": "string",
  "created_at": "datetime"
}
```

---

## 2. SaaS Admin Dashboard — Sidebar Navigation

```
📊  Dashboard (platform KPIs)
🏪  Tenants
    ├── All Tenants
    ├── Pending Approval
    ├── Suspended
    └── Create Tenant
💳  Plans & Billing
    ├── Plans Config
    └── Subscriptions
📣  Announcements
🔑  Access & Admins
⚙️  Platform Settings
📋  Audit Logs
```

---

## 3. SaaS Admin Features

### 3.1 Dashboard (KPIs)
- Total tenants (active / pending / suspended)
- MRR (Monthly Recurring Revenue)
- New signups (last 30 days)
- Churned tenants (last 30 days)
- Top plans by usage
- Storage usage across tenants
- Recent audit log feed

### 3.2 Tenant Management

#### List & Filter
- Filter by status, plan, date range
- Search by name, email, slug
- Bulk actions: suspend, delete, change plan

#### Tenant Detail View
- Basic info (name, email, phone, logo)
- Current plan + subscription history
- Config status (which creds are set)
- Onboarding progress bar
- All-time order count + revenue
- Impersonate button (for support)
- Manual override: activate / suspend with reason
- Config editor (admin can view/edit encrypted creds)

#### Create Tenant (manual provisioning)
1. Fill basic info → auto-generate slug
2. Assign plan
3. Send onboarding invite email via Resend
4. Tenant appears in "pending" state

### 3.3 Plans & Billing
- CRUD on plan definitions
- View all active subscriptions
- Override a tenant's plan manually
- View payment history per tenant (via Razorpay webhook data)
- Handle failed payments → notify tenant

### 3.4 Announcements
- Publish platform-wide notices
- Target by plan tier
- Set expiry
- Push via Telegram or email to all shop admins

### 3.5 Access & Admins
- Invite other SaaS support admins
- Assign roles: `superadmin` | `support`
- Revoke access

### 3.6 Platform Settings
- Platform name, logo, favicon
- Default "from" email (Resend sender)
- Telegram alert channel for platform events
- Maintenance mode toggle
- Default plan for new signups

### 3.7 Audit Logs
- Immutable log of all SaaS admin actions
- Filter by actor, tenant, action type, date

---

## 4. SaaS Admin Auth Flow

```
POST /saas/auth/login
  → email + password
  → returns JWT (role: superadmin/support)
  → 2FA via TOTP (optional, recommended)

All saas routes guarded by: saas_admin_required dependency
```

---

## 5. Tenant Provisioning Workflow

```
1. Shop owner submits signup form (or SaaS admin creates manually)
2. Tenant record created with status=pending, onboarding_step=1
3. Invite email sent via Resend with magic onboarding link
4. Shop owner completes 5-step onboarding (see auth/onboarding doc)
5. On onboarding_complete=true → status set to active
6. Tenant config stored encrypted in tenant_configs
7. SaaS admin notified via Telegram
```

---

## 6. Environment / Config Fetch Strategy

Instead of `.env` files per deployment, each tenant's backend instance fetches its config from `tenant_configs` at startup and caches it in memory (with a TTL of 5 min).

```python
# On FastAPI startup per tenant context
async def get_tenant_config(tenant_id: str) -> TenantConfig:
    cached = await redis.get(f"config:{tenant_id}")
    if cached:
        return TenantConfig(**json.loads(cached))
    config = await db.tenant_configs.find_one({"tenant_id": ObjectId(tenant_id)})
    decrypted = decrypt_config(config)
    await redis.setex(f"config:{tenant_id}", 300, decrypted.json())
    return decrypted
```

Sensitive fields encrypted at rest using AES-256 (key stored as true env var on server, never in DB).
