"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Input, InputGroup, Dropdown, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOrdersStore, useUIStore } from "@/lib/store";
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
  const { orders } = useOrdersStore();
  const { openModal } = useUIStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  
  const statusFilter = searchParams.get("status") || "all";

  const updateStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/dashboard/orders?${params.toString()}`);
  };

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
            onClick={() => updateStatus(opt.key)}
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
      <div className="max-w-sm">
        <div className="flex items-center gap-2 bg-default/40 border border-border rounded-2xl px-4 py-2.5 text-sm hover:border-accent/40 transition-all">
          <Icon icon="solar:magnifer-bold-duotone" className="text-lg text-muted" />
          <input
            placeholder="Search by order #, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
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
                <tr key={order.id} className="table-row-hover group/row">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-accent text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-muted">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <p className="font-medium text-sm">{order.customer.name}</p>
                    <p className="text-xs text-muted">{order.customer.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.fulfillmentStatus} />
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <StatusBadge status={order.paymentStatus} />
                    <p className="text-xs text-muted mt-1 font-medium">{order.paymentMethod}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-sm tracking-tight">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-3.5 text-muted text-xs hidden lg:table-cell opacity-80" suppressHydrationWarning>
                    {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <div 
                          className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer group"
                          role="button"
                          tabIndex={0}
                        >
                          <Icon icon="solar:menu-dots-bold-duotone" className="text-xl group-hover:scale-110 transition-transform" />
                        </div>
                      </Dropdown.Trigger>
                      <Dropdown.Popover className="min-w-[180px]">
                        <Dropdown.Menu onAction={(key) => {
                          if (key === "view") openModal("order", "edit", order);
                        }}>
                          <Dropdown.Item id="view" textValue="View Full Details">
                            <Icon icon="solar:eye-bold-duotone" className="text-lg text-muted" />
                            <Label className="font-bold">View Details</Label>
                          </Dropdown.Item>
                          <Dropdown.Item id="invoice" textValue="Print Invoice">
                            <Icon icon="solar:printer-minimalistic-bold-duotone" className="text-lg text-muted" />
                            <Label className="font-bold">Print Invoice</Label>
                          </Dropdown.Item>
                          <Dropdown.Item id="label" textValue="Download Label">
                            <Icon icon="solar:download-square-bold-duotone" className="text-lg text-muted" />
                            <Label className="font-bold">Download Label</Label>
                          </Dropdown.Item>
                          <Separator className="my-1 border-border/50" />
                          <Dropdown.Item id="cancel" textValue="Cancel Order" variant="danger">
                            <Icon icon="solar:close-circle-bold-duotone" className="text-lg text-danger" />
                            <Label className="font-bold text-danger">Cancel Order</Label>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </td>
                </tr>
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
