// Auth Types
export interface SaasUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "support";
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: SaasUser;
  token: string;
}

// Tenant Types
export interface Tenant {
  _id: string;
  shop_name: string;
  shop_slug: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  logo_url?: string;
  brand_color?: string;
  status: "pending" | "active" | "suspended" | "deleted";
  plan: "free" | "starter" | "pro" | "enterprise";
  onboarding_step: number;
  onboarding_complete: boolean;
  created_at: string;
  activated_at?: string;
  suspended_at?: string;
  suspension_reason?: string;
  order_count: number;
  revenue: number;
}

export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  limit: number;
}

export interface TenantDetailResponse extends Tenant {}

// Plan Types
export interface Plan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly?: number;
  currency: string;
  features: PlanFeature[];
  max_products: number;
  max_orders_monthly: number;
  max_users: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  name: string;
  enabled: boolean;
}

export interface CreatePlanRequest {
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly?: number;
  currency: string;
  features: PlanFeature[];
  max_products: number;
  max_orders_monthly: number;
  max_users: number;
}

// Announcement Types
export interface Announcement {
  _id: string;
  title: string;
  content: string;
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
  content: string;
  type: "info" | "warning" | "success";
  severity: "low" | "medium" | "high";
  target_roles: string[];
}

// SaaS Admin Types
export interface SaasAdmin {
  _id: string;
  email: string;
  name: string;
  role: "superadmin" | "support";
  last_login?: string;
  created_at: string;
}

export interface CreateAdminRequest {
  email: string;
  name: string;
  role: "superadmin" | "support";
}

// Dashboard Metrics
export interface DashboardMetrics {
  total_tenants: number;
  active_tenants: number;
  pending_activations: number;
  suspended_tenants: number;
  monthly_revenue: number;
  total_orders: number;
  avg_plan_tier: string;
  growth_rate: number;
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
