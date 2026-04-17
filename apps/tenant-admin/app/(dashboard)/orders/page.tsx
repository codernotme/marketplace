import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Add01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { formatINR, formatDateTime, getOrderStatusColor, formatOrderStatus } from "@workspace/ui/lib/formatters";
import { DataTable } from "@workspace/ui/components/data-table";
import { getOrders } from "@/app/actions/orders";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders — themrktplace",
  description: "Manage your store orders, fulfillments, and returns.",
};

const columns = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-semibold text-primary">{row.original.orderNumber || `#${row.original.id.slice(-4)}`}</span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.customer?.name || "Guest Customer"}</span>
        <span className="text-[10px] text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <Badge 
        className={cn("shadow-none border-transparent", getOrderStatusColor(row.original.status))}
      >
        {formatOrderStatus(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }: any) => <span className="tabular-nums font-semibold">{formatINR(row.original.total)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }: any) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
  },
  {
    id: "actions",
    cell: ({ row }: any) => (
      <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8">
        <Link href={`/dashboard/orders/${row.original.id}`}>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </Button>
    ),
  },
];

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Orders"
        description="Track, manage, and fulfill your customer orders."
      >
        <Button variant="outline" size="sm" className="rounded-full shadow-none">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm" className="rounded-full shadow-none px-5">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Create order
        </Button>
      </PageHeader>

      {/* Quick metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Unfulfilled", value: orders.filter(o => o.status === "pending").length, color: "text-warning" },
          { label: "Active", value: orders.filter(o => ["processing", "shipped"].includes(o.status)).length, color: "text-primary" },
          { label: "Completed", value: orders.filter(o => o.status === "delivered").length, color: "text-success" },
          { label: "Revenue", value: formatINR(orders.reduce((acc, o) => acc + o.total, 0), true), color: "text-foreground" },
        ].map((m) => (
          <div key={m.label} className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className={cn("text-xl font-bold mt-1", m.color)}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-sm">
        <DataTable 
          columns={columns as any} 
          data={orders} 
          searchColumn="orderNumber"
          searchPlaceholder="Search order number..."
        />
      </div>
    </div>
  );
}
