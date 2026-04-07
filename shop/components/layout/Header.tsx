"use client";

import { Dropdown, Label, Description, Header as DropdownHeader, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MobileSidebar } from "./Sidebar";
import { useUIStore } from "@/lib/store";

const notifications = [
  { id: 1, text: "New order #ORD-2026-4521 received", time: "5m ago", icon: "solar:cart-bold-duotone", read: false },
  { id: 2, text: "Low stock: Retro Canvas Sneakers (US 8 out)", time: "2h ago", icon: "solar:box-bold-duotone", read: false },
  { id: 3, text: "New support ticket from Rahul G.", time: "3h ago", icon: "solar:chat-round-bold-duotone", read: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setMobileSidebarOpen } = useUIStore();
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment: string, index: number) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { label, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <>
      <MobileSidebar />
      <header className="sticky top-0 z-40 w-full pt-4 pb-2 px-4 md:px-6 bg-background/50 backdrop-blur-md">
        <div className="flex items-center justify-between bg-surface/90 backdrop-blur-xl border border-border px-4 h-16 rounded-2xl shadow-lg shadow-accent/5">
          {/* Left: Mobile Toggle + Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Icon icon="solar:hamburger-menu-bold-duotone" className="text-xl" />
            </button>

            <nav className="hidden sm:flex items-center gap-2 overflow-hidden">
              <Link href="/dashboard" className="text-muted hover:text-accent transition-colors">
                <Icon icon="solar:home-2-bold-duotone" className="text-lg" />
              </Link>
              {breadcrumbs.map((bc: { label: string; href: string; isLast: boolean }) => (
                <div key={bc.href} className="flex items-center gap-2 flex-shrink-0" suppressHydrationWarning>
                  <Icon icon="solar:alt-arrow-right-bold-duotone" className="text-[10px] text-muted/40" />
                  <Link 
                    href={bc.href}
                    className={`text-xs font-bold transition-colors truncate max-w-[120px] ${
                      bc.isLast ? "text-foreground cursor-default pointer-events-none" : "text-muted hover:text-accent"
                    }`}
                  >
                    {bc.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div 
              className="hidden md:flex items-center gap-2 bg-default/40 border border-border/50 rounded-xl px-3 py-2 text-xs text-muted hover:border-accent/30 transition-all cursor-pointer group"
              id="global-search"
            >
              <Icon icon="solar:magnifer-bold-duotone" className="text-base flex-shrink-0 group-hover:text-accent transition-colors" />
              <span className="flex-1 pr-8">Search anything…</span>
              <kbd className="hidden lg:flex items-center gap-1 text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded-md font-mono opacity-60">
                <span>⌘</span><span>K</span>
              </kbd>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1 border-border/50 hidden md:block" />

            <div className="flex items-center gap-1">
              {/* Notifications Dropdown */}
              <Dropdown>
                <Dropdown.Trigger>
                  <div 
                    className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-all duration-200 relative outline-none cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label="Notifications"
                  >
                    <div className="relative">
                      <Icon icon="solar:bell-bold-duotone" className="text-xl group-hover:scale-110 shadow-sm transition-transform" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                      )}
                    </div>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[320px] p-0 overflow-hidden bg-overlay border border-border rounded-2xl shadow-xl">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-default/5">
                    <span className="font-bold text-sm">Notifications</span>
                    <button className="text-[10px] text-accent font-black uppercase tracking-widest hover:opacity-80">Mark all read</button>
                  </div>
                  <Dropdown.Menu className="p-0">
                    {notifications.map((n) => (
                      <Dropdown.Item 
                        key={n.id} 
                        id={`notif-${n.id}`} 
                        textValue={n.text}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-accent/5 transition-colors ${!n.read ? "bg-accent/[0.02]" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-accent/15 text-accent" : "bg-default text-muted"}`}>
                          <Icon icon={n.icon} className="text-base" />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <Label className={`text-[11px] leading-snug block mb-0.5 ${!n.read ? "font-bold text-foreground" : "text-muted font-medium"}`}>
                            {n.text}
                          </Label>
                          <Description className="text-[9px] text-muted opacity-80 uppercase tracking-wider font-bold">{n.time}</Description>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 bg-accent rounded-full self-center flex-shrink-0" />}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                  <div className="px-4 py-2.5 border-t border-border text-center bg-default/5">
                    <button className="text-[10px] text-accent font-black uppercase tracking-[0.2em] hover:underline">View all activity</button>
                  </div>
                </Dropdown.Popover>
              </Dropdown>

              {/* Theme toggle */}
              <button
                className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors outline-none"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle theme"
              >
                <Icon
                  icon={theme === "dark" ? "solar:sun-bold-duotone" : "solar:moon-stars-bold-duotone"}
                  className="text-xl"
                />
              </button>

              {/* User Profile Dropdown */}
              <Dropdown>
                <Dropdown.Trigger>
                  <div className="ml-1 outline-none cursor-pointer group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-indigo-500 text-white flex items-center justify-center font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20">
                      A
                    </div>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[240px]">
                  <div className="px-3 pt-3 pb-2 border-b border-border/50 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-black">AD</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none">Admin User</span>
                        <span className="text-[10px] text-muted font-bold mt-1 uppercase tracking-wider">admin@themrkt.com</span>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Menu onAction={(key) => {
                    if (key === "profile") router.push("/dashboard/profile");
                    if (key === "settings") router.push("/dashboard/settings");
                    if (key === "logout") {
                      // Simulating logout
                      window.location.href = "/login";
                    }
                  }}>
                    <Dropdown.Section>
                      <DropdownHeader className="px-3 py-1.5 text-[9px] font-black text-muted uppercase tracking-[0.25em] opacity-40">Account</DropdownHeader>
                      <Dropdown.Item id="profile" textValue="My Profile">
                        <Icon icon="solar:user-circle-bold-duotone" className="text-lg text-muted" />
                        <Label className="font-bold text-xs">My Profile</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="settings" textValue="Settings">
                        <Icon icon="solar:settings-bold-duotone" className="text-lg text-muted" />
                        <Label className="font-bold text-xs">Settings</Label>
                      </Dropdown.Item>
                    </Dropdown.Section>
                    <Separator className="my-1 border-border/50" />
                    <Dropdown.Section>
                      <Dropdown.Item id="logout" textValue="Log Out" variant="danger">
                        <Icon icon="solar:logout-3-bold-duotone" className="text-lg text-danger" />
                        <Label className="font-bold text-xs text-danger">Log Out</Label>
                      </Dropdown.Item>
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
