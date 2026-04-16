import { PageHeader } from "@workspace/ui/components/page-header";
import { StatCard, StatGrid } from "@workspace/ui/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBasket01Icon,
  DollarCircleIcon,
  UserMultiple02Icon,
  PackageIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatRelativeTime } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — themrktplace",
  description: "Your store at a glance — revenue, orders, customers, and more.",
};

// Mock data — replace with real tRPC queries
const stats = [
  {
    title: "Total Revenue",
    value: formatINR(124520),
    change: { value: 12.5, period: "last month" },
    icon: <HugeiconsIcon icon={DollarCircleIcon} size={20} />,
  },
  {
    title: "Orders",
    value: "342",
    change: { value: 8.2, period: "last month" },
    icon: <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} />,
  },
  {
    title: "Customers",
    value: "1,284",
    change: { value: 3.1, period: "last month" },
    icon: <HugeiconsIcon icon={UserMultiple02Icon} size={20} />,
  },
  {
    title: "Products",
    value: "86",
    change: { value: -2.4, period: "last month" },
    icon: <HugeiconsIcon icon={PackageIcon} size={20} />,
  },
];

const recentOrders = [
  { id: "#1042", customer: "Priya Sharma", amount: formatINR(2499), status: "delivered", date: new Date(Date.now() - 3600000) },
  { id: "#1041", customer: "Rahul Verma", amount: formatINR(5999), status: "shipped", date: new Date(Date.now() - 7200000) },
  { id: "#1040", customer: "Ananya Singh", amount: formatINR(1249), status: "processing", date: new Date(Date.now() - 10800000) },
  { id: "#1039", customer: "Rohan Mehta", amount: formatINR(799), status: "pending", date: new Date(Date.now() - 18000000) },
  { id: "#1038", customer: "Kavita Nair", amount: formatINR(3299), status: "delivered", date: new Date(Date.now() - 86400000) },
];

const statusBadge: Record<string, string> = {
  pending:    "secondary",
  processing: "outline",
  shipped:    "default",
  delivered:  "default",
  cancelled:  "destructive",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your store."
      />

      {/* Stats */}
      <StatGrid cols={4}>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </StatGrid>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <a
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusBadge[order.status] as "default" | "secondary" | "outline" | "destructive"}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-medium tabular-nums">{order.amount}</span>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {formatRelativeTime(order.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
