import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Download01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { DataTable } from "@workspace/ui/components/data-table";
import { formatINR } from "@workspace/ui/lib/formatters";
import { getProducts } from "@/app/actions/products";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — themrktplace",
  description: "Manage your store's product catalog.",
};

const columns = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.category?.name || "No Category"}</span>
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }: any) => <span className="font-mono text-xs">{row.original.sku || "N/A"}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => (
      <span className="tabular-nums">
        {row.original.variants?.[0] ? formatINR(row.original.variants[0].price) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.original.status as string;
      return (
        <Badge 
          variant={status === "active" ? "default" : status === "draft" ? "secondary" : "outline"}
          className="capitalize shadow-none"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }: any) => (
      <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors">
        <Link href={`/dashboard/products/${row.original.id}`}>
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
        </Link>
      </Button>
    ),
  },
];

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Products"
        description="Manage your product catalog — add, edit, and organize products."
      >
        <Button variant="outline" size="sm" className="shadow-none rounded-full">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm" asChild className="shadow-none rounded-full px-5">
          <Link href="/dashboard/products/new">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            Add product
          </Link>
        </Button>
      </PageHeader>

      {/* Quick stats with glass effect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total products", value: products.length, trend: "+2 this week" },
          { label: "Low stock", value: "0", trend: "0 archived" },
          { label: "Out of stock", value: "0", trend: "All good" },
        ].map((s) => (
          <div key={s.label} className="group rounded-2xl border border-border/50 p-6 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-sm">
        <DataTable 
          columns={columns as any} 
          data={products} 
          searchColumn="name"
          searchPlaceholder="Search products..."
        />
      </div>
    </div>
  );
}
