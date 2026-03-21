# 🎨 DesignGuide.md
> Multi-Category Marketplace — Complete UI/UX Design System
> Stack: **Next.js 15 · HeroUI v2 · Tailwind CSS · Framer Motion**
> Inspired by: Wink Ecommerce · Nextgen · Nike — Editorial Minimalism

---

## 📖 Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Typography System](#3-typography-system)
4. [Spacing & Layout](#4-spacing--layout)
5. [Responsive Breakpoints](#5-responsive-breakpoints)
6. [HeroUI Configuration](#6-heroui-configuration)
7. [Core Component Patterns](#7-core-component-patterns)
8. [Page Design Specs](#8-page-design-specs)
9. [Auth Pages — Login & Signup](#9-auth-pages--login--signup)
10. [Admin Dashboard](#10-admin-dashboard)
11. [Mobile-First Rules](#11-mobile-first-rules)
12. [Motion & Animation](#12-motion--animation)
13. [Accessibility Checklist](#13-accessibility-checklist)
14. [Do's & Don'ts](#14-dos--donts)

---

## 1. Design Philosophy

### Direction: **Editorial Minimalism**

Drawn from high-fashion lookbooks, the Wink Ecommerce and Nextgen references — clean white space,
bold product photography, razor-thin borders, and purposeful motion. Every pixel serves the
product, never fights it.

```
The One Thing Users Remember → The product photography breathes. Nothing competes with it.
```

| Principle | Rule |
|---|---|
| **Breathing Room** | Generous whitespace — the product is the hero |
| **Typography First** | Large, confident display text; hierarchy is everything |
| **Monochrome Core** | Near-black + off-white + one warm accent |
| **Photography-led** | Cards are frames for the product, not decorative boxes |
| **Motion with Purpose** | Every animation has a reason; none are decorative |
| **Mobile-Native** | Bottom nav, thumb zones, swipeable drawers |

---

## 2. Design Tokens

### 2.1 Color Palette

```css
/* globals.css — paste these into :root */

:root {
  /* ─── Core Neutrals ─── */
  --c-white:        #FFFFFF;
  --c-off-white:    #F8F8F6;   /* page background */
  --c-surface:      #F2F2F0;   /* card bg, input fills, skeleton */
  --c-border:       #E8E8E4;   /* all default borders */
  --c-border-hover: #C8C8C2;   /* border on hover / focus */
  --c-muted:        #9A9A94;   /* placeholder, icon, meta text */
  --c-secondary:    #5A5A54;   /* secondary body text */
  --c-primary:      #1A1A18;   /* headings, primary text, CTAs */
  --c-black:        #0D0D0B;   /* darkest — used sparingly */

  /* ─── Accents ─── */
  --c-warm-gold:    #C8A882;   /* sale badges, star ratings, warm highlights */
  --c-success:      #4CAF82;   /* in-stock, success states */
  --c-danger:       #E05C5C;   /* errors, out-of-stock, active wishlist */
  --c-warning:      #F5A623;   /* low stock, warnings */
  --c-info:         #5B9BD5;   /* info banners, links */

  /* ─── Semantic Aliases ─── */
  --c-bg:           var(--c-off-white);
  --c-fg:           var(--c-primary);
  --c-card:         var(--c-white);
  --c-input-bg:     var(--c-surface);
  --c-placeholder:  var(--c-muted);
}

/* ─── Dark Mode (future-ready) ─── */
[data-theme="dark"] {
  --c-bg:           #111110;
  --c-fg:           #F0F0EE;
  --c-card:         #1C1C1A;
  --c-surface:      #242422;
  --c-border:       #2E2E2C;
  --c-border-hover: #484844;
  --c-muted:        #666662;
  --c-secondary:    #9A9A94;
  --c-primary:      #F0F0EE;
}
```

### 2.2 Color Usage Map

| Context | Color Token | Notes |
|---|---|---|
| Page background | `--c-bg` (#F8F8F6) | Slight warm off-white |
| Card / panel | `--c-card` (#FFFFFF) | Pure white for contrast |
| Input fill | `--c-surface` (#F2F2F0) | Subtle fill when unfocused |
| All borders | `--c-border` (#E8E8E4) | Hairline — 1px only |
| Primary text | `--c-primary` (#1A1A18) | Near-black, warmer than #000 |
| Secondary text | `--c-secondary` (#5A5A54) | Body copy, descriptions |
| Muted / meta | `--c-muted` (#9A9A94) | Captions, placeholders |
| CTA buttons | `--c-primary` bg + white text | Full black pill |
| Price display | `--c-primary` mono font | Bold, prominent |
| Star ratings | `--c-warm-gold` (#C8A882) | Never yellow — warm gold |
| Sale / discount | `--c-primary` bg pill | `-30%` in white on black |
| New arrival | `--c-warm-gold` bg pill | "New" badge |
| Success / stock | `--c-success` (#4CAF82) | Green dot + label |
| Danger / error | `--c-danger` (#E05C5C) | Wishlist active, errors |

### 2.3 Shadow System

```css
:root {
  --shadow-xs: 0 1px 2px rgba(26, 26, 24, 0.04);
  --shadow-sm: 0 2px 8px rgba(26, 26, 24, 0.06);
  --shadow-md: 0 4px 16px rgba(26, 26, 24, 0.08);
  --shadow-lg: 0 8px 32px rgba(26, 26, 24, 0.10);
  --shadow-xl: 0 16px 48px rgba(26, 26, 24, 0.14);
}
```

> **Rule:** Cards use `shadow-sm` at rest, `shadow-md` on hover. Never use dramatic shadows on flat UI.

### 2.4 Border Radius

```css
:root {
  --radius-xs:   4px;    /* status dots, micro tags */
  --radius-sm:   8px;    /* small buttons, input addons */
  --radius-md:   12px;   /* default cards, modals */
  --radius-lg:   16px;   /* large cards, drawers */
  --radius-xl:   20px;   /* image containers, hero cards */
  --radius-2xl:  28px;   /* bottom sheets on mobile */
  --radius-full: 9999px; /* pills, avatars, CTA buttons */
}
```

---

## 3. Typography System

### 3.1 Font Families

```tsx
// app/layout.tsx — Google Fonts import
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
})

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

// Apply: className={`${display.variable} ${body.variable} ${mono.variable}`}
```

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;  /* hero, product names */
  --font-body:    'DM Sans', system-ui, sans-serif;       /* all UI */
  --font-mono:    'DM Mono', monospace;                   /* prices, codes, SKUs */
}
```

### 3.2 Type Scale

```css
:root {
  /* Scale */
  --text-2xs:  0.625rem;  /* 10px — micro labels */
  --text-xs:   0.688rem;  /* 11px — badge text */
  --text-sm:   0.813rem;  /* 13px — meta, captions */
  --text-base: 0.938rem;  /* 15px — body copy */
  --text-md:   1.063rem;  /* 17px — card titles */
  --text-lg:   1.25rem;   /* 20px — section headings */
  --text-xl:   1.5rem;    /* 24px — page titles */
  --text-2xl:  2rem;      /* 32px — hero subheading */
  --text-3xl:  2.75rem;   /* 44px — hero heading desktop */
  --text-4xl:  4rem;      /* 64px — editorial display */
  --text-5xl:  6rem;      /* 96px — mega editorial */

  /* Line Heights */
  --leading-none:    1;
  --leading-tight:   1.1;
  --leading-snug:    1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.7;

  /* Letter Spacing */
  --tracking-tightest: -0.04em;
  --tracking-tight:    -0.02em;
  --tracking-normal:    0em;
  --tracking-wide:      0.06em;
  --tracking-wider:     0.10em;
  --tracking-widest:    0.15em; /* ALL CAPS labels only */
}
```

### 3.3 Typography Usage Table

| Element | Family | Size Token | Weight | Letter Spacing | Transform |
|---|---|---|---|---|---|
| Mega hero headline | `font-display` | `text-4xl` / `text-5xl` | 300 | `tracking-tightest` | — |
| Hero heading | `font-display` | `text-3xl` | 300–400 | `tracking-tight` | — |
| Product name (detail) | `font-display` | `text-2xl`–`text-3xl` | 400 | `tracking-tight` | — |
| Section heading | `font-body` | `text-xl` | 600 | `tracking-tight` | — |
| Product card title | `font-body` | `text-md` | 500 | normal | — |
| Body / description | `font-body` | `text-base` | 400 | normal | — |
| Price (all) | `font-mono` | `text-md`–`text-2xl` | 500–600 | `-0.02em` | — |
| Nav links | `font-body` | `text-sm` | 400 | `tracking-wide` | — |
| Button text | `font-body` | `text-sm` | 500 | `tracking-wide` | — |
| Badge / chip | `font-body` | `text-xs` | 500 | `tracking-widest` | `UPPERCASE` |
| Caption / meta | `font-body` | `text-sm` | 400 | normal | — |
| Category label | `font-body` | `text-xs` | 500 | `tracking-widest` | `UPPERCASE` |
| Table headers | `font-body` | `text-xs` | 500 | `tracking-widest` | `UPPERCASE` |
| Input label | `font-body` | `text-xs` | 500 | `tracking-widest` | `UPPERCASE` |

### 3.4 Tailwind Typography Classes

```tsx
// Reusable className strings — define as constants

export const TYPOGRAPHY = {
  heroDisplay:    "font-display text-4xl md:text-5xl font-light leading-tight tracking-[-0.04em]",
  heroHeading:    "font-display text-2xl md:text-3xl font-light leading-tight tracking-tight",
  sectionHeading: "font-body text-xl font-semibold tracking-tight text-[--c-primary]",
  cardTitle:      "font-body text-[17px] font-medium leading-snug text-[--c-primary]",
  body:           "font-body text-[15px] font-normal leading-relaxed text-[--c-secondary]",
  price:          "font-mono text-[17px] font-semibold tracking-[-0.02em] text-[--c-primary]",
  priceStrike:    "font-mono text-sm font-normal line-through text-[--c-muted]",
  navLink:        "font-body text-sm font-normal tracking-wide text-[--c-secondary]",
  buttonText:     "font-body text-sm font-medium tracking-wide",
  badgeText:      "font-body text-[11px] font-medium tracking-[0.15em] uppercase",
  caption:        "font-body text-sm text-[--c-muted]",
  categoryLabel:  "font-body text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-muted]",
  tableHeader:    "font-body text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-muted]",
  inputLabel:     "font-body text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-secondary]",
}
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

```
4px   → gap between inline icon + label
8px   → internal tight padding (badge, chip)
12px  → input vertical padding
16px  → base unit — standard list gaps, card internal padding (mobile)
20px  → card internal padding (tablet)
24px  → card internal padding (desktop)
32px  → between sections (mobile)
48px  → between sections (tablet)
64px  → between major sections (desktop)
80px  → hero padding horizontal
96px  → hero padding vertical
```

### 4.2 Container Strategy

```tsx
// components/shared/PageWrapper.tsx
// Use this wrapper on every page

<div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
  {children}
</div>

// Section inner max-width (content doesn't stretch on ultra-wide)
<div className="max-w-[1280px] mx-auto">
  {children}
</div>
```

### 4.3 Grid System

| Breakpoint | Columns | Gutter | Product Grid |
|---|---|---|---|
| Mobile `< 640px` | 4 col | 12px | **2 columns** |
| Tablet `640–1023px` | 8 col | 16px | **2–3 columns** |
| Laptop `1024–1279px` | 12 col | 24px | **3 columns** |
| Desktop `1280–1439px` | 12 col | 24px | **4 columns** |
| Wide `≥ 1440px` | 12 col | 32px | **4 columns** |

```tsx
// Standard product grid
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

---

## 5. Responsive Breakpoints

### 5.1 Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs':  '390px',   // iPhone 14 Pro — smallest target
        'sm':  '640px',   // large phones landscape
        'md':  '768px',   // tablets portrait
        'lg':  '1024px',  // tablets landscape, small laptops
        'xl':  '1280px',  // desktops
        '2xl': '1440px',  // wide desktops
        '3xl': '1920px',  // ultra-wide (content stops at 1440)
      },
    },
  },
}
```

### 5.2 Mobile-Specific Layout Rules

```
Mobile (< 768px):
  ├── Navbar:         [☰ Menu]  [LOGO]  [🔍] [🛒]
  ├── Bottom Nav:     [Home] [Search] [Wishlist] [Cart] [Profile]
  ├── Filter:         Full-screen bottom sheet drawer
  ├── Product grid:   2 columns, 3:4 image ratio
  ├── Product detail: Stacked — images full width, then info
  ├── Cart:           Bottom sheet or full page
  └── Checkout:       Single column, one step per screen

Tablet (768px–1023px):
  ├── Navbar:         Full navbar, compressed
  ├── No bottom nav:  Use top navbar
  ├── Product grid:   3 columns
  ├── Product detail: 50/50 split
  └── Sidebar filters:Collapsible accordion, no fixed sidebar

Desktop (≥ 1024px):
  ├── Navbar:         Full two-row navbar (main + sub-category bar)
  ├── Product grid:   3–4 columns
  ├── Sidebar:        Fixed left sidebar 224px, sticky on scroll
  ├── Product detail: 55/45 split (gallery / info)
  └── Cart:           Right-side drawer (420px wide)
```

### 5.3 Touch Target Rules

```
Minimum touch target:   44 × 44px (iOS HIG standard)
Recommended:            48 × 48px
Button height min:      48px on mobile
Input height min:       52px on mobile
Icon buttons:           44px diameter minimum
Bottom nav items:       Touch area ≥ 56px
```

---

## 6. HeroUI Configuration

### 6.1 Provider + Theme Setup

```tsx
// app/providers.tsx
'use client'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
```

### 6.2 heroui.config.ts — Full Theme Override

```ts
// heroui.config.ts
import { heroui } from '@heroui/react'

export const herouiPlugin = heroui({
  themes: {
    light: {
      colors: {
        background:  '#F8F8F6',
        foreground:  '#1A1A18',
        divider:     '#E8E8E4',
        focus:       '#1A1A18',

        primary: {
          50:        '#F0F0EE',
          100:       '#D8D8D4',
          200:       '#C0C0BA',
          300:       '#A8A8A0',
          400:       '#909086',
          500:       '#787870',
          600:       '#5A5A54',
          700:       '#3C3C38',
          800:       '#2A2A26',
          900:       '#1A1A18',
          DEFAULT:   '#1A1A18',
          foreground:'#FFFFFF',
        },
        secondary: {
          DEFAULT:   '#5A5A54',
          foreground:'#FFFFFF',
        },
        success: {
          DEFAULT:   '#4CAF82',
          foreground:'#FFFFFF',
        },
        warning: {
          DEFAULT:   '#F5A623',
          foreground:'#FFFFFF',
        },
        danger: {
          DEFAULT:   '#E05C5C',
          foreground:'#FFFFFF',
        },
      },
      layout: {
        radius: {
          small:  '8px',
          medium: '12px',
          large:  '16px',
        },
        borderWidth: {
          small:  '1px',
          medium: '1px',
          large:  '1.5px',
        },
        boxShadow: {
          small:  '0 2px 8px rgba(26,26,24,0.06)',
          medium: '0 4px 16px rgba(26,26,24,0.08)',
          large:  '0 8px 32px rgba(26,26,24,0.10)',
        },
      },
    },
  },
})
```

---

## 7. Core Component Patterns

### 7.1 Buttons

```tsx
// ─── PRIMARY — Full black pill ───────────────────────────────
<Button
  className="
    bg-[#1A1A18] text-white rounded-full
    px-8 h-12 text-sm font-medium tracking-wide
    hover:bg-[#2E2E2A] active:scale-[0.98]
    transition-all duration-200 ease-out
    disabled:opacity-40 disabled:cursor-not-allowed
  "
>
  Add to Cart
</Button>

// ─── SECONDARY — Outlined pill ──────────────────────────────
<Button
  variant="bordered"
  className="
    border border-[#1A1A18] text-[#1A1A18] rounded-full
    px-8 h-12 text-sm font-medium tracking-wide
    hover:bg-[#1A1A18] hover:text-white
    transition-all duration-200
  "
>
  View Details
</Button>

// ─── GHOST — Minimal text ────────────────────────────────────
<Button
  variant="light"
  className="
    text-[#5A5A54] hover:text-[#1A1A18]
    hover:bg-[#F2F2F0] rounded-xl
    text-sm font-medium
    transition-all duration-150
  "
  endContent={<ArrowRightIcon className="w-3.5 h-3.5" />}
>
  See All
</Button>

// ─── ICON BUTTON — Wishlist / Cart ──────────────────────────
<Button
  isIconOnly
  variant="flat"
  className="
    w-10 h-10 min-w-10 rounded-full
    bg-white border border-[#E8E8E4]
    hover:border-[#C8C8C2] hover:shadow-sm
    transition-all duration-150
  "
  aria-label="Add to wishlist"
>
  <HeartIcon className="w-4 h-4 text-[#9A9A94]" />
</Button>

// ─── DANGER ──────────────────────────────────────────────────
<Button
  color="danger"
  className="bg-[#E05C5C] text-white rounded-full px-6 h-10"
>
  Remove Item
</Button>

// ─── LOADING STATE ───────────────────────────────────────────
<Button
  isLoading
  className="bg-[#1A1A18] text-white rounded-full px-8 h-12"
  spinner={
    <span className="w-4 h-4 border-2 border-white/30 border-t-white
                     rounded-full animate-spin" />
  }
>
  Processing...
</Button>
```

### 7.2 Inputs & Form Fields

```tsx
// ─── Shared classNames object ────────────────────────────────
const inputClassNames = {
  label: `
    text-[11px] font-medium tracking-[0.15em] uppercase
    text-[#5A5A54] mb-1
  `,
  inputWrapper: `
    bg-white border border-[#E8E8E4] rounded-xl
    hover:border-[#C8C8C2]
    focus-within:border-[#1A1A18] focus-within:bg-white
    shadow-none transition-all duration-200
    h-12
  `,
  input: "text-sm text-[#1A1A18] placeholder:text-[#9A9A94]",
  errorMessage: "text-xs text-[#E05C5C] mt-1",
  helperWrapper: "pt-1",
}

// ─── Text Input ──────────────────────────────────────────────
<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  classNames={inputClassNames}
/>

// ─── Search Input ─────────────────────────────────────────────
<Input
  placeholder="Search products, brands..."
  classNames={{
    ...inputClassNames,
    inputWrapper: `
      bg-[#F2F2F0] border border-transparent rounded-full
      hover:border-[#C8C8C2] hover:bg-white
      focus-within:border-[#1A1A18] focus-within:bg-white
      transition-all duration-200 h-11
    `,
  }}
  startContent={
    <SearchIcon className="w-4 h-4 text-[#9A9A94] flex-shrink-0" />
  }
/>

// ─── Password Input ──────────────────────────────────────────
<Input
  type={showPassword ? "text" : "password"}
  label="Password"
  placeholder="Min. 8 characters"
  classNames={inputClassNames}
  endContent={
    <button
      type="button"
      onClick={() => setShowPassword(s => !s)}
      className="text-[#9A9A94] hover:text-[#1A1A18] transition-colors"
    >
      {showPassword
        ? <EyeOffIcon className="w-4 h-4" />
        : <EyeIcon className="w-4 h-4" />
      }
    </button>
  }
/>

// ─── Textarea ────────────────────────────────────────────────
<Textarea
  label="Review"
  placeholder="Share your thoughts about this product..."
  minRows={4}
  classNames={{
    label: inputClassNames.label,
    inputWrapper: `
      bg-white border border-[#E8E8E4] rounded-xl
      focus-within:border-[#1A1A18]
      transition-all duration-200
    `,
    input: "text-sm text-[#1A1A18] placeholder:text-[#9A9A94]",
  }}
/>

// ─── Select ──────────────────────────────────────────────────
<Select
  label="Sort By"
  classNames={{
    label: inputClassNames.label,
    trigger: `
      bg-white border border-[#E8E8E4] rounded-xl h-12
      data-[hover=true]:border-[#C8C8C2]
      data-[open=true]:border-[#1A1A18]
      shadow-none transition-all duration-200
    `,
    value: "text-sm text-[#1A1A18]",
    popoverContent: "rounded-xl border border-[#E8E8E4] shadow-lg bg-white p-1",
    listboxWrapper: "rounded-xl",
  }}
>
  <SelectItem key="popular">Most Popular</SelectItem>
  <SelectItem key="newest">Newest First</SelectItem>
  <SelectItem key="price_asc">Price: Low to High</SelectItem>
  <SelectItem key="price_desc">Price: High to Low</SelectItem>
  <SelectItem key="rating">Top Rated</SelectItem>
</Select>

// ─── Checkbox ────────────────────────────────────────────────
<Checkbox
  classNames={{
    base: "py-2 gap-3",
    wrapper: `
      rounded-sm border-[#C8C8C2]
      data-[selected=true]:bg-[#1A1A18]
      data-[selected=true]:border-[#1A1A18]
      before:rounded-sm after:rounded-sm
    `,
    label: "text-sm text-[#5A5A54]",
  }}
>
  Remember me
</Checkbox>

// ─── Price Range Slider ───────────────────────────────────────
<Slider
  label="Price Range"
  minValue={0}
  maxValue={50000}
  step={500}
  defaultValue={[0, 15000]}
  formatOptions={{ style: 'currency', currency: 'INR' }}
  classNames={{
    base: "w-full",
    label: inputClassNames.label,
    filler: "bg-[#1A1A18]",
    thumb: `
      bg-[#1A1A18] border-2 border-white
      shadow-md w-5 h-5
      data-[dragging=true]:scale-110
      transition-transform
    `,
    track: "bg-[#E8E8E4] h-1",
    value: "font-mono text-xs text-[#5A5A54]",
  }}
/>
```

### 7.3 Chips & Badges

```tsx
// ─── Category pill — Active ─────────────────────────────────
<Chip
  className="
    bg-[#1A1A18] text-white text-[11px] font-medium
    tracking-[0.15em] uppercase rounded-full
    px-4 h-8 cursor-pointer
    transition-transform duration-150 active:scale-95
  "
>
  Men
</Chip>

// ─── Category pill — Inactive ────────────────────────────────
<Chip
  variant="bordered"
  className="
    border border-[#E8E8E4] text-[#5A5A54] text-[11px]
    font-medium tracking-[0.15em] uppercase rounded-full
    px-4 h-8 cursor-pointer
    hover:border-[#1A1A18] hover:text-[#1A1A18]
    transition-all duration-150
  "
>
  Women
</Chip>

// ─── Sale badge (-30%) ───────────────────────────────────────
<Chip
  className="
    bg-[#1A1A18] text-white text-[10px] font-medium
    tracking-[0.12em] uppercase rounded-sm
    px-2 h-5
  "
>
  -30%
</Chip>

// ─── New arrival badge ────────────────────────────────────────
<Chip
  className="
    bg-[#C8A882] text-white text-[10px] font-medium
    tracking-[0.12em] uppercase rounded-sm
    px-2 h-5
  "
>
  New
</Chip>

// ─── In Stock indicator ───────────────────────────────────────
<Chip
  className="bg-[#EDFAF4] text-[#4CAF82] text-xs font-medium rounded-full px-3 h-6"
  startContent={
    <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF82] flex-shrink-0" />
  }
>
  In Stock
</Chip>

// ─── Out of Stock ─────────────────────────────────────────────
<Chip
  className="bg-[#FEF0F0] text-[#E05C5C] text-xs font-medium rounded-full px-3 h-6"
  startContent={
    <span className="w-1.5 h-1.5 rounded-full bg-[#E05C5C] flex-shrink-0" />
  }
>
  Out of Stock
</Chip>

// ─── Order Status chips ───────────────────────────────────────
const STATUS_CHIP: Record<string, string> = {
  pending:   "bg-[#FFF8ED] text-[#F5A623]",
  confirmed: "bg-[#EEF5FF] text-[#5B9BD5]",
  shipped:   "bg-[#F0F0FE] text-[#7B7BF5]",
  delivered: "bg-[#EDFAF4] text-[#4CAF82]",
  cancelled: "bg-[#FEF0F0] text-[#E05C5C]",
}

<Chip className={`${STATUS_CHIP[order.status]} text-xs font-medium rounded-full px-3 h-6`}>
  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
</Chip>
```

### 7.4 Cards

```tsx
// ─── Product Card (grid) ─────────────────────────────────────
<Card
  isPressable
  className="
    bg-white border border-[#E8E8E4] rounded-2xl
    shadow-none hover:shadow-md hover:border-[#C8C8C2]
    transition-all duration-300 overflow-hidden
    group cursor-pointer
  "
  onPress={() => router.push(`/products/${product.slug}`)}
>
  <CardBody className="p-0">

    {/* ── Image container ── */}
    <div className="relative overflow-hidden aspect-[3/4] bg-[#F2F2F0]">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="
          object-cover object-top
          group-hover:scale-[1.04]
          transition-transform duration-500 ease-out
        "
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Wishlist button — appears on hover (desktop), always visible (mobile) */}
      <Button
        isIconOnly
        size="sm"
        className="
          absolute top-3 right-3
          bg-white/90 backdrop-blur-sm rounded-full
          shadow-sm w-8 h-8 min-w-8
          md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-200
        "
        onPress={() => toggleWishlist(product.id)}
        aria-label="Toggle wishlist"
      >
        <HeartIcon
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            isWishlisted
              ? 'fill-[#E05C5C] text-[#E05C5C]'
              : 'text-[#5A5A54]'
          }`}
        />
      </Button>

      {/* Badges — top left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {product.isNew && <NewBadge />}
        {product.discount && <SaleBadge discount={product.discount} />}
      </div>
    </div>

    {/* ── Product info ── */}
    <div className="p-3 md:p-4 space-y-2">
      <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#9A9A94]">
        {product.brand}
      </p>
      <h3 className="text-[15px] font-medium leading-snug text-[#1A1A18] line-clamp-2">
        {product.name}
      </h3>

      {/* Rating */}
      <StarRating value={product.rating} count={product.reviewCount} size="sm" />

      {/* Price row */}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="font-mono font-semibold text-[#1A1A18]">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.originalPrice && (
          <span className="font-mono text-xs text-[#9A9A94] line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>

  </CardBody>
</Card>

// ─── Stat Card (admin dashboard) ─────────────────────────────
<Card className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none p-6">
  <CardBody className="p-0">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#9A9A94] mb-2">
          {stat.label}
        </p>
        <p className="font-mono text-3xl font-semibold text-[#1A1A18]">
          {stat.value}
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] flex items-center justify-center">
        <stat.icon className="w-5 h-5 text-[#5A5A54]" />
      </div>
    </div>
    <div className="flex items-center gap-1.5 mt-4">
      {stat.trend > 0
        ? <TrendUpIcon className="w-3.5 h-3.5 text-[#4CAF82]" />
        : <TrendDownIcon className="w-3.5 h-3.5 text-[#E05C5C]" />
      }
      <span className={`text-xs font-medium ${stat.trend > 0 ? 'text-[#4CAF82]' : 'text-[#E05C5C]'}`}>
        {Math.abs(stat.trend)}%
      </span>
      <span className="text-xs text-[#9A9A94]">vs last month</span>
    </div>
  </CardBody>
</Card>
```

### 7.5 Tabs

```tsx
// ─── Pill tabs (category switcher) ──────────────────────────
<Tabs
  classNames={{
    base: "w-full overflow-x-auto",
    tabList: "bg-[#F2F2F0] rounded-full p-1 gap-1 flex-nowrap",
    tab: `
      rounded-full text-sm font-medium text-[#9A9A94]
      px-5 h-9 whitespace-nowrap
      data-[selected=true]:bg-white
      data-[selected=true]:text-[#1A1A18]
      data-[selected=true]:shadow-sm
      transition-all duration-200
    `,
    cursor: "hidden",
    panel: "pt-6",
  }}
>
  <Tab key="all" title="All" />
  <Tab key="men" title="Men" />
  <Tab key="women" title="Women" />
  <Tab key="kids" title="Kids" />
</Tabs>

// ─── Underline tabs (product detail info) ────────────────────
<Tabs
  variant="underlined"
  classNames={{
    tabList: "border-b border-[#E8E8E4] gap-6 p-0",
    tab: `
      text-sm font-medium text-[#9A9A94] pb-3 px-0
      data-[selected=true]:text-[#1A1A18]
    `,
    cursor: "bg-[#1A1A18] h-0.5 rounded-full",
    panel: "pt-5",
  }}
>
  <Tab key="desc" title="Description" />
  <Tab key="shipping" title="Shipping" />
  <Tab key="reviews" title="Reviews (41)" />
</Tabs>
```

### 7.6 Modal & Drawer

```tsx
// ─── Cart Drawer ─────────────────────────────────────────────
<Drawer
  isOpen={cartOpen}
  onOpenChange={setCartOpen}
  placement="right"
  classNames={{
    base: "max-w-[420px] w-[95vw]",
    backdrop: "bg-black/30 backdrop-blur-sm",
    header: "border-b border-[#E8E8E4] px-6 py-5 font-medium text-[#1A1A18]",
    body: "px-6 py-4 overflow-y-auto",
    footer: "border-t border-[#E8E8E4] px-6 py-5 flex-col gap-3",
    closeButton: "top-4 right-4 text-[#9A9A94] hover:text-[#1A1A18]",
  }}
>
  <DrawerContent>
    <DrawerHeader>Your Cart (3)</DrawerHeader>
    <DrawerBody>{/* cart items list */}</DrawerBody>
    <DrawerFooter>
      <div className="flex justify-between items-center mb-1 w-full">
        <span className="text-sm text-[#5A5A54]">Total</span>
        <span className="font-mono font-semibold text-lg text-[#1A1A18]">
          ₹4,299
        </span>
      </div>
      <Button className="w-full bg-[#1A1A18] text-white rounded-full h-12 text-sm font-medium tracking-wide">
        Proceed to Checkout
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

// ─── Mobile Filter Bottom Sheet ───────────────────────────────
<Drawer
  isOpen={filterOpen}
  onOpenChange={setFilterOpen}
  placement="bottom"
  classNames={{
    base: "rounded-t-3xl max-h-[90vh]",
    backdrop: "bg-black/30",
    header: "border-b border-[#E8E8E4] px-6 py-5",
    body: "px-6 pb-8 overflow-y-auto",
    footer: "border-t border-[#E8E8E4] px-6 py-5 grid grid-cols-2 gap-3",
  }}
>
  <DrawerContent>
    <DrawerHeader>Filter & Sort</DrawerHeader>
    <DrawerBody>{/* filter options */}</DrawerBody>
    <DrawerFooter>
      <Button variant="bordered" className="border-[#E8E8E4] text-[#1A1A18] rounded-full">
        Reset
      </Button>
      <Button className="bg-[#1A1A18] text-white rounded-full">
        Apply Filters
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

// ─── Confirmation Modal ────────────────────────────────────────
<Modal
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  classNames={{
    base: "rounded-2xl border border-[#E8E8E4] shadow-xl",
    backdrop: "bg-black/30 backdrop-blur-sm",
    header: "border-b border-[#E8E8E4] px-6 py-5 text-base font-medium",
    body: "px-6 py-5 text-sm text-[#5A5A54] leading-relaxed",
    footer: "border-t border-[#E8E8E4] px-6 py-5 gap-3",
    closeButton: "top-4 right-4",
  }}
>
  <ModalContent>
    <ModalHeader>Remove Item?</ModalHeader>
    <ModalBody>
      Are you sure you want to remove this item from your cart?
    </ModalBody>
    <ModalFooter>
      <Button variant="light" onPress={onClose} className="text-[#5A5A54] rounded-full">
        Cancel
      </Button>
      <Button className="bg-[#E05C5C] text-white rounded-full px-6">
        Remove
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### 7.7 Accordion (Product Description, FAQ)

```tsx
<Accordion
  className="border border-[#E8E8E4] rounded-2xl overflow-hidden"
  showDivider={false}
  itemClasses={{
    base: "border-b border-[#E8E8E4] last:border-0 px-0",
    title: "text-sm font-medium text-[#1A1A18] py-4 px-5",
    content: "text-sm text-[#5A5A54] leading-relaxed pb-5 px-5 pt-0",
    trigger: "py-0 px-0 hover:bg-[#F8F8F6] transition-colors",
    indicator: "text-[#9A9A94] mr-5",
    heading: "",
  }}
  selectionMode="multiple"
>
  <AccordionItem key="desc" title="Description & Fit">
    Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric...
  </AccordionItem>
  <AccordionItem key="shipping" title="Shipping & Delivery">
    <div className="grid grid-cols-2 gap-4">
      {SHIPPING_INFO.map(item => (
        <div key={item.label} className="flex gap-3">
          <item.icon className="w-4 h-4 text-[#9A9A94] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9A9A94]">
              {item.label}
            </p>
            <p className="text-sm text-[#1A1A18] font-medium mt-0.5">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </AccordionItem>
  <AccordionItem key="returns" title="Returns & Exchanges">
    Easy 30-day returns on all eligible products...
  </AccordionItem>
</Accordion>
```

### 7.8 Table (Admin)

```tsx
<Table
  aria-label="Orders table"
  classNames={{
    wrapper: "shadow-none border border-[#E8E8E4] rounded-2xl overflow-hidden",
    table: "min-w-full",
    thead: "[&>tr]:border-0",
    th: `
      bg-[#F8F8F6] text-[11px] font-medium tracking-[0.15em] uppercase
      text-[#9A9A94] border-b border-[#E8E8E4]
      first:pl-6 last:pr-6 py-4
    `,
    td: `
      text-sm text-[#1A1A18] border-b border-[#F2F2F0]
      last-of-type:border-0 py-4
      first:pl-6 last:pr-6
    `,
    tr: "hover:bg-[#FAFAF8] transition-colors duration-100",
  }}
  selectionMode="multiple"
  checkboxesProps={{
    classNames: {
      wrapper: "before:rounded-sm after:rounded-sm border-[#C8C8C2]",
    },
  }}
>
  <TableHeader>
    <TableColumn>ORDER</TableColumn>
    <TableColumn>CUSTOMER</TableColumn>
    <TableColumn>DATE</TableColumn>
    <TableColumn>AMOUNT</TableColumn>
    <TableColumn>STATUS</TableColumn>
    <TableColumn>ACTIONS</TableColumn>
  </TableHeader>
  <TableBody>
    {orders.map(order => (
      <TableRow key={order.id}>
        <TableCell>#{order.id}</TableCell>
        <TableCell>{order.customer}</TableCell>
        <TableCell>{order.date}</TableCell>
        <TableCell>
          <span className="font-mono font-medium">
            ₹{order.amount.toLocaleString('en-IN')}
          </span>
        </TableCell>
        <TableCell><StatusChip status={order.status} /></TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button isIconOnly size="sm" variant="flat"
                    className="rounded-lg w-8 h-8 bg-[#F2F2F0]">
              <EyeIcon className="w-3.5 h-3.5 text-[#5A5A54]" />
            </Button>
            <Button isIconOnly size="sm" variant="flat"
                    className="rounded-lg w-8 h-8 bg-[#F2F2F0]">
              <EditIcon className="w-3.5 h-3.5 text-[#5A5A54]" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 7.9 Pagination

```tsx
<Pagination
  total={20}
  initialPage={1}
  showControls
  classNames={{
    base: "flex justify-center",
    wrapper: "gap-1",
    item: `
      bg-white border border-[#E8E8E4] text-sm text-[#5A5A54]
      rounded-xl w-9 h-9 min-w-9
      hover:border-[#C8C8C2] hover:text-[#1A1A18]
      transition-all duration-150
    `,
    cursor: `
      bg-[#1A1A18] text-white rounded-xl shadow-none
      border-0
    `,
    prev: "rounded-xl border border-[#E8E8E4] bg-white",
    next: "rounded-xl border border-[#E8E8E4] bg-white",
    forwardIcon: "text-[#5A5A54]",
    ellipsis: "text-[#9A9A94]",
  }}
/>
```

### 7.10 Toast / Notification

```tsx
// Use with react-hot-toast or sonner
// Visual style:
{
  style: {
    background: '#1A1A18',
    color: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
  },
  duration: 3000,
  position: 'bottom-center',    // mobile
  // position: 'bottom-right',  // desktop
}

// Success toast
toast.success('Added to cart!', {
  icon: '✓',
  style: { background: '#4CAF82' },
})

// Error toast
toast.error('Something went wrong', {
  style: { background: '#E05C5C' },
})
```

---

## 8. Page Design Specs

### 8.1 Navbar — Two-Row Pattern

```tsx
// components/shared/Navbar.tsx

{/* ── Row 1: Brand + Nav + Actions ── */}
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E8E4]">
  <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4">

    {/* Hamburger (mobile) */}
    <Button isIconOnly variant="light" className="md:hidden rounded-xl w-10 h-10">
      <MenuIcon className="w-5 h-5" />
    </Button>

    {/* Logo — centered mobile, left desktop */}
    <div className="flex-1 md:flex-none flex justify-center md:justify-start">
      <Link href="/">
        <span className="font-display text-xl font-medium tracking-tight text-[#1A1A18]">
          Marketplace
        </span>
      </Link>
    </div>

    {/* Desktop nav links */}
    <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
      {NAV_LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-[#5A5A54] hover:text-[#1A1A18] tracking-wide
                     transition-colors duration-150 relative group"
        >
          {link.label}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1A1A18]
                           group-hover:w-full transition-all duration-300" />
        </Link>
      ))}
    </nav>

    {/* Right actions */}
    <div className="flex items-center gap-1.5 ml-auto md:ml-0">
      {/* Search — desktop inline, mobile icon */}
      <div className="hidden md:block w-52">
        <NavSearchBar />
      </div>
      <Button isIconOnly variant="light" className="md:hidden rounded-xl w-10 h-10">
        <SearchIcon className="w-5 h-5" />
      </Button>

      {/* Wishlist */}
      <Button isIconOnly variant="light" className="hidden md:flex rounded-xl w-10 h-10">
        <HeartIcon className="w-5 h-5" />
      </Button>

      {/* Cart with badge */}
      <Button
        isIconOnly
        variant="light"
        className="rounded-xl w-10 h-10 relative"
        onPress={() => setCartOpen(true)}
      >
        <ShoppingBagIcon className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
                           bg-[#1A1A18] text-white text-[10px] font-medium
                           flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Button>

      {/* User avatar */}
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            src={user?.avatar}
            size="sm"
            className="cursor-pointer w-8 h-8"
            fallback={<UserIcon className="w-4 h-4" />}
          />
        </DropdownTrigger>
        <DropdownMenu classNames={{ base: "rounded-xl border border-[#E8E8E4] shadow-lg" }}>
          <DropdownItem key="profile">My Profile</DropdownItem>
          <DropdownItem key="orders">My Orders</DropdownItem>
          <DropdownItem key="wishlist">Wishlist</DropdownItem>
          <DropdownItem key="logout" className="text-[#E05C5C]">Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>

  {/* ── Row 2: Category bar (desktop only) ── */}
  <div className="hidden md:flex items-center gap-4 px-8 py-2.5 overflow-x-auto scrollbar-none
                  border-t border-[#F2F2F0]">
    <Select
      placeholder="Categories"
      className="w-40 flex-shrink-0"
      classNames={{ trigger: "h-8 rounded-lg bg-transparent border-0 shadow-none text-sm" }}
    />
    {QUICK_LINKS.map(link => (
      <Link key={link} href="#"
            className="text-sm text-[#5A5A54] hover:text-[#1A1A18] whitespace-nowrap
                       tracking-wide transition-colors">
        {link}
      </Link>
    ))}
    <Divider orientation="vertical" className="h-4 bg-[#E8E8E4] mx-2" />
    <div className="flex gap-2">
      {GENDER_TABS.map(tab => (
        <Chip
          key={tab}
          className={`cursor-pointer rounded-full text-[11px] tracking-wider uppercase h-7 ${
            activeTab === tab
              ? 'bg-[#1A1A18] text-white'
              : 'border border-[#E8E8E4] text-[#5A5A54] hover:border-[#C8C8C2]'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Chip>
      ))}
    </div>
  </div>
</header>

{/* ── Mobile Bottom Navigation ── */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95
                backdrop-blur-md border-t border-[#E8E8E4]
                flex items-center justify-around px-2 pb-safe pt-2 h-[72px]">
  {BOTTOM_NAV.map(item => (
    <Link
      key={item.href}
      href={item.href}
      className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl
                  transition-colors duration-150 ${
        isActive(item.href)
          ? 'text-[#1A1A18]'
          : 'text-[#9A9A94]'
      }`}
    >
      <item.icon className="w-5 h-5" />
      <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
    </Link>
  ))}
</nav>
```

---

### 8.2 Product Listing Page

```tsx
// app/(shop)/products/page.tsx

<div className="max-w-[1440px] mx-auto">

  {/* ── Category banner ── */}
  <div className="relative h-48 md:h-64 mx-4 md:mx-8 mt-4 rounded-2xl overflow-hidden bg-[#F2F2F0]">
    <Image src={category.banner} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-center px-8">
      <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Collections</p>
      <h1 className="font-display text-white text-2xl md:text-4xl font-light leading-tight">
        {category.name}
      </h1>
      <p className="text-white/70 text-sm mt-2 hidden md:block max-w-md">
        {category.description}
      </p>
    </div>
  </div>

  {/* ── Breadcrumb ── */}
  <div className="px-4 md:px-8 py-4">
    <Breadcrumbs classNames={{ list: "gap-2" }}>
      <BreadcrumbItem href="/" className="text-xs text-[#9A9A94]">Home</BreadcrumbItem>
      <BreadcrumbItem className="text-xs text-[#1A1A18] font-medium">
        {category.name}
      </BreadcrumbItem>
    </Breadcrumbs>
  </div>

  <div className="flex gap-6 px-4 md:px-8 pb-16">

    {/* ── Desktop Sidebar Filters ── */}
    <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
      <div className="sticky top-24 space-y-6">

        {/* Brand filter */}
        <FilterGroup title="Brand">
          <CheckboxGroup>
            {brands.map(b => (
              <Checkbox
                key={b.slug}
                value={b.slug}
                classNames={{
                  base: "flex-row-reverse justify-between py-1.5 max-w-full",
                  label: "text-sm text-[#5A5A54] flex items-center gap-2",
                  wrapper: "rounded-sm border-[#C8C8C2] data-[selected=true]:bg-[#1A1A18]",
                }}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{b.name}</span>
                  <span className="text-xs text-[#9A9A94]">{b.count}</span>
                </span>
              </Checkbox>
            ))}
          </CheckboxGroup>
          <button className="text-xs text-[#1A1A18] font-medium underline underline-offset-2 mt-2">
            Show more
          </button>
        </FilterGroup>

        <Divider className="bg-[#E8E8E4]" />

        {/* Category filter */}
        <FilterGroup title="Category">
          <CheckboxGroup>{/* same pattern */}</CheckboxGroup>
        </FilterGroup>

        <Divider className="bg-[#E8E8E4]" />

        {/* Price range */}
        <FilterGroup title="Price Range">
          <Slider minValue={0} maxValue={50000} step={500} defaultValue={[0, 15000]}
                  classNames={{
                    filler: "bg-[#1A1A18]",
                    thumb: "bg-[#1A1A18] border-2 border-white shadow-md",
                    track: "bg-[#E8E8E4] h-1",
                  }} />
          <div className="flex justify-between mt-1.5">
            <span className="font-mono text-xs text-[#9A9A94]">₹0</span>
            <span className="font-mono text-xs text-[#9A9A94]">₹50,000</span>
          </div>
        </FilterGroup>

        <Divider className="bg-[#E8E8E4]" />

        {/* Rating filter */}
        <FilterGroup title="Rating">
          <RadioGroup>
            {[4, 3, 2, 1].map(r => (
              <Radio key={r} value={r.toString()}
                     classNames={{
                       wrapper: "border-[#C8C8C2]",
                       label: "text-sm text-[#5A5A54]",
                     }}>
                <div className="flex items-center gap-1.5">
                  <StarRating value={r} size="xs" />
                  <span>& above</span>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </FilterGroup>

      </div>
    </aside>

    {/* ── Product Grid ── */}
    <main className="flex-1 min-w-0">

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile filter trigger */}
          <Button
            variant="bordered"
            className="lg:hidden border-[#E8E8E4] text-[#1A1A18] text-sm rounded-xl h-10"
            startContent={<SlidersIcon className="w-4 h-4" />}
            onPress={() => setFilterOpen(true)}
          >
            Filter
          </Button>
          <p className="text-sm text-[#9A9A94]">
            <span className="text-[#1A1A18] font-medium">247</span> products
          </p>
        </div>
        <Select placeholder="Sort: Popular" className="w-44">
          <SelectItem key="popular">Most Popular</SelectItem>
          <SelectItem key="newest">Newest</SelectItem>
          <SelectItem key="price_asc">Price ↑</SelectItem>
          <SelectItem key="price_desc">Price ↓</SelectItem>
        </Select>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <Chip
              key={f.id}
              onClose={() => removeFilter(f.id)}
              className="bg-[#F2F2F0] text-[#1A1A18] text-xs rounded-full border border-[#E8E8E4]"
            >
              {f.label}
            </Chip>
          ))}
          <button onClick={clearAll}
                  className="text-xs text-[#E05C5C] underline underline-offset-2">
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {loading
          ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <Pagination total={12} initialPage={1} showControls />
      </div>
    </main>
  </div>
</div>
```

---

### 8.3 Product Detail Page

```tsx
// app/(shop)/products/[slug]/page.tsx

<div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
  <Breadcrumbs className="mb-6" />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-16">

    {/* ── Left: Image Gallery ── */}
    <div className="space-y-3">

      {/* Main image — tall portrait ratio */}
      <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden bg-[#F2F2F0]">
        <Image src={selectedImage} fill className="object-cover object-top" priority />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Chip className="bg-white/90 backdrop-blur-sm text-[#1A1A18] text-xs rounded-full
                           border border-[#E8E8E4] shadow-sm">
            {product.category}
          </Chip>
        </div>
      </div>

      {/* Thumbnail row — 4 across */}
      <div className="grid grid-cols-4 gap-2">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`
              aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200
              ${selectedImage === img ? 'border-[#1A1A18]' : 'border-transparent'}
            `}
          >
            <Image src={img} width={80} height={80}
                   className="object-cover w-full h-full" alt={`View ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>

    {/* ── Right: Product Info ── */}
    <div className="space-y-5 md:sticky md:top-24 md:self-start">

      {/* Category label */}
      <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#9A9A94]">
        {product.brand} · {product.category}
      </p>

      {/* Name + wishlist */}
      <div className="flex items-start gap-3 justify-between">
        <h1 className="font-display text-3xl md:text-4xl font-light leading-tight tracking-tight text-[#1A1A18]">
          {product.name}
        </h1>
        <Button isIconOnly variant="flat"
                className="rounded-full w-10 h-10 bg-[#F2F2F0] flex-shrink-0 mt-1">
          <HeartIcon className={wishlisted ? 'fill-[#E05C5C] text-[#E05C5C]' : 'text-[#5A5A54]'} />
        </Button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <StarRating value={product.rating} size="md" />
        <span className="text-sm text-[#9A9A94]">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Color selector */}
      <div>
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#9A9A94] mb-2.5">
          Color — <span className="text-[#1A1A18] normal-case font-normal text-sm">{selectedColor}</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {product.colors.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              title={c.name}
              className={`
                w-8 h-8 rounded-full border-2 transition-all duration-200
                ${selectedColor === c.name
                  ? 'border-[#1A1A18] scale-110 shadow-sm'
                  : 'border-transparent hover:border-[#C8C8C2]'
                }
              `}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#9A9A94]">
            Size
          </p>
          <button className="text-xs text-[#5A5A54] underline underline-offset-2">
            Size Guide
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={!product.availableSizes.includes(size)}
              className={`
                w-12 h-12 text-sm font-medium rounded-xl border
                transition-all duration-150
                ${selectedSize === size
                  ? 'bg-[#1A1A18] text-white border-[#1A1A18]'
                  : 'bg-white text-[#1A1A18] border-[#E8E8E4] hover:border-[#1A1A18]'
                }
                disabled:opacity-30 disabled:cursor-not-allowed
                disabled:line-through disabled:hover:border-[#E8E8E4]
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-3xl font-semibold text-[#1A1A18]">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.originalPrice && (
          <>
            <span className="font-mono text-lg text-[#9A9A94] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <Chip className="bg-[#1A1A18] text-white text-[10px] uppercase tracking-wider rounded-sm px-2 h-5">
              -{product.discount}%
            </Chip>
          </>
        )}
      </div>

      {/* Add to cart — sticky footer on mobile */}
      <div className="
        fixed bottom-[72px] left-0 right-0 px-4 pb-4
        md:static md:bottom-auto md:p-0
        bg-white/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
        border-t border-[#E8E8E4] md:border-0 pt-3 md:pt-0
        z-30 md:z-auto
      ">
        <Button
          className="w-full bg-[#1A1A18] text-white rounded-full h-13 text-sm font-medium tracking-wide
                     hover:bg-[#2E2E2A] active:scale-[0.99] transition-all duration-200"
          size="lg"
          startContent={<ShoppingBagIcon className="w-4 h-4" />}
        >
          Add to Cart
        </Button>
      </div>

      {/* Delivery countdown */}
      <div className="flex items-center gap-2.5 bg-[#F8F8F6] border border-[#E8E8E4]
                      rounded-xl px-4 py-3">
        <ClockIcon className="w-4 h-4 text-[#9A9A94] flex-shrink-0" />
        <span className="text-sm text-[#5A5A54]">
          Order in{' '}
          <strong className="text-[#1A1A18] font-mono">02:30:25</strong>{' '}
          to get next-day delivery
        </span>
      </div>

      {/* Accordion */}
      <ProductInfoAccordion product={product} />
    </div>
  </div>

  {/* Reviews Section */}
  <section className="mt-16 pt-10 border-t border-[#E8E8E4]">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-semibold tracking-tight">Rating & Reviews</h2>
      <Button variant="light" className="text-sm text-[#5A5A54]">See more</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">

      {/* Rating summary */}
      <div>
        <p className="font-display text-7xl font-light text-[#1A1A18]">
          {product.rating}
          <span className="text-2xl text-[#9A9A94]">/5</span>
        </p>
        <p className="text-sm text-[#9A9A94] mt-1">{product.reviewCount} reviews</p>

        {/* Bar chart */}
        <div className="mt-4 space-y-1.5">
          {[5, 4, 3, 2, 1].map(n => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-[#C8A882] text-xs">★</span>
              <span className="text-xs text-[#9A9A94] w-3">{n}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#E8E8E4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C8A882] transition-all duration-500"
                  style={{ width: `${(ratingDist[n] / product.reviewCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-5">
        {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
      </div>
    </div>
  </section>

  {/* You might also like */}
  <section className="mt-16">
    <h2 className="font-display text-3xl font-light text-center tracking-tight mb-8">
      You might also like
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </section>
</div>
```

---

## 9. Auth Pages — Login & Signup

### 9.1 Layout Pattern — Split Screen

```tsx
// Shared auth layout wrapper
// app/(auth)/layout.tsx

<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

  {/* Left — Editorial Image Panel (desktop only) */}
  <div className="hidden lg:flex relative overflow-hidden flex-col">
    <Image
      src="/images/auth-editorial.jpg"
      fill
      className="object-cover object-center"
      priority
    />
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />

    {/* Top logo */}
    <div className="relative z-10 p-10">
      <span className="font-display text-2xl font-light text-white tracking-tight">
        Marketplace
      </span>
    </div>

    {/* Bottom copy */}
    <div className="relative z-10 mt-auto p-10">
      <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
        New Collection · 2025
      </p>
      <h2 className="font-display text-5xl font-light text-white leading-tight tracking-tight mb-4">
        Discover Your<br />Perfect Style
      </h2>
      <p className="text-white/70 text-sm leading-relaxed max-w-sm">
        Join over 2 million shoppers who find their signature look every day.
      </p>

      {/* Testimonial */}
      <div className="mt-8 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <Avatar key={i} src={`/avatars/${i}.jpg`} size="sm"
                    className="border-2 border-white" />
          ))}
        </div>
        <p className="text-white/70 text-xs">
          <strong className="text-white font-medium">4.9 ★</strong>{' '}
          from 50,000+ reviews
        </p>
      </div>
    </div>
  </div>

  {/* Right — Form Panel */}
  <div className="flex flex-col justify-center items-center min-h-screen
                  px-6 sm:px-10 py-12 bg-[#F8F8F6]">

    {/* Mobile logo */}
    <div className="lg:hidden mb-10">
      <span className="font-display text-2xl font-light text-[#1A1A18]">Marketplace</span>
    </div>

    <div className="w-full max-w-[380px]">
      {children}
    </div>
  </div>
</div>
```

### 9.2 Login Form

```tsx
// app/(auth)/login/page.tsx
<div className="w-full">

  {/* Heading */}
  <div className="mb-8">
    <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A18] mb-1">
      Welcome back
    </h1>
    <p className="text-sm text-[#9A9A94]">
      Sign in to continue shopping
    </p>
  </div>

  {/* Social auth */}
  <div className="grid grid-cols-2 gap-3 mb-6">
    <Button
      variant="bordered"
      className="border border-[#E8E8E4] bg-white text-sm text-[#1A1A18]
                 rounded-xl h-11 hover:border-[#C8C8C2] transition-colors"
      startContent={
        <svg className="w-4 h-4" viewBox="0 0 24 24">{/* Google SVG */}</svg>
      }
    >
      Google
    </Button>
    <Button
      variant="bordered"
      className="border border-[#E8E8E4] bg-white text-sm text-[#1A1A18]
                 rounded-xl h-11 hover:border-[#C8C8C2] transition-colors"
      startContent={
        <svg className="w-4 h-4" viewBox="0 0 24 24">{/* Facebook/Apple SVG */}</svg>
      }
    >
      Apple
    </Button>
  </div>

  {/* Divider */}
  <div className="flex items-center gap-4 mb-6">
    <div className="flex-1 h-px bg-[#E8E8E4]" />
    <span className="text-xs text-[#9A9A94] whitespace-nowrap">or with email</span>
    <div className="flex-1 h-px bg-[#E8E8E4]" />
  </div>

  {/* Form */}
  <form onSubmit={handleLogin} className="space-y-4">
    <Input
      type="email"
      label="Email"
      placeholder="you@example.com"
      autoComplete="email"
      isRequired
      classNames={{
        label: "text-[11px] font-medium tracking-[0.15em] uppercase text-[#5A5A54]",
        inputWrapper: `
          bg-white border border-[#E8E8E4] rounded-xl h-12
          hover:border-[#C8C8C2]
          focus-within:border-[#1A1A18]
          shadow-none transition-all duration-200
        `,
        input: "text-sm text-[#1A1A18] placeholder:text-[#9A9A94]",
      }}
      startContent={<MailIcon className="w-4 h-4 text-[#9A9A94]" />}
    />

    <Input
      type={showPassword ? "text" : "password"}
      label="Password"
      placeholder="••••••••"
      autoComplete="current-password"
      isRequired
      classNames={{
        label: "text-[11px] font-medium tracking-[0.15em] uppercase text-[#5A5A54]",
        inputWrapper: `
          bg-white border border-[#E8E8E4] rounded-xl h-12
          hover:border-[#C8C8C2]
          focus-within:border-[#1A1A18]
          shadow-none transition-all duration-200
        `,
        input: "text-sm text-[#1A1A18] placeholder:text-[#9A9A94]",
      }}
      startContent={<LockIcon className="w-4 h-4 text-[#9A9A94]" />}
      endContent={
        <button
          type="button"
          onClick={() => setShowPassword(s => !s)}
          className="text-[#9A9A94] hover:text-[#1A1A18] transition-colors p-0.5"
          tabIndex={-1}
        >
          {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        </button>
      }
    />

    {/* Remember + Forgot */}
    <div className="flex items-center justify-between">
      <Checkbox
        size="sm"
        classNames={{
          wrapper: "rounded-sm border-[#C8C8C2] data-[selected=true]:bg-[#1A1A18]",
          label: "text-sm text-[#5A5A54]",
        }}
      >
        Remember me
      </Checkbox>
      <Link
        href="/forgot-password"
        className="text-sm text-[#1A1A18] underline underline-offset-2 hover:text-[#5A5A54]"
      >
        Forgot password?
      </Link>
    </div>

    {/* Error message */}
    {error && (
      <div className="flex items-center gap-2 bg-[#FEF0F0] border border-[#FBCFCF]
                      rounded-xl px-4 py-3">
        <AlertCircleIcon className="w-4 h-4 text-[#E05C5C] flex-shrink-0" />
        <p className="text-sm text-[#E05C5C]">{error}</p>
      </div>
    )}

    {/* CTA */}
    <Button
      type="submit"
      isLoading={loading}
      className="
        w-full bg-[#1A1A18] text-white rounded-full h-12
        text-sm font-medium tracking-wide
        hover:bg-[#2E2E2A] active:scale-[0.99]
        transition-all duration-200
      "
    >
      Sign In
    </Button>
  </form>

  {/* Register link */}
  <p className="text-center text-sm text-[#9A9A94] mt-6">
    Don't have an account?{' '}
    <Link href="/register"
          className="text-[#1A1A18] font-medium underline underline-offset-2">
      Create one free
    </Link>
  </p>
</div>
```

### 9.3 Register Form

```tsx
// app/(auth)/register/page.tsx

<div className="w-full">

  <div className="mb-8">
    <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A18] mb-1">
      Create your account
    </h1>
    <p className="text-sm text-[#9A9A94]">
      Join millions discovering their style
    </p>
  </div>

  <form onSubmit={handleRegister} className="space-y-4">

    {/* Name row */}
    <div className="grid grid-cols-2 gap-3">
      <Input label="First Name" placeholder="Aryan" {...authInputProps} />
      <Input label="Last Name" placeholder="Sharma" {...authInputProps} />
    </div>

    {/* Email */}
    <Input
      type="email"
      label="Email"
      placeholder="you@example.com"
      startContent={<MailIcon className="w-4 h-4 text-[#9A9A94]" />}
      {...authInputProps}
    />

    {/* Phone */}
    <Input
      type="tel"
      label="Phone"
      placeholder="98765 43210"
      startContent={
        <div className="flex items-center gap-1.5 border-r border-[#E8E8E4] pr-2 mr-1">
          <span className="text-sm">🇮🇳</span>
          <span className="text-sm text-[#5A5A54]">+91</span>
        </div>
      }
      {...authInputProps}
    />

    {/* Password */}
    <div className="space-y-2">
      <Input
        type="password"
        label="Password"
        placeholder="Min. 8 characters"
        endContent={<PasswordToggle />}
        {...authInputProps}
      />

      {/* Password strength bar */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  i <= strength
                    ? strength <= 1 ? 'bg-[#E05C5C]'
                      : strength === 2 ? 'bg-[#F5A623]'
                      : strength === 3 ? 'bg-[#C8A882]'
                      : 'bg-[#4CAF82]'
                    : 'bg-[#E8E8E4]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#9A9A94]">
            {['', 'Weak — add symbols', 'Fair — getting better', 'Good — almost there', '✓ Strong password'][strength]}
          </p>
        </div>
      )}
    </div>

    {/* Confirm password */}
    <Input
      type="password"
      label="Confirm Password"
      placeholder="Re-enter your password"
      isInvalid={confirmPassword !== password && confirmPassword.length > 0}
      errorMessage="Passwords do not match"
      endContent={<PasswordToggle />}
      {...authInputProps}
    />

    {/* Terms */}
    <Checkbox
      isRequired
      classNames={{
        base: "items-start gap-3",
        wrapper: "rounded-sm border-[#C8C8C2] mt-0.5 data-[selected=true]:bg-[#1A1A18]",
        label: "text-sm text-[#5A5A54] leading-relaxed",
      }}
    >
      I agree to the{' '}
      <Link href="/terms" className="text-[#1A1A18] underline">Terms of Service</Link>
      {' '}and{' '}
      <Link href="/privacy" className="text-[#1A1A18] underline">Privacy Policy</Link>
    </Checkbox>

    <Button
      type="submit"
      isLoading={loading}
      className="w-full bg-[#1A1A18] text-white rounded-full h-12
                 text-sm font-medium tracking-wide hover:bg-[#2E2E2A]
                 active:scale-[0.99] transition-all duration-200"
    >
      Create Account
    </Button>
  </form>

  <p className="text-center text-sm text-[#9A9A94] mt-6">
    Already have an account?{' '}
    <Link href="/login" className="text-[#1A1A18] font-medium underline underline-offset-2">
      Sign in
    </Link>
  </p>
</div>
```

### 9.4 OTP Verification

```tsx
// app/(auth)/verify/page.tsx

<div className="w-full text-center space-y-6">

  {/* Icon */}
  <div className="w-16 h-16 rounded-2xl bg-[#F2F2F0] border border-[#E8E8E4]
                  flex items-center justify-center mx-auto">
    <MailIcon className="w-7 h-7 text-[#1A1A18]" />
  </div>

  {/* Copy */}
  <div>
    <h2 className="text-xl font-semibold tracking-tight text-[#1A1A18] mb-1.5">
      Check your email
    </h2>
    <p className="text-sm text-[#9A9A94] leading-relaxed">
      We sent a 6-digit code to<br />
      <strong className="text-[#1A1A18] font-medium">{email}</strong>
    </p>
  </div>

  {/* 6-digit OTP input */}
  <div className="flex gap-3 justify-center">
    {Array(6).fill(0).map((_, i) => (
      <input
        key={i}
        ref={refs[i]}
        maxLength={1}
        inputMode="numeric"
        pattern="[0-9]"
        className="
          w-11 h-14 text-center text-xl font-semibold
          border-2 border-[#E8E8E4] rounded-xl
          bg-white text-[#1A1A18]
          focus:border-[#1A1A18] focus:outline-none
          transition-all duration-150
          caret-transparent
        "
        onChange={e => handleInput(i, e.target.value)}
        onKeyDown={e => handleBackspace(i, e)}
        onPaste={i === 0 ? handlePaste : undefined}
      />
    ))}
  </div>

  {/* Submit */}
  <Button
    onPress={verifyOTP}
    isLoading={loading}
    isDisabled={otp.join('').length < 6}
    className="w-full bg-[#1A1A18] text-white rounded-full h-12
               text-sm font-medium tracking-wide"
  >
    Verify Email
  </Button>

  {/* Resend */}
  <p className="text-sm text-[#9A9A94]">
    Didn't receive the code?{' '}
    {canResend
      ? (
        <button
          onClick={resendOTP}
          className="text-[#1A1A18] font-medium underline underline-offset-2"
        >
          Resend now
        </button>
      )
      : (
        <span>Resend in <strong className="text-[#1A1A18] font-mono">{countdown}s</strong></span>
      )
    }
  </p>

  <Link href="/login" className="text-sm text-[#9A9A94] hover:text-[#1A1A18]
                                  flex items-center justify-center gap-1.5">
    <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to login
  </Link>
</div>
```

### 9.5 Forgot Password

```tsx
// Step 1 — Email input
<div className="w-full space-y-6">
  <div className="w-14 h-14 rounded-2xl bg-[#F2F2F0] border border-[#E8E8E4]
                  flex items-center justify-center mx-auto">
    <KeyIcon className="w-6 h-6 text-[#1A1A18]" />
  </div>

  <div className="text-center">
    <h2 className="text-xl font-semibold tracking-tight text-[#1A1A18] mb-1.5">
      Forgot your password?
    </h2>
    <p className="text-sm text-[#9A9A94]">
      Enter your email and we'll send a reset link
    </p>
  </div>

  <Input
    type="email"
    label="Email Address"
    placeholder="you@example.com"
    startContent={<MailIcon className="w-4 h-4 text-[#9A9A94]" />}
    {...authInputProps}
  />

  <Button className="w-full bg-[#1A1A18] text-white rounded-full h-12 text-sm font-medium">
    Send Reset Link
  </Button>

  <Link href="/login"
        className="flex items-center justify-center gap-1.5 text-sm text-[#9A9A94]
                   hover:text-[#1A1A18] transition-colors">
    <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to login
  </Link>
</div>

// Step 2 — Success state
<div className="w-full text-center space-y-6">
  <div className="w-14 h-14 rounded-2xl bg-[#EDFAF4] flex items-center justify-center mx-auto">
    <CheckCircleIcon className="w-7 h-7 text-[#4CAF82]" />
  </div>
  <div>
    <h2 className="text-xl font-semibold text-[#1A1A18] mb-1.5">Check your email</h2>
    <p className="text-sm text-[#9A9A94]">
      We've sent a reset link to <strong className="text-[#1A1A18]">{email}</strong>.<br />
      The link expires in 30 minutes.
    </p>
  </div>
  <Button variant="bordered" className="border-[#E8E8E4] text-[#1A1A18] rounded-full px-6">
    Open email app
  </Button>
</div>
```

---

## 10. Admin Dashboard

### 10.1 Admin Layout

```tsx
// app/admin/layout.tsx

<div className="flex min-h-screen bg-[#F8F8F6]">

  {/* ── Sidebar ── */}
  <aside className="
    w-60 flex-shrink-0 bg-white border-r border-[#E8E8E4]
    sticky top-0 h-screen overflow-y-auto
    flex flex-col
  ">
    {/* Brand + admin badge */}
    <div className="px-5 py-5 border-b border-[#E8E8E4]">
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-medium text-[#1A1A18]">
          Marketplace
        </span>
        <Chip className="bg-[#1A1A18] text-white text-[10px] uppercase tracking-widest
                         rounded-sm h-5 px-2">
          Admin
        </Chip>
      </div>
    </div>

    {/* Admin profile */}
    <div className="px-5 py-4 border-b border-[#E8E8E4]">
      <div className="flex items-center gap-3">
        <Avatar
          src={admin.avatar}
          size="sm"
          className="flex-shrink-0"
          fallback={
            <div className="bg-[#F2F2F0] w-full h-full flex items-center justify-center">
              <span className="text-sm font-medium text-[#1A1A18]">
                {admin.name.charAt(0)}
              </span>
            </div>
          }
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1A1A18] truncate">{admin.name}</p>
          <p className="text-xs text-[#9A9A94] capitalize">{admin.role}</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {ADMIN_NAV_SECTIONS.map(section => (
        <div key={section.title} className="mb-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em]
                        text-[#9A9A94] px-3 mb-2">
            {section.title}
          </p>
          {section.items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-150
                ${isActive(item.href)
                  ? 'bg-[#1A1A18] text-white font-medium'
                  : 'text-[#5A5A54] hover:bg-[#F2F2F0] hover:text-[#1A1A18]'
                }
              `}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && (
                <span className={`
                  text-[10px] font-medium rounded-full px-1.5 py-0.5 min-w-[18px]
                  text-center leading-none
                  ${isActive(item.href) ? 'bg-white/20 text-white' : 'bg-[#E8E8E4] text-[#5A5A54]'}
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </nav>

    {/* Bottom: sign out */}
    <div className="p-3 border-t border-[#E8E8E4]">
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-sm text-[#9A9A94] hover:text-[#E05C5C] hover:bg-[#FEF0F0]
                          transition-all duration-150">
        <LogOutIcon className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  </aside>

  {/* ── Main content ── */}
  <div className="flex-1 min-w-0 flex flex-col">

    {/* Top bar */}
    <header className="h-16 bg-white border-b border-[#E8E8E4] px-6
                        flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-[#1A1A18]">
          {pageTitle}
        </h1>
        <p className="text-xs text-[#9A9A94]">{pageDescription}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button isIconOnly variant="flat"
                className="w-9 h-9 rounded-xl bg-[#F2F2F0] relative">
          <BellIcon className="w-4 h-4 text-[#5A5A54]" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full
                           bg-[#E05C5C] border-2 border-white" />
        </Button>
        <Button
          className="bg-[#1A1A18] text-white rounded-xl h-9 px-4 text-sm font-medium"
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>
    </header>

    {/* Page content */}
    <main className="flex-1 p-6 overflow-y-auto">
      {children}
    </main>
  </div>
</div>
```

### 10.2 Admin Dashboard Page

```tsx
// app/admin/dashboard/page.tsx

<div className="space-y-6">

  {/* Greeting */}
  <div>
    <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A18]">
      Good morning, Aryan 👋
    </h2>
    <p className="text-sm text-[#9A9A94] mt-1">
      Here's what's happening in your store today.
    </p>
  </div>

  {/* KPI stat cards — 4 column grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {KPI_STATS.map(stat => (
      <Card key={stat.key}
            className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none p-5">
        <CardBody className="p-0">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F2F2F0] flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-[#5A5A54]" />
            </div>
            <Chip className={`text-[10px] uppercase tracking-widest rounded-full h-5 px-2 ${
              stat.trend > 0
                ? 'bg-[#EDFAF4] text-[#4CAF82]'
                : 'bg-[#FEF0F0] text-[#E05C5C]'
            }`}>
              {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
            </Chip>
          </div>
          <p className="font-mono text-3xl font-semibold text-[#1A1A18] mb-1">
            {stat.value}
          </p>
          <p className="text-xs text-[#9A9A94] uppercase tracking-wide">{stat.label}</p>
        </CardBody>
      </Card>
    ))}
  </div>

  {/* Charts row */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

    {/* Revenue chart — takes 2/3 */}
    <Card className="lg:col-span-2 bg-white border border-[#E8E8E4] rounded-2xl shadow-none">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-[#1A1A18] tracking-tight">
              Revenue Overview
            </h3>
            <p className="text-xs text-[#9A9A94] mt-0.5">Last 12 months</p>
          </div>
          <Tabs
            size="sm"
            classNames={{
              tabList: "bg-[#F2F2F0] rounded-full p-0.5",
              tab: "rounded-full text-xs font-medium h-7 px-3 text-[#9A9A94]
                    data-[selected=true]:bg-white data-[selected=true]:text-[#1A1A18]
                    data-[selected=true]:shadow-sm transition-all",
              cursor: "hidden",
            }}
          >
            <Tab key="week" title="Week" />
            <Tab key="month" title="Month" />
            <Tab key="year" title="Year" />
          </Tabs>
        </div>
        {/* Chart area — use Recharts */}
        <RevenueChart data={revenueData} />
      </CardBody>
    </Card>

    {/* Category breakdown — 1/3 */}
    <Card className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none">
      <CardBody className="p-6">
        <h3 className="text-base font-semibold text-[#1A1A18] tracking-tight mb-6">
          Sales by Category
        </h3>
        <CategoryDonutChart data={categoryData} />
        <div className="mt-4 space-y-2">
          {categoryData.map(c => (
            <div key={c.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="text-sm text-[#5A5A54]">{c.name}</span>
              </div>
              <span className="font-mono text-sm text-[#1A1A18] font-medium">
                {c.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  </div>

  {/* Bottom row: Recent orders + Top products */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

    {/* Recent Orders */}
    <Card className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E8E4]">
          <h3 className="text-base font-semibold text-[#1A1A18] tracking-tight">
            Recent Orders
          </h3>
          <Button variant="light" size="sm" className="text-sm text-[#5A5A54]"
                  as={Link} href="/admin/orders">
            View all →
          </Button>
        </div>
        <div className="divide-y divide-[#F2F2F0]">
          {recentOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A18]">#{order.id}</p>
                <p className="text-xs text-[#9A9A94] mt-0.5">{order.customer}</p>
              </div>
              <StatusChip status={order.status} />
              <span className="font-mono text-sm font-medium text-[#1A1A18]">
                ₹{order.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>

    {/* Top Products */}
    <Card className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E8E4]">
          <h3 className="text-base font-semibold text-[#1A1A18] tracking-tight">
            Top Products
          </h3>
          <Button variant="light" size="sm" className="text-sm text-[#5A5A54]">
            View all →
          </Button>
        </div>
        <div className="divide-y divide-[#F2F2F0]">
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 px-6 py-4">
              <span className="font-mono text-sm text-[#9A9A94] w-5 flex-shrink-0">
                {i + 1}
              </span>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F2F2F0] flex-shrink-0">
                <Image src={p.image} width={40} height={40}
                       className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A18] truncate">{p.name}</p>
                <p className="text-xs text-[#9A9A94]">{p.unitsSold} sold</p>
              </div>
              <span className="font-mono text-sm font-medium text-[#1A1A18]">
                ₹{p.revenue.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  </div>
</div>
```

### 10.3 Admin Nav Structure

```ts
const ADMIN_NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard",   href: "/admin",            icon: HomeIcon,       badge: null },
      { label: "Analytics",   href: "/admin/analytics",  icon: BarChartIcon,   badge: null },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Products",    href: "/admin/products",   icon: BoxIcon,        badge: null },
      { label: "Categories",  href: "/admin/categories", icon: GridIcon,       badge: null },
      { label: "Inventory",   href: "/admin/inventory",  icon: PackageIcon,    badge: 3    }, // low stock
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders",      href: "/admin/orders",     icon: ShoppingBagIcon,badge: 12   },
      { label: "Payments",    href: "/admin/payments",   icon: CreditCardIcon, badge: null },
      { label: "Coupons",     href: "/admin/coupons",    icon: TagIcon,        badge: null },
      { label: "Reviews",     href: "/admin/reviews",    icon: StarIcon,       badge: 5    },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Customers",   href: "/admin/customers",  icon: UsersIcon,      badge: null },
      { label: "Vendors",     href: "/admin/vendors",    icon: StoreIcon,      badge: 2    }, // pending KYC
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings",    href: "/admin/settings",   icon: SettingsIcon,   badge: null },
    ],
  },
]
```

---

## 11. Mobile-First Rules

### 11.1 Layout Rules by Breakpoint

```
MOBILE (default — < 768px)
├── Body padding:      16px horizontal
├── Navbar:            [☰] [Logo] [🔍] [🛒] — 64px height
├── Bottom nav:        72px + safe-area — fixed, always visible
├── Product grid:      2 columns, gap-3
├── Product card:      Compact — 3px padding, smaller font
├── Product detail:    Full-width images → info below
├── Add to Cart:       Fixed bottom bar above bottom nav
├── Cart:              Bottom sheet (90vh max) or full page
├── Filters:           Full-screen bottom sheet
├── Checkout:          Single column, one step visible
├── Forms:             Full-width inputs, 52px height minimum
└── Typography:        Hero max text-3xl, body text-sm

TABLET (768px–1023px)
├── Body padding:      32px horizontal
├── Navbar:            Full nav (single row)
├── No bottom nav:     Use top navbar only
├── Product grid:      3 columns, gap-4
├── Product detail:    50/50 split
├── Sidebar filters:   Hidden by default, toggle sheet
└── Typography:        Hero max text-4xl

DESKTOP (≥ 1024px)
├── Body padding:      48–64px horizontal
├── Navbar:            Two rows (brand+nav / category bar)
├── Product grid:      4 columns, gap-5
├── Product detail:    55/45 image/info split
├── Sidebar filters:   Fixed 224px, sticky
├── Cart:              Right drawer 420px wide
└── Typography:        Hero text-5xl or bigger
```

### 11.2 Thumb Zone — Mobile Priority

```
SAFE THUMB ZONE (comfortable reach — bottom 40% of screen):
  ├── Primary CTA button (Add to Cart, Checkout)
  ├── Bottom navigation bar
  └── Cart total / checkout button in cart drawer

REACHABLE WITH STRETCH (middle 35% of screen):
  ├── Filter chips
  ├── Sort dropdown
  └── Search bar

HARD TO REACH (top 25% of screen):
  ├── Navbar brand/logo (fine — tap is rare)
  ├── Back button (acceptable — intentional gesture)
  └── Page title (display only)
```

### 11.3 Mobile-Specific CSS Utilities

```css
/* Add to globals.css */

/* Safe area for phones with notch/home indicator */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
.mb-safe {
  margin-bottom: env(safe-area-inset-bottom);
}

/* Hide scrollbar but keep functionality */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Snap scroll for carousels */
.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}
.snap-start {
  scroll-snap-align: start;
}

/* Touch highlight prevention */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Improve tap response */
button, a, [role="button"] {
  touch-action: manipulation;
}
```

---

## 12. Motion & Animation

### 12.1 Token Reference

```ts
// lib/motion.ts — reusable Framer Motion variants

export const EASING = {
  spring: [0.16, 1, 0.3, 1],      // snappy spring
  smooth: [0.4, 0, 0.2, 1],       // material standard
  bounce: [0.34, 1.56, 0.64, 1],  // slight overshoot
}

export const DURATION = {
  fast:   0.12,  // micro interactions (hover, focus)
  normal: 0.22,  // button states, chips
  slow:   0.38,  // modals, drawers, panels
  slower: 0.60,  // page transitions, skeleton fade
}
```

### 12.2 Page Load — Stagger Cards

```tsx
// Staggered product grid reveal

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
>
  {products.map(p => (
    <motion.div key={p.id} variants={cardVariants}>
      <ProductCard product={p} />
    </motion.div>
  ))}
</motion.div>
```

### 12.3 Drawer / Modal Entry

```tsx
// Slide in from right (cart drawer)
const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  show: {
    x: 0, opacity: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    x: '100%', opacity: 0,
    transition: { duration: 0.26, ease: [0.4, 0, 0.2, 1] }
  }
}

// Slide up from bottom (mobile sheet)
const sheetVariants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: '100%', transition: { duration: 0.26 } }
}
```

### 12.4 Product Image Zoom

```css
/* Pure CSS — no JS needed */
.product-image-container {
  overflow: hidden;
}

.product-image-container img {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-image-container:hover img {
  transform: scale(1.04);
}
```

### 12.5 Skeleton Loaders

```tsx
// ProductSkeleton — mirrors ProductCard layout exactly
<Card className="bg-white border border-[#E8E8E4] rounded-2xl shadow-none overflow-hidden">
  <CardBody className="p-0">
    <Skeleton className="aspect-[3/4] w-full rounded-none" />
    <div className="p-4 space-y-2.5">
      <Skeleton className="h-3 w-1/3 rounded-full" />
      <Skeleton className="h-4 w-3/4 rounded-full" />
      <Skeleton className="h-3 w-1/4 rounded-full" />
      <Skeleton className="h-4 w-1/2 rounded-full" />
    </div>
  </CardBody>
</Card>

// HeroUI Skeleton classNames
const skeletonClass = "bg-[#F2F2F0] after:via-[#E8E8E4]"
```

### 12.6 Button Micro-interactions

```css
/* Applied via className */
.btn-press {
  transition: transform 0.12s ease, background-color 0.15s ease;
}
.btn-press:active {
  transform: scale(0.97);
}

/* Heart/wishlist pulse on activate */
@keyframes heartPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  70%  { transform: scale(0.90); }
  100% { transform: scale(1); }
}
.heart-pop {
  animation: heartPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 13. Accessibility Checklist

```
COLOR CONTRAST
  ✅ All body text on bg:    #1A1A18 on #F8F8F6 = 17.8:1 (AAA)
  ✅ Secondary text on bg:   #5A5A54 on #F8F8F6 = 7.2:1  (AA)
  ✅ Muted text on bg:       #9A9A94 on #F8F8F6 = 3.8:1  (AA large)
  ✅ White on black button:  #FFFFFF on #1A1A18 = 17.8:1 (AAA)
  ⚠️ Check warm gold text on white (use only for decorative stars)

KEYBOARD NAVIGATION
  ✅ All buttons/links have visible focus ring:
     focus-visible:ring-2 focus-visible:ring-[#1A1A18] focus-visible:ring-offset-2
  ✅ Modal traps focus inside
  ✅ Drawer closes on Escape
  ✅ Tab order follows visual reading order

SEMANTICS
  ✅ <main>, <nav>, <header>, <footer>, <aside>, <section> used correctly
  ✅ All images have meaningful alt text (empty alt="" for decorative)
  ✅ Form inputs have associated <label> or aria-label
  ✅ Icon buttons have aria-label
  ✅ Loading states have aria-busy="true"
  ✅ Error messages linked with aria-describedby

TOUCH & MOBILE
  ✅ All tap targets ≥ 44×44px
  ✅ No hover-only interactions on touch devices
  ✅ Sufficient spacing between adjacent interactive elements (≥ 8px)
  ✅ Input fields don't zoom on focus (font-size ≥ 16px on iOS)
```

```tsx
// Apply globally to all focusable elements
// globals.css
*:focus-visible {
  outline: 2px solid #1A1A18;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## 14. Do's & Don'ts

### ✅ DO

```
DO use font-display (Cormorant Garamond) for product names and hero headings
DO use font-mono (DM Mono) for ALL prices — it makes them feel premium
DO use near-black (#1A1A18) — never pure #000000
DO use off-white (#F8F8F6) as the page background — never pure white
DO use 1px borders only — never thicker
DO give images room to breathe — never crop too tight
DO make product images 3:4 portrait ratio on listing, 4:5 on detail
DO use uppercase tracking-widest for ALL labels, badges, table headers
DO keep card hover effects subtle — shadow-md + slight border darkening
DO fade-in product grids with a stagger animation on page load
DO show skeleton loaders that exactly mirror the real component layout
DO use pill (rounded-full) buttons for all primary CTAs
DO use rounded-xl (12px) for cards, inputs, modals
DO always show item count on cart icon
DO use sticky "Add to Cart" button on mobile (fixed above bottom nav)
DO test all pages with bottom nav taking 72px + safe-area at the bottom
```

### ❌ DON'T

```
DON'T use Inter, Roboto, or system-ui as display fonts
DON'T use purple/blue gradients — the palette is monochromatic
DON'T use drop shadows heavier than shadow-md on cards
DON'T show sidebar filters on mobile — use bottom sheet instead
DON'T put primary CTA above the fold on mobile — keep it in thumb zone
DON'T use more than 3 font weights on any single page
DON'T use color alone to communicate state — always add text/icon
DON'T allow text to sit on top of product photography without a gradient overlay
DON'T use animation on every element — pick one high-impact moment per page
DON'T use border-radius > 24px on any UI element (except full pill)
DON'T forget to add pb-safe class to bottom nav and sticky footers
DON'T show empty states as just text — always pair with an illustration or icon
DON'T use yellow stars (#FFD700) — use warm gold (#C8A882) instead
DON'T hard-code currency — always use Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
DON'T place interactive elements in the top 25% of mobile screens
```

---

## Appendix: Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN QUICK REFERENCE                    │
├─────────────────┬───────────────────────────────────────────┤
│ Page BG         │ #F8F8F6                                    │
│ Card BG         │ #FFFFFF                                    │
│ Surface         │ #F2F2F0                                    │
│ Border          │ #E8E8E4 (1px only)                         │
│ Primary text    │ #1A1A18                                    │
│ Secondary text  │ #5A5A54                                    │
│ Muted text      │ #9A9A94                                    │
│ CTA button      │ #1A1A18 bg + white text + rounded-full     │
│ Stars           │ #C8A882 (warm gold — NOT yellow)           │
│ Success         │ #4CAF82                                    │
│ Danger          │ #E05C5C                                    │
├─────────────────┼───────────────────────────────────────────┤
│ Display font    │ Cormorant Garamond (weight 300–400)        │
│ Body font       │ DM Sans (weight 400–600)                   │
│ Mono font       │ DM Mono (prices, codes)                    │
├─────────────────┼───────────────────────────────────────────┤
│ Card radius     │ rounded-2xl (16px)                         │
│ Input radius    │ rounded-xl (12px)                          │
│ Button radius   │ rounded-full (pill)                        │
│ Badge radius    │ rounded-full or rounded-sm (sale)          │
├─────────────────┼───────────────────────────────────────────┤
│ Mobile grid     │ 2 columns                                  │
│ Tablet grid     │ 3 columns                                  │
│ Desktop grid    │ 4 columns                                  │
│ Product ratio   │ 3:4 (listing) / 4:5 (detail)              │
├─────────────────┼───────────────────────────────────────────┤
│ Mobile nav      │ Bottom bar (72px + safe-area)              │
│ Desktop nav     │ Two-row sticky (64px + 44px)               │
│ Cart            │ Right drawer 420px (desktop)               │
│ Filters         │ Left sidebar 224px (desktop only)          │
│ Filter mobile   │ Bottom sheet drawer                        │
└─────────────────┴───────────────────────────────────────────┘
```
