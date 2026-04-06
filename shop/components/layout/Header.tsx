"use client";

import { useState } from "react";
import { Dropdown, Button, Label, Description, Header as DropdownHeader, Separator } from "@heroui/react";
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
        <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-default/60 border border-border rounded-xl px-3 py-2 text-sm text-muted hover:border-accent/50 transition-colors cursor-pointer" id="global-search">
          <Icon icon="solar:magnifer-bold-duotone" className="text-base flex-shrink-0" />
          <span className="flex-1">Search anything…</span>
          <span className="text-xs bg-surface border border-border px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notifications Dropdown */}
          <Dropdown>
            <Dropdown.Trigger 
              className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-colors relative"
              aria-label="Notifications"
            >
              <div className="relative">
                <Icon icon="solar:bell-bold-duotone" className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
                )}
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="min-w-[320px] p-0 overflow-hidden bg-overlay border border-border rounded-2xl shadow-overlay">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-default/5">
                <span className="font-bold text-sm">Notifications</span>
                <button className="text-[11px] text-accent font-black uppercase tracking-wider hover:opacity-80">Mark all read</button>
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
                      <Label className={`text-xs leading-snug block mb-0.5 ${!n.read ? "font-bold text-foreground" : "text-muted font-medium"}`}>
                        {n.text}
                      </Label>
                      <Description className="text-[10px] text-muted opacity-80">{n.time}</Description>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 bg-accent rounded-full self-center flex-shrink-0" />}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
              <div className="px-4 py-2.5 border-t border-border text-center bg-default/5">
                <button className="text-[11px] text-accent font-bold uppercase tracking-widest hover:underline">View all activity</button>
              </div>
            </Dropdown.Popover>
          </Dropdown>

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

          {/* User Profile Dropdown */}
          <Dropdown>
            <Dropdown.Trigger className="ml-1 outline-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white flex items-center justify-center font-black text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-accent/20">
                A
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="min-w-[240px]">
              <div className="px-3 pt-3 pb-2 border-b border-border/50 mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-black">AD</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-none">Admin User</span>
                    <span className="text-[11px] text-muted font-medium mt-1">admin@themrkt.com</span>
                  </div>
                </div>
              </div>
              <Dropdown.Menu onAction={(key) => console.log(key)}>
                <Dropdown.Section>
                  <DropdownHeader className="px-3 py-1.5 text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-60">Account</DropdownHeader>
                  <Dropdown.Item id="profile" textValue="My Profile">
                    <Icon icon="solar:user-circle-bold-duotone" className="text-lg text-muted" />
                    <Label className="font-bold">My Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="settings" textValue="Settings">
                    <Icon icon="solar:settings-bold-duotone" className="text-lg text-muted" />
                    <Label className="font-bold">Settings</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
                <Separator className="my-1 border-border/50" />
                <Dropdown.Section>
                  <Dropdown.Item id="logout" textValue="Log Out" variant="danger">
                    <Icon icon="solar:logout-3-bold-duotone" className="text-lg text-danger" />
                    <Label className="font-bold text-danger">Log Out</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </header>
    </>
  );
}
