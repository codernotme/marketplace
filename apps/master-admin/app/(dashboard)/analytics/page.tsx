"use client";

import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Download01Icon, 
  ChartBarLineIcon, 
  Activity01Icon,
  ShoppingBasket01Icon,
  DollarCircleIcon
} from "@hugeicons/core-free-icons";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { formatINR } from "@workspace/ui/lib/formatters";

const data = [
  { month: 'Jan', revenue: 450000, orders: 1200 },
  { month: 'Feb', revenue: 520000, orders: 1450 },
  { month: 'Mar', revenue: 480000, orders: 1320 },
  { month: 'Apr', revenue: 610000, orders: 1680 },
  { month: 'May', revenue: 750000, orders: 1900 },
  { month: 'Jun', revenue: 890000, orders: 2400 },
];

export default function MasterAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <PageHeader
        title="Platform Analytics"
        description="Deep dive into cross-tenant revenue and transaction performance."
      >
        <Button variant="outline" size="sm" className="rounded-full shadow-none bg-background">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export Report
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <HugeiconsIcon icon={DollarCircleIcon} size={20} />
               </div>
               Platform Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: "bold" }}
                     formatter={(val: number) => [formatINR(val), "Revenue"]}
                   />
                   <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} barSize={24} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
               <div className="p-2 bg-info/10 rounded-xl text-info">
                  <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} />
               </div>
               Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-4">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: "bold" }}
                   />
                   <Line type="monotone" dataKey="orders" stroke="hsl(var(--info))" strokeWidth={4} dot={{ r: 6, fill: "hsl(var(--info))", strokeWidth: 3, stroke: "#fff" }} />
                </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card/20 backdrop-blur-sm rounded-[40px] p-12 text-center flex flex-col items-center gap-4">
          <div className="p-5 bg-primary/10 rounded-full animate-bounce">
             <HugeiconsIcon icon={Activity01Icon} size={32} className="text-primary" />
          </div>
         <h3 className="text-2xl font-black tracking-tighter">AI Predictions</h3>
         <p className="text-sm text-muted-foreground max-w-[400px]">Based on current growth patterns, platform GMV is projected to hit ₹1.2Cr by the end of Q3 2026.</p>
         <Button className="rounded-2xl px-12 h-12 font-black shadow-2xl shadow-primary/20 mt-4">Download Full Deck</Button>
      </Card>
    </div>
  );
}
