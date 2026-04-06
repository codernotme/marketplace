export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: "saas_admin" | "tenant_admin";
  tenant_id: string | null;
  action: string;
  meta: Record<string, unknown>;
  ip: string;
  created_at: string;
}

export const auditLogs: AuditLog[] = [
  {
    id: "log_001",
    actor_id: "admin_001",
    actor_role: "saas_admin",
    tenant_id: "tenant_001",
    action: "tenant.plan.changed",
    meta: { from_plan: "starter", to_plan: "pro" },
    ip: "192.168.1.100",
    created_at: "2024-04-06T12:30:00Z",
  },
  {
    id: "log_002",
    actor_id: "admin_002",
    actor_role: "saas_admin",
    tenant_id: "tenant_005",
    action: "tenant.suspended",
    meta: { reason: "Payment failed - 3 consecutive missed payments" },
    ip: "192.168.1.101",
    created_at: "2024-04-06T11:15:00Z",
  },
  {
    id: "log_003",
    actor_id: "admin_001",
    actor_role: "saas_admin",
    tenant_id: "tenant_004",
    action: "tenant.created",
    meta: { shop_name: "Books & Coffee", plan: "free" },
    ip: "192.168.1.100",
    created_at: "2024-03-28T07:45:00Z",
  },
  {
    id: "log_004",
    actor_id: "admin_001",
    actor_role: "saas_admin",
    tenant_id: "tenant_003",
    action: "tenant_config.updated",
    meta: { fields: ["razorpay_key_id", "resend_api_key"] },
    ip: "192.168.1.100",
    created_at: "2024-04-05T16:20:00Z",
  },
  {
    id: "log_005",
    actor_id: "admin_002",
    actor_role: "saas_admin",
    tenant_id: null,
    action: "admin.access.revoked",
    meta: { admin_id: "admin_003" },
    ip: "192.168.1.101",
    created_at: "2024-04-04T09:00:00Z",
  },
  {
    id: "log_006",
    actor_id: "admin_001",
    actor_role: "saas_admin",
    tenant_id: "tenant_006",
    action: "tenant.activated",
    meta: { onboarding_completed: true },
    ip: "192.168.1.100",
    created_at: "2024-01-07T10:00:00Z",
  },
  {
    id: "log_007",
    actor_id: "admin_001",
    actor_role: "saas_admin",
    tenant_id: "tenant_002",
    action: "announcement.published",
    meta: { announcement_id: "ann_001", visible_to: "all" },
    ip: "192.168.1.100",
    created_at: "2024-04-01T10:00:00Z",
  },
  {
    id: "log_008",
    actor_id: "admin_002",
    actor_role: "saas_admin",
    tenant_id: "tenant_001",
    action: "config.viewed",
    meta: { fields_viewed: ["razorpay_key", "resend_api"] },
    ip: "192.168.1.101",
    created_at: "2024-04-03T14:45:00Z",
  },
];
