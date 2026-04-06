"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { DashboardMetrics } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";

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
  icon: React.ReactNode;
  trend?: number;
}

function KPICard({ title, value, subtext, icon, trend }: KPICardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
            {trend !== undefined && (
              <p className={`text-xs mt-2 ${trend >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
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
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to theMrktPlace SaaS Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Tenants"
          value={metrics?.total_tenants || 0}
          subtext={`${metrics?.active_tenants} active`}
          icon={<Users className="w-6 h-6 text-foreground" />}
          trend={8.2}
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${(metrics?.monthly_revenue || 0).toLocaleString()}`}
          subtext="Current month"
          icon={<DollarSign className="w-6 h-6 text-foreground" />}
          trend={12.5}
        />
        <KPICard
          title="Total Orders"
          value={(metrics?.total_orders || 0).toLocaleString()}
          subtext="All time"
          icon={<ShoppingCart className="w-6 h-6 text-foreground" />}
          trend={5.3}
        />
        <KPICard
          title="Growth Rate"
          value={`${metrics?.growth_rate || 0}%`}
          subtext="Month over month"
          icon={<TrendingUp className="w-6 h-6 text-foreground" />}
          trend={2.1}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Last 6 months revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  formatter={(value) => `$${value}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Orders Volume</CardTitle>
            <CardDescription>Last 6 months orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Activations</p>
                <p className="text-2xl font-bold text-orange-400">{metrics?.pending_activations}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Suspended Tenants</p>
                <p className="text-2xl font-bold text-red-400">{metrics?.suspended_tenants}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Plan Tier</p>
                <p className="text-2xl font-bold text-purple-400">{metrics?.avg_plan_tier}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

