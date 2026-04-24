// ─── Tenant / Store ───────────────────────────────────────────────────────────

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'starter' | 'pro' | 'enterprise'
  createdAt: Date
  updatedAt: Date
}

export interface Store {
  id: string
  tenantId: string
  name: string
  address: string | null
  phone: string | null
  currency: string
  timezone: string
  createdAt: Date
  updatedAt: Date
}

// ─── Users / Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'manager' | 'cashier' | 'staff'

export interface User {
  id: string
  tenantId: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JwtPayload {
  sub: string
  tenantId: string
  storeId: string
  role: UserRole
  iat: number
  exp: number
}

// ─── License ──────────────────────────────────────────────────────────────────

export type ModuleKey =
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'customers'
  | 'staff'
  | 'reports'
  | 'ecommerce'

export interface License {
  id: string
  tenantId: string
  module: ModuleKey
  isActive: boolean
  expiresAt: Date | null
}

// ─── Products / Inventory ─────────────────────────────────────────────────────

export interface Product {
  id: string
  storeId: string
  name: string
  description: string | null
  categoryId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  size: string | null
  color: string | null
  price: number
  costPrice: number | null
  imageUrl: string | null
}

export interface InventoryRecord {
  id: string
  variantId: string
  storeId: string
  quantity: number
  reservedQty: number
  updatedAt: Date
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export type SaleStatus = 'pending' | 'completed' | 'refunded' | 'voided'
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'mixed'

export interface Sale {
  id: string
  storeId: string
  customerId: string | null
  staffId: string | null
  status: SaleStatus
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  paymentMethod: PaymentMethod
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SaleItem {
  id: string
  saleId: string
  variantId: string
  quantity: number
  unitPrice: number
  discountAmount: number
  total: number
}

// ─── Customers ───────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  tenantId: string
  name: string
  email: string | null
  phone: string | null
  totalSpend: number
  totalOrders: number
  createdAt: Date
  updatedAt: Date
}

// ─── Staff / Shifts ───────────────────────────────────────────────────────────

export interface Staff {
  id: string
  userId: string
  storeId: string
  employeeCode: string
  position: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Shift {
  id: string
  staffId: string
  storeId: string
  startedAt: Date
  endedAt: Date | null
  openingCash: number
  closingCash: number | null
}

// ─── API Response Helpers ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
