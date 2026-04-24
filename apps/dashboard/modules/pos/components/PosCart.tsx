"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon, UserAdd01Icon, MinusSignIcon, Add01Icon, Tag01Icon, PauseCircleIcon, DollarCircleIcon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

export function PosCart() {
  // Static mock state for UI scaffolding
  const cartItems = [
    { id: "1", name: "Premium Leather Jacket", price: 299.99, qty: 1 },
    { id: "4", name: "Artisan Coffee Beans", price: 24.00, qty: 2 },
  ]

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const tax = subtotal * 0.08 // 8% tax mock
  const discount = 0
  const total = subtotal + tax - discount

  return (
    <div className="flex flex-col h-full bg-card relative">
      
      {/* Customer / Context Header */}
      <div className="p-4 border-b border-border/40 bg-card/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <HugeiconsIcon icon={UserAdd01Icon} className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium font-sans">Add Customer</p>
            <p className="text-[10px] uppercase tracking-wider">For loyalty & receipts</p>
          </div>
        </button>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
          <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
        </Button>
      </div>

      {/* Cart Items Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 flex flex-col gap-3">
        {cartItems.map(item => (
          <div key={item.id} className="bg-background/50 border border-border/40 rounded-xl p-3 flex gap-3 group relative overflow-hidden">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-medium text-sm leading-tight pr-4">{item.name}</h4>
                <p className="font-semibold text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-border/60 rounded-lg overflow-hidden bg-background">
                  <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <HugeiconsIcon icon={MinusSignIcon} className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-medium font-mono">{item.qty}</span>
                  <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <HugeiconsIcon icon={Add01Icon} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between">
              <span className="font-semibold text-lg">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <HugeiconsIcon icon={Tag01Icon} className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-sans text-sm">Cart is empty</p>
          </div>
        )}
      </div>

      {/* Totals & Actions Area */}
      <div className="p-6 bg-background border-t border-border/50 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
        
        <div className="space-y-3 mb-6 font-sans text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <button className="flex items-center gap-1 text-primary hover:underline">
              <HugeiconsIcon icon={Tag01Icon} className="w-3 h-3" /> Add Discount
            </button>
            <span className="font-mono text-foreground">${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (8%)</span>
            <span className="font-mono text-foreground">${tax.toFixed(2)}</span>
          </div>
          
          <div className="pt-3 border-t border-border/60 flex justify-between items-end">
            <span className="text-base font-medium">Total</span>
            <span className="text-3xl font-semibold tracking-tight text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button variant="outline" className="h-12 font-sans font-medium hover:bg-muted" onClick={() => {}}>
            <HugeiconsIcon icon={PauseCircleIcon} className="w-4 h-4 mr-2" /> Hold Order
          </Button>
          <Button variant="outline" className="h-12 font-sans font-medium hover:bg-muted">
            <HugeiconsIcon icon={Tag01Icon} className="w-4 h-4 mr-2" /> Coupon
          </Button>
        </div>
        
        <Button className="w-full h-16 text-lg font-medium tracking-wide shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
          <HugeiconsIcon icon={DollarCircleIcon} className="w-5 h-5 mr-2" /> Pay ${total.toFixed(2)}
        </Button>
        
      </div>
    </div>
  )
}
