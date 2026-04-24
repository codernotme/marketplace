"use client"

import { PageHeader } from "@/components/common/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { BusinessProfileForm } from "@modules/settings/components/BusinessProfileForm"
import { StoreSettingsForm } from "@modules/settings/components/StoreSettingsForm"
import { TaxSettingsForm } from "@modules/settings/components/TaxSettingsForm"
import { PaymentMethodsForm } from "@modules/settings/components/PaymentMethodsForm"
import { SecuritySettingsForm } from "@modules/settings/components/SecuritySettingsForm"
import { useSettings } from "@modules/settings/hooks/useSettings"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { isLoading } = useSettings()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader 
        title="Settings" 
        description="Configure your business profile, tax rates, and billing information."
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="stores" className="rounded-lg">Stores</TabsTrigger>
          <TabsTrigger value="tax" className="rounded-lg">Taxes & GST</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg">Payments</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <BusinessProfileForm />
        </TabsContent>

        <TabsContent value="stores">
          <StoreSettingsForm />
        </TabsContent>

        <TabsContent value="tax">
          <TaxSettingsForm />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentMethodsForm />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
