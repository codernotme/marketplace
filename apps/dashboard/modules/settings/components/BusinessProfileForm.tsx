"use client"

import * as React from "react"
import { useSettings } from "../hooks/useSettings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Loader2 } from "lucide-react"

export function BusinessProfileForm() {
  const { tenant, updateProfile } = useSettings()
  const [formData, setFormData] = React.useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    gstin: ""
  })

  React.useEffect(() => {
    if (tenant) {
      setFormData({
        businessName: tenant.businessName || "",
        businessEmail: tenant.businessEmail || "",
        businessPhone: tenant.businessPhone || "",
        gstin: tenant.gstin || ""
      })
    }
  }, [tenant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(formData)
  }

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>Update your business information and global defaults.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input 
                id="gstin" 
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Contact Email</Label>
              <Input 
                id="businessEmail" 
                type="email"
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Phone Number</Label>
              <Input 
                id="businessPhone" 
                value={formData.businessPhone}
                onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
