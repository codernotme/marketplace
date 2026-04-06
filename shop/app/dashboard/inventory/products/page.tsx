"use client";

import { useState } from "react";
import { Button, Chip, Input, Select, } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { products, type ProductStatus } from "@/lib/mock-data";
import { formatCurrency, getStatusColor } from "@/lib/utils";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions: { key: string; label: string }[] = [
    { key: "all", label: "All Status" },
    { key: "active", label: "Active" },
    { key: "draft", label: "Draft" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products total`}
        icon="solar:box-bold-duotone"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Icon icon="solar:upload-bold-duotone" className="text-base" />
              Import CSV
            </Button>
            <Button variant="primary" size="sm" className="gap-2" onPress={() => window.location.href = "/dashboard/inventory/products/add"}>
              <Icon icon="solar:add-square-bold-duotone" className="text-base" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or SKU…"
          value={search}
          onValueChange={setSearch}
          startContent={<Icon icon="solar:magnifer-bold-duotone" className="text-muted text-lg" />}
          className="sm:max-w-xs"
        />
        <Select
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
          className="sm:max-w-[160px]"
        >
          {statusOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Flags</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((product) => {
                const colorMap: Record<ProductStatus, "success" | "default" | "warning"> = {
                  active: "success",
                  draft: "default",
                  archived: "warning",
                };
                const stockBadge =
                  product.stock === 0
                    ? { label: "Out", color: "danger" as const }
                    : product.stock <= product.lowStockThreshold
                    ? { label: product.stock.toString(), color: "warning" as const }
                    : { label: product.stock.toString(), color: "success" as const };

                return (
                  <tr key={product.id} className="table-row-hover">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-default flex items-center justify-center flex-shrink-0">
                          <Icon icon="solar:box-bold-duotone" className="text-muted" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[200px]">{product.title}</p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3.5 text-muted">{product.category}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div>
                        <p className="font-bold">{formatCurrency(product.price)}</p>
                        {product.comparePrice && (
                          <p className="text-xs text-muted line-through">{formatCurrency(product.comparePrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Chip size="sm" variant={stockBadge.color}>
                        {stockBadge.label === "Out" ? "Out of stock" : `${stockBadge.label} in stock`}
                      </Chip>
                    </td>
                    <td className="px-4 py-3.5">
                      <Chip size="sm" variant={colorMap[product.status]}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Chip>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {product.isNew && (
                          <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-medium">New</span>
                        )}
                        {product.isBestSeller && (
                          <span className="text-xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-md font-medium">⭐ Best</span>
                        )}
                        {product.isFeatured && (
                          <span className="text-xs bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded-md font-medium">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                          <Icon icon="solar:pen-bold-duotone" className="text-base" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    <Icon icon="solar:box-bold-duotone" className="text-4xl mx-auto mb-2 opacity-30" />
                    <p>No products found</p>
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
