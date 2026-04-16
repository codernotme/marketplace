# 🚀 DEPLOYMENT.md — CI/CD, Infrastructure & Observability

## Infrastructure Overview

```
Production Stack
├── Vercel                  (Next.js apps — all 4 frontends)
├── Fly.io                  (API services — Fastify, BullMQ workers)
├── Neon                    (Serverless PostgreSQL)
├── Upstash Redis           (Serverless Redis — cache, queues, pub/sub)
├── Typesense Cloud         (Search)
├── Cloudflare R2           (Object storage)
├── Cloudflare (CDN/DNS)    (WAF, DDoS, edge caching)
├── Resend                  (Transactional email)
└── Doppler                 (Secrets management)
```

---

## 1. Monorepo CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ============================================================
  # CHANGE DETECTION — only run affected packages
  # ============================================================
  changes:
    runs-on: ubuntu-latest
    outputs:
      api: ${{ steps.filter.outputs.api }}
      master-admin: ${{ steps.filter.outputs.master-admin }}
      tenant-admin: ${{ steps.filter.outputs.tenant-admin }}
      storefront: ${{ steps.filter.outputs.storefront }}
      pos: ${{ steps.filter.outputs.pos }}
      packages: ${{ steps.filter.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            api:       ['services/api-gateway/**', 'packages/**']
            master-admin: ['apps/master-admin/**', 'packages/**']
            tenant-admin: ['apps/tenant-admin/**', 'packages/**']
            storefront: ['apps/storefront/**', 'packages/**']
            pos:       ['apps/pos/**', 'packages/**']
            packages:  ['packages/**']

  # ============================================================
  # QUALITY GATES (parallel)
  # ============================================================
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo typecheck

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint
      - run: pnpm prettier --check .

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo test -- --coverage
      - uses: codecov/codecov-action@v4

  test-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_PASSWORD: testpass, POSTGRES_DB: themrktplace_test }
        options: --health-cmd pg_isready --health-interval 5s
      redis:
        image: redis:7-alpine
        options: --health-cmd "redis-cli ping"
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:migrate
        env: { DATABASE_URL: postgresql://postgres:testpass@localhost/themrktplace_test }
      - run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost/themrktplace_test
          REDIS_URL: redis://localhost:6379

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit --audit-level=high
      - uses: returntocorp/semgrep-action@v1
        with: { config: "p/owasp-top-ten p/nodejs" }
      - uses: gitleaks/gitleaks-action@v2

  # ============================================================
  # BUILD & DEPLOY (only on main after all checks pass)
  # ============================================================
  deploy-staging:
    needs: [typecheck, lint, test-unit, test-integration, security]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build
      # Deploy all Next.js apps to Vercel (staging)
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-args: '--env NODE_ENV=staging'
      # Deploy services to Fly.io
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only --app themrktplace-api-staging
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }

  deploy-production:
    needs: [typecheck, lint, test-unit, test-integration, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Run DB migrations
        run: pnpm db:migrate
        env: { DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} }
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-args: '--prod'
      - name: Deploy API to Fly.io
        run: flyctl deploy --remote-only --app themrktplace-api
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: '{"text": "✅ themrktplace deployed to production — ${{ github.sha }}"}'
        env: { SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }} }
```

---

## 2. Docker Setup

```dockerfile
# infra/docker/api.Dockerfile

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY services/api-gateway/package.json ./services/api-gateway/
RUN pnpm install --frozen-lockfile --prod=false

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo build --filter=api-gateway...

# Runtime
FROM node:20-alpine AS runner
RUN addgroup -S themrktplace && adduser -S themrktplace -G themrktplace
WORKDIR /app

COPY --from=builder --chown=themrktplace:themrktplace /app/services/api-gateway/dist ./dist
COPY --from=builder --chown=themrktplace:themrktplace /app/node_modules ./node_modules

USER themrktplace

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s \
  CMD node -e "fetch('http://localhost:4000/health').then(r => process.exit(r.ok ? 0 : 1))"

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml (development)

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: themrktplace
      POSTGRES_PASSWORD: themrktplace
      POSTGRES_DB: themrktplace
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U themrktplace"]
      interval: 5s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --save 20 1 --loglevel warning
    volumes:
      - redisdata:/data

  typesense:
    image: typesense/typesense:0.26.0
    ports: ["8108:8108"]
    environment:
      TYPESENSE_API_KEY: dev-key
      TYPESENSE_DATA_DIR: /data
    volumes:
      - typesensedata:/data

  mailhog:
    image: mailhog/mailhog
    ports: ["1025:1025", "8025:8025"]  # SMTP + Web UI

volumes:
  pgdata:
  redisdata:
  typesensedata:
```

---

## 3. Fly.io Configuration (API Gateway)

```toml
# fly.toml

app = "themrktplace-api"
primary_region = "bom"        # Mumbai (closest to India)

[build]
  dockerfile = "infra/docker/api.Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "4000"

[http_service]
  internal_port = 4000
  force_https = true
  auto_stop_machines = false
  min_machines_running = 2     # Always-on
  processes = ["app"]

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 2

[checks]
  [checks.health]
    grace_period = "30s"
    interval = "10s"
    method = "GET"
    path = "/health"
    port = 4000
    timeout = "3s"

# Auto-scale based on load
[[services.concurrency]]
  type = "requests"
  hard_limit = 250
  soft_limit = 200
```

---

## 4. Observability Stack

### OpenTelemetry Setup
```typescript
// services/api-gateway/telemetry.ts

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'themrktplace-api-gateway',
    'deployment.environment': process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
  metricReader: new PrometheusExporter({ port: 9464 }),
});

sdk.start();
```

### Structured Logging
```typescript
// packages/utils/logger.ts

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', '*.password', '*.token', '*.secret'],
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
  },
  // Pretty print in development
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' }
    }
  })
});

// Usage: logger.info({ tenantId, orderId }, 'Order created');
```

### Grafana Dashboard Panels
```
themrktplace API Dashboard:
├── Request Rate (req/s)
├── Error Rate (%)
├── p50/p95/p99 Latency
├── Active WebSocket Connections
├── Queue Depth (BullMQ jobs pending)
├── DB Pool Usage
├── Redis Memory Usage
├── Cache Hit Rate
├── Active Tenants
└── GMV per hour (real-time)
```

---

## 5. Database Migrations (Zero-Downtime)

```bash
#!/bin/bash
# tools/scripts/migrate-prod.sh

set -e

echo "🔍 Checking pending migrations..."
PENDING=$(pnpm drizzle-kit status --config=packages/db/drizzle.config.ts | grep "pending" | wc -l)

if [ "$PENDING" -eq 0 ]; then
  echo "✅ No pending migrations"
  exit 0
fi

echo "📋 $PENDING migration(s) pending"

# 1. Take DB backup snapshot
echo "💾 Creating DB snapshot..."
pg_dump $DATABASE_URL --format=custom --file=/tmp/themrktplace-backup-$(date +%Y%m%d%H%M%S).dump

# 2. Run migrations (Drizzle is transactional)
echo "🚀 Running migrations..."
pnpm drizzle-kit migrate --config=packages/db/drizzle.config.ts

echo "✅ Migrations complete"
```

---

## 6. Rollback Strategy

```bash
# Quick rollback procedure

# 1. Revert Vercel deployment
vercel rollback --token=$VERCEL_TOKEN

# 2. Revert API service
flyctl releases rollback --app themrktplace-api

# 3. If DB migration needs rollback:
# (Only for backwards-compatible expansions — contractions are manual)
pnpm drizzle-kit rollback --steps=1

# 4. Notify team
echo "🔄 Rollback complete. Incident channel: #incidents"
```

---

## 7. Environment Management

```
Environments:
  local     → Docker Compose + local Next.js dev servers
  preview   → Vercel preview deployments (per PR)
  staging   → Dedicated staging cluster (mirrors production)
  production → Production cluster

Secret management (Doppler):
  themrktplace/local/     → Dev secrets (non-sensitive)
  themrktplace/staging/   → Staging secrets
  themrktplace/production/ → Production secrets (restricted access)

Config injection:
  doppler run --project themrktplace --config production -- node server.js
```

---

## 8. Disaster Recovery

| Scenario | RTO | RPO | Recovery Procedure |
|----------|-----|-----|-------------------|
| App crash | < 30s | 0 | Fly.io auto-restart |
| DB connection loss | < 1min | 0 | Connection pool retry |
| DB failure | < 5min | < 1min | Neon automatic failover |
| Redis failure | < 1min | N/A (cache) | Services degrade gracefully |
| Region outage | < 10min | < 5min | Traffic rerouted to secondary region |
| Full data loss | < 4hr | < 24hr | Restore from Neon PITR + Cloudflare R2 |