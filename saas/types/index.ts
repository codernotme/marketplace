// Auth Types
export interface SaasUser {
  id: string;
  email: string;
  name: string;
  role: "saas_admin" | "saas_admin" | "support";
  is_verified: boolean;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: SaasUser;
  token: string;
  refresh_token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// Tenant Types
export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  owner_name: string;
  owner_email: string;
  owner_phone?: string;
  logo_url?: string;
  brand_color?: string;
  status: "pending" | "active" | "suspended" | "deleted";
  plan: "free" | "starter" | "intermediate" | "growth" | "enterprise";
  plan_code?: string;
  plan_name?: string;
  module_access?: Array<"shop" | "web" | "app">;
  onboarding_step: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at?: string;
  activated_at?: string;
  suspended_at?: string;
  suspension_reason?: string;
  order_count?: number;
  revenue?: number;
}

export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  limit: number;
}

export interface TenantDetailResponse extends Tenant { }

// Plan Types
export interface Plan {
  _id: string;
  code: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  currency: string;
  features: PlanFeature[];
  allowed_modules: Array<"shop" | "web" | "app">;
  requires_contact_sales: boolean;
  max_products: number;
  max_staff: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  name: string;
  enabled: boolean;
}

export interface CreatePlanRequest {
  code: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  currency: string;
  features: PlanFeature[];
  allowed_modules: Array<"shop" | "web" | "app">;
  requires_contact_sales: boolean;
  max_products: number;
  max_staff: number;
}

// Announcement Types
export interface Announcement {
  _id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "success";
  severity: "low" | "medium" | "high";
  target_roles: string[];
  is_active: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  body: string;
  type: "info" | "warning" | "success";
  severity: "low" | "medium" | "high";
  target_roles: string[];
}

// SaaS Admin Types
export interface SaasAdmin {
  _id: string;
  email: string;
  name: string;
  role: "saas_admin" | "support";
  is_verified: boolean;
  last_login?: string;
  created_at: string;
}

export interface CreateAdminRequest {
  email: string;
  name: string;
  role: "saas_admin" | "support";
  password: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  total_tenants: number;
  active_tenants: number;
  suspended_tenants: number;
  mrr: number;
}

// Audit Log
export interface AuditLog {
  _id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

export interface AuditLogResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: Record<string, unknown>;
}

// API Response Wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: "success" | "error";
}
