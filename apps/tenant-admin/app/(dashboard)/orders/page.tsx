import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FilterIcon, Download01Icon } from "@hugeicons/core-free-icons";
import { formatINR, formatDateTime, formatOrderStatus, getOrderStatusColor } from "@workspace/ui/lib/formatters";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders — themrktplace",
  description: "Manage your store orders, fulfillments, and returns.",
};

const mockOrders = [
  { id: "#1042", customer: "Priya Sharma", items: 3, amount: 2499, status: "delivered", date: new Date(Date.now() - 3600000) },
  { id: "#1041", customer: "Rahul Verma", items: 1, amount: 5999, status: "shipped", date: new Date(Date.now() - 7200000) },
  { id: "#1040", customer: "Ananya Singh", items: 2, amount: 1249, status: "processing", date: new Date(Date.now() - 10800000) },
  { id: "#1039", customer: "Rohan Mehta", items: 1, amount: 799, status: "pending", date: new Date(Date.now() - 18000000) },
  { id: "#1038", customer: "Kavita Nair", items: 4, amount: 3299, status: "cancelled", date: new Date(Date.now() - 86400000) },
  { id: "#1037", customer: "Vikram Joshi", items: 2, amount: 1899, status: "delivered", date: new Date(Date.now() - 172800000) },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="Track, manage, and fulfill your customer orders."
      >
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Create order
        </Button>
      </PageHeader>

      {/* Status tabs */}
      <div className="flex items-center gap-1 border-b border-border -mb-2">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              i === 0
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm font-medium">{mockOrders.length} orders</p>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" />
            Filter
          </Button>
        </div>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <span className="text-sm font-mono font-medium">{order.id}</span>
              <span className="text-sm font-medium">{order.customer}</span>
              <span className="text-sm text-muted-foreground">{order.items} item{order.items !== 1 ? "s" : ""}</span>
              <span className="text-sm font-semibold tabular-nums">{formatINR(order.amount)}</span>
              <span className="text-xs text-muted-foreground">{formatDateTime(order.date)}</span>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full w-fit", getOrderStatusColor(order.status))}>
                {formatOrderStatus(order.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
