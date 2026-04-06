"use client";

import { Card } from "@/components/ui/card";
import { auditLogs } from "@/lib/data/audit-logs";
import { admins } from "@/lib/data/admins";
import { tenants } from "@/lib/data/tenants";

export function AuditFeed() {
  const getAdminName = (adminId: string) => {
    return admins.find((a) => a.id === adminId)?.name || "Unknown Admin";
  };

  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return "Platform";
    return tenants.find((t) => t.id === tenantId)?.shop_name || "Unknown Tenant";
  };

  const actionLabels: Record<string, string> = {
    "tenant.plan.changed": "Plan Changed",
    "tenant.suspended": "Suspended",
    "tenant.created": "Created",
    "tenant_config.updated": "Config Updated",
    "admin.access.revoked": "Access Revoked",
    "tenant.activated": "Activated",
    "announcement.published": "Announcement Published",
    "config.viewed": "Config Viewed",
  };

  const recentLogs = auditLogs.slice(0, 6);

  return (
    <Card className="p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4">Recent Audit Logs</h3>
      <div className="space-y-3">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-start justify-between py-3 border-b border-gray-200 last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {getAdminName(log.actor_id)} {actionLabels[log.action] || log.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getTenantName(log.tenant_id)} • {new Date(log.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
              {log.actor_role === "saas_admin" ? "SaaS Admin" : "Tenant Admin"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

