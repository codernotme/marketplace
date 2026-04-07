"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { DashboardMetrics } from "@/types";
import { Card, Button, Skeleton } from "@heroui/react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  variant: "primary" | "secondary" | "accent" | "success" | "warning";
}

function KPICard({ title, value, subtext, icon, trend, variant }: KPICardProps) {
  const variants = {
    primary: "from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20",
    secondary: "from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20",
    accent: "from-zinc-500/20 to-zinc-500/5 text-white border-white/10",
    success: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
    warning: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20",
  };

  return (
    <Card className="luxury-card p-0 group">
      <div className={cn("p-6 flex flex-col justify-between h-full bg-linear-to-br transition-all duration-500 group-hover:scale-[1.02]", variants[variant])}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl relative group-hover:rotate-12 transition-transform">
            <Icon icon={icon} className="text-2xl" />
          </div>
          {trend !== undefined && (
            <div className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 backdrop-blur-md border",
              trend >= 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              <Icon icon={trend >= 0 ? "solar:round-arrow-right-up-bold" : "solar:round-arrow-right-down-bold"} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
             <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{value}</h2>
             {subtext && <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{subtext}</span>}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <Icon icon={icon} className="text-8xl -rotate-12" />
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
        const response = await apiClient.get<DashboardMetrics>("/api/saas/dashboard/metrics");
        setMetrics(response);
      } catch (error) {
        toast.error("Telemetry sync interrupted");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 p-1">
        <div className="flex items-center justify-between">
           <div className="space-y-2">
             <Skeleton className="h-8 w-64 rounded-2xl" />
             <Skeleton className="h-4 w-48 rounded-xl opacity-60" />
           </div>
           <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 rounded-[40px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="lg:col-span-2 h-[480px] rounded-[40px]" />
           <Skeleton className="h-[480px] rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 p-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-2xl backdrop-blur-xl">
            <Icon icon="solar:crown-minimalistic-bold-duotone" className="text-3xl text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-outfit)" }}>
               Platform Pulse
            </h1>
            <p className="text-sm text-zinc-500 font-medium tracking-wide">
               Real-time administrative telemetrics and ecosystem governance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             variant="outline"
             className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 h-12 rounded-2xl shadow-xl transition-all flex items-center gap-2"
             onClick={() => window.location.reload()}
           >
              <Icon icon="solar:refresh-bold-duotone" className="text-xl" />
              Refresh Data
           </Button>
           <Button 
             className="bg-white text-black font-black uppercase tracking-[0.1em] text-[10px] px-6 h-12 rounded-2xl shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2"
           >
              <Icon icon="solar:file-download-bold-duotone" className="text-xl" />
              Export Report
           </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Ecosystem"
          value={metrics?.total_tenants || 0}
          subtext="Provisioned Units"
          icon="solar:globus-bold-duotone"
          variant="primary"
          trend={14.2}
        />
        <KPICard
          title="Fiscal Throughput"
          value={`$${(metrics?.mrr || 0).toLocaleString()}`}
          subtext="Monthly Velocity"
          icon="solar:double-alt-arrow-up-bold-duotone"
          variant="success"
          trend={21.5}
        />
        <KPICard
          title="System Resilience"
          value="99.98%"
          subtext="Verified Uptime"
          icon="solar:shield-check-bold-duotone"
          variant="warning"
          trend={0.2}
        />
        <KPICard
          title="Active Sentinels"
          value="08"
          subtext="Verified Admins"
          icon="solar:shield-user-bold-duotone"
          variant="accent"
        />
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="luxury-card p-8 bg-zinc-900/40 backdrop-blur-3xl min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Analytical Stream</p>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>Monetary Trajectory</h3>
              </div>
              <div className="flex gap-2">
                 <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">7 Days</div>
                 <div className="px-4 py-2 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl">30 Days</div>
              </div>
            </div>

            <div className="flex-1 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" vertical={false} opacity={0.05} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525B" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={20}
                    style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <YAxis 
                    stroke="#52525B" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                    style={{ fontWeight: 800 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", fontSize: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 10, color: '#FFFFFF' }}
                    labelStyle={{ color: '#71717A', marginBottom: '4px', fontWeight: 900, textTransform: 'uppercase', fontSize: 9 }}
                    cursor={{ stroke: '#FFFFFF', strokeWidth: 1, strokeDasharray: '8 8', opacity: 0.2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FFFFFF" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
           <Card className="luxury-card p-8 bg-zinc-900/40 backdrop-blur-3xl flex-1 flex flex-col">
              <div className="space-y-1 mb-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Ecosystem Dist.</p>
                <h3 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>Status Audit</h3>
              </div>
              
              <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" vertical={false} opacity={0.05} />
                    <XAxis dataKey="name" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} dy={10} style={{ fontWeight: 800 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px" }} />
                    <Bar dataKey="orders" fill="#FFFFFF" radius={[12, 12, 4, 4]} barSize={20} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 space-y-3">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                          <Icon icon="solar:shield-warning-bold-duotone" className="text-xl" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Threats</p>
                          <p className="text-sm font-bold text-white">None Detected</p>
                       </div>
                    </div>
                    <Icon icon="solar:alt-arrow-right-bold-duotone" className="text-zinc-700 transition-transform group-hover:translate-x-1" />
                 </div>
                 
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                          <Icon icon="solar:check-read-bold-duotone" className="text-xl" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Integrity Check</p>
                          <p className="text-sm font-bold text-white">Passed 2h ago</p>
                       </div>
                    </div>
                    <Icon icon="solar:alt-arrow-right-bold-duotone" className="text-zinc-700 transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

