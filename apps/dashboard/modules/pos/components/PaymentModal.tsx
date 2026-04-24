"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { DollarCircleIcon, CreditCardIcon, SmartPhone01Icon, CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { usePosStore } from "../store/usePosStore"
import { db } from "@/lib/db"
import api from "@/lib/api"
import { toast } from "sonner"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const { cart, selectedCustomer, grandTotal, clearCart } = usePosStore()
  const [payments, setPayments] = React.useState<{ method: string; amount: number }[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)

  const total = grandTotal()
  const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0)
  const remainingAmount = Math.max(0, total - paidAmount)

  const addPayment = (method: string) => {
    if (remainingAmount <= 0) return
    setPayments([...payments, { method, amount: remainingAmount }])
  }

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index))
  }

  const handleProcessSale = async () => {
    if (paidAmount < total) {
      toast.error("Full amount must be paid")
      return
    }

    setIsProcessing(true)
    const saleData = {
      customerId: selectedCustomer?.id,
      items: cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price
      })),
      payments: payments.map(p => ({
        method: p.method,
        amount: p.amount
      }))
    }

    try {
      if (navigator.onLine) {
        await api.post("/sales", saleData)
        toast.success("Sale completed successfully")
      } else {
        await db.pendingSales.add({
          data: saleData,
          timestamp: Date.now(),
          synced: 0
        })
        toast.info("Offline: Sale saved to sync queue")
      }
      
      clearCart()
      setPayments([])
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to process sale")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted p-4 rounded-xl flex justify-between items-center">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total to Pay</span>
            <span className="text-3xl font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col h-20 gap-2" 
                onClick={() => addPayment("CASH")}
                disabled={remainingAmount <= 0}
              >
                <HugeiconsIcon icon={DollarCircleIcon} className="w-6 h-6" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-20 gap-2" 
                onClick={() => addPayment("CARD")}
                disabled={remainingAmount <= 0}
              >
                <HugeiconsIcon icon={CreditCardIcon} className="w-6 h-6" />
                <span className="text-xs">Card</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-20 gap-2" 
                onClick={() => addPayment("UPI")}
                disabled={remainingAmount <= 0}
              >
                <HugeiconsIcon icon={SmartPhone01Icon} className="w-6 h-6" />
                <span className="text-xs">UPI</span>
              </Button>
            </div>
          </div>

          {payments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Payments Applied</p>
              <div className="space-y-2">
                {payments.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-card border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase">{p.method}</span>
                      <span className="text-sm font-bold">₹{p.amount.toFixed(2)}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removePayment(idx)}>
                      <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {remainingAmount > 0 ? (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-bold text-destructive">₹{remainingAmount.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg justify-center">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5" />
              <span className="font-semibold">Fully Paid</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-12">Cancel</Button>
          <Button 
            onClick={handleProcessSale} 
            disabled={paidAmount < total || isProcessing}
            className="flex-1 h-12 shadow-lg shadow-primary/20"
          >
            {isProcessing ? "Processing..." : "Complete Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
