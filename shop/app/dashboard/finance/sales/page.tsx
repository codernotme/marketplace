"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOrdersStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function FinanceSalesPage() {
  const { orders } = useOrdersStore();
  
  const paidOrders = orders.filter(o => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalTax = paidOrders.reduce((sum, o) => sum + o.tax, 0);
  const totalDiscount = paidOrders.reduce((sum, o) => sum + o.discount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        subtitle="Detailed revenue and transaction logs"
        icon="solar:document-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2 text-xs">
              <Icon icon="solar:export-bold-duotone" className="text-base" />
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" className="gap-2 text-xs">
              <Icon icon="solar:printer-bold-duotone" className="text-base" />
              Print PDF
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "solar:wallet-money-bold-duotone", color: "text-accent", bg: "bg-accent/10" },
          { label: "Tax Collected", value: formatCurrency(totalTax), icon: "solar:bill-list-bold-duotone", color: "text-warning", bg: "bg-warning/10" },
          { label: "Total Discounts", value: formatCurrency(totalDiscount), icon: "solar:ticket-sale-bold-duotone", color: "text-danger", bg: "bg-danger/10" },
          { label: "Net Revenue", value: formatCurrency(totalRevenue - totalTax - totalDiscount), icon: "solar:graph-up-bold-duotone", color: "text-success", bg: "bg-success/10" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl p-5 border border-border/50 stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} mb-3`}>
              <Icon icon={s.icon} className="text-xl" />
            </div>
            <p className="text-xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">{s.value}</p>
            <p className="text-xs text-muted mt-1 uppercase font-semibold tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Order #</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Customer</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Subtotal</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Tax</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Discount</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Total</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Status</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-muted uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="table-row-hover transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-accent font-bold">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-sm">{order.customer.name}</p>
                    <p className="text-[10px] text-muted uppercase tracking-tighter">{order.paymentMethod}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-medium">{formatCurrency(order.subtotal)}</td>
                  <td className="px-5 py-4 text-right text-muted">{formatCurrency(order.tax)}</td>
                  <td className="px-5 py-4 text-right text-danger">-{formatCurrency(order.discount)}</td>
                  <td className="px-5 py-4 text-right font-bold text-foreground">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 text-xs text-muted font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <Icon icon="solar:document-bold-duotone" className="text-5xl mx-auto mb-4 opacity-20" />
                    <p className="text-muted font-medium">No transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
