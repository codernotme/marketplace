"use client";

import { Dropdown, Button, Input, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const { user } = useSaasAuthStore();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Sidebar Trigger & Search Bar */}
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger className="md:hidden mr-2" />
          <div className="relative w-full max-w-md hidden md:flex">
            <div className="relative w-full group">
              <Icon 
                icon="solar:magnifer-linear" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" 
              />
              <input
                type="text"
                placeholder="Search tenants, orders..."
                className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <Dropdown>
            <Dropdown.Trigger>
              <div 
                className="relative inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer outline-none"
                role="button"
                tabIndex={0}
              >
                <Icon icon="solar:bell-bing-bold-duotone" className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-background" />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="min-w-[320px] bg-background border border-border shadow-xl rounded-2xl p-0 overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/10">
                <h3 className="font-bold text-sm">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 text-center text-xs text-muted-foreground italic">
                  No new notifications
                </div>
              </div>
            </Dropdown.Popover>
          </Dropdown>

          {/* User Avatar Dropdown */}
          <Dropdown>
            <Dropdown.Trigger>
              <div className="outline-none cursor-pointer group px-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-foreground/30 text-white flex items-center justify-center font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="min-w-[240px] bg-background border border-border shadow-xl rounded-2xl">
              <div className="px-4 py-3 border-b border-border/50 mb-1">
                <p className="text-xs font-bold text-foreground">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Dropdown.Menu onAction={(key) => console.log(key)}>
                <Dropdown.Item id="profile" textValue="Profile" className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg">
                  <Icon icon="solar:user-bold-duotone" className="text-lg opacity-60" />
                  <span className="text-xs font-bold">My Profile</span>
                </Dropdown.Item>
                <Dropdown.Item id="settings" textValue="Settings" className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg">
                  <Icon icon="solar:settings-bold-duotone" className="text-lg opacity-60" />
                  <span className="text-xs font-bold">Account Settings</span>
                </Dropdown.Item>
                <Dropdown.Item 
                  id="logout" 
                  textValue="Logout" 
                  className="flex items-center gap-2 p-2 hover:bg-danger/10 text-danger rounded-lg mt-1"
                >
                  <Icon icon="solar:logout-3-bold-duotone" className="text-lg" />
                  <span className="text-xs font-bold">Sign out</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

