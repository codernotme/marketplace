"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Tags, 
  Percent, 
  Ticket,
  Truck,
  Box,
  Store,
  LogOut
} from "lucide-react";
import { Avatar, Button, ScrollShadow } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Inventory", href: "/dashboard/inventory", icon: Box },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Discounts", href: "/dashboard/discounts", icon: Percent },
  { name: "Helpdesk", href: "/dashboard/support", icon: Ticket },
  { name: "Shipping", href: "/dashboard/shipping", icon: Truck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSession(data?.user);
    });
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex"
      >
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Store className="w-5 h-5 text-primary mr-2" />
          <span className="font-semibold tracking-tight text-lg">Store Admin</span>
        </div>
        
        <ScrollShadow className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "" : "text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollShadow>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar size="sm" color="accent">
              <Avatar.Fallback>{session?.name?.charAt(0) || "A"}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.name || "Loading..."}</span>
              <span className="text-xs text-zinc-500 truncate w-32">{session?.email}</span>
            </div>
          </div>
          <Button 
            className="w-full justify-start font-medium text-zinc-500" 
            variant="danger" 
            onPress={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
          <div className="font-medium text-lg">
            {SIDEBAR_ITEMS.find(i => pathname === i.href || pathname.startsWith(i.href + "/"))?.name || "Dashboard"}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-950/50">
          {children}
        </div>
      </main>
    </div>
  );
}
