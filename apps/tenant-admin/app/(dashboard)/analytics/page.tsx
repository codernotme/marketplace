import { PageHeader } from "@workspace/ui/components/page-header";
import { StatCard, StatGrid } from "@workspace/ui/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DollarCircleIcon,
  ShoppingBasket01Icon,
  UserMultiple02Icon,
  ChartBarSquare01Icon,
  TrendUpIcon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatCompact } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics — themrktplace",
  description: "Deep insights into your store performance.",
};

const stats = [
  { title: "Revenue (MTD)", value: formatINR(124520), change: { value: 12.5, period: "last month" }, icon: <HugeiconsIcon icon={DollarCircleIcon} size={20} /> },
  { title: "Orders (MTD)", value: "342", change: { value: 8.2, period: "last month" }, icon: <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} /> },
  { title: "New Customers", value: "128", change: { value: 3.1, period: "last month" }, icon: <HugeiconsIcon icon={UserMultiple02Icon} size={20} /> },
  { title: "Avg Order Value", value: formatINR(3640), change: { value: 4.8, period: "last month" }, icon: <HugeiconsIcon icon={TrendUpIcon} size={20} /> },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Track your store's performance with real-time metrics and reports."
      />

      <StatGrid cols={4}>
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 75, 60, 85, 70, 95, 80, 65, 100, 85, 70, 90, 78, 92, 88, 76, 95, 82, 70, 88, 94, 79, 87, 91, 98].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
            <CardDescription>By revenue this month</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { name: "Classic White Tee", revenue: 28490, units: 48 },
              { name: "Slim Fit Jeans", revenue: 22485, units: 15 },
              { name: "Running Sneakers", revenue: 17994, units: 6 },
              { name: "Canvas Backpack", revenue: 13485, units: 15 },
              { name: "Silk Scarf", revenue: 9576, units: 24 },
            ].map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.units} units</p>
                </div>
                <span className="text-sm font-semibold tabular-nums shrink-0">{formatINR(p.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
