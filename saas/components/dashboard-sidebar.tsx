"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { BarChart3, Users, CreditCard, Bell, Key, Settings, FileText, LogOut, ChevronUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users },
  { href: "/dashboard/plans", label: "Plans & Billing", icon: CreditCard },
  { href: "/dashboard/announcements", label: "Announcements", icon: Bell },
  { href: "/dashboard/admins", label: "Access & Admins", icon: Key },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useSaasAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 border-b border-border">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 mb-2 text-left">
          <Image src="/logo.svg" alt="theMrktPlace" width={36} height={36} className="w-9 h-9 rounded-lg object-cover" priority />
          <div>
            <h1 className="text-lg font-bold text-foreground">theMrktPlace</h1>
            <p className="text-xs text-muted-foreground">SaaS Admin</p>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-1 flex-1">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton isActive={isActive} tooltip={item.label} onClick={() => router.push(item.href)}>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-foreground transition hover:bg-accent">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs uppercase">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <ChevronUp className="w-4 h-4 shrink-0" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56 mb-2">
                <DropdownMenuItem className="text-foreground focus:bg-accent">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

