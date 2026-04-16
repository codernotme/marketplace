import { PageHeader } from "@workspace/ui/components/page-header";
import { StatCard, StatGrid } from "@workspace/ui/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { DollarCircleIcon, TrendUpIcon, UserMultiple02Icon, ArrowUpRight01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { formatINR } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing — themrktplace Master Admin",
  description: "Platform billing, revenue, and subscription management.",
};

const stats = [
  { title: "MRR", value: formatINR(697542), change: { value: 14.2, period: "last month" }, icon: <HugeiconsIcon icon={DollarCircleIcon} size={20} /> },
  { title: "ARR", value: formatINR(8370504, true), change: { value: 14.2, period: "last year" }, icon: <HugeiconsIcon icon={TrendUpIcon} size={20} /> },
  { title: "Active Subscriptions", value: "134", change: { value: 9.8, period: "last month" }, icon: <HugeiconsIcon icon={UserMultiple02Icon} size={20} /> },
  { title: "Churn Rate", value: "2.1%", change: { value: -0.4, period: "last month" }, icon: <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} /> },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Billing" description="Platform revenue, subscriptions, and financial health.">
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export report
        </Button>
      </PageHeader>

      <StatGrid cols={4}>
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { plan: "Enterprise", revenue: 79992, tenants: 8 },
              { plan: "Pro", revenue: 101966, tenants: 34 },
              { plan: "Growth", revenue: 57942, tenants: 58 },
              { plan: "Starter", revenue: 12558, tenants: 42 },
            ].map((p) => (
              <div key={p.plan} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{p.plan}</Badge>
                  <span className="text-xs text-muted-foreground">{p.tenants} tenants</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatINR(p.revenue)}/mo</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <CardDescription>Latest platform billing activity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { tenant: "SportZone", amount: 9999, status: "paid", date: "Apr 1, 2026" },
              { tenant: "FashionHub", amount: 2999, status: "paid", date: "Apr 1, 2026" },
              { tenant: "TechGadgets", amount: 999, status: "due", date: "Apr 5, 2026" },
            ].map((inv) => (
              <div key={inv.tenant} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium">{inv.tenant}</p>
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums">{formatINR(inv.amount)}</span>
                  <Badge variant={inv.status === "paid" ? "default" : "destructive"}>{inv.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
