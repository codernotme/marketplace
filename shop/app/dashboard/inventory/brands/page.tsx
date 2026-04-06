"use client";

import { Button, Dropdown, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBrandsStore, useUIStore } from "@/lib/store";

export default function BrandsPage() {
  const { brands, deleteBrand, toggleBrand } = useBrandsStore();
  const { openModal } = useUIStore();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Brands"
        subtitle={`${brands.length} brands`}
        icon="solar:shield-star-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onPress={() => openModal("brand", "add")}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Brand
          </Button>
        }
      />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Manufacturer</th>
                <th className="text-left px-5 py-4 font-bold text-muted uppercase tracking-widest text-[10px] hidden md:table-cell">Slug</th>
                <th className="text-right px-5 py-4 font-bold text-muted uppercase tracking-widest text-[10px] hidden lg:table-cell">Inventory</th>
                <th className="text-left px-5 py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-5 py-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {brands.map((b) => (
                <tr key={b.id} className="table-row-hover group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-violet-500/10 flex items-center justify-center font-black text-sm text-accent shadow-sm border border-accent/5">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-full h-full object-contain p-1" />
                        ) : b.name[0].toUpperCase()}
                      </div>
                      <span className="font-bold tracking-tight text-sm">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-mono text-[11px] hidden md:table-cell opacity-70 uppercase">{b.slug}</td>
                  <td className="px-5 py-3.5 text-right font-black hidden lg:table-cell text-xs opacity-80">{b.productCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${b.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                      {b.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors outline-none cursor-pointer">
                            <Icon icon="solar:menu-dots-bold-duotone" className="text-xl" />
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[160px]">
                          <Dropdown.Menu onAction={(key) => {
                            if (key === "edit") openModal("brand", "edit", b);
                            if (key === "toggle") toggleBrand(b.id);
                            if (key === "delete" && window.confirm(`Delete ${b.name}?`)) deleteBrand(b.id);
                          }}>
                            <Dropdown.Item id="edit" textValue="Edit Brand">
                              <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                              <Label className="font-bold">Edit Brand</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="toggle" textValue={b.isActive ? "Hide Brand" : "Show Brand"}>
                              <Icon icon={b.isActive ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-lg text-muted" />
                              <Label className="font-bold">{b.isActive ? "Hide Brand" : "Show Brand"}</Label>
                            </Dropdown.Item>
                            <Separator className="my-1 border-border/50" />
                            <Dropdown.Item id="delete" textValue="Delete Brand" variant="danger">
                              <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                              <Label className="font-bold text-danger">Delete Brand</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
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
