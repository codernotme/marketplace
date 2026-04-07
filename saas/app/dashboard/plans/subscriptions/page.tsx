"use client";

import { useState } from "react";
import { Card, Button, Chip, Dropdown, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { subscriptions } from "@/lib/data/subscriptions";
import { tenants } from "@/lib/data/tenants";
import { plans } from "@/lib/data/plans";

const statusConfig: Record<string, { color: "success" | "danger" | "default" | "accent", icon: string }> = {
  active: { color: "success", icon: "solar:check-circle-bold-duotone" },
  past_due: { color: "danger", icon: "solar:shield-warning-bold-duotone" },
  cancelled: { color: "default", icon: "solar:close-circle-bold-duotone" },
  trialing: { color: "accent", icon: "solar:play-bold-duotone" },
};

export default function SubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = subscriptions.filter(
    (sub) => statusFilter === "all" || sub.status === statusFilter
  );

  const getTenantName = (tenantId: string) => {
    return tenants.find((t) => t.id === tenantId)?.shop_name || "Unknown";
  };

  const getPlanName = (planId: string) => {
    return plans.find((p) => p.id === planId)?.display_name || "Unknown";
  };

  const getPlanPrice = (planId: string) => {
    return plans.find((p) => p.id === planId)?.price_monthly || 0;
  };

  const totalMRR = filtered.reduce((sum, sub) => {
    if (sub.status === "active") {
      return sum + getPlanPrice(sub.plan_id);
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Subscriptions"
        subtitle="Real-time ledger of platform revenue and tenant billing cycles"
        icon="solar:wad-of-money-bold-duotone"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold gap-2">
              <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
              Download Ledger
            </Button>
            <Dropdown>
              <Dropdown.Trigger>
                <Button variant="primary" className="font-bold gap-2">
                  <Icon icon="solar:filter-bold-duotone" className="text-lg" />
                  Filter Stream
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-[180px]">
                <Dropdown.Menu 
                  selectionMode="single" 
                  selectedKeys={new Set([statusFilter])}
                  onSelectionChange={(keys: any) => setStatusFilter(Array.from(keys)[0] as string)}
                >
                  <Dropdown.Item key="all" id="all" textValue="All Status">All Status</Dropdown.Item>
                  <Dropdown.Item key="active" id="active" textValue="Active">Active</Dropdown.Item>
                  <Dropdown.Item key="past_due" id="past_due" textValue="Past Due" className="text-danger">Past Due</Dropdown.Item>
                  <Dropdown.Item key="cancelled" id="cancelled" textValue="Cancelled">Cancelled</Dropdown.Item>
                  <Dropdown.Item key="trialing" id="trialing" textValue="Trialing" className="text-primary">Trialing</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Nodes", value: subscriptions.filter((s) => s.status === "active").length, icon: "solar:check-circle-bold-duotone", color: "text-success", bg: "bg-success/10" },
          { label: "Critical Arrears", value: subscriptions.filter((s) => s.status === "past_due").length, icon: "solar:shield-warning-bold-duotone", color: "text-danger", bg: "bg-danger/10" },
          { label: "Estimated MRR", value: `$${totalMRR.toLocaleString()}`, icon: "solar:banknote-bold-duotone", color: "text-accent", bg: "bg-accent/10" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border border-border bg-surface shadow-sm group hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <Icon icon={stat.icon} className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tenant Entity</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deployment Plan</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Billing Cycle</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Current Period</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-muted-foreground italic text-sm">
                      No matching subscription records found.
                   </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px] border border-accent/20">
                            {getTenantName(sub.tenant_id).substring(0, 2).toUpperCase()}
                         </div>
                         <span className="font-bold text-xs">{getTenantName(sub.tenant_id)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium opacity-80">
                      {getPlanName(sub.plan_id)}
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={statusConfig[sub.status]?.color || "default"}
                        className="font-black text-[10px] uppercase tracking-wider h-6 pr-2"
                      >
                         <div className="flex items-center gap-1">
                            <Icon icon={statusConfig[sub.status]?.icon || "solar:info-circle-bold-duotone"} />
                            {sub.status}
                         </div>
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Icon icon="solar:calendar-bold-duotone" className="text-xs" />
                        <span className="text-[10px] uppercase font-black tracking-widest">{sub.billing_cycle}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground/80">
                            {new Date(sub.current_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium opacity-60">Renews at midnight</span>
                       </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Button 
                        variant="ghost" 
                        isIconOnly 
                        className="rounded-full opacity-60 hover:opacity-100 transition-all h-8 w-8"
                       >
                          <Icon icon="solar:pen-new-square-bold-duotone" className="text-lg opacity-60" />
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {subscriptions.some((s) => s.status === "past_due") && (
        <Card className="border border-danger/30 bg-danger/[0.03] p-4 shadow-sm animate-in slide-in-from-bottom duration-500">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
               <Icon icon="solar:shield-warning-bold-duotone" className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-black text-danger tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                CRITICAL: {subscriptions.filter((s) => s.status === "past_due").length} Overdue Accounts Detected
              </p>
              <p className="text-xs text-danger/70 mt-0.5 font-medium leading-relaxed">
                Platform governance requires immediate resolution of these arrears to maintain service continuity. 
                Auto-suspension protocols will trigger in 48 hours for unresolved accounts.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

