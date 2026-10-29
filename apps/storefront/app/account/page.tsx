"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useCustomerAuthStore } from "@/store/customerAuthStore"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Package01Icon,
  Coins01Icon,
  CreditCardIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"

export default function CustomerAccountPage() {
  const router = useRouter()
  const { customer, isAuthenticated, logout } = useCustomerAuthStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!mounted || !customer) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading customer account...</p>
      </div>
    )
  }

  const sampleOrders = [
    {
      id: "WEB-1092",
      date: "28 October 2026",
      items: "Oxford Cotton Classic Shirt (M) + 1 more item",
      total: 5189.62,
      status: "PACKED",
      statusLabel: "Packed & Ready for Dispatch",
      deliveryType: "Home Delivery",
    },
    {
      id: "INV-1048",
      date: "14 October 2026",
      items: "Slim Fit Stretch Chino Trouser (32)",
      total: 2499.00,
      status: "DELIVERED",
      statusLabel: "In-Store Purchase at Indiranagar Store",
      deliveryType: "Store Counter",
    },
  ]

  const handleSignOut = () => {
    logout()
    toast.success("Signed out of your customer account")
    router.push("/")
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Customer Account
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {customer.name} · {customer.email} · {customer.phone || "+91 98765 43210"}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Omnichannel Rewards & Balance Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Loyalty Points */}
        <div className="rounded-xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Brand Loyalty Points
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <HugeiconsIcon icon={Coins01Icon} className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">
            {customer.loyaltyPoints ?? 342}{" "}
            <span className="text-sm font-medium text-muted-foreground">pts</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Earn 1 point per ₹10 spent. Usable on website checkout or in physical store.
          </p>
        </div>

        {/* Store Credit Balance */}
        <div className="rounded-xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Store Credit Balance
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <HugeiconsIcon icon={CreditCardIcon} className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">
            ₹{(customer.storeCredit ?? 1500).toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Store credit from returns or promotions. Automatically applies at checkout.
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-foreground">Order & Purchase History</h2>
        <p className="text-xs text-muted-foreground">
          Combined purchase history across our online storefront and flagship retail registers.
        </p>

        <div className="mt-4 space-y-4">
          {sampleOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-card p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Package01Icon} className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{order.id}</span>
                    <span className="rounded bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {order.deliveryType}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-foreground font-medium">{order.items}</p>
                  <p className="text-[11px] text-muted-foreground">{order.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                <span className="text-sm font-extrabold text-foreground">
                  ₹{order.total.toFixed(2)}
                </span>
                <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                  {order.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

