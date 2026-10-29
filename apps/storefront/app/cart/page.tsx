"use client"

import * as React from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  Delete02Icon,
  Store01Icon,
  DeliveryTruck01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore()
  const [deliveryType, setDeliveryType] = React.useState<"HOME" | "BOPIS">("HOME")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cartSubtotal = subtotal()
  const gstAmount = (cartSubtotal * 0.18)
  const shippingFee = deliveryType === "BOPIS" || cartSubtotal > 1999 ? 0 : 150
  const grandTotal = cartSubtotal + gstAmount + shippingFee

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
          <HugeiconsIcon icon={ShoppingBag01Icon} className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Your shopping bag is empty</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Explore our tailored apparel collections and discover new arrivals.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground"
        >
          <span>Continue Shopping</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Shopping Bag ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-4 sm:p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted/30 font-bold text-primary">
                  {item.size || "M"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{item.productName}</h3>
                  <p className="text-xs text-muted-foreground">
                    Size: {item.size} · Color: {item.color} · SKU: {item.sku}
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border/60 bg-muted/20">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-foreground">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="mt-1 text-[11px] text-destructive hover:underline flex items-center gap-1 justify-end"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Omnichannel Delivery Mode Selection */}
          <div className="rounded-xl border border-border/40 bg-card p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Choose Delivery Preference
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeliveryType("HOME")}
                className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                  deliveryType === "HOME"
                    ? "border-primary bg-primary/5"
                    : "border-border/40 bg-muted/20 hover:border-primary/40"
                }`}
              >
                <HugeiconsIcon icon={DeliveryTruck01Icon} className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-foreground">Standard Home Delivery</div>
                  <div className="text-[11px] text-muted-foreground">
                    Estimated 2-3 business days. {cartSubtotal > 1999 ? "Free" : "₹150 fee"}.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("BOPIS")}
                className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                  deliveryType === "BOPIS"
                    ? "border-primary bg-primary/5"
                    : "border-border/40 bg-muted/20 hover:border-primary/40"
                }`}
              >
                <HugeiconsIcon icon={Store01Icon} className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-foreground">In-Store Pickup (BOPIS)</div>
                  <div className="text-[11px] text-muted-foreground">
                    Ready at Indiranagar Store in 2 hours. Complimentary free.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated GST (18%)</span>
                <span className="font-semibold text-foreground">₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between text-sm font-extrabold text-foreground">
                <span>Total Amount</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Link>

            <p className="text-[11px] text-center text-muted-foreground">
              Secure 256-bit SSL encrypted checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

