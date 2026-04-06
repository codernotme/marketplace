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

export function DashboardHeader() {
  const { user } = useSaasAuthStore();

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="md:ml-64 px-4 py-4 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tenants, orders..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-slate-700 cursor-default">
                  <p className="font-medium text-white text-sm">New signup</p>
                  <p className="text-slate-400 text-xs">TechHub Store joined</p>
                  <p className="text-slate-500 text-xs mt-1">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 focus:bg-slate-700 cursor-default">
                  <p className="font-medium text-white text-sm">Payment received</p>
                  <p className="text-slate-400 text-xs">Fashion Boutique paid $299</p>
                  <p className="text-slate-500 text-xs mt-1">5 hours ago</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
