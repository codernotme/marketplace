"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { fetchShopAnalytics, fetchShopKpi, fetchShopOrders } from "@/lib/api";
import { useProductsStore, useOrdersStore, useUIStore } from "@/lib/store";
import { formatCurrency, percentChange } from "@/lib/utils";

export default function DashboardPage() {
  const { products } = useProductsStore();
  const { orders } = useOrdersStore();
  const { openModal } = useUIStore();

  const [kpiData, setKpiData] = useState<any>({
    todayRevenue: 0,
    todayOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    pendingQueries: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    monthlyRevenue: [],
    weeklyDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
    telegramBotStatus: "inactive",
  });
  const [analyticsData, setAnalyticsData] = useState<any>({ topProducts: [] });
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [kpi, analytics, orderRows] = await Promise.all([
        fetchShopKpi(),
        fetchShopAnalytics(),
        fetchShopOrders({ limit: 5 }),
      ]);

      if (kpi && typeof kpi === "object") {
        setKpiData((prev: any) => ({ ...prev, ...kpi }));
      }
      if (analytics && typeof analytics === "object") {
        setAnalyticsData((prev: any) => ({ ...prev, ...analytics }));
      }
      if (Array.isArray(orderRows)) {
        setLiveOrders(orderRows);
      }
    };
    loadDashboardData();
  }, []);

  const monthChange = percentChange(kpiData.revenueThisMonth, kpiData.revenueLastMonth);
  const lowStockProducts = products.filter(
    (p) => p.variants.some((v) => v.stock > 0 && v.stock <= 5) && !p.variants.every(v => v.stock === 0)
  );
  const outOfStockProducts = products.filter((p) => p.variants.every((v) => v.stock === 0));
  const recentOrders = liveOrders.length ? liveOrders : orders.slice(0, 5);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Aryan 👋 Here's what's happening."
        icon="solar:chart-2-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2"
            onPress={() => openModal("product", "add")}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Product
          </Button>
        }
      />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={formatCurrency(kpiData.todayRevenue)} change={12.4} changeLabel="vs yesterday" icon="solar:wallet-money-bold-duotone" iconBg="bg-accent/10" iconColor="text-accent" />
        <StatCard title="Today's Orders" value={String(kpiData.todayOrders)} change={8.2} changeLabel="vs yesterday" icon="solar:cart-large-bold-duotone" iconBg="bg-success/15" iconColor="text-success" />
        <StatCard title="Total Customers" value={kpiData.totalCustomers.toLocaleString()} change={5.1} changeLabel="this month" icon="solar:users-group-two-rounded-bold-duotone" iconBg="bg-warning/15" iconColor="text-warning" />
        <StatCard title="Pending Orders" value={String(kpiData.pendingOrders)} change={-3.4} changeLabel="vs yesterday" icon="solar:clock-circle-bold-duotone" iconBg="bg-danger/15" iconColor="text-danger" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value={formatCurrency(kpiData.revenueThisMonth)} change={monthChange} changeLabel="vs last month" icon="solar:graph-up-bold-duotone" iconBg="bg-violet-500/10" iconColor="text-violet-400" />
        <StatCard title="Total Products" value={String(products.length)} icon="solar:box-bold-duotone" iconBg="bg-indigo-500/10" iconColor="text-indigo-400" />
        <StatCard title="Low Stock" value={String(lowStockProducts.length + outOfStockProducts.length)} icon="solar:danger-triangle-bold-duotone" iconBg="bg-orange-500/10" iconColor="text-orange-400" />
        <StatCard title="Open Tickets" value={String(kpiData.pendingQueries)} icon="solar:chat-round-bold-duotone" iconBg="bg-pink-500/10" iconColor="text-pink-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-sm">Monthly Revenue</h3>
              <p className="text-xs text-muted mt-0.5">Last 7 months performance</p>
            </div>
            <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-lg">
              <Icon icon="solar:arrow-up-bold-duotone" className="text-sm" />
              {monthChange}% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={kpiData.monthlyRevenue} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                width={40}
              />
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
                formatter={(v: any) => [formatCurrency(Number(v)), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGradient)" dot={false} activeDot={{ r: 5, fill: "#6366f1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* This week */}
        <div className="bg-surface rounded-2xl p-5 border border-border">
          <div className="mb-4">
            <h3 className="font-semibold text-sm">This Week</h3>
            <p className="text-xl font-bold text-accent mt-1" style={{ fontFamily: "var(--font-outfit)" }}>
              {formatCurrency(kpiData.weeklyRevenue.reduce((a: number, b: number) => a + b, 0))}
            </p>
            <p className="text-xs text-muted">Total revenue</p>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart
              data={kpiData.weeklyDays.map((day: string, i: number) => ({ day, revenue: kpiData.weeklyRevenue[i] }))}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 11 }}
                formatter={(v: any) => [formatCurrency(Number(v)), "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Telegram bot status */}
          <div className="mt-4 p-3 bg-default/40 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:chat-round-dots-bold-duotone" className="text-blue-400 text-base" />
            </div>
            <div>
              <p className="text-xs font-medium">Telegram Bot</p>
              <p className={`text-xs ${kpiData.telegramBotStatus === "active" ? "text-success" : "text-danger"}`}>
                ● {kpiData.telegramBotStatus === "active" ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders + side column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-sm">Recent Orders</h3>
            <a href="/dashboard/orders" className="text-xs text-accent font-medium hover:underline">View All →</a>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order: any) => (
              <div key={order.id || order._id || order.order_number || order.orderNumber} className="flex items-center gap-4 px-5 py-3.5 table-row-hover">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-accent">{order.orderNumber || order.order_number || "-"}</span>
                    <StatusBadge status={order.fulfillmentStatus || order.fulfillment_status || "pending"} />
                  </div>
                  <p className="text-xs text-muted mt-0.5">{order.customer?.name || order.customer_name || "Customer"} · {(order.items || []).length} item{(order.items || []).length !== 1 ? "s" : ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{formatCurrency(Number(order.total || order.total_amount || order.pricing?.grand_total || order.pricing?.grandTotal || 0))}</p>
                  <p className="text-xs text-muted" suppressHydrationWarning>{new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Icon icon="solar:danger-triangle-bold-duotone" className="text-orange-400 text-base" />
                <h3 className="font-semibold text-sm">Stock Alerts</h3>
              </div>
              <span className="text-xs bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                {lowStockProducts.length + outOfStockProducts.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 4).map((p) => {
                const allOut = p.variants.every(v => v.stock === 0);
                const minStock = Math.min(...p.variants.map(v => v.stock));
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-default flex-shrink-0">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="solar:box-bold-duotone" className="text-muted text-lg m-auto mt-1.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{p.title}</p>
                      <p className={`text-xs ${allOut ? "text-danger" : "text-orange-400"}`}>
                        {allOut ? "Out of stock" : `${minStock} left`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <h3 className="font-semibold text-sm">Recent Activity</h3>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.slice(0, 4).map((a: any, idx: number) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon="solar:cart-large-bold-duotone" className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug text-foreground/80">New order {a.orderNumber || a.order_number || idx + 1} received</p>
                    <p className="text-xs text-muted mt-0.5">{new Date(a.createdAt || a.created_at || Date.now()).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">Top Products by Revenue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Units</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analyticsData.topProducts.map((p: any, i: number) => (
                <tr key={i} className="table-row-hover">
                  <td className="px-5 py-3.5 text-muted font-mono text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5 font-medium text-sm">{p.title}</td>
                  <td className="px-5 py-3.5 text-right text-muted text-sm">{p.units.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-sm">{formatCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
