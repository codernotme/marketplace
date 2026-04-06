"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { MobileSidebar } from "./Sidebar";
import { Button } from "@heroui/react";
import { siteConfig } from "@/lib/mock-data";

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New order #ORD-2026-4521 received", time: "5m ago", icon: "solar:cart-bold-duotone", read: false },
    { id: 2, text: "Low stock: Puma RS-X3 (3 left)", time: "2h ago", icon: "solar:box-bold-duotone", read: false },
    { id: 3, text: "New support ticket from Rahul G.", time: "3h ago", icon: "solar:chat-bold-duotone", read: true },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-border/50">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-default/70 text-muted hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(true)}
        >
          <Icon icon="solar:hamburger-menu-bold-duotone" className="text-xl" />
        </button>

        {/* Breadcrumbs / Title */}
        <div className="flex-1 min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <Icon icon="solar:alt-arrow-right-bold-duotone" className="text-xs text-muted" />}
                  <span className={i === breadcrumbs.length - 1 ? "text-foreground font-semibold font-[family-name:var(--font-outfit)]" : "text-muted hover:text-foreground cursor-pointer transition-colors"}>
                    {bc.label}
                  </span>
                </span>
              ))}
            </nav>
          ) : (
            <h1 className="text-base font-bold font-[family-name:var(--font-outfit)] truncate">{title}</h1>
          )}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-default/60 border border-border/50 rounded-xl px-3 py-2 text-sm text-muted hover:border-accent/50 transition-colors cursor-pointer min-w-[200px]">
          <Icon icon="solar:magnifer-bold-duotone" className="text-base" />
          <span>Search anything…</span>
          <kbd className="ml-auto text-xs bg-default px-1.5 py-0.5 rounded-md">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-xl hover:bg-default/70 text-muted hover:text-foreground transition-colors"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Icon icon="solar:bell-bold-duotone" className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-overlay border border-border/50 rounded-2xl shadow-overlay z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                <span className="font-semibold font-[family-name:var(--font-outfit)]">Notifications</span>
                <span className="text-xs text-accent font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-border/30">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-default/40 cursor-pointer transition-colors ${!n.read ? "bg-accent/5" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-accent/15 text-accent" : "bg-default text-muted"}`}>
                      <Icon icon={n.icon} className="text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-medium" : "text-muted"}`}>{n.text}</p>
                      <p className="text-xs text-muted mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border/40 text-center">
                <span className="text-sm text-accent font-medium cursor-pointer hover:underline">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          className="p-2 rounded-xl hover:bg-default/70 text-muted hover:text-foreground transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Icon
            icon={theme === "dark" ? "solar:sun-bold-duotone" : "solar:moon-bold-duotone"}
            className="text-xl"
          />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-accent/20">
          A
        </div>
      </header>
    </>
  );
}
