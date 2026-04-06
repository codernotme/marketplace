"use client";

import { useState } from "react";
import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { orders, type OrderStatus } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const STATUS_TABS: { key: string; label: string; count?: number }[] = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const ORDER_STATUS_VARIANTS: Record<string, "success" | "warning" | "danger" | "default"> = {
  pending: "warning",
  processing: "warning",
  packed: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
  returned: "danger",
};

const PAYMENT_STATUS_VARIANTS: Record<string, "success" | "warning" | "danger" | "default"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "default",
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "all" || o.fulfillmentStatus === activeTab;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
        icon="solar:cart-large-bold-duotone"
        actions={
          <Button variant="secondary" size="sm" className="gap-2">
            <Icon icon="solar:export-bold-duotone" className="text-base" />
            Export CSV
          </Button>
        }
      />

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-default/40 rounded-xl overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab.key === "all" ? orders.length : orders.filter((o) => o.fulfillmentStatus === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-surface text-accent shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-accent/10 text-accent" : "bg-default text-muted"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by order number, customer name or email…"
        value={search}
        onValueChange={setSearch}
        startContent={<Icon icon="solar:magnifer-bold-duotone" className="text-muted text-lg" />}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Items</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((order) => (
                <tr key={order.id} className="table-row-hover">
                  <td className="px-5 py-4">
                    <p className="font-bold text-accent">{order.orderNumber}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-xs text-muted">{order.customer.email}</p>
                  </td>
                  <td className="px-5 py-4 text-right text-muted">{order.items.length}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-4">
                    <Chip size="sm" variant={PAYMENT_STATUS_VARIANTS[order.paymentStatus]}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Chip>
                  </td>
                  <td className="px-5 py-4">
                    <Chip size="sm" variant={ORDER_STATUS_VARIANTS[order.fulfillmentStatus]}>
                      {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                    </Chip>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.source === "web" ? "bg-blue-500/10 text-blue-400" :
                      order.source === "mobile" ? "bg-purple-500/10 text-purple-400" :
                      "bg-orange-500/10 text-orange-400"
                    }`}>
                      {order.source}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                      <Icon icon="solar:eye-bold-duotone" className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted">
                    <Icon icon="solar:cart-large-bold-duotone" className="text-4xl mx-auto mb-2 opacity-30" />
                    <p>No orders found</p>
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
