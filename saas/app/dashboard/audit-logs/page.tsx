"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auditLogs } from "@/lib/data/audit-logs";
import { admins } from "@/lib/data/admins";
import { tenants } from "@/lib/data/tenants";
import { Search } from "lucide-react";

const actionTypes = [
  "tenant.plan.changed",
  "tenant.suspended",
  "tenant.created",
  "tenant_config.updated",
  "admin.access.revoked",
  "tenant.activated",
  "announcement.published",
  "config.viewed",
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      admins.find((a) => a.id === log.actor_id)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenants.find((t) => t.id === log.tenant_id)?.shop_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesRole = roleFilter === "all" || log.actor_role === roleFilter;

    return matchesSearch && matchesAction && matchesRole;
  });

  const getAdminName = (adminId: string) => {
    return admins.find((a) => a.id === adminId)?.name || "Unknown";
  };

  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return "Platform";
    return tenants.find((t) => t.id === tenantId)?.shop_name || "Unknown";
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">Immutable record of all platform admin actions</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by admin or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Action</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {actionLabels[action] || action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="saas_admin">SaaS Admin</SelectItem>
                <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Admin</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IP Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{getAdminName(log.actor_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {actionLabels[log.action] || log.action}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{getTenantName(log.tenant_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {log.actor_role === "saas_admin" ? "SaaS Admin" : "Tenant Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 font-mono">{log.ip}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{new Date(log.created_at).toLocaleDateString()}</p>
                      <p className="text-gray-600">{new Date(log.created_at).toLocaleTimeString()}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No logs found matching your filters.
          </div>
        )}
      </Card>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Total logs:</span> {auditLogs.length} |{" "}
          <span className="font-medium">Filtered:</span> {filtered.length}
        </p>
      </div>
    </div>
  );
}
