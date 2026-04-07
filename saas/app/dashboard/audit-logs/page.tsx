"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { AuditLog } from "@/types";
import { Card, Button, Input, InputGroup, Chip, Modal, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const actionConfig: Record<string, { color: "success" | "accent" | "danger" | "warning" | "default", icon: string }> = {
  create: { color: "success", icon: "solar:add-circle-bold-duotone" },
  update: { color: "accent", icon: "solar:pen-new-square-bold-duotone" },
  delete: { color: "danger", icon: "solar:trash-bin-trash-bold-duotone" },
  suspend: { color: "warning", icon: "solar:shield-warning-bold-duotone" },
  activate: { color: "success", icon: "solar:check-circle-bold-duotone" },
  login: { color: "default", icon: "solar:key-bold-duotone" },
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = new URLSearchParams({
          limit: "50",
          ...(search && { search }),
        });
        const response = await apiClient.get<{ data: AuditLog[] }>(`/api/saas/audit-logs?${params.toString()}`);
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        // Mock data for demo
        setLogs([
          {
            _id: "log_001",
            admin_id: "admin_001",
            admin_email: "aryan@themrktplace.com",
            action: "update",
            resource_type: "tenant",
            resource_id: "65f2b1a2c3d4",
            changes: { status: "active", plan: "pro", activated_at: new Date().toISOString() },
            ip_address: "157.34.122.90",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
          {
            _id: "log_002",
            admin_id: "admin_001",
            admin_email: "aryan@themrktplace.com",
            action: "create",
            resource_type: "plan",
            resource_id: "65f2b5e2a1b2",
            changes: { name: "Enterprise Ultra", price_monthly: 999, currency: "USD" },
            ip_address: "157.34.122.90",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            _id: "log_003",
            admin_id: "admin_002",
            admin_email: "support@themrktplace.com",
            action: "suspend",
            resource_type: "tenant",
            resource_id: "65f2c2a3b1c2",
            changes: { status: "suspended", reason: "Policy violation: high risk activities" },
            ip_address: "192.168.1.45",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [search]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Admin,Action,Resource,IP Address\n"
      + logs.map(e => `${e.timestamp},${e.admin_email},${e.action},${e.resource_type},${e.ip_address}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Audit Logs"
        subtitle="Governance tracking and real-time platform activity"
        icon="solar:shield-check-bold-duotone"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold gap-2" onClick={handleExport}>
              <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
              Export CSV
            </Button>
            <Button variant="primary" className="font-bold gap-2">
              <Icon icon="solar:playback-speed-bold-duotone" className="text-lg" />
              Live Stream
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: "1,284", icon: "solar:activity-bold-duotone", color: "text-accent", bg: "bg-accent/10" },
          { label: "Security Alerts", value: "3", icon: "solar:shield-warning-bold-duotone", color: "text-danger", bg: "bg-danger/10" },
          { label: "Active Admins", value: "12", icon: "solar:users-group-rounded-bold-duotone", color: "text-secondary", bg: "bg-secondary/10" },
          { label: "System Health", value: "99.9%", icon: "solar:check-circle-bold-duotone", color: "text-success", bg: "bg-success/10" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border border-border bg-surface shadow-sm sm-stat-card">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon icon={stat.icon} className="text-xl" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <InputGroup className="max-w-md bg-default-100/50 border border-border/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <InputGroup.Prefix className="pl-3 text-muted-foreground">
            <Icon icon="solar:magnifer-linear" className="text-default-400" width={18} />
          </InputGroup.Prefix>
          <Input
            placeholder="Filter by admin, resource ID or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2"
          />
        </InputGroup>
      </div>

      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Admin Actor</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operation</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Target Resource</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Network Context</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Timestamp</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center">
                      <Spinner color="accent" />
                      <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Hydrating audit stream...</p>
                   </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-muted-foreground italic text-sm">
                      No matching audit entries found.
                   </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px] border border-accent/20">
                            {log.admin_email.substring(0, 2).toUpperCase()}
                         </div>
                         <span className="font-bold text-xs">{log.admin_email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={actionConfig[log.action]?.color || "default"}
                        className="font-black text-[10px] uppercase tracking-wider h-6 flex items-center gap-1.5 px-3"
                      >
                         <Icon icon={actionConfig[log.action]?.icon || "solar:info-circle-bold-duotone"} className="text-xs" />
                         <span>{log.action}</span>
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-black uppercase tracking-widest">
                          {log.resource_type}
                        </span>
                        <code className="text-[10px] text-muted-foreground font-mono opacity-60">
                          {log.resource_id}
                        </code>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="solar:global-bold-duotone" className="text-xs text-muted-foreground" />
                        <code className="text-[10px] font-mono text-muted-foreground">{log.ip_address}</code>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span className="text-[10px] text-muted-foreground font-medium opacity-60">{new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Button 
                        variant="ghost" 
                        isIconOnly 
                        className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={() => openDetails(log)}
                       >
                          <Icon icon="solar:eye-bold-duotone" className="text-lg opacity-60" />
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal>
        <Modal.Backdrop 
          isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)}
          variant="blur"
          className="bg-black/60"
        >
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 bg-default-50/50 border-b border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:file-json-bold-duotone" className="text-2xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Event Analysis</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">UID: {selectedLog?._id}</p>
                   </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-default-100/50 border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Contextual Actor</p>
                    <p className="text-sm font-bold">{selectedLog?.admin_email}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{selectedLog?.user_agent}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-default-100/50 border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Network Origin</p>
                    <p className="text-sm font-bold">{selectedLog?.ip_address}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Platform Backend Signature</p>
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Changes Context</p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Copy JSON</button>
                   </div>
                   <div className="p-4 rounded-2xl bg-black border border-border overflow-hidden">
                      <pre className="text-xs text-emerald-400 font-mono overflow-auto max-h-[300px]">
                        {JSON.stringify(selectedLog?.changes, null, 2)}
                      </pre>
                   </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="p-6 bg-default-50/50 border-t border-border flex justify-between items-center">
                <p className="text-[10px] text-muted-foreground italic font-medium">Recorded at {selectedLog && new Date(selectedLog.timestamp).toLocaleString()}</p>
                <Button variant="primary" className="font-bold rounded-xl px-6" onClick={() => setIsModalOpen(false)}>
                  Dismiss Analysis
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <div className="flex items-center justify-between pt-4">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Live Sync: Active</span>
         </div>
         <p className="text-[10px] text-muted-foreground font-medium opacity-60">Retention Policy: 365 Days Performance History</p>
      </div>
    </div>
  );
}

