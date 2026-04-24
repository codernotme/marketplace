"use client"

import * as React from "react"
import { useCurrentShift, useShiftActions } from "../hooks/useShifts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store01Icon, DollarCircleIcon, Note01Icon } from "@hugeicons/core-free-icons"

export function ShiftManager({ children }: { children: React.ReactNode }) {
  // Hardcoded storeId for now, should come from context/settings
  const storeId = "default-store-id" 
  const { data: currentShift, isLoading } = useCurrentShift(storeId)
  const { openShift, closeShift } = useShiftActions(storeId)

  const [isOpening, setIsOpening] = React.useState(false)
  const [openingCash, setOpeningCash] = React.useState(0)
  const [notes, setNotes] = React.useState("")

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-background">Loading shift status...</div>

  if (!currentShift) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background/80 backdrop-blur-sm z-[100] fixed inset-0">
        <div className="max-w-md w-full p-8 bg-card border rounded-2xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <HugeiconsIcon icon={Store01Icon} className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">Open New Shift</h2>
            <p className="text-sm text-muted-foreground mt-2">Enter the starting cash amount to begin your session</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Opening Cash (₹)</Label>
              <div className="relative">
                <HugeiconsIcon icon={DollarCircleIcon} className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  className="pl-10 h-12" 
                  placeholder="0.00"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input 
                placeholder="e.g. Morning shift" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-medium shadow-xl shadow-primary/20"
            disabled={openShift.isPending}
            onClick={() => openShift.mutate({ openingCash, notes })}
          >
            {openShift.isPending ? "Opening..." : "Start Shift"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export function CloseShiftModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const storeId = "default-store-id"
  const { closeShift } = useShiftActions(storeId)
  const [closingCash, setClosingCash] = React.useState(0)
  const [notes, setNotes] = React.useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Close Shift & Reconcile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Actual Cash in Drawer (₹)</Label>
            <Input 
              type="number" 
              placeholder="Count your cash..." 
              className="h-12"
              value={closingCash}
              onChange={(e) => setClosingCash(Number(e.target.value))}
            />
            <p className="text-[10px] text-muted-foreground">The system will calculate discrepancies based on sales.</p>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input 
              placeholder="Any remarks?" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            variant="destructive"
            disabled={closeShift.isPending}
            onClick={() => closeShift.mutate({ closingCash, notes }, { onSuccess: () => onOpenChange(false) })}
          >
            {closeShift.isPending ? "Closing..." : "Close Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
