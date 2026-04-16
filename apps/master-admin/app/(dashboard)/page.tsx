import { PageHeader } from "@workspace/ui/components/page-header";
import { StatCard, StatGrid } from "@workspace/ui/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building01Icon,
  DollarCircleIcon,
  UserMultiple02Icon,
  ChartBarSquare01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatCompact, formatRelativeTime } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Overview — themrktplace Master Admin",
  description: "Bird's-eye view of the entire themrktplace platform.",
};

const stats = [
  { title: "Total Tenants", value: "142", change: { value: 18.3, period: "last month" }, icon: <HugeiconsIcon icon={Building01Icon} size={20} /> },
  { title: "Platform GMV", value: formatINR(18500000, true), change: { value: 24.1, period: "last month" }, icon: <HugeiconsIcon icon={DollarCircleIcon} size={20} /> },
  { title: "Active Users", value: formatCompact(48200), change: { value: 11.7, period: "last month" }, icon: <HugeiconsIcon icon={UserMultiple02Icon} size={20} /> },
  { title: "Avg MRR / Tenant", value: formatINR(4900), change: { value: 3.2, period: "last month" }, icon: <HugeiconsIcon icon={ChartBarSquare01Icon} size={20} /> },
];

const recentTenants = [
  { name: "FashionHub", plan: "Pro", mrr: 2999, status: "active", joined: new Date(Date.now() - 86400000) },
  { name: "TechGadgets India", plan: "Growth", mrr: 999, status: "trial", joined: new Date(Date.now() - 172800000) },
  { name: "ArtisanKitchen", plan: "Starter", mrr: 299, status: "active", joined: new Date(Date.now() - 259200000) },
  { name: "SportZone", plan: "Enterprise", mrr: 9999, status: "active", joined: new Date(Date.now() - 345600000) },
];

export default function MasterDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform Overview"
        description="Real-time health and performance of the entire themrktplace platform."
      />

      <StatGrid cols={4}>
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent tenants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Tenants</CardTitle>
            <a href="/dashboard/tenants" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
            </a>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentTenants.map((t) => (
                <div key={t.name} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(t.joined)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{t.plan}</Badge>
                    <Badge variant={t.status === "active" ? "default" : "secondary"} className="text-xs">{t.status}</Badge>
                    <span className="text-sm font-semibold tabular-nums">{formatINR(t.mrr)}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { plan: "Enterprise", count: 8, pct: 5.6, color: "bg-primary" },
              { plan: "Pro", count: 34, pct: 23.9, color: "bg-primary/70" },
              { plan: "Growth", count: 58, pct: 40.8, color: "bg-primary/50" },
              { plan: "Starter", count: 42, pct: 29.6, color: "bg-primary/30" },
            ].map((p) => (
              <div key={p.plan} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-20">{p.plan}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">{p.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
