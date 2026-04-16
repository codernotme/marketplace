import { PageHeader } from "@workspace/ui/components/page-header";
import { StatCard, StatGrid } from "@workspace/ui/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarSquare01Icon,
  UserMultiple02Icon,
  Building01Icon,
  GlobalIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatCompact } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Analytics — themrktplace Master Admin",
  description: "Global performance metrics and multi-tenant insights.",
};

const stats = [
  { title: "Total Platform GMV", value: formatINR(18500000, true), change: { value: 24.1, period: "last month" }, icon: <HugeiconsIcon icon={ChartBarSquare01Icon} size={20} /> },
  { title: "Total Users", value: formatCompact(48200), change: { value: 11.7, period: "last month" }, icon: <HugeiconsIcon icon={UserMultiple02Icon} size={20} /> },
  { title: "Active Tenants", value: "142", change: { value: 5.2, period: "last month" }, icon: <HugeiconsIcon icon={Building01Icon} size={20} /> },
  { title: "Avg. Engagement", value: "84%", change: { value: 2.4, period: "last month" }, icon: <HugeiconsIcon icon={GlobalIcon} size={20} /> },
];

export default function MasterAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform Analytics"
        description="Aggregate data from across all tenants and regions."
      />

      <StatGrid cols={4}>
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Platform Revenue Growth</CardTitle>
            <CardDescription>Aggregate GMV across all tenants (Last 6 Months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2 px-4 pb-4">
              {[45, 60, 55, 85, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t transition-all duration-300" 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Month {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Tenants</CardTitle>
            <CardDescription>By revenue contribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { name: "FashionHub", share: "24%", revenue: "₹4.4M" },
              { name: "SportZone", share: "18%", revenue: "₹3.3M" },
              { name: "TechGadgets India", share: "15%", revenue: "₹2.7M" },
              { name: "ArtisanKitchen", share: "12%", revenue: "₹2.2M" },
              { name: "GreenLeaf Organics", share: "9%", revenue: "₹1.6M" },
            ].map((tenant) => (
              <div key={tenant.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{tenant.name}</p>
                  <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: tenant.share }} />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold">{tenant.revenue}</p>
                  <p className="text-[10px] text-muted-foreground">{tenant.share} share</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
