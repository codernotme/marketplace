# Antislop: The Mrktplace

Mode: full | Result: clean (0 tells, 0 smells)

## Scope
Scanned entire project tree, master documentation suite (`docs/`), root `README.md`, `AGENTS.md`, and TSZ ledger files.

## Four Lens Audit

| Lens | Status | Findings & Actions |
| --- | --- | --- |
| Visual | Pass | Custom OKLCH obsidian dark theme (`oklch(0.145 0 0)`), no raw hex values, no generic template look. Dual-density viewports configured. |
| Copy | Pass | Zero em dashes across all documentation, comments, and commit scopes. Concise, professional developer tone. No robotic boilerplate. |
| Code | Pass | Strict TypeScript compliance, zero `any` types. Strict module encapsulation (`modules/{domain}/`). Clean separation of page files and domain components. |
| Repo | Pass | Complete Turborepo monorepo configuration, standard Docker Compose, centralized `.env.example`, documented deployment workflow. |

## Signature Decisions Verified
1. Typography: Inter with `tabular-nums` enforced on all prices, quantities, and financial calculations.
2. Palette: Deep obsidian foundation with warm champagne gold and neutral zinc highlights.
3. Architecture: Full-screen dual-density POS terminal layout with offline Dexie.js sync and split tender billing.

## Standing Rules
- Never use em dashes in any documentation, comments, or commit messages.
- Never add AI comments or disclaimers.
- Do not commit or push without explicit approval.

