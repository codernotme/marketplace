# themrktplace - Coding & Design Standards

## DESIGN & UI RULES
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) is the ONLY component library.
- **Styling**: Tailwind CSS v3 for all custom styling. No inline styles.
- **Responsiveness**: Fully responsive: mobile (320px+), tablet (768px+), desktop (1280px+).
- **Style Variant**: shadcn/ui "New York" style variant with neutral base color.
- **Theme**: Dark mode support mandatory on every component/screen using `next-themes`.
- **Icons**: [@hugeicons/react](https://hugeicons.com/) for all icons.
- **Typography**: Inter font via `next/font`. Strict hierarchy:
  - Page Title: `text-2xl font-semibold`
  - Section Heading: `text-lg font-medium`
  - Label: `text-sm font-medium text-muted-foreground`
  - Body: `text-sm`
- **Spacing**: Tailwind spacing scale. 
  - Page Padding: `px-4 md:px-6 lg:px-8`
  - Section Gap: `gap-6`
  - Card Padding: `p-4 md:p-6`
- **Data Tables**: shadcn/ui Table + TanStack Table with sorting, pagination, and search.
- **Forms**: React Hook Form + Zod + shadcn/ui Form components. Every field must have a label, placeholder, and error message.
- **Loading States**: Use shadcn/ui Skeleton or `Loader2` (Lucide) with `animate-spin`. No blank screens.
- **Empty States**: Centered with icon, heading, description, and CTA button.
- **Notifications**: shadcn/ui Sonner (toaster) for all messages.
- **Modals**: shadcn/ui Dialog or AlertDialog. No browser `confirm()`.
- **Colors**: Use semantic tokens (`background`, `foreground`, `primary`, etc.). No hardcoded hex colors.

## ARCHITECTURE RULES
- **Module-Based**: Everything is a module in `modules/{module-name}/`.
- **Module Structure**:
  - `components/` - UI components
  - `hooks/` - Data fetching via TanStack Query
  - `store/` - Zustand slice for client state
  - `types/` - TS interfaces and Zod schemas
  - `utils/` - Helper functions
  - `index.ts` - Barrel export
- **Page Logic**: No business logic in page files; they only compose module components.
- **Data Fetching**: All server state through TanStack Query hooks. No direct API calls in components.
- **API Client**: Typed Axios instance in `lib/api.ts` with interceptors. No raw `fetch()`.
- **Shared Components**:
  - `components/ui/` - shadcn primitives
  - `components/common/` - custom shared components (PageHeader, DataTable, etc.)
- **TypeScript**: Strict mode enabled. No `.js` or `.jsx`. No `any` types.
- **Path Aliases**:
  - `@/` -> Root directory
  - `@modules/` -> `modules/`
  - `@components/` -> `components/`
  - `@lib/` -> `lib/`

## QUALITY RULES
- **Validation**: Every form has client-side Zod validation matching the server schema.
- **Safety**: Destructive actions must have an `AlertDialog` confirmation.
- **Licensing**: Page-level license checks rendering `UpgradePrompt` for inactive modules.
- **Accessibility**: Keyboard navigable, ARIA attributes, `aria-label` for icon-only buttons.
- **Performance**: `React.memo` for heavy list items, `useMemo` for expensive data, lazy-load module pages with `next/dynamic`.
