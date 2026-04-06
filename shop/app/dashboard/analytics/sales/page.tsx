"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Icon } from "@iconify/react";
import { Button, Card, Separator } from "@heroui/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { analyticsData, kpiData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function AnalyticsSalesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Sales Analytics"
        subtitle="In-depth analysis of your store's revenue and performance"
        icon="solar:graph-up-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="font-bold border border-border">
              <Icon icon="solar:calendar-bold-duotone" className="text-lg mr-2" />
              Last 30 Days
            </Button>
            <Button variant="primary" size="sm" className="font-bold shadow-lg shadow-accent/20">
              <Icon icon="solar:download-bold-duotone" className="text-lg mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Main Revenue Chart */}
      <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Revenue Forecast</h3>
            <p className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">Predicted vs Actual performance</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-muted font-black uppercase tracking-widest leading-none mb-1.5">Total Revenue</p>
              <p className="text-2xl font-black text-foreground tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                {formatCurrency(kpiData.totalRevenue)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-10 opacity-30" />
            <div className="text-right">
              <p className="text-[10px] text-accent font-black uppercase tracking-widest leading-none mb-1.5">Growth</p>
              <p className="text-2xl font-black text-accent tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>+24.5%</p>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.salesOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 700 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 700 }}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", backdropFilter: "blur(12px)" }}
                itemStyle={{ color: "var(--foreground)", fontWeight: 900, fontSize: 13 }}
                labelStyle={{ color: "var(--accent)", fontWeight: 900, marginBottom: "4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
                activeDot={{ r: 8, stroke: "var(--surface)", strokeWidth: 4, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
          <h3 className="text-lg font-black tracking-tight mb-8" style={{ fontFamily: "var(--font-outfit)" }}>Customer Retention</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.newVsReturning}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {analyticsData.newVsReturning.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: "16px", backdropFilter: "blur(8px)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <p className="text-3xl font-black text-foreground" style={{ fontFamily: "var(--font-outfit)" }}>{analyticsData.newVsReturning.reduce((s, e) => s + e.value, 0)}</p>
              <p className="text-[10px] text-muted font-black uppercase tracking-widest">Total Cust.</p>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {analyticsData.newVsReturning.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-black uppercase tracking-widest text-muted">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
          <h3 className="text-lg font-black tracking-tight mb-8" style={{ fontFamily: "var(--font-outfit)" }}>Purchase Funnel</h3>
          <div className="space-y-6">
            {analyticsData.conversionFunnel.map((stage, i) => {
              const prevCount = i === 0 ? stage.count : analyticsData.conversionFunnel[i-1].count;
              const dropPercent = i === 0 ? 100 : (stage.count / prevCount) * 100;
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[11px] text-muted font-black uppercase tracking-widest">{stage.stage}</p>
                    <p className="text-sm font-black">{stage.count.toLocaleString()} <span className="text-[10px] text-muted font-bold">({dropPercent.toFixed(1)}%)</span></p>
                  </div>
                  <div className="h-3 bg-default/40 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-violet-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      style={{ width: `${(stage.count / analyticsData.conversionFunnel[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top Products detailed */}
      <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
        <h3 className="text-lg font-black tracking-tight mb-8" style={{ fontFamily: "var(--font-outfit)" }}>Product Performance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-black text-muted uppercase tracking-widest">
                <th className="text-left py-4 px-4">Rank</th>
                <th className="text-left py-4 px-4">Product Name</th>
                <th className="text-right py-4 px-4">Sales Vol.</th>
                <th className="text-right py-4 px-4">Gross Revenue</th>
                <th className="text-right py-4 px-4">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {analyticsData.topProducts.map((p, i) => (
                <tr key={p.title} className="group hover:bg-default/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-black text-muted opacity-50">#0{i+1}</td>
                  <td className="py-4 px-4 font-black tracking-tight">{p.title}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-foreground/80 font-bold">
                      {p.units.toLocaleString()}
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-accent">{formatCurrency(p.revenue)}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-default/60 text-[10px] font-black font-mono">
                      {((p.units / analyticsData.conversionFunnel[2].count) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
