# theMrktPlace Backend — Copilot Instructions

This file provides context for GitHub Copilot and other AI coding assistants working on the FastAPI backend.

**For the complete backend guide, also reference [.cursorrules](../../.cursorrules).**

---

## Quick Start

You are building the **theMrktPlace** backend:
- Framework: **FastAPI** (async/await)
- Database: **MongoDB** + Motor (async driver)
- Multi-tenant: Every query must include `tenant_id` filter
- Auth: JWT tokens, OTP-based flows, role-based access

**Before writing code:**
1. Check [02-ecommerce-schema.md](../../02-ecommerce-schema.md) for collection shapes
2. Check [05-backend-api.md](../../05-backend-api.md) for endpoint specs
3. Always scope queries to the current tenant
4. Never make blocking calls — use `await`

---

## Key Rules

### 1. Multi-Tenancy is Non-Negotiable
```python
# ✅ Every query scoped by tenant_id
product = await db.products.find_one({
    "_id": ObjectId(product_id),
    "tenant_id": ObjectId(tenant_id)
})

# ❌ Will cause cross-tenant data leaks
product = await db.products.find_one({"_id": ObjectId(product_id)})
```

### 2. Tenant Config is Encrypted & Cached
- Razorpay keys, Telegram tokens, Resend API keys live in `tenant_configs`
- **Never** hardcode secrets; always fetch from DB/cache
- Cache in Redis with 5-min TTL
- Encrypt at rest with AES-256-GCM using `ENCRYPTION_KEY` env var

### 3. All Async
```python
# ✅ Use await for all I/O
product = await db.products.find_one(query)
await email_service.send(...)

# ❌ Never blocking
product = db.products.find_one_sync(query)
requests.get(...)  # Use httpx.AsyncClient instead
```

### 4. Background Tasks for Side Effects
```python
# ✅ Return immediately, offload async work
background_tasks.add_task(send_email, order, config)
return {"status": "order_created"}

# ❌ Blocks response
await send_email(order, config)
return {"status": "done"}
```

---

## File Organization

| Path | Purpose |
|------|---------|
| `routers/saas/*` | SaaS admin APIs (`/api/saas/*`) |
| `routers/shop/*` | Tenant shop APIs (`/api/shop/*`) |
| `core/dependencies.py` | Auth guards: `get_current_user`, `get_tenant`, `saas_admin_required` |
| `core/security.py` | JWT, password hashing, encryption |
| `services/` | External integrations (Resend, Razorpay, Telegram) |
| `models/` | Pydantic request/response schemas |
| `utils/` | Helpers: slug gen, pagination, validators |

---

## Collections Reference

**Global (no tenant_id):**
- `saas_admins`, `tenants`, `tenant_configs`, `plans`, `tenant_subscriptions`, `audit_logs`

**Per-Tenant (always filter by tenant_id):**
- `users`, `products`, `categories`, `orders`, `coupons`, `banners`, `reviews`, `queries`, `shop_settings`, `inventory_logs`, `shipping_zones`, `otps`, `analytics_events`

---

## Common Patterns

### Router with Auth
```python
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from core.dependencies import get_tenant, get_current_user, require_role
from core.database import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", status_code=201)
async def create_product(
    data: ProductCreate,
    background_tasks: BackgroundTasks,
    tenant = Depends(get_tenant),
    user = Depends(require_role(["shop_admin"])),
    db = Depends(get_db),
):
    tenant_id = str(tenant["_id"])
    # Logic here
    background_tasks.add_task(notify_telegram, product_id, tenant_id)
    return {"created": True}
```

### Inventory Deduction (Atomic)
```python
result = await db.products.update_one(
    {
        "_id": ObjectId(product_id),
        "tenant_id": ObjectId(tenant_id),
        "stock": {"$gte": qty}  # Atomic check
    },
    {"$inc": {"stock": -qty}}
)
if result.modified_count == 0:
    raise OutOfStockError()
# Log the change
await db.inventory_logs.insert_one({
    "tenant_id": ObjectId(tenant_id),
    "product_id": ObjectId(product_id),
    "type": "sale",
    "quantity_change": -qty,
    "created_at": datetime.utcnow()
})
```

### Unique Slug (Per Tenant)
```python
async def generate_slug(title: str, tenant_id: str, db):
    base = slugify(title)
    slug = base
    counter = 1
    while await db.products.find_one({"slug": slug, "tenant_id": ObjectId(tenant_id)}):
        slug = f"{base}-{counter}"
        counter += 1
    return slug
```

---

## Testing Checklist

- [ ] Endpoint scopes query by `tenant_id`
- [ ] All DB calls are `await` (no sync)
- [ ] Sensitive data (secrets) never logged/returned plain
- [ ] Background tasks used for email/Telegram/analytics
- [ ] Stock validation is atomic (check + deduct in one update)
- [ ] Razorpay signatures verified before creating order
- [ ] Pagination defaults set (min=1, max=100)
- [ ] Error responses use defined error codes (see `.cursorrules`)

---

## Common Mistakes

❌ Query without tenant_id → cross-tenant leak  
❌ Sync `.requests` instead of `httpx.AsyncClient` → blocks event loop  
❌ Hardcode secrets → exposed in logs  
❌ Await for email in route → slow response  
❌ Trust client prices → security hole  
❌ Return ObjectId directly in JSON → not serializable  

---

## Documentation Map

| Topic | File |
|-------|------|
| Data models | [02-ecommerce-schema.md](../../02-ecommerce-schema.md) |
| SaaS admin features | [01-saas-admin-schema.md](../../01-saas-admin-schema.md) |
| API endpoints & algorithms | [05-backend-api.md](../../05-backend-api.md) |
| Auth & onboarding flows | [06-auth-onboarding-flows.md](../../06-auth-onboarding-flows.md) |
| Full system design | [.cursorrules](../../.cursorrules) |

---

**Questions?** Refer to the schema docs or the `.cursorrules` file.
