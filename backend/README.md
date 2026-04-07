# theMrktPlace Backend

Production-oriented FastAPI backend for theMrktPlace suite, designed for:
- strict multi-tenancy
- master/shared/tenant database routing
- SaaS admin + shop APIs
- JWT + OTP auth flows
- encrypted tenant configs
- Telegram, Resend, and Razorpay integrations

## Database Topology

- Master DB: SaaS/global control data (`tenants`, `plans`, `saas_admins`, `tenant_configs`)
- Shared DB: default tenant data storage with strict `tenant_id` filtering
- Tenant DB(s): optional dedicated databases per tenant (`db_mode=dedicated`)

## Run

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `pip install -e .`
3. Start app:
   - `python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000`

## API Prefixes

- `GET /health`
- `/api/saas/*`
- `/api/shop/*`
- `/api/v3/webhooks/telegram/active`

## Reliability Features

- Async I/O everywhere (Motor + HTTPX)
- Tenant-safe repository pattern
- DB indexes on startup
- Credential encryption with AES-256-GCM
- Retry wrappers for outbound service calls
- Request-scoped tenant resolution
