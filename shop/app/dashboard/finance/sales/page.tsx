"use client";

import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function FinanceSalesPage() {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.total : 0), 0);
  const totalTax = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.tax : 0), 0);
  const totalDiscount = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.discount : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        subtitle="Detailed revenue and transaction logs"
        icon="solar:document-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Icon icon="solar:export-bold-duotone" className="text-base" />
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Icon icon="solar:printer-bold-duotone" className="text-base" />
              Print PDF
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "solar:wallet-money-bold-duotone", color: "text-accent" },
          { label: "Tax Collected", value: formatCurrency(totalTax), icon: "solar:bill-list-bold-duotone", color: "text-warning" },
          { label: "Total Discounts", value: formatCurrency(totalDiscount), icon: "solar:ticket-sale-bold-duotone", color: "text-danger" },
          { label: "Net Revenue", value: formatCurrency(totalRevenue - totalTax - totalDiscount), icon: "solar:graph-up-bold-duotone", color: "text-success" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl p-4 border border-border/50">
            <Icon icon={s.icon} className={`text-2xl ${s.color} mb-2`} />
            <p className="text-xl font-bold font-[family-name:var(--font-outfit)]">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Subtotal</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Tax</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Discount</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Method</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {orders.map((order) => (
                <tr key={order.id} className="table-row-hover">
                  <td className="px-5 py-4 font-mono text-xs text-accent font-bold">{order.orderNumber}</td>
                  <td className="px-5 py-4 font-medium">{order.customer.name}</td>
                  <td className="px-5 py-4 text-right">{formatCurrency(order.subtotal)}</td>
                  <td className="px-5 py-4 text-right text-muted">{formatCurrency(order.tax)}</td>
                  <td className="px-5 py-4 text-right text-danger">-{formatCurrency(order.discount)}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs capitalize bg-default px-2 py-0.5 rounded-md text-muted">{order.paymentMethod}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
