"use client"

import * as React from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useCustomerAuthStore } from "@/store/customerAuthStore"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  UserCircleIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

export function Header() {
  const [mounted, setMounted] = React.useState(false)
  const totalCount = useCartStore((s) => s.totalCount())
  const { customer, isAuthenticated } = useCustomerAuthStore()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Announcement Banner */}
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
        Festive Season: Free express delivery on all orders over ₹1,999. In-store pickup available.
      </div>

      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              themrktplace
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              All Apparel
            </Link>
            <Link href="/?category=Tops" className="hover:text-foreground transition-colors">
              Shirts & Tops
            </Link>
            <Link href="/?category=Trousers" className="hover:text-foreground transition-colors">
              Pants & Chinos
            </Link>
            <Link href="/?category=Outerwear" className="hover:text-foreground transition-colors">
              Blazers & Outerwear
            </Link>
            <Link href="/?category=Dresses" className="hover:text-foreground transition-colors">
              Dresses
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search collections..."
              className="h-9 w-48 rounded-full border border-border/40 bg-muted/30 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary lg:w-64"
            />
          </div>

          {/* Customer Account Button */}
          {mounted && isAuthenticated && customer ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full border border-border/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50"
            >
              <HugeiconsIcon icon={UserCircleIcon} className="h-4 w-4 text-primary" />
              <span>{customer.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50"
            >
              <HugeiconsIcon icon={UserCircleIcon} className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Shopping Bag Button */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-foreground hover:bg-muted/50"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
            {mounted && totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

