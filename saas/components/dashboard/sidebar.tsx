"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@heroui/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "BarChart3" },
  { href: "/dashboard/tenants", label: "Tenants", icon: "Users" },
  { href: "/dashboard/plans", label: "Plans & Billing", icon: "CreditCard" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "Bell" },
  { href: "/dashboard/admins", label: "Access & Admins", icon: "Key" },
  { href: "/dashboard/settings", label: "Platform Settings", icon: "Settings" },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: "FileText" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-foreground"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-foreground transition-transform duration-200 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">SaaS Admin</h1>
          <p className="text-gray-400 text-sm">Master Control Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-blue-600 text-foreground"
                    : "text-gray-400 hover:bg-gray-800 hover:text-foreground"
                  }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <div className="px-4 py-3 bg-gray-800 rounded-lg text-xs">
            <p className="text-gray-400">Logged in as</p>
            <p className="text-foreground font-medium">Alice Johnson</p>
            <p className="text-gray-500">saas_admin</p>
          </div>
          <Button variant="outline" className="w-full justify-start text-gray-400 hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="md:ml-64" />
    </>
  );
}

