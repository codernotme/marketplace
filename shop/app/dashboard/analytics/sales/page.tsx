"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
} from "recharts";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { analyticsData, kpiData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const PIE_COLORS = ["#6366f1", "#8b5cf6"];

export default function AnalyticsSalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Overview"
        subtitle="Revenue and order trends"
        icon="solar:chart-bold-duotone"
      />

      {/* Revenue trend */}
      <div className="bg-surface rounded-2xl p-5 border border-border/50">
        <h3 className="font-semibold font-[family-name:var(--font-outfit)] mb-5">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={kpiData.monthlyRevenue} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revGrad2)" dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-surface rounded-2xl p-5 border border-border/50">
          <h3 className="font-semibold font-[family-name:var(--font-outfit)] mb-5">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analyticsData.topProducts} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
              <YAxis type="category" dataKey="title" tick={{ fill: "var(--muted)", fontSize: 10 }} width={160} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 22) + "…" : v} />
              <Tooltip contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* New vs Returning + Funnel */}
        <div className="space-y-4">
          {/* Pie */}
          <div className="bg-surface rounded-2xl p-5 border border-border/50">
            <h3 className="font-semibold font-[family-name:var(--font-outfit)] mb-4">Customer Type</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={analyticsData.newVsReturning} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {analyticsData.newVsReturning.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {analyticsData.newVsReturning.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                    <div>
                      <p className="text-xs text-muted">{item.name}</p>
                      <p className="font-bold text-sm">{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion funnel */}
          <div className="bg-surface rounded-2xl p-5 border border-border/50">
            <h3 className="font-semibold font-[family-name:var(--font-outfit)] mb-4">Conversion Funnel</h3>
            <div className="space-y-2.5">
              {analyticsData.conversionFunnel.map((stage, i) => {
                const maxCount = analyticsData.conversionFunnel[0].count;
                const pct = Math.round((stage.count / maxCount) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">{stage.stage}</span>
                      <span className="font-semibold">{stage.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-default rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: PIE_COLORS[0], opacity: 1 - i * 0.15 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
