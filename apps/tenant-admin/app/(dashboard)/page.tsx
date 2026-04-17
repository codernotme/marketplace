"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBasket01Icon,
  DollarCircleIcon,
  UserMultiple02Icon,
  PackageIcon,
  ArrowUpRight01Icon,
  TrendingUpScaleIcon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatRelativeTime, getOrderStatusColor, formatOrderStatus } from "@workspace/ui/lib/formatters";
import { getDashboardStats } from "@/app/actions/dashboard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stats = await getDashboardStats();
        setData(stats);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatINR(data.revenue),
      change: { value: 12.5, period: "vs last week" },
      icon: DollarCircleIcon,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Active Orders",
      value: data.orders.toString(),
      change: { value: 8.2, period: "vs last week" },
      icon: ShoppingBasket01Icon,
      color: "text-info",
      bg: "bg-info/10"
    },
    {
      title: "Total Customers",
      value: data.customers.toString(),
      change: { value: 3.1, period: "vs last week" },
      icon: UserMultiple02Icon,
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      title: "Catalog Size",
      value: data.products.toString(),
      change: { value: 2, period: "new this week" },
      icon: PackageIcon,
      color: "text-warning",
      bg: "bg-warning/10"
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Overview"
          description="Everything you need to know about your store, right now."
        />
        <div className="flex gap-2">
           <Badge variant="outline" className="px-4 py-1.5 rounded-full border-none bg-background shadow-sm text-muted-foreground font-medium">
             Last 7 Days
           </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-sm rounded-3xl group hover:translate-y-[-2px] transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <HugeiconsIcon icon={stat.icon} size={24} className={stat.color} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-success">
                   <HugeiconsIcon icon={TrendingUpScaleIcon} size={14} />
                   {stat.change.value}%
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-medium">{stat.change.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/40 backdrop-blur-lg rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-xl font-black tracking-tight">Revenue Analytics</CardTitle>
               <p className="text-xs text-muted-foreground font-medium tracking-wide">Daily gross sales for the current period</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</span>
               </div>
            </div>
          </CardHeader>
          <CardContent className="h-[380px] p-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'short' })}
                />
                <YAxis 
                   hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                    borderRadius: "16px", 
                    border: "none", 
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }} 
                  formatter={(val: number) => [formatINR(val), "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-sm rounded-[40px] flex flex-col">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black tracking-tight">Recent Orders</CardTitle>
            <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
               View All
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1">
              {data.recentOrders.map((order: any, idx: number) => (
                <div
                  key={order.id}
                  className="group flex items-center justify-between px-8 py-5 hover:bg-muted/30 transition-all border-b border-border/40 last:border-none animate-in fade-in slide-in-from-right-4 duration-500"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-bold group-hover:text-primary transition-colors tracking-tight">{order.customer?.name || "Guest Checkout"}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.orderNumber || `#${order.id.slice(-4)}`}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-black tabular-nums">{formatINR(order.total)}</span>
                    <Badge className={cn("text-[9px] px-2 py-0 h-4 border-transparent shadow-none font-black uppercase tracking-tight", getOrderStatusColor(order.status))}>
                      {formatOrderStatus(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-muted/5 mt-auto">
               <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                        <HugeiconsIcon icon={TrendingUpScaleIcon} size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black tracking-tight">Daily Goal</p>
                        <p className="text-[10px] font-medium text-muted-foreground">84% completed</p>
                     </div>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full">
                     <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
