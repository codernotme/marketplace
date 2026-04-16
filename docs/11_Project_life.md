# 📅 PROJECT_LIFECYCLE.md — SDE Lifecycle, Roadmap & Process

## Development Methodology: Shape Up + Agile Hybrid

- **6-week cycles** (not sprints) for major features
- **2-week cool-down** between cycles for bugs, refactoring, tooling
- **Daily standups** + async-first communication (Linear + Slack)
- **Demo-driven** — working software every cycle

---

## Phase 0: Foundation (Weeks 1–4)

**Goal:** Monorepo skeleton, auth, multi-tenancy, CI/CD

### Week 1–2: Infrastructure & Dev Environment
- [ ] Set up Turborepo monorepo with all apps
- [ ] Configure shared packages (ui, db, auth, types, config)
- [ ] Docker Compose for local development
- [ ] GitHub Actions CI pipeline (typecheck, lint, test)
- [ ] Doppler secrets setup
- [ ] Neon DB + Drizzle ORM configured
- [ ] Base Tailwind + shadcn/ui design system
- [ ] Inter + JetBrains Mono fonts configured

**Milestone:** `pnpm dev` starts all apps; CI passes

### Week 3–4: Auth + Multi-Tenancy Core
- [ ] Auth.js v5 with email/password + Google OAuth
- [ ] JWT (RS256) + refresh token rotation
- [ ] Tenant provisioning service
- [ ] Schema-per-tenant DB isolation
- [ ] Tenant middleware (subdomain + custom domain)
- [ ] Plan limits enforcement
- [ ] Basic RBAC with CASL
- [ ] Master admin login + tenant list view

**Milestone:** Two tenants isolated, provisioned programmatically

---

## Phase 1: Core Commerce (Weeks 5–14)

### Cycle 1 (Weeks 5–10): Product & Inventory
**Tenant Admin:**
- [ ] Product CRUD + variants engine
- [ ] Product image upload (Cloudflare R2)
- [ ] Category tree with closure table
- [ ] Inventory tracking (per-location)
- [ ] Bulk CSV import
- [ ] Typesense search integration + auto-indexing
- [ ] Product listing page with DataTable

**Storefront:**
- [ ] Product listing page (ISR + faceted search)
- [ ] Product detail page
- [ ] Category pages
- [ ] Image gallery with zoom
- [ ] Mobile-responsive layout

**Milestone:** Full product management + searchable storefront

### Cycle 2 (Weeks 11–16): Orders & Payments
**Tenant Admin:**
- [ ] Order management (list, detail, edit)
- [ ] Order timeline (status history)
- [ ] Manual order creation
- [ ] Fulfillment workflow
- [ ] Return & refund flows
- [ ] Packing slips PDF

**Storefront:**
- [ ] Cart (persistent, cross-device)
- [ ] Guest checkout flow
- [ ] Stripe integration (card payments)
- [ ] Razorpay integration (UPI, Net Banking)
- [ ] Order confirmation page + email

**Milestone:** End-to-end order flow live

---

## Phase 2: POS & Advanced Features (Weeks 17–28)

### Cycle 3 (Weeks 17–22): Point of Sale
- [ ] POS UI (product search, cart, payment)
- [ ] Cash payment + receipt printing
- [ ] Stripe Terminal integration
- [ ] Razorpay POS (QR code UPI)
- [ ] Offline mode (IndexedDB + Service Worker)
- [ ] Offline sync with conflict resolution
- [ ] Register management
- [ ] Shift open/close + Z-report
- [ ] Customer lookup at POS

**Milestone:** POS usable in real store, works offline

### Cycle 4 (Weeks 23–28): Marketing & CRM
- [ ] Customer profiles + segmentation (RFM)
- [ ] Discount engine (% , fixed, BOGO, free shipping)
- [ ] Coupon code system
- [ ] Abandoned cart recovery (email + push)
- [ ] Email campaign builder
- [ ] Loyalty points system
- [ ] Gift cards
- [ ] Referral program

---

## Phase 3: AI & Analytics (Weeks 29–38)

### Cycle 5 (Weeks 29–34): Analytics
- [ ] ClickHouse setup + event pipeline
- [ ] Sales dashboard (revenue, AOV, conversion)
- [ ] Product performance reports
- [ ] Customer acquisition analytics
- [ ] Real-time metrics (WebSocket)
- [ ] Custom report builder
- [ ] Export to CSV/Excel/PDF
- [ ] Master admin platform analytics

### Cycle 6 (Weeks 35–40): AI Features
- [ ] AI product description generator (Claude API)
- [ ] Semantic search with embeddings
- [ ] Product recommendations (collaborative filtering)
- [ ] Dynamic pricing suggestions
- [ ] Demand forecasting
- [ ] AI chatbot for storefront
- [ ] Auto-tagging products from images

---

## Phase 4: Mobile & Scale (Weeks 39–52)

### Cycle 7 (Weeks 39–44): Mobile App
- [ ] Expo Router setup + screens
- [ ] Product browsing + search
- [ ] Cart + checkout (Apple Pay / Google Pay)
- [ ] Order tracking
- [ ] Push notifications
- [ ] Biometric auth
- [ ] Offline catalog browse

### Cycle 8 (Weeks 45–50): Integrations & Scale
- [ ] Shopify import tool
- [ ] Amazon / Flipkart marketplace sync
- [ ] ERP integration framework
- [ ] Zapier / Make connectors
- [ ] Multi-region deployment
- [ ] Performance optimization pass (LCP < 2s)
- [ ] Load testing (k6)

### Cool-down (Weeks 51–52): Launch Prep
- [ ] Security audit (external pen test)
- [ ] GDPR/DPDPA compliance review
- [ ] Documentation finalization
- [ ] Marketing website
- [ ] Onboarding flow polish
- [ ] Launch! 🚀

---

## Team Workflow

### Git Branching Strategy (Trunk-Based)
```
main          ← Production (protected, requires 2 reviews)
  └─ develop  ← Staging (protected, requires 1 review)
       ├─ feature/NC-123-product-variants
       ├─ fix/NC-456-checkout-bug
       └─ chore/NC-789-upgrade-nextjs
```

### PR Template
```markdown
## Summary
<!-- What does this PR do? -->

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Chore / Dependency

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if UI change)

## Related Issues
Closes #

## Deployment Notes
<!-- DB migrations? Feature flags? Config changes needed? -->
```

### Code Review Standards
- All PRs reviewed by at least 1 peer (2 for main)
- No PR > 400 lines of diff (break it up)
- Tests required for new business logic
- No `TODO` comments merged (use Linear tickets)
- PR must be green (CI passes) before review
- Self-review checklist before requesting review

---

## Definition of Done

A feature is "Done" when:
- [ ] Code written + peer reviewed
- [ ] Unit tests ≥ 80% coverage for new code
- [ ] Integration tests for critical paths
- [ ] TypeScript — zero `any` usage
- [ ] Accessibility — keyboard navigable, WCAG AA
- [ ] Responsive — tested at 375px, 768px, 1280px
- [ ] Performance — no Lighthouse regression
- [ ] Security — no new vulnerabilities in audit
- [ ] Documentation updated (API docs, README)
- [ ] Demo'd to team/stakeholder
- [ ] Deployed to staging and smoke-tested

---

## Testing Strategy

```
Testing Pyramid:
                     ┌──────────────┐
                     │   E2E Tests  │  ← Playwright, key flows only
                     │  (critical   │     ~50 tests
                     │   user flows)│
                  ┌──┴──────────────┴──┐
                  │  Integration Tests  │  ← Real DB, real Redis
                  │  (API + DB layer)   │     ~200 tests
              ┌───┴────────────────────┴───┐
              │        Unit Tests           │  ← Pure business logic
              │  (services, algorithms,     │     ~500+ tests
              │   utils, validators)        │
              └─────────────────────────────┘

Coverage targets:
  packages/       → 90%+
  services/       → 80%+
  apps/           → 60%+ (UI components)
```

### Critical E2E Test Scenarios
1. Full checkout flow (guest + account)
2. POS sale + receipt
3. Offline POS → sync on reconnect
4. Admin creates product → visible on storefront
5. Order fulfillment + tracking
6. Discount code application
7. Tenant signup + provisioning
8. Multi-tenant data isolation

---

## Performance Budgets

| Metric | Target | Budget Exceeded → |
|--------|--------|-------------------|
| Storefront LCP | < 2.5s | Block PR merge |
| Storefront TTI | < 3.5s | Block PR merge |
| Admin JS bundle | < 500KB | Warning |
| API p99 latency | < 500ms | Alert + investigate |
| DB query time p95 | < 100ms | Investigate + index |
| Search p95 | < 50ms | Alert |

---

## Dependency Management

```bash
# Weekly automated updates via Renovate Bot
# .renovaterc.json configured for:
# - Patch updates: auto-merge
# - Minor updates: PR + review
# - Major updates: PR + team discussion

# Manual security audit weekly:
pnpm audit --audit-level=moderate

# Unused deps check monthly:
pnpm dlx depcheck
```

---

## Post-Launch Operations

### On-Call Rotation
- Week-by-week rotation among 3 senior engineers
- PagerDuty integration with Grafana alerts
- Runbooks for common incidents in Notion

### SLO Monitoring
```
Product SLOs:
  - API availability: 99.9% (< 43.8 min/month downtime)
  - Checkout success rate: > 99.5%
  - Search latency p99: < 200ms
  - POS offline sync: < 30s on reconnect

Error Budgets:
  - 0.1% budget = 43.8 min/month
  - When budget < 25% remaining → freeze new features, focus on reliability
  - When budget < 10% → incident review + mandatory reliability sprint
```