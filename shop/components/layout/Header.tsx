"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { MobileSidebar } from "./Sidebar";
import { useUIStore } from "@/lib/store";

const notifications = [
  { id: 1, text: "New order #ORD-2026-4521 received", time: "5m ago", icon: "solar:cart-bold-duotone", read: false },
  { id: 2, text: "Low stock: Retro Canvas Sneakers (US 8 out)", time: "2h ago", icon: "solar:box-bold-duotone", read: false },
  { id: 3, text: "New support ticket from Rahul G.", time: "3h ago", icon: "solar:chat-round-bold-duotone", read: true },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setMobileSidebarOpen } = useUIStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <MobileSidebar />
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-border">
        {/* Mobile menu */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Icon icon="solar:hamburger-menu-bold-duotone" className="text-xl" />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-default/60 border border-border rounded-xl px-3 py-2 text-sm text-muted hover:border-accent/50 transition-colors cursor-pointer">
          <Icon icon="solar:magnifer-bold-duotone" className="text-base flex-shrink-0" />
          <span className="flex-1">Search anything…</span>
          <span className="text-xs bg-surface border border-border px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Icon icon="solar:bell-bold-duotone" className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 w-80 bg-overlay border border-border rounded-2xl shadow-overlay z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-accent font-medium cursor-pointer">Mark all read</span>
                  </div>
                  <div className="divide-y divide-border">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-default/40 transition-colors ${!n.read ? "bg-accent/5" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-accent/15 text-accent" : "bg-default text-muted"}`}>
                          <Icon icon={n.icon} className="text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${!n.read ? "font-medium text-foreground" : "text-muted"}`}>{n.text}</p>
                          <p className="text-xs text-muted mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border text-center">
                    <span className="text-xs text-accent font-medium cursor-pointer">View all notifications</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Icon
              icon={theme === "dark" ? "solar:sun-bold-duotone" : "solar:moon-stars-bold-duotone"}
              className="text-xl"
            />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white flex items-center justify-center font-black text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 ml-1">
            A
          </div>
        </div>
      </header>
    </>
  );
}
