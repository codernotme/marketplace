"use client";

import { Button, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { categories } from "@/lib/mock-data";

export default function CategoriesPage() {
  const rootCategories = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Categories"
        subtitle="Manage your product taxonomy"
        icon="solar:folder-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Category
          </Button>
        }
      />

      <div className="space-y-3">
        {rootCategories.map((cat) => {
          const children = getChildren(cat.id);
          return (
            <div key={cat.id} className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icon icon={cat.icon} className="text-accent text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{cat.name}</p>
                    <span className="text-xs bg-default text-muted px-2 py-0.5 rounded-full">{cat.productCount} products</span>
                  </div>
                  <p className="text-xs text-muted">/{cat.slug}</p>
                </div>
                <Switch defaultSelected={cat.isActive} size="sm" />
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                    <Icon icon="solar:pen-bold-duotone" className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                    <Icon icon="solar:add-square-bold-duotone" className="text-sm" />
                  </button>
                </div>
              </div>

              {children.length > 0 && (
                <div className="border-t border-border/40 bg-background/30">
                  {children.map((child, i) => (
                    <div key={child.id} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-border/30" : ""}`}>
                      <div className="w-4 ml-6 flex-shrink-0 text-border">
                        <Icon icon="solar:alt-arrow-right-bold-duotone" className="text-xs text-muted" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-default flex items-center justify-center">
                        <Icon icon={child.icon} className="text-muted text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{child.name}</p>
                        <p className="text-xs text-muted">{child.productCount} products · /{child.slug}</p>
                      </div>
                      <Switch defaultSelected={child.isActive} size="sm" />
                      <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                        <Icon icon="solar:pen-bold-duotone" className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
