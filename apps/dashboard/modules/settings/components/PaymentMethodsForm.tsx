"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { DollarCircleIcon, CreditCardIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons"

export function PaymentMethodsForm() {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Configure which payment methods are accepted at your terminals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            { id: 'cash', label: 'Cash', icon: DollarCircleIcon, enabled: true },
            { id: 'card', label: 'Credit / Debit Card', icon: CreditCardIcon, enabled: true },
            { id: 'upi', label: 'UPI / QR Codes', icon: SmartPhone01Icon, enabled: true },
            { id: 'credit', label: 'Store Credit', icon: DollarCircleIcon, enabled: false },
          ].map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <HugeiconsIcon icon={method.icon} className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <Switch checked={method.enabled} />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button>Save Payment Preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}
