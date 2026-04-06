"use client";

import { useState } from "react";
import { Button, InputGroup, Input, Dropdown, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useProductsStore, useUIStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { ProductStatus } from "@/lib/mock-data";

const STATUS_OPTS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct } = useProductsStore();
  const { openModal } = useUIStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: products.length,
    active: products.filter(p => p.status === "active").length,
    draft: products.filter(p => p.status === "draft").length,
    archived: products.filter(p => p.status === "archived").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products total`}
        icon="solar:box-bold-duotone"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Icon icon="solar:upload-bold-duotone" className="text-base" />
              Import
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onPress={() => openModal("product", "add")}
            >
              <Icon icon="solar:add-square-bold-duotone" className="text-base" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-default/40 rounded-xl w-fit">
        {STATUS_OPTS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === opt.key ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === opt.key ? "bg-accent/10 text-accent" : "bg-default/80 text-muted"}`}>
              {counts[opt.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <InputGroup className="bg-default/40 border border-border rounded-xl">
          <InputGroup.Prefix className="pl-3 text-muted">
            <Icon icon="solar:magnifer-bold-duotone" className="text-lg" />
          </InputGroup.Prefix>
          <Input
            placeholder="Search by name, SKU or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2"
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Category</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Stock</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden xl:table-cell">Flags</th>
                <th className="px-4 py-3.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                const allOut = product.variants.every((v) => v.stock === 0);
                const isLow = !allOut && product.variants.some((v) => v.stock > 0 && v.stock <= 5);

                return (
                  <tr key={product.id} className="table-row-hover">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-default flex-shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon icon="solar:box-bold-duotone" className="text-muted text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[180px] text-sm">{product.title}</p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted font-mono text-xs hidden md:table-cell">{product.sku}</td>
                    <td className="px-4 py-3.5 text-muted text-xs hidden lg:table-cell">
                      {product.category_id}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="font-bold text-sm">{formatCurrency(product.price)}</p>
                      {product.comparePrice && (
                        <p className="text-xs text-muted line-through">{formatCurrency(product.comparePrice)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        allOut ? "bg-danger/15 text-danger" :
                        isLow ? "bg-warning/15 text-warning" :
                        "bg-success/15 text-success"
                      }`}>
                        {allOut ? "Out of stock" : isLow ? `Low (${totalStock})` : `${totalStock} in stock`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {product.is_new && <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-semibold">New</span>}
                        {product.is_featured && <span className="text-xs bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded-md font-semibold">Featured</span>}
                        {product.is_trending && <span className="text-xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-md font-semibold">🔥 Hot</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors outline-none cursor-pointer">
                            <Icon icon="solar:menu-dots-bold-duotone" className="text-xl" />
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[180px]">
                          <Dropdown.Menu onAction={(key) => {
                            if (key === "edit") openModal("product", "edit", product);
                            if (key === "delete" && window.confirm(`Delete "${product.title}"?`)) deleteProduct(product.id);
                            if (key === "active" || key === "draft" || key === "archived") updateProduct(product.id, { status: key });
                          }}>
                            <Dropdown.Section>
                              <Dropdown.Item id="edit" textValue="Edit Details">
                                <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                                <Label className="font-bold">Edit Details</Label>
                              </Dropdown.Item>
                              <Dropdown.Item id="duplicate" textValue="Make a Copy">
                                <Icon icon="solar:copy-bold-duotone" className="text-lg text-muted" />
                                <Label className="font-bold">Make a Copy</Label>
                              </Dropdown.Item>
                            </Dropdown.Section>
                            
                            <Separator className="my-1 border-border/50" />
                            
                            <Dropdown.Section>
                              <Dropdown.SubmenuTrigger>
                                <Dropdown.Item id="status" textValue="Change Status">
                                  <Icon icon="solar:shield-check-bold-duotone" className="text-lg text-muted" />
                                  <Label className="font-bold">Change Status</Label>
                                  <Dropdown.SubmenuIndicator />
                                </Dropdown.Item>
                                <Dropdown.Popover className="min-w-[140px]">
                                  <Dropdown.Menu>
                                    <Dropdown.Item id="active" textValue="Active">
                                      <div className="w-2 h-2 rounded-full bg-success mr-2" />
                                      <Label className="font-bold text-success">Active</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="draft" textValue="Draft">
                                      <div className="w-2 h-2 rounded-full bg-warning mr-2" />
                                      <Label className="font-bold text-warning">Draft</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="archived" textValue="Archived">
                                      <div className="w-2 h-2 rounded-full bg-muted mr-2" />
                                      <Label className="font-bold text-muted">Archived</Label>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown.Popover>
                              </Dropdown.SubmenuTrigger>
                            </Dropdown.Section>

                            <Separator className="my-1 border-border/50" />

                            <Dropdown.Section>
                              <Dropdown.Item id="delete" textValue="Delete Product" variant="danger">
                                <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                                <Label className="font-bold text-danger">Delete Product</Label>
                              </Dropdown.Item>
                            </Dropdown.Section>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Icon icon="solar:box-bold-duotone" className="text-5xl mx-auto mb-3 opacity-20" />
                    <p className="text-muted text-sm">No products found</p>
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
