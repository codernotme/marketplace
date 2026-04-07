"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { DashboardMetrics } from "@/types";
import { Card, Spinner, Skeleton, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 221 },
  { name: "Mar", revenue: 2000, orders: 229 },
  { name: "Apr", revenue: 2780, orders: 200 },
  { name: "May", revenue: 1890, orders: 229 },
  { name: "Jun", revenue: 2390, orders: 200 },
];

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: string;
  trend?: number;
  iconBg?: string;
  iconColor?: string;
}

function KPICard({ title, value, subtext, icon, trend, iconBg = "bg-primary/10", iconColor = "text-primary" }: KPICardProps) {
  return (
    <Card className="p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{value}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {trend !== undefined && (
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-0.5",
                trend >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              )}>
                <Icon icon={trend >= 0 ? "solar:arrow-right-up-bold-duotone" : "solar:arrow-right-down-bold-duotone"} className="text-xs" />
                {Math.abs(trend)}%
              </span>
            )}
            {subtext && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{subtext}</span>}
          </div>
        </div>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", iconBg, iconColor)}>
          <Icon icon={icon} className="text-2xl" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiClient.get<DashboardMetrics>("/api/saas/dashboard/metrics");
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        // Use mock data for demo
        setMetrics({
          total_tenants: 847,
          active_tenants: 723,
          pending_activations: 45,
          suspended_tenants: 12,
          monthly_revenue: 65320,
          total_orders: 12450,
          avg_plan_tier: "Pro",
          growth_rate: 12.5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon icon="solar:chart-2-bold-duotone" className="text-xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">Welcome to theMrktPlace SaaS Administration</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="font-bold flex items-center gap-2"
        >
          <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Tenants"
          value={metrics?.total_tenants || 0}
          subtext={`${metrics?.active_tenants} online`}
          icon="solar:users-group-two-rounded-bold-duotone"
          iconBg="bg-primary/20"
          iconColor="text-primary"
          trend={8.2}
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${(metrics?.monthly_revenue || 0).toLocaleString()}`}
          subtext="Current month"
          icon="solar:dollar-minimalistic-bold-duotone"
          iconBg="bg-success/20"
          iconColor="text-success"
          trend={12.5}
        />
        <KPICard
          title="Total Orders"
          value={(metrics?.total_orders || 0).toLocaleString()}
          subtext="Processed"
          icon="solar:cart-large-bold-duotone"
          iconBg="bg-warning/20"
          iconColor="text-warning"
          trend={5.3}
        />
        <KPICard
          title="Growth Rate"
          value={`${metrics?.growth_rate || 0}%`}
          subtext="YTD Performance"
          icon="solar:graph-up-bold-duotone"
          iconBg="bg-secondary/20"
          iconColor="text-secondary"
          trend={2.1}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border bg-surface shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Revenue Trend</h3>
                <p className="text-xs text-muted-foreground mt-1">Platform performance for past 6 months</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-success bg-success/10 px-2 py-1 rounded-lg">
                    <Icon icon="solar:arrow-right-up-bold-duotone" />
                    +12% vs LY
                 </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 border border-border bg-surface shadow-sm h-full">
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Order Volume</h3>
              <p className="text-xs text-muted-foreground mt-1">Distribution across months</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 11 }} />
                <Bar dataKey="orders" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-8 space-y-4">
               <div className="flex items-center justify-between p-3 bg-default-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/20 text-warning flex items-center justify-center">
                       <Icon icon="solar:clock-circle-bold-duotone" className="text-lg" />
                    </div>
                    <span className="text-xs font-bold">Pending Actions</span>
                  </div>
                  <span className="text-sm font-black">{metrics?.pending_activations}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-default-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-danger/20 text-danger flex items-center justify-center">
                       <Icon icon="solar:shield-warning-bold-duotone" className="text-lg" />
                    </div>
                    <span className="text-xs font-bold">Suspended</span>
                  </div>
                  <span className="text-sm font-black">{metrics?.suspended_tenants}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-default-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                       <Icon icon="solar:stars-line-bold-duotone" className="text-lg" />
                    </div>
                    <span className="text-xs font-bold">Avg Plan</span>
                  </div>
                  <span className="text-sm font-black text-secondary">{metrics?.avg_plan_tier}</span>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

