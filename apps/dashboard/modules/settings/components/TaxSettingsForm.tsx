"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tag01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

export function TaxSettingsForm() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Tax Rates</CardTitle>
          <CardDescription>Manage your GST and other tax rates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { name: 'GST 18%', rate: 18, isDefault: true },
              { name: 'GST 12%', rate: 12, isDefault: false },
              { name: 'GST 5%', rate: 5, isDefault: false },
            ].map((tax, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={Tag01Icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{tax.name}</p>
                    <p className="text-xs text-muted-foreground">{tax.rate}% Tax Rate</p>
                  </div>
                </div>
                {tax.isDefault && (
                  <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full h-12 border-dashed">
            <HugeiconsIcon icon={PlusSignIcon} className="mr-2 w-4 h-4" /> Add Tax Rate
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>HSN Configuration</CardTitle>
          <CardDescription>Configure default HSN codes for categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default HSN Code</Label>
                <Input placeholder="e.g. 6205" />
              </div>
              <div className="space-y-2">
                <Label>SAC Code (Services)</Label>
                <Input placeholder="e.g. 9983" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save HSN Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
