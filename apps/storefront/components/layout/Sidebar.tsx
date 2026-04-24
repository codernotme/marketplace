"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardCircleIcon,
  Package01Icon,
  Invoice01Icon,
  UserGroupIcon,
  WorkHistoryIcon,
  PresentationBarChart01Icon,
  Settings02Icon,
  Logout01Icon,
  ShoppingCart01Icon
} from '@hugeicons/core-free-icons'

const navItems = [
  { label: 'Dashboard', href: '/', icon: DashboardCircleIcon },
  { label: 'POS', href: '/pos', icon: ShoppingCart01Icon },
  { label: 'Inventory', href: '/inventory', icon: Package01Icon },
  { label: 'Sales', href: '/sales', icon: Invoice01Icon },
  { label: 'Customers', href: '/customers', icon: UserGroupIcon },
  { label: 'Staff', href: '/staff', icon: WorkHistoryIcon },
  { label: 'Reports', href: '/reports', icon: PresentationBarChart01Icon },
  { label: 'Settings', href: '/settings', icon: Settings02Icon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            M
          </div>
          <span>themrktplace</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <HugeiconsIcon icon={Logout01Icon} className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
