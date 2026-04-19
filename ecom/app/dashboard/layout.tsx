"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  LogOut,
  Gift
} from "lucide-react";
import { Button, ScrollShadow } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  { name: "My Profile", href: "/dashboard", icon: User },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  { name: "Payment Methods", href: "/dashboard/payments", icon: CreditCard },
  { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
        className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex pt-8"
      >
        <div className="px-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="font-semibold tracking-tight text-xl text-primary">Storefront</Link>
        </div>
        
        <ScrollShadow className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
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
          <Button 
            className="w-full justify-start font-medium text-zinc-500" 
            variant="danger-soft" 
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
            {SIDEBAR_ITEMS.find(i => pathname === i.href)?.name || "Customer Portal"}
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
