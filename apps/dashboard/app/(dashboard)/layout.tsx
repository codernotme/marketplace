"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { PackageIcon, ShoppingBag01Icon, UserMultipleIcon, Store01Icon, Settings01Icon, PieChartIcon, DashboardSquare01Icon, TerminalIcon } from "@hugeicons/core-free-icons"
import { cn } from "@workspace/ui/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: DashboardSquare01Icon },
  { href: "/pos", label: "POS Terminal", icon: TerminalIcon, highlight: true },
  { href: "/inventory", label: "Inventory", icon: PackageIcon },
  { href: "/sales", label: "Sales & Returns", icon: ShoppingBag01Icon },
  { href: "/customers", label: "Customers", icon: UserMultipleIcon },
  { href: "/staff", label: "Staff", icon: Store01Icon },
  { href: "/reports", label: "Reports", icon: PieChartIcon },
  { href: "/settings", label: "Settings", icon: Settings01Icon },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 flex-col hidden md:flex border-r border-border/50 bg-card z-20 shadow-xl shadow-border/5">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <span className="text-lg font-medium tracking-tight text-primary">
            The Mrktplace
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : item.highlight 
                      ? "text-primary hover:bg-primary/5" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <HugeiconsIcon icon={item.icon} className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-medium text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center px-6 z-10 shrink-0 md:hidden">
          <span className="text-lg font-medium tracking-tight text-primary">
            The Mrktplace
          </span>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
