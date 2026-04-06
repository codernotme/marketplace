"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOrdersStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@/lib/mock-data";

const STATUS_OPTS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const FULFILLMENT_OPTIONS: OrderStatus[] = ["pending", "processing", "packed", "shipped", "delivered", "cancelled", "returned"];

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.fulfillmentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTS.reduce((acc, opt) => {
    acc[opt.key] = opt.key === "all" ? orders.length : orders.filter(o => o.fulfillmentStatus === opt.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
        icon="solar:cart-large-bold-duotone"
        actions={
          <Button variant="secondary" size="sm" className="gap-2">
            <Icon icon="solar:download-bold-duotone" className="text-base" />
            Export
          </Button>
        }
      />

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-default/40 rounded-xl w-fit overflow-x-auto">
        {STATUS_OPTS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              statusFilter === opt.key ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === opt.key ? "bg-accent/10 text-accent" : "bg-default/80 text-muted"}`}>
              {counts[opt.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by order #, customer…"
        value={search}
        onValueChange={setSearch}
        startContent={<Icon icon="solar:magnifer-bold-duotone" className="text-muted text-lg" />}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Payment</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <>
                  <tr key={order.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-accent text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-muted">{order.customer.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={order.fulfillmentStatus} />
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs bg-default/60 border border-border rounded-md px-1.5 py-0.5 text-muted cursor-pointer focus:outline-none focus:border-accent"
                        >
                          {FULFILLMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <StatusBadge status={order.paymentStatus} />
                      <p className="text-xs text-muted mt-0.5">{order.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-sm">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-3.5 text-muted text-xs hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <Icon icon={expandedOrder === order.id ? "solar:alt-arrow-up-bold-duotone" : "solar:alt-arrow-down-bold-duotone"} className="text-base" />
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-expand`} className="bg-background/40">
                      <td colSpan={7} className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold text-xs text-muted mb-2 uppercase tracking-wider">Items Ordered</p>
                            <div className="space-y-1.5">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-muted">{item.variant} × {item.qty}</p>
                                  </div>
                                  <p className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-border space-y-1 text-xs text-muted">
                              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                              <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</span></div>
                              <div className="flex justify-between"><span>Tax (GST)</span><span>{formatCurrency(order.tax)}</span></div>
                              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−{formatCurrency(order.discount)}</span></div>}
                              <div className="flex justify-between font-bold text-foreground text-sm mt-1"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-muted mb-2 uppercase tracking-wider">Shipping Address</p>
                            <p className="text-sm">{order.shippingAddress.line1}</p>
                            <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                            {order.trackingNumber && (
                              <div className="mt-3 p-2.5 bg-default/60 rounded-xl">
                                <p className="text-xs text-muted">Tracking: <span className="font-mono text-foreground">{order.trackingNumber}</span></p>
                                <p className="text-xs text-muted">Courier: {order.courier}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Icon icon="solar:cart-large-bold-duotone" className="text-5xl mx-auto mb-3 opacity-20" />
                    <p className="text-muted text-sm">No orders found</p>
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
