"use client"

import * as React from "react"
import { useSettings } from "../hooks/useSettings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Loader2 } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store01Icon } from "@hugeicons/core-free-icons"

export function StoreSettingsForm() {
  const { tenant, updateStore } = useSettings()

  if (!tenant?.stores?.length) {
    return (
      <Card className="border-border/40 shadow-sm">
        <CardContent className="py-10 text-center text-muted-foreground">
          No stores found.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {tenant.stores.map((store: any) => (
        <Card key={store.id} className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <HugeiconsIcon icon={Store01Icon} className="w-6 h-6" />
            </div>
            <div>
              <CardTitle>{store.name}</CardTitle>
              <CardDescription>Configure store-specific settings and contact info.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                updateStore.mutate({
                  id: store.id,
                  data: {
                    name: formData.get('name') as string,
                    phone: formData.get('phone') as string,
                    address: formData.get('address') as string,
                  }
                })
              }} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`name-${store.id}`}>Store Name</Label>
                  <Input id={`name-${store.id}`} name="name" defaultValue={store.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`phone-${store.id}`}>Store Phone</Label>
                  <Input id={`phone-${store.id}`} name="phone" defaultValue={store.phone} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`address-${store.id}`}>Address</Label>
                  <Input id={`address-${store.id}`} name="address" defaultValue={store.address} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateStore.isPending}>
                  {updateStore.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Store
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
