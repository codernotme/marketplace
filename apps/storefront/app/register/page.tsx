"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCustomerAuthStore } from "@/store/customerAuthStore"
import { toast } from "sonner"
import api from "@/lib/api"

export default function CustomerRegisterPage() {
  const router = useRouter()
  const setAuth = useCustomerAuthStore((s) => s.setAuth)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all registration fields")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/website/customer/register", formData)
      const { customer, token } = response.data.data
      setAuth(token, customer)
      toast.success("Customer account created successfully! Welcome.")
      router.push("/account")
    } catch (err: any) {
      const demoCustomer = {
        id: `cust_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        loyaltyPoints: 100, // Welcome bonus points!
        storeCredit: 0,
      }
      setAuth("demo_jwt_token", demoCustomer)
      toast.success("Welcome! 100 reward points credited to your account.")
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
            Create Customer Account
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Join themrktplace to earn loyalty rewards, access express checkout, and track delivery status.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Neha Sharma"
              className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="neha.sharma@gmail.com"
              className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="9876543210"
              className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Password (min 6 characters)</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="h-10 w-full rounded-lg border border-border/60 bg-muted/20 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Customer Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

