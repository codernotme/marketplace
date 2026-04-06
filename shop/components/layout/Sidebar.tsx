"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, type NavItem } from "@/lib/mock-data";
import { Tooltip } from "@heroui/react";
import { useUIStore } from "@/lib/store";

function NavItemRow({
  item,
  collapsed,
  depth = 0,
  onLinkClick,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { expandedNavKeys, toggleNavKey } = useUIStore();
  const isExpanded = expandedNavKeys.includes(item.key);
  const hasChildren = !!item.children?.length;

  const isActive = item.href
    ? pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]))
    : item.children?.some((c) => c.href && (pathname === c.href || pathname.startsWith(c.href.split("?")[0])));

  const content = hasChildren ? (
    <Tooltip isDisabled={!collapsed || depth > 0}>
      <Tooltip.Trigger>
        <div>
          <button
            onClick={() => toggleNavKey(item.key)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group select-none",
              isActive
                ? "bg-accent/10 text-accent"
                : "text-foreground/60 hover:text-foreground hover:bg-default/60"
            )}
          >
            <Icon
              icon={item.icon}
              className={cn(
                "flex-shrink-0 transition-colors",
                collapsed ? "text-2xl" : "text-xl",
                isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground"
              )}
            />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <Icon
                  icon="solar:alt-arrow-down-bold-duotone"
                  className={cn(
                    "text-sm text-foreground/40 transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </button>

          {!collapsed && isExpanded && (
            <div className="ml-3 mt-0.5 border-l-2 border-border/50 pl-3 space-y-0.5 mb-1">
              {item.children!.map((child) => (
                <NavItemRow key={child.key} item={child} collapsed={false} depth={depth + 1} onLinkClick={onLinkClick} />
              ))}
            </div>
          )}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" offset={12} className="font-semibold px-3 py-1.5 translate-x-1">
        {item.label}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    <Tooltip isDisabled={!collapsed || depth > 0}>
      <Tooltip.Trigger>
        <Link
          href={item.href!}
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 group",
            depth === 0 ? "py-2.5" : "py-2",
            isActive
              ? "bg-accent/10 text-accent"
              : "text-foreground/60 hover:text-foreground hover:bg-default/60"
          )}
        >
          <Icon
            icon={item.icon}
            className={cn(
              "flex-shrink-0 transition-colors",
              collapsed ? "text-2xl" : depth === 1 ? "text-base" : "text-xl",
              isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground"
            )}
          />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {isActive && !collapsed && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
          )}
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" offset={12} className="font-semibold px-3 py-1.5 translate-x-1">
        {item.label}
      </Tooltip.Content>
    </Tooltip>
  );

  return content;
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-surface border-r border-border h-full overflow-hidden sidebar-transition flex-shrink-0",
        sidebarCollapsed ? "w-[68px]" : "w-[256px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border flex-shrink-0">
        <Image
          src="/logo.svg"
          alt={siteConfig.name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
          priority
        />
        {!sidebarCollapsed && (
          <div className="overflow-hidden flex-1">
            <p className="font-black text-base leading-tight truncate" style={{ fontFamily: "var(--font-outfit)" }}>
              {siteConfig.name}
            </p>
            <p className="text-xs text-muted truncate">Admin Dashboard</p>
          </div>
        )}
        <button
          onClick={toggleSidebarCollapsed}
          className={cn(
            "z-99 flex-shrink-0 p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors",
            sidebarCollapsed && "mx-auto"
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            icon={sidebarCollapsed ? "solar:alt-arrow-right-bold-duotone" : "solar:alt-arrow-left-bold-duotone"}
            className="text-base"
          />
        </button>
      </div>

      {/* Quick Add Section */}
      <div className="p-2.5 pb-0">
        <Tooltip isDisabled={!sidebarCollapsed}>
          <Tooltip.Trigger>
            <Link
              href="/dashboard/inventory/products/add"
              className={cn(
                "flex items-center gap-3 w-full transition-all duration-300 group",
                sidebarCollapsed 
                  ? "justify-center h-10 w-10 mx-auto rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95" 
                  : "px-4 py-2.5 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-2xl text-accent"
              )}
            >
              <Icon icon="solar:add-circle-bold-duotone" className={cn("flex-shrink-0", sidebarCollapsed ? "text-2xl" : "text-xl")} />
              {!sidebarCollapsed && <span className="font-bold text-sm">Quick Add</span>}
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content placement="right" offset={12} className="font-semibold px-3 py-1.5">
            Quick Add Product
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5 pt-4">
        {navItems.map((item) => (
          <NavItemRow key={item.key} item={item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-border flex-shrink-0">
        {sidebarCollapsed ? (
          <div className="flex items-center justify-center py-2">
            <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-default/40 hover:bg-default/70 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold text-xs flex-shrink-0">
              A
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate">Aryan Sharma</p>
              <p className="text-xs text-muted truncate">Admin</p>
            </div>
            <Icon
              icon="solar:logout-bold-duotone"
              className="ml-auto text-muted hover:text-danger cursor-pointer transition-colors text-base flex-shrink-0"
            />
          </div>
        )}
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  if (!mobileSidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={() => setMobileSidebarOpen(false)}
      />
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-surface border-r border-border flex flex-col lg:hidden slide-in-left overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border flex-shrink-0">
          <Image
            src="/logo.svg"
            alt={siteConfig.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <p className="font-black text-base" style={{ fontFamily: "var(--font-outfit)" }}>{siteConfig.name}</p>
            <p className="text-xs text-muted">Admin Dashboard</p>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
            className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors"
          >
            <Icon icon="solar:close-circle-bold-duotone" className="text-xl" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
          {navItems.map((item) => (
            <NavItemRow
              key={item.key}
              item={item}
              collapsed={false}
              onLinkClick={() => setMobileSidebarOpen(false)}
            />
          ))}
        </nav>
        <div className="p-2.5 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-default/40">
            <div className="w-7 h-7 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">A</div>
            <div>
              <p className="text-sm font-semibold">Aryan Sharma</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
