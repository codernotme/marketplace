"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, type NavItem } from "@/lib/mock-data";
import { useUIStore } from "@/lib/store";

function NavItemRow({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const pathname = usePathname();
  const { expandedNavKeys, toggleNavKey } = useUIStore();
  const isExpanded = expandedNavKeys.includes(item.key);
  const hasChildren = !!item.children?.length;

  const isActive = item.href
    ? pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]))
    : item.children?.some((c) => c.href && pathname.startsWith(c.href.split("?")[0]));

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => toggleNavKey(item.key)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
            isActive
              ? "bg-accent/10 text-accent"
              : "text-foreground/60 hover:text-foreground hover:bg-default/50"
          )}
        >
          <Icon
            icon={item.icon}
            className={cn(
              "text-xl flex-shrink-0 transition-colors",
              isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground"
            )}
          />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-[family-name:var(--font-outfit)]">
                {item.label}
              </span>
              <Icon
                icon="solar:alt-arrow-down-bold-duotone"
                className={cn(
                  "text-base text-foreground/40 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </>
          )}
        </button>

        {!collapsed && isExpanded && (
          <div className="ml-4 mt-1 border-l border-border/50 pl-3 space-y-0.5">
            {item.children!.map((child) => (
              <NavItemRow key={child.key} item={child} collapsed={false} depth={1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
        depth === 0 ? "py-2.5" : "py-2",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-foreground/60 hover:text-foreground hover:bg-default/50"
      )}
    >
      <Icon
        icon={item.icon}
        className={cn(
          "text-xl flex-shrink-0 transition-colors",
          depth === 1 ? "text-base" : "text-xl",
          isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground"
        )}
      />
      {!collapsed && (
        <span className="font-[family-name:var(--font-outfit)]">{item.label}</span>
      )}
      {isActive && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-surface border-r border-border/50 h-full overflow-hidden sidebar-transition flex-shrink-0",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
            <Icon icon="solar:shop-bold-duotone" className="text-white text-xl" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-base leading-tight truncate font-[family-name:var(--font-outfit)]">
                {siteConfig.name}
              </p>
              <p className="text-xs text-muted truncate">Admin Dashboard</p>
            </div>
          )}
          <button
            onClick={toggleSidebarCollapsed}
            className={cn(
              "ml-auto p-1.5 rounded-lg hover:bg-default/70 text-muted hover:text-foreground transition-colors flex-shrink-0",
              sidebarCollapsed && "mx-auto ml-0"
            )}
          >
            <Icon
              icon={sidebarCollapsed ? "solar:alt-arrow-right-bold-duotone" : "solar:alt-arrow-left-bold-duotone"}
              className="text-base"
            />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavItemRow key={item.key} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border/40">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-default/40">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-semibold text-sm flex-shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">Aryan Sharma</p>
                <p className="text-xs text-muted truncate">aryan@luminarystore.com</p>
              </div>
              <Icon icon="solar:logout-bold-duotone" className="ml-auto text-muted hover:text-danger cursor-pointer transition-colors text-lg flex-shrink-0" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

// Mobile sidebar
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-surface border-r border-border/50 flex flex-col lg:hidden slide-in-left overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
            <Icon icon="solar:shop-bold-duotone" className="text-white text-xl" />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-base leading-tight font-[family-name:var(--font-outfit)]">{siteConfig.name}</p>
            <p className="text-xs text-muted">Admin Dashboard</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-default/70 text-muted hover:text-foreground transition-colors">
            <Icon icon="solar:close-bold-duotone" className="text-base" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavItemRow key={item.key} item={item} collapsed={false} />
          ))}
        </nav>
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-default/40">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-semibold text-sm">A</div>
            <div><p className="text-sm font-semibold">Aryan Sharma</p><p className="text-xs text-muted">Admin</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}
