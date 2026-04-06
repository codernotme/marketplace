"use client";

import { Button, Dropdown, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCategoriesStore, useUIStore } from "@/lib/store";

export default function CategoriesPage() {
  const { categories, deleteCategory, toggleCategory } = useCategoriesStore();
  const { openModal } = useUIStore();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
        icon="solar:folder-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onPress={() => openModal("category", "add")}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Category
          </Button>
        }
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-surface border border-border rounded-2xl overflow-hidden stat-card group">
            {cat.image ? (
              <div className="h-28 overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="h-28 bg-gradient-to-br from-accent/10 to-violet-500/10 flex items-center justify-center">
                <Icon icon={cat.icon} className="text-5xl text-accent/40" />
              </div>
            )}
            <div className="p-4 relative">
              <div className="absolute top-4 right-4 z-10">
                <Dropdown>
                  <Dropdown.Trigger>
                    <div 
                      className="p-1 rounded-lg hover:bg-default/40 text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer group"
                      role="button"
                      tabIndex={0}
                    >
                      <Icon icon="solar:menu-dots-bold-duotone" className="text-xl group-hover:scale-110 transition-transform" />
                    </div>
                  </Dropdown.Trigger>
                  <Dropdown.Popover className="min-w-[160px]">
                    <Dropdown.Menu onAction={(key) => {
                      if (key === "edit") openModal("category", "edit", cat);
                      if (key === "toggle") toggleCategory(cat.id);
                      if (key === "delete" && window.confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id);
                    }}>
                      <Dropdown.Item id="edit" textValue="Edit Category">
                        <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                        <Label className="font-bold">Edit Category</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="toggle" textValue={cat.isActive ? "Hide Category" : "Show Category"}>
                        <Icon icon={cat.isActive ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-lg text-muted" />
                        <Label className="font-bold">{cat.isActive ? "Hide Category" : "Show Category"}</Label>
                      </Dropdown.Item>
                      <Separator className="my-1 border-border/50" />
                      <Dropdown.Item id="delete" textValue="Delete Category" variant="danger">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                        <Label className="font-bold text-danger">Delete Category</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon icon={cat.icon} className="text-accent text-base flex-shrink-0" />
                    <h3 className="font-bold text-sm truncate">{cat.name}</h3>
                  </div>
                  <p className="text-[10px] text-muted font-mono tracking-tighter truncate uppercase opacity-80">{cat.slug}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${cat.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted mt-3 font-bold uppercase tracking-wider">{cat.productCount} products</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
