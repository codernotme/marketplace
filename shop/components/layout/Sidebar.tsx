"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, type NavItem } from "@/lib/mock-data";
import { Tooltip, Dropdown } from "@heroui/react";
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
  const searchParams = useSearchParams();

  const checkIsActive = (href?: string, children?: NavItem[]): boolean => {
    if (!href) {
      return children?.some((c) => c.href && checkIsActive(c.href)) ?? false;
    }

    const [baseUrl, queryStr] = href.split("?");
    const pathMatch = pathname === baseUrl || (baseUrl !== "/dashboard" && pathname.startsWith(baseUrl + "/"));

    if (pathMatch && queryStr) {
      const itemParams = new URLSearchParams(queryStr);
      return Array.from(itemParams.entries()).every(([key, val]) => searchParams.get(key) === val);
    }

    // For base URLs, only active if NO search params (or at least no relevant ones)
    return pathMatch && (!queryStr ? searchParams.toString() === "" : true);
  };

  const { expandedNavKeys, toggleNavKey } = useUIStore();
  const isExpanded = expandedNavKeys.includes(item.key);
  const hasChildren = !!item.children?.length;
  const isActive = checkIsActive(item.href, item.children);

  if (hasChildren) {
    if (collapsed) {
      return (
        <Dropdown>
          <Dropdown.Trigger>
            <div
              className={cn(
                "flex items-center justify-center p-2.5 mx-auto my-1.5 rounded-xl transition-all duration-200 group select-none hover:bg-default/60 cursor-pointer outline-none",
                isActive ? "bg-accent/10 text-accent font-bold shadow-sm" : "text-foreground/40 hover:text-foreground"
              )}
              role="button"
              tabIndex={0}
            >
              <Icon icon={item.icon} className="text-2xl transition-transform group-hover:scale-110" />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Popover className="min-w-[190px] bg-surface/95 backdrop-blur-xl border border-border shadow-2xl p-1 rounded-2xl ml-2 overflow-hidden">
            <Dropdown.Menu onSelectionChange={(keys) => { }} selectionMode="none">
              <Dropdown.Section>
                <div className="px-3.5 py-3 mb-1 bg-default/5 border-b border-border/40">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent leading-none">{item.label}</p>
                </div>
                {item.children!.map((child) => (
                  <Dropdown.Item key={child.key} id={child.key} className="p-0 hover:bg-transparent">
                    <Link
                      href={child.href || "#"}
                      onClick={onLinkClick}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                        checkIsActive(child.href) ? "text-accent bg-accent/5" : "text-muted hover:text-foreground hover:bg-default/50"
                      )}
                    >
                      <Icon icon={child.icon} className="text-lg opacity-70" />
                      {child.label}
                    </Link>
                  </Dropdown.Item>
                ))}
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      );
    }

    return (
      <div className="w-full px-2">
        <button
          onClick={() => toggleNavKey(item.key)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group select-none",
            isActive ? "bg-accent/10 text-accent font-bold" : "text-foreground/60 hover:text-foreground hover:bg-default/60"
          )}
        >
          <Icon
            icon={item.icon}
            className={cn(
              "flex-shrink-0 transition-colors text-xl",
              isActive ? "text-accent" : "text-foreground/40 group-hover:text-foreground"
            )}
          />
          <span className="flex-1 text-left">{item.label}</span>
          <Icon
            icon="solar:alt-arrow-down-bold-duotone"
            className={cn(
              "text-sm text-foreground/30 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        {isExpanded && (
          <div className="ml-4 mt-0.5 border-l-2 border-border/40 pl-3 space-y-0.5 mb-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {item.children!.map((child) => (
              <NavItemRow key={child.key} item={child} collapsed={false} depth={depth + 1} onLinkClick={onLinkClick} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Tooltip isDisabled={!collapsed || depth > 0}>
      <Tooltip.Trigger>
        <div className="w-full">
          <Link
            href={item.href!}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group mx-auto my-1.5 outline-none",
              collapsed ? "p-2.5 justify-center w-fit" : "px-3 py-2.5 w-full",
              isActive
                ? "bg-accent/10 text-accent font-bold"
                : "text-foreground/60 hover:text-foreground hover:bg-default/60"
            )}
          >
            <Icon
              icon={item.icon}
              className={cn(
                "flex-shrink-0 transition-colors",
                collapsed ? "text-2xl" : depth === 1 ? "text-base" : "text-xl",
                isActive ? "text-accent" : "text-foreground/40 group-hover:text-foreground"
              )}
            />
            {!collapsed && <span className="flex-1">{item.label}</span>}
            {isActive && !collapsed && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            )}
          </Link>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" offset={12} className="font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 translate-x-1">
        {item.label}
      </Tooltip.Content>
    </Tooltip>
  );
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
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 py-4 border-b border-border flex-shrink-0 sticky top-0 bg-surface z-10 transition-all duration-300",
        sidebarCollapsed ? "px-0 justify-center h-[72px]" : "px-4"
      )}>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <Image
            src="/logo.svg"
            alt={siteConfig.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
            priority
          />
          {!sidebarCollapsed && (
            <div className="overflow-hidden flex-1 fade-in">
              <p className="font-black text-base leading-tight truncate" style={{ fontFamily: "var(--font-outfit)" }}>
                {siteConfig.name}
              </p>
              <p className="text-xs text-muted truncate">Admin Dashboard</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebarCollapsed}
          className={cn(
            "flex-shrink-0 p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-all duration-200",
            sidebarCollapsed ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-surface border border-border shadow-md z-50 hover:scale-110" : ""
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            icon={sidebarCollapsed ? "solar:alt-arrow-right-bold-duotone" : "solar:alt-arrow-left-bold-duotone"}
            className={cn("transition-transform duration-300", sidebarCollapsed ? "text-accent" : "text-base")}
          />
        </button>
      </div>

      {/* Quick Add Section */}
      <div className="p-2.5 pb-0">
        <Tooltip isDisabled={!sidebarCollapsed}>
          <Tooltip.Trigger>
            <div
              onClick={() => useUIStore.getState().openModal("product", "add")}
              onKeyDown={(e) => e.key === "Enter" && useUIStore.getState().openModal("product", "add")}
              role="button"
              tabIndex={0}
              className={cn(
                "flex items-center gap-3 w-full transition-all duration-300 group cursor-pointer outline-none",
                sidebarCollapsed
                  ? "justify-center h-10 w-10 mx-auto rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95"
                  : "px-4 py-2.5 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-2xl text-accent"
              )}
            >
              <Icon icon="solar:add-circle-bold-duotone" className={cn("flex-shrink-0", sidebarCollapsed ? "text-2xl" : "text-xl")} />
              {!sidebarCollapsed && <span className="font-bold text-sm">Quick Add</span>}
            </div>
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
            <div className="overflow-hidden flex-1 group-hover:translate-x-0.5 transition-transform">
              <p className="text-sm font-bold truncate">Aryan Bajpai</p>
              <p className="text-[10px] text-muted truncate uppercase tracking-widest font-black opacity-60">Administrator</p>
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
              <p className="text-sm font-semibold">Aryan Bajpai</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
