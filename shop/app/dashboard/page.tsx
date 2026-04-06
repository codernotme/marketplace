"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Icon } from "@iconify/react";
import { Button, Chip } from "@heroui/react";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  kpiData,
  products,
  orders,
  recentActivity,
  analyticsData,
} from "@/lib/mock-data";
import { formatCurrency, getStatusColor, percentChange } from "@/lib/utils";

const PIE_COLORS = ["#6366f1", "#8b5cf6"];

export default function DashboardPage() {
  const monthChange = percentChange(kpiData.revenueThisMonth, kpiData.revenueLastMonth);
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, Aryan 👋 Here's what's happening today.`}
        icon="solar:chart-2-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onPress={() => window.location.href = "/dashboard/inventory/products/add"}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Product
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(kpiData.todayRevenue)}
          change={12.4}
          changeLabel="vs yesterday"
          icon="solar:wallet-money-bold-duotone"
          iconBg="bg-accent/10"
          iconColor="text-accent"
        />
        <StatCard
          title="Today's Orders"
          value={String(kpiData.todayOrders)}
          change={8.2}
          changeLabel="vs yesterday"
          icon="solar:cart-large-bold-duotone"
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          title="Total Customers"
          value={kpiData.totalCustomers.toLocaleString()}
          change={5.1}
          changeLabel="this month"
          icon="solar:users-group-two-rounded-bold-duotone"
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          title="Pending Orders"
          value={String(kpiData.pendingOrders)}
          change={-3.4}
          changeLabel="vs yesterday"
          icon="solar:clock-circle-bold-duotone"
          iconBg="bg-danger/10"
          iconColor="text-danger"
        />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(kpiData.revenueThisMonth)}
          change={monthChange}
          changeLabel="vs last month"
          icon="solar:graph-up-bold-duotone"
          iconBg="bg-violet-500/10"
          iconColor="text-violet-500"
        />
        <StatCard
          title="Total Products"
          value={String(kpiData.totalProducts)}
          icon="solar:box-bold-duotone"
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Low Stock Items"
          value={String(kpiData.lowStockItems)}
          icon="solar:danger-triangle-bold-duotone"
          iconBg="bg-orange-500/10"
          iconColor="text-orange-400"
        />
        <StatCard
          title="Pending Queries"
          value={String(kpiData.pendingQueries)}
          icon="solar:chat-round-bold-duotone"
          iconBg="bg-pink-500/10"
          iconColor="text-pink-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold font-[family-name:var(--font-outfit)]">Monthly Revenue</h3>
              <p className="text-sm text-muted mt-0.5">Last 7 months performance</p>
            </div>
            <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-lg">
              <Icon icon="solar:arrow-up-bold-duotone" className="text-sm" />
              {monthChange}% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={kpiData.monthlyRevenue} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                width={44}
              />
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGradient)" dot={false} activeDot={{ r: 5, fill: "#6366f1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Revenue sparkline */}
        <div className="bg-surface rounded-2xl p-5 border border-border/50">
          <div className="mb-4">
            <h3 className="font-semibold font-[family-name:var(--font-outfit)]">This Week</h3>
            <p className="text-2xl font-bold text-accent mt-1 font-[family-name:var(--font-outfit)]">
              {formatCurrency(kpiData.weeklyRevenue.reduce((a, b) => a + b, 0))}
            </p>
            <p className="text-sm text-muted">Total revenue this week</p>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={kpiData.weeklyDays.map((day, i) => ({ day, revenue: kpiData.weeklyRevenue[i] }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
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
                ● {kpiData.telegramBotStatus === "active" ? "Connected & Active" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <h3 className="font-semibold font-[family-name:var(--font-outfit)]">Recent Orders</h3>
            <Button variant="ghost" size="sm" className="text-accent" onPress={() => window.location.href = "/dashboard/orders"}>
              View All →
            </Button>
          </div>
          <div className="divide-y divide-border/30">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3 table-row-hover">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{order.orderNumber}</span>
                    <Chip
                      size="sm"
                      variant={getStatusColor(order.fulfillmentStatus) === "success" ? "success" : getStatusColor(order.fulfillmentStatus) === "warning" ? "warning" : getStatusColor(order.fulfillmentStatus) === "danger" ? "danger" : "default"}
                    >
                      {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                    </Chip>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{order.customer.name} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Low stock + Activity */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Icon icon="solar:danger-triangle-bold-duotone" className="text-orange-400 text-base" />
                <h3 className="font-semibold text-sm font-[family-name:var(--font-outfit)]">Low Stock</h3>
              </div>
              <span className="text-xs text-orange-400 font-semibold bg-orange-400/10 px-2 py-0.5 rounded-full">{lowStockProducts.length + outOfStockProducts.length}</span>
            </div>
            <div className="divide-y divide-border/30">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-default flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:box-bold-duotone" className="text-muted text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.title}</p>
                    <p className={`text-xs ${p.stock === 0 ? "text-danger" : "text-orange-400"}`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border/40">
              <h3 className="font-semibold text-sm font-[family-name:var(--font-outfit)]">Recent Activity</h3>
            </div>
            <div className="divide-y divide-border/30">
              {recentActivity.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={a.icon} className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug">{a.message}</p>
                    <p className="text-xs text-muted mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <h3 className="font-semibold font-[family-name:var(--font-outfit)]">Top Products by Revenue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Units Sold</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {analyticsData.topProducts.map((p, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="px-5 py-3.5 text-muted font-medium">{i + 1}</td>
                  <td className="px-5 py-3.5 font-medium">{p.title}</td>
                  <td className="px-5 py-3.5 text-right text-muted">{p.units.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right font-bold">{formatCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
