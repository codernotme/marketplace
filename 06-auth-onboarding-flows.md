# Auth Flows & Admin Onboarding

---

## 1. Customer Auth Flows (Ecommerce Web + Mobile)

### 1.1 Register with Email + Password

```
User fills: name, email, password, phone (optional)
  ↓
POST /api/shop/auth/register
  ↓
Server: create user (is_email_verified=false) → generate OTP → send email via Resend
  ↓
Redirect to OTP verification screen (email pre-filled)
  ↓
User enters 6-digit OTP
  ↓
POST /api/shop/auth/verify-email { email, otp }
  ↓
Server: verify OTP → mark email verified → return JWT
  ↓
Store JWT in Zustand (web: httpOnly cookie or localStorage) → redirect to home
```

### 1.2 Login with Email + Password

```
POST /api/shop/auth/login { email, password }
  ↓ (if account exists, email verified, password matches)
Return { access_token, user }
  ↓
Store token → redirect to previous page (or home)

Error cases:
  → email not verified: prompt OTP resend
  → wrong password: show error, allow 5 attempts before 15min lockout
  → account inactive: show "contact support" message
```

### 1.3 Passwordless OTP Login

```
User enters email only
  ↓
POST /api/shop/auth/login/otp { email }
  ↓
Server: if user exists → send OTP; if not → create user + send OTP (auto-register)
  ↓
User enters OTP
  ↓
POST /api/shop/auth/login/otp/verify { email, otp }
  ↓
Return JWT → store → redirect
```

### 1.4 Forgot Password

```
User enters email
  ↓
POST /api/shop/auth/forgot-password { email }
  ↓
Server: send OTP with purpose=password_reset (don't reveal if email exists)
  ↓
OTP verification screen
  ↓
POST /api/shop/auth/reset-password { email, otp, new_password }
  ↓
Server: verify OTP → hash new password → update user → invalidate all refresh tokens
  ↓
Redirect to login with success toast
```

### 1.5 Google OAuth (Optional)

```
User clicks "Continue with Google"
  ↓
Redirect to /api/shop/auth/google
  ↓
Google OAuth consent screen
  ↓
Callback: /api/shop/auth/google/callback
  ↓
Server: find or create user with auth_provider=google
  ↓
Return JWT → redirect with token in URL fragment → store in state → redirect to home
```

---

## 2. Route Guards (Frontend)

### Web (Next.js Middleware)
```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const authRoutes = ["/login", "/register", "/forgot-password"]
  const protectedRoutes = ["/account", "/checkout"]

  if (protectedRoutes.some(r => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url))
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }
}
```

### Client-Side AuthGuard Component (existing in codebase)
```tsx
// components/shared/AuthGuard.tsx
export function AuthGuard({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (role && user?.role !== role) {
      router.push("/")
    }
  }, [isAuthenticated, user, role])

  if (!isAuthenticated) return <LoadingSpinner />
  return <>{children}</>
}
```

---

## 3. Admin Dashboard Auth (Shop Owner)

### 3.1 Login (after onboarding)

```
POST /api/shop/auth/login { email, password }
  → role must be shop_admin
  ↓
Return JWT with role=shop_admin, tenant_id
  ↓
Redirect to /dashboard
```

### 3.2 Admin Auth Guard
All `/dashboard/*` routes check:
1. Valid JWT present
2. `role === "shop_admin"` OR `role === "vendor"` OR `role === "manager"`
3. Tenant is active (status === "active")
4. If onboarding not complete → redirect to `/onboarding`

---

## 4. Shop Owner Onboarding (5-Step Flow)

This is the flow from your notebook sketch. Triggered after a shop owner is invited by the SaaS admin.

### Overview
```
Step 1: Basic Info
Step 2: Mail + Password
Step 3: Credentials (Razorpay, Telegram, DB)
Step 4: Verification (automated cred check)
Step 5: Setup Check → Done
```

### Step 1 — Basic Info
**Fields:**
- Shop Name (used as brand name)
- Brand Tagline (optional)
- Logo upload (image → S3/R2 → URL stored)
- Favicon upload (optional)
- Primary Color (color picker)
- Contact Email
- Contact Phone
- Shop Address (optional)

**On submit:**
```
POST /api/shop/onboarding/step/1
  → validate fields
  → update tenant.shop_name, shop_settings.general, shop_settings.branding
  → set onboarding_step = 2
  → return { next_step: 2 }
```

### Step 2 — Mail + Password
**Fields:**
- Admin email (pre-filled from invite, read-only)
- Create password (min 8 chars, 1 number, 1 uppercase)
- Confirm password
- (optional) Resend API Key — for sending store emails

**On submit:**
```
POST /api/shop/onboarding/step/2
  → hash password
  → update user.password_hash
  → store resend_api_key encrypted in tenant_configs
  → set onboarding_step = 3
```

### Step 3 — Credentials
**Fields:**
- Razorpay Key ID + Secret Key
  (with link to Razorpay dashboard, "where to find this" tooltip)
- Telegram Bot Token
  (with step-by-step: create bot via @BotFather, copy token)
- Telegram Chat ID
  (with guide: add bot to group/channel, use @userinfobot)
- MongoDB URI (optional — for enterprise tenants with dedicated DB)

**On submit:**
```
POST /api/shop/onboarding/step/3
  → encrypt all secrets with AES-256
  → store in tenant_configs
  → set onboarding_step = 4
```

### Step 4 — Verification
Automated checks run on the server.

**UI:**
- Loading state with per-service progress indicators
- ✅ / ❌ per service after check

**Checks:**
| Service | What's tested |
|---------|--------------|
| Razorpay | Fetch orders list (1 result) — validates key pair |
| Telegram | Send test message to chat_id |
| Resend | Send test email to owner's email |

```
POST /api/shop/onboarding/step/4/verify
  → runs verify_credentials() (see backend doc)
  → returns { razorpay: "ok|failed", telegram: "ok|failed", resend: "ok|failed" }
```

**If all pass:** "Next" button enabled → proceed to Step 5
**If some fail:** Show which failed + "Edit Credentials" link back to Step 3
**Razorpay is required**; Telegram and Resend failures show warnings but allow proceeding.

### Step 5 — Setup Check / Done

**UI:**
- Checklist summary:
  - [x] Shop info configured
  - [x] Admin login set
  - [x] Payment gateway connected
  - [x/~] Email service connected
  - [x/~] Telegram bot connected
- "Launch My Store" button

**On submit:**
```
POST /api/shop/onboarding/step/5/complete
  → set tenant.onboarding_complete = true
  → set tenant.status = "active"
  → set tenant.activated_at = now
  → send welcome email to owner (via Resend)
  → send Telegram: "🎉 Your store is live!"
  → notify SaaS admin via Telegram
  → return { redirect: "/dashboard" }
```

---

## 5. SaaS Admin Auth

### Login
```
POST /api/saas/auth/login { email, password }
  → verify against saas_admins collection
  → return JWT with role=superadmin|support (no tenant_id)
```

### Session
- JWT stored in httpOnly cookie
- Short expiry: 8 hours
- Refresh token: 7 days
- No public-facing routes — SaaS admin portal is a separate deployment

---

## 6. Token Strategy

| Token | Expiry | Storage | Notes |
|-------|--------|---------|-------|
| Access Token (JWT) | 15 min | Memory (Zustand) | Short lived |
| Refresh Token | 30 days | httpOnly Cookie | Silent refresh |
| SaaS Access Token | 8 hours | httpOnly Cookie | Admin portal only |
| OTP | 10 min | MongoDB (TTL index) | Max 5 attempts |
| Magic Link | 24 hours | MongoDB (TTL index) | Onboarding invite |

### Silent Refresh Flow
```
Request with expired access token
  ↓
401 Unauthorized response
  ↓
Axios interceptor catches 401
  ↓
POST /api/shop/auth/refresh (refresh token sent via cookie)
  ↓
New access token → retry original request
  ↓
If refresh also fails → logout + redirect to login
```

---

## 7. Roles & Permissions Matrix

| Action | customer | vendor | shop_admin | saas_admin |
|--------|----------|--------|------------|------------|
| Browse products | ✅ | ✅ | ✅ | ✅ |
| Place order | ✅ | ✅ | ✅ | — |
| View own orders | ✅ | ✅ | ✅ | — |
| Manage products | — | own only | all | — |
| Manage orders | — | own only | all | — |
| Access dashboard | — | vendor dash | full dash | — |
| Manage settings | — | — | ✅ | — |
| View all tenants | — | — | — | ✅ |
| Suspend tenant | — | — | — | superadmin |
| Change plan | — | — | — | superadmin |

---

## 8. Security Notes

- All passwords hashed with **bcrypt** (cost factor 12)
- OTPs hashed before storage (never stored plain)
- Razorpay secrets, Telegram tokens, Resend keys encrypted with **AES-256-GCM** at rest
- Encryption key stored only in server environment (never in DB)
- Rate limiting on all auth endpoints (10 req/min per IP via slowapi)
- CORS restricted to known frontend domains per tenant
- All admin routes require both valid JWT AND active tenant check
- Razorpay webhooks verified via HMAC-SHA256 signature before processing
