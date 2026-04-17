"use client";

import {
  GridViewIcon,
  Building01Icon,
  CreditCardIcon,
  PieChartSquareIcon,
  Settings01Icon,
  UserMultiple02Icon,
  ArrowDown01Icon,
  Logout01Icon,
  Activity01Icon,
  Database01Icon,
  Notification01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const masterNavItems = [
  { label: "Overview", href: "/dashboard", icon: GridViewIcon },
  { label: "Tenants", href: "/dashboard/tenants", icon: Building01Icon },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCardIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: PieChartSquareIcon },
  { label: "Leaderboard", href: "/dashboard/analytics/leaderboard", icon: Activity01Icon },
  { label: "Registry", href: "/dashboard/settings/registry", icon: Database01Icon },
  { label: "Broadcast", href: "/dashboard/communications/announcements", icon: Notification01Icon },
  { label: "Email Templates", href: "/dashboard/communications/templates", icon: Mail01Icon },
  { label: "Users", href: "/dashboard/users", icon: UserMultiple02Icon },
  { label: "Activity", href: "/dashboard/activity", icon: Activity01Icon },
  { label: "Settings", href: "/dashboard/settings", icon: Settings01Icon },
];

export function MasterSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="size-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">themrktplace</span>
            <span className="text-xs text-muted-foreground leading-none mt-0.5 font-medium text-primary/70">Master Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors text-left">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">SA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">Super Admin</span>
                <span className="text-xs text-muted-foreground truncate">admin@themrktplace.io</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <HugeiconsIcon icon={Logout01Icon} size={16} className="mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
