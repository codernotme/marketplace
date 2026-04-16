import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FilterIcon, Download01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — themrktplace",
  description: "Manage your store's product catalog.",
};

const mockProducts = [
  { id: "1", name: "Classic White Tee", sku: "TEE-001", price: "₹599", stock: 142, status: "published" },
  { id: "2", name: "Slim Fit Jeans", sku: "JNS-002", price: "₹1,499", stock: 38, status: "published" },
  { id: "3", name: "Running Sneakers", sku: "SNK-003", price: "₹2,999", stock: 0, status: "published" },
  { id: "4", name: "Canvas Backpack", sku: "BAG-004", price: "₹899", stock: 25, status: "draft" },
  { id: "5", name: "Silk Scarf", sku: "ACC-005", price: "₹399", stock: 88, status: "archived" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog — add, edit, and organize products."
      >
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Add product
        </Button>
      </PageHeader>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total products", value: "86" },
          { label: "Low stock", value: "12" },
          { label: "Out of stock", value: "4" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-4 bg-card">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm font-medium">All Products</p>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" />
            Filter
          </Button>
        </div>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Product</span>
            <span>SKU</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
          </div>
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium">{product.name}</span>
              <span className="text-sm font-mono text-muted-foreground">{product.sku}</span>
              <span className="text-sm tabular-nums">{product.price}</span>
              <span
                className={`text-sm tabular-nums font-medium ${
                  product.stock === 0
                    ? "text-destructive"
                    : product.stock < 20
                    ? "text-warning"
                    : ""
                }`}
              >
                {product.stock === 0 ? "Out of stock" : product.stock}
              </span>
              <Badge variant={statusVariant[product.status] ?? "outline"}>
                {product.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
