"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Icon } from "@iconify/react";
import { Tooltip, Dropdown, Button } from "@heroui/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "solar:chart-2-bold-duotone" },
  { href: "/dashboard/tenants", label: "Tenants", icon: "solar:users-group-two-rounded-bold-duotone" },
  { href: "/dashboard/plans", label: "Plans & Billing", icon: "solar:bill-list-bold-duotone" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "solar:bell-bing-bold-duotone" },
  { href: "/dashboard/admins", label: "Access & Admins", icon: "solar:key-minimalistic-square-bold-duotone" },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: "solar:document-text-bold-duotone" },
  { href: "/dashboard/settings", label: "Settings", icon: "solar:settings-bold-duotone" },
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
    <aside className="w-64 border-r border-border bg-background flex flex-col h-full flex-shrink-0">
      {/* Header / Branding */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Image 
              src="/logo.svg" 
              alt="theMrktPlace" 
              width={28} 
              height={28} 
              className="w-7 h-7 rounded-lg object-cover" 
              priority 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-foreground leading-tight">theMrktPlace</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group outline-none",
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-sm" 
                  : "text-muted-foreground hover:bg-default-100 hover:text-foreground"
              )}
            >
              <Icon 
                icon={item.icon} 
                className={cn(
                  "text-xl flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                )} 
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border mt-auto">
        <Dropdown>
          <Dropdown.Trigger>
            <div className="w-full flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-default-100 outline-none text-left select-none cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black opacity-60">Super Admin</p>
              </div>
              <Icon icon="solar:alt-arrow-up-linear" className="text-muted-foreground text-xs" />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Popover className="min-w-[220px] bg-background border border-border shadow-xl rounded-2xl p-1">
            <Dropdown.Menu onAction={(key) => {
              if (key === "logout") handleLogout();
            }}>
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
    </aside>
  );
}

