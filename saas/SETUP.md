# SaaS Admin Frontend

Modern, full-featured SaaS admin dashboard for theMrktPlace platform. Built with Next.js 16, TypeScript, React 19, and TailwindCSS.

## ✨ Features

### Authentication
- **JWT-based authentication** with secure token refresh
- **Protected routes** with role-based access control
- **Session persistence** via Zustand store
- **Auto-logout** on token expiry

### Dashboard Pages
- **Overview** - KPI metrics, revenue charts, and platform insights
- **Tenants** - Create, manage, and monitor marketplace shops
- **Tenant Details** - View configs, usage, and activity logs
- **Plans & Billing** - Manage subscription tiers and pricing
- **Announcements** - Send platform-wide notifications
- **Admins** - Invite and manage platform admins
- **Audit Logs** - Track all administrative actions
- **Settings** - Configure platform, email, and security

### UI Components
- **Modern dark theme** with orange accent colors
- **ShadcnUI components** with full customization
- **Responsive design** - Works on mobile, tablet, desktop
- **Real-time search & filtering** across all pages
- **Data tables** with sorting, pagination, actions
- **Charts & analytics** using Recharts
- **Loading states & error handling** throughout

### API Integration
- **Typed API client** with automatic token injection
- **Error handling** with auto-refresh retry logic
- **Mock data** support for development
- **Request/response types** fully typed with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommend 20 LTS)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and set your backend API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-updates on file changes.

### Build for Production

```bash
npm run build
npm start
```

### Linting & Type Checking

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier (format code)
```

## 📁 Project Structure

```
saas/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (redirect)
│   ├── login/                  # Login page
│   └── dashboard/              # Protected dashboard routes
│       ├── layout.tsx          # Dashboard layout
│       ├── page.tsx            # Overview/KPI dashboard
│       ├── tenants/            # Tenant management
│       ├── plans/              # Plans & billing
│       ├── announcements/      # Announcements
│       ├── admins/             # Admin management
│       ├── audit-logs/         # Audit logs
│       └── settings/           # Platform settings
├── components/
│   ├── auth-guard.tsx          # Protected route wrapper
│   ├── dashboard-sidebar.tsx   # Navigation sidebar
│   ├── dashboard-header.tsx    # Top bar with search
│   ├── providers.tsx           # Theme & global providers
│   ├── redirect.tsx            # Home redirect logic
│   └── ui/                     # ShadcnUI components
├── lib/
│   ├── api.ts                  # API client with auth
│   └── data/                   # Mock data for development
├── store/
│   └── saas-auth.store.ts      # Zustand auth store
├── types/
│   └── index.ts                # TypeScript type definitions
└── styles/
    └── globals.css             # Global styles
```

## 🔑 Key Files

### Authentication & API
- **`store/saas-auth.store.ts`** - Manages auth state, login, token refresh
- **`lib/api.ts`** - HTTP client with automatic token injection
- **`components/auth-guard.tsx`** - Wraps protected pages
- **`app/login/page.tsx`** - Login form with error handling

### Components
- **`components/dashboard-sidebar.tsx`** - Mobile-responsive sidebar navigation
- **`components/dashboard-header.tsx`** - Header with notifications
- **`app/dashboard/layout.tsx`** - Dashboard wrapper with auth guard

### Pages
All dashboard pages follow the same pattern:
1. Fetch data from API via `apiClient.get()`
2. Handle loading & errors gracefully
3. Fall back to mock data for demo
4. Display with ShadcnUI components
5. Support filtering, search, pagination

## 🔌 Backend Integration

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000         # Backend API base URL

# Optional
NEXT_PUBLIC_APP_NAME=theMrktPlace                 # App name in header
NEXT_PUBLIC_ENABLE_ANALYTICS=true                 # Feature flag
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true             # Feature flag
```

### API Endpoints Expected

The frontend expects these SaaS admin endpoints:

```
POST   /api/saas/auth/login                - Login
POST   /api/saas/auth/refresh              - Refresh token
POST   /api/saas/auth/logout               - Logout

GET    /api/saas/dashboard/metrics         - Dashboard KPIs
GET    /api/saas/tenants                   - List tenants (with filters)
GET    /api/saas/tenants/:id               - Get tenant details
PATCH  /api/saas/tenants/:id               - Update tenant
POST   /api/saas/tenants/:id/suspend       - Suspend tenant
POST   /api/saas/tenants/:id/activate      - Activate tenant

GET    /api/saas/plans                     - List plans
POST   /api/saas/plans                     - Create plan
PATCH  /api/saas/plans/:id                 - Update plan

GET    /api/saas/announcements             - List announcements
POST   /api/saas/announcements             - Create announcement
PATCH  /api/saas/announcements/:id         - Update announcement

GET    /api/saas/admins                    - List admins
POST   /api/saas/admins                    - Create admin
DELETE /api/saas/admins/:id                - Delete admin

GET    /api/saas/audit-logs                - List audit logs
```

See `05-backend-api.md` for complete endpoint documentation.

## 🎨 Theming

The app uses a **dark theme** by default with the following colors:
- **Background:** Slate-950 (`#030712`)
- **Cards:** Slate-900 (`#0f172a`)
- **Text:** White / Slate-300
- **Accent:** Orange (`#f97316` / `#ea580c`)
- **Success:** Green (`#22c55e`)
- **Error:** Red (`#ef4444`)

### Customizing Colors

Edit colors in component classes (e.g., `bg-orange-500`, `text-slate-400`) or update the Tailwind config.

## 📊 Mock Data

For development without a backend, the app falls back to mock data:
- **`lib/data/tenants.ts`** - Sample tenant data
- **`lib/data/plans.ts`** - Sample plans
- **`lib/data/admins.ts`** - Sample admins
- **`lib/data/audit-logs.ts`** - Sample audit logs

Remove the try-catch blocks to use API-only.

## 🧪 Testing

### Login Credentials (Demo)
```
Email: admin@themrktplace.com
Password: demo123456
```

### Test Workflows
1. **Login** - Test auth flow and token storage
2. **Dashboard** - View KPIs and charts
3. **Tenants** - List, search, filter, view details
4. **Create Tenant** - Form submission
5. **Plans** - View pricing tiers
6. **Announcements** - Create and publish
7. **Settings** - Update configuration

## 🚨 Common Issues

### API requests fail with 401
- Ensure `NEXT_PUBLIC_API_URL` points to your backend
- Check that backend is running
- Verify JWT token format in `saas-auth.store.ts`

### CORS errors
- Backend must allow `localhost:3000` origin
- Add CORS middleware to FastAPI backend

### Components not styling properly
- Run `npm run dev` to ensure Tailwind processes CSS
- Check that `globals.css` is imported in `layout.tsx`

### Mock data not loading
- API client falls back to mock only if API request fails
- Edit specific API call to remove try-catch

## 📖 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ShadcnUI Components](https://ui.shadcn.com)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Project Architecture Docs](../05-backend-api.md)

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/dashboard-improvements

# Make changes and commit
git add .
git commit -m "feat: add tenant search filter"

# Push and create PR
git push origin feature/dashboard-improvements
```

## 🤝 Contributing

1. Follow the code structure and naming conventions
2. Use TypeScript for type safety
3. Add proper error handling
4. Keep components modular and reusable
5. Update this README if adding new features

## 📄 License

Proprietary - theMrktPlace Platform
