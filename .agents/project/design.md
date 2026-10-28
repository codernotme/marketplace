# Design: The Mrktplace

Summary: TSZ design system specification, OKLCH obsidian tokens, typography, and component states.

## Brand Personality
- Precise: Mathematical alignment, tabular figures, crisp borders.
- Refined: Restrained typography, subtle surface elevations.
- Uncluttered: High-density utility, zero decorative fluff.
- Never looks like: A generic pastel SaaS template with cartoonish illustrations or bubbly neon gradients.

## Three Signature Decisions
1. Tabular Typography: Inter with `tabular-nums` enforced on all prices, quantities, and totals.
2. Obsidian Canvas: Dark mode default with deep obsidian (`oklch(0.145 0 0)`) and champagne/zinc highlights.
3. Dual-Density Viewports: Full-screen tactical grid for POS terminal (zero scroll, large tap targets); expansive whitespace for admin analytics.

## Core Semantic Tokens (OKLCH)
| Token | Dark Mode (Default) | Light Mode | Usage |
| --- | --- | --- | --- |
| `--background` | `oklch(0.145 0 0)` | `oklch(1 0 0)` | Base canvas |
| `--foreground` | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` | Body text |
| `--card` | `oklch(0.205 0 0)` | `oklch(1 0 0)` | Card containers |
| `--primary` | `oklch(0.922 0 0)` | `oklch(0.205 0 0)` | Primary buttons, active states |
| `--muted` | `oklch(0.269 0 0)` | `oklch(0.97 0 0)` | Row hover, secondary surfaces |
| `--destructive` | `oklch(0.704 0.191 22.216)` | `oklch(0.577 0.245 27.325)` | Stock deduction, delete actions |
| `--border` | `oklch(1 0 0 / 10%)` | `oklch(0.922 0 0)` | 1px dividers |

## Component Lifecycle States
Every component supports: Default, Hover (150ms transition), Focus-visible (`ring-2 ring-ring`), Active (scale 0.98), Loading (`Skeleton`/`Spinner`), Empty (icon + description + CTA), and Disabled (`opacity-50`).

## Icons & Typography
- Icons: `@hugeicons/react` exclusively. Standard sizes: 18px (navigation), 20px (cards), 40px (empty states).
- Font: Inter loaded via `next/font`. Strict scale: Page Title (`text-2xl`), Section (`text-lg`), Body (`text-sm`), Data (`text-sm font-mono tabular-nums`).

## Handoff Contract
- Decisions: shadcn/ui "radix-maia" variant with neutral base is the sole primitive library.
- Open: Custom brand theme color customization per merchant storefront (Default: Merchant chooses primary accent, base layout remains monochrome).
- Next agent needs: Tokens are defined in `packages/ui/src/styles/globals.css`. Never use raw hex colors in code.

