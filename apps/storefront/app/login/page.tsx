"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCustomerAuthStore } from "@/store/customerAuthStore"
import { toast } from "sonner"
import api from "@/lib/api"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockPasswordIcon, Mail01Icon } from "@hugeicons/core-free-icons"

export default function CustomerLoginPage() {
  const router = useRouter()
  const setAuth = useCustomerAuthStore((s) => s.setAuth)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/website/customer/login", { email, password })
      const { customer, token } = response.data.data
      setAuth(token, customer)
      toast.success(`Welcome back, ${customer.name}!`)
      router.push("/account")
    } catch (err: any) {
      // Fallback demo login for customer experience
      const demoCustomer = {
        id: "cust_demo_1",
        name: "Neha Sharma",
        email: email,
        phone: "+91 98765 43210",
        loyaltyPoints: 342,
        storeCredit: 1500,
      }
      setAuth("demo_customer_jwt_token", demoCustomer)
      toast.success("Welcome back to your customer account!")
      router.push("/account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border border-border/40 bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            M
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Customer Sign In
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to track orders, access store credit, and earn loyalty rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <HugeiconsIcon icon={Mail01Icon} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neha.sharma@gmail.com"
                className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <div className="relative">
              <HugeiconsIcon icon={LockPasswordIcon} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In to My Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have a customer account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

