"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building01Icon,
  DollarCircleIcon,
  UserMultiple02Icon,
  ChartBarLineIcon,
  Activity01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { formatINR, formatCompact, formatRelativeTime } from "@workspace/ui/lib/formatters";
import { getMasterStats } from "@/app/actions/master";
import { TenantWizard } from "@/components/tenants/tenant-wizard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { cn } from "@workspace/ui/lib/utils";

export default function MasterDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stats = await getMasterStats();
        setData(stats);
      } catch (error) {
        console.error("Failed to load master data", error);
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
    { title: "Total Tenants", value: data.tenantsCount.toString(), change: { value: 18.3, period: "last month" }, icon: Building01Icon, color: "text-primary", bg: "bg-primary/10" },
    { title: "Platform GMV", value: formatINR(data.totalGMV, true), change: { value: 24.1, period: "last month" }, icon: DollarCircleIcon, color: "text-success", bg: "bg-success/10" },
    { title: "Active Users", value: formatCompact(data.totalUsers), change: { value: 11.7, period: "last month" }, icon: UserMultiple02Icon, color: "text-info", bg: "bg-info/10" },
    { title: "Avg MRR / Tenant", value: formatINR(data.avgRevenue), change: { value: 3.2, period: "last month" }, icon: ChartBarLineIcon, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Platform Overview"
          description="Bird's-eye view of the entire themrktplace platform health."
        />
        <Badge variant="outline" className="px-4 py-2 rounded-full border-none bg-background shadow-sm text-primary font-bold hidden md:flex items-center gap-2">
           <HugeiconsIcon icon={Globe02Icon} size={14} />
           Global Region: Asia-South
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={s.title} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-sm rounded-[32px] overflow-hidden group hover:translate-y-[-2px] transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl", s.bg)}>
                  <HugeiconsIcon icon={s.icon} size={24} className={s.color} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-success">
                   <HugeiconsIcon icon={Activity01Icon} size={14} />
                   {s.change.value}%
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.title}</p>
                <p className="text-3xl font-black mt-1 tracking-tight">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/40 backdrop-blur-lg rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 pb-0">
             <CardTitle className="text-xl font-black tracking-tight">Ecosystem Growth</CardTitle>
             <p className="text-xs text-muted-foreground font-medium tracking-wide">Platform-wide GMV and Tenant onboarding</p>
          </CardHeader>
          <CardContent className="h-[380px] p-0 mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', gmv: 4000, tenants: 24 },
                  { name: 'Tue', gmv: 3000, tenants: 18 },
                  { name: 'Wed', gmv: 2000, tenants: 29 },
                  { name: 'Thu', gmv: 2780, tenants: 32 },
                  { name: 'Fri', gmv: 1890, tenants: 48 },
                  { name: 'Sat', gmv: 2390, tenants: 38 },
                  { name: 'Sun', gmv: 3490, tenants: 43 },
                ]} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                         <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: "bold" }} 
                   />
                   <Area type="monotone" dataKey="gmv" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorGmv)" />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Tenats Activity */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-sm rounded-[40px] flex flex-col overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black tracking-tight">Recent Tenants</CardTitle>
            <a href="/dashboard/tenants" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
               View All
            </a>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <div className="divide-y divide-border/40">
                {data.recentTenants.map((tenant: any, idx: number) => (
                  <div key={tenant.name || idx} className="px-8 py-5 flex items-center justify-between hover:bg-muted/30 transition-all group animate-in slide-in-from-right-4" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] font-bold group-hover:text-primary transition-colors tracking-tight">{tenant.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Joined {formatRelativeTime(tenant.joined)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge className="text-[9px] px-2 py-0 h-4 border-transparent shadow-none font-black uppercase tracking-tight bg-primary/10 text-primary">
                        {tenant.plan}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tenant.status}</span>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="p-8 bg-muted/5 mt-auto border-t border-border/40 flex justify-center">
                <TenantWizard />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
