"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { analyticsData, kpiData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const PIE_COLORS = ["#6366f1", "#8b5cf6"];

export default function SalesAnalyticsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Sales Overview"
        subtitle="Revenue and performance analysis"
        icon="solar:chart-bold-duotone"
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(kpiData.totalRevenue), icon: "solar:wallet-money-bold-duotone", color: "text-accent" },
          { label: "Total Orders", value: kpiData.totalOrders.toLocaleString(), icon: "solar:cart-large-bold-duotone", color: "text-success" },
          { label: "Monthly Rev.", value: formatCurrency(kpiData.revenueThisMonth), icon: "solar:calendar-bold-duotone", color: "text-warning" },
          { label: "Avg. Order", value: formatCurrency(Math.round(kpiData.totalRevenue / kpiData.totalOrders)), icon: "solar:graph-up-bold-duotone", color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 stat-card">
            <Icon icon={s.icon} className={`text-2xl mb-2 ${s.color}`} />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Customer charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-sm mb-1">Monthly Revenue Trend</h3>
          <p className="text-xs text-muted mb-5">Last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analyticsData.salesOverview} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
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
                width={42}
              />
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-sm mb-1">New vs Returning</h3>
          <p className="text-xs text-muted mb-4">Customer split</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={analyticsData.newVsReturning}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                dataKey="value"
                paddingAngle={3}
              >
                {analyticsData.newVsReturning.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {analyticsData.newVsReturning.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-muted">{d.name}</span>
                </div>
                <span className="text-xs font-bold">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="bg-surface rounded-2xl p-5 border border-border">
        <h3 className="font-semibold text-sm mb-5">Conversion Funnel</h3>
        <div className="space-y-3">
          {analyticsData.conversionFunnel.map((stage, i) => {
            const maxVal = analyticsData.conversionFunnel[0].count;
            const pct = Math.round((stage.count / maxVal) * 100);
            return (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{stage.count.toLocaleString()}</span>
                    <span className="text-xs font-bold text-accent">{pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-default rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `oklch(0.62 0.195 ${250 + i * 15})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top products bar chart */}
      <div className="bg-surface rounded-2xl p-5 border border-border">
        <h3 className="font-semibold text-sm mb-5">Top Products by Revenue</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData.topProducts} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <YAxis type="category" dataKey="title" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={160} />
            <Tooltip
              contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }}
              formatter={(v: number) => [formatCurrency(v), "Revenue"]}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
