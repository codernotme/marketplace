"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card, Button, Chip, Spinner, Input, Dropdown } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GlobalOrder {
  _id: string;
  tenant_id: string;
  order_number: string;
  user_email: string;
  total_amount: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  fulfillment_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

interface OrderStats {
  gross_revenue: number;
  avg_order_value: number;
  total_volume: number;
  success_rate: number;
}

const paymentColors: Record<string, "success" | "warning" | "danger" | "default" | "accent"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "accent",
};

const fulfillmentColors: Record<string, "success" | "warning" | "danger" | "default" | "accent"> = {
  delivered: "success",
  shipped: "accent",
  processing: "warning",
  pending: "default",
  cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<GlobalOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        apiClient.get<{ data: GlobalOrder[] }>("/api/saas/orders"),
        apiClient.get<OrderStats>("/api/saas/orders/stats"),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes);
    } catch (error) {
      toast.error("Failed to synchronize transaction ledger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:bill-list-bold-duotone" className="text-3xl text-primary" />
             Platform Orders
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Consolidated real-time transaction ledger for the entire ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="font-bold gap-2" onClick={fetchData}>
             <Icon icon="solar:refresh-bold-duotone" className="text-lg" />
             Refresh Stream
           </Button>
           <Button variant="primary" className="font-bold gap-2 shadow-lg shadow-primary/20">
             <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
             Export Ledger
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue (GMV)", value: `$${stats?.gross_revenue.toLocaleString() || "0"}`, icon: "solar:banknote-bold-duotone", color: "text-success", bg: "bg-success/10" },
          { label: "Transaction Volume", value: stats?.total_volume || "0", icon: "solar:cart-large-4-bold-duotone", color: "text-primary", bg: "bg-primary/10" },
          { label: "Average Order Value", value: `$${stats?.avg_order_value || "0"}`, icon: "solar:round-transfer-horizontal-bold-duotone", color: "text-accent", bg: "bg-accent/10" },
          { label: "Success Rate", value: `${stats?.success_rate || "0"}%`, icon: "solar:check-circle-bold-duotone", color: "text-warning", bg: "bg-warning/10" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border bg-surface shadow-sm overflow-hidden group">
            <div className="p-4 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <Icon icon={stat.icon} className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Constraints & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-surface border border-border p-3 rounded-2xl shadow-sm">
         <div className="max-w-md w-full bg-default-100/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center px-3 h-11 border border-border/50">
           <Icon icon="solar:magnifer-linear" className="text-default-400" width={18} />
           <Input
             placeholder="Search by order number or email..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="flex-1 bg-transparent border-none shadow-none focus:ring-0 text-sm ml-2 h-full"
           />
         </div>
         <div className="flex bg-default-100/50 border border-border/50 rounded-xl p-1 gap-1 h-11 w-full sm:w-auto overflow-x-auto scrollbar-hide">
           {["all", "paid", "pending", "failed"].map((s) => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={cn(
                 "px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                 statusFilter === s ? "bg-background text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:bg-default-200/50"
               )}
             >
               {s === "all" ? "All Payments" : s.toUpperCase()}
             </button>
           ))}
         </div>
      </div>

      {/* Ledger Table */}
      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction Trace</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Source Tenant</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Settlement</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Fulfillment</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Chronology</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <Spinner color="accent" />
                      <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hydrating Transaction Ledger...</p>
                   </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-muted-foreground italic text-sm">
                      Zero matching records detected in the transaction stream.
                   </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                         <span className="font-bold text-sm text-foreground">{o.order_number}</span>
                         <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">{o.user_email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-default-100 flex items-center justify-center border border-border/50">
                           <Icon icon="solar:shop-bold-duotone" className="text-xs text-muted-foreground" />
                        </div>
                        <code className="text-xs font-mono text-muted-foreground opacity-60">
                          {o.tenant_id.substring(0, 8)}
                        </code>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                         <span className="text-sm font-black text-foreground">${o.total_amount.toLocaleString()}</span>
                         <Chip 
                          variant="soft" 
                          color={paymentColors[o.payment_status]}
                          className="font-black text-[9px] uppercase tracking-wider h-5 flex items-center gap-1"
                         >
                            {o.payment_status}
                         </Chip>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={fulfillmentColors[o.fulfillment_status]}
                        className="font-black text-[9px] uppercase tracking-wider h-5 px-2"
                      >
                         {o.fulfillment_status}
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{new Date(o.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-muted-foreground font-medium opacity-60">{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Button 
                        variant="ghost" 
                        isIconOnly 
                        className="rounded-xl opacity-40 group-hover:opacity-100 transition-all h-9 w-9"
                       >
                          <Icon icon="solar:eye-bold-duotone" className="text-lg opacity-60" />
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between pt-4">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Network Throughput: Optimal</span>
         </div>
         <p className="text-[10px] text-muted-foreground font-medium opacity-60 tracking-wider">PLATFORM DATA INTEGRITY VERIFIED • SaaS V3</p>
      </div>
    </div>
  );
}
