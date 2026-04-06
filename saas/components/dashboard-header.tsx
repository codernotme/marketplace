"use client";

import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const { user } = useSaasAuthStore();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-30">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Sidebar Trigger & Search Bar */}
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger className="md:hidden mr-2" />
          <div className="relative w-full max-w-md hidden md:flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants, orders..."
              className="pl-10 bg-muted/50 border-input"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-default">
                  <p className="font-medium text-sm">New signup</p>
                  <p className="text-muted-foreground text-xs">TechHub Store joined</p>
                  <p className="text-muted-foreground text-xs mt-1">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-default">
                  <p className="font-medium text-sm">Payment received</p>
                  <p className="text-muted-foreground text-xs">Fashion Boutique paid $299</p>
                  <p className="text-muted-foreground text-xs mt-1">5 hours ago</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

