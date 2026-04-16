import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Settings — themrktplace Master Admin",
  description: "Global platform configuration and system settings.",
};

export default function MasterSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform Settings"
        description="Global configuration for the entire themrktplace ecosystem."
      />

      <Tabs defaultValue="platform">
        <TabsList>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="billing">Billing Rules</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-6 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identity & Branding</CardTitle>
              <CardDescription>Global platform defaults</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="themrktplace" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="supportEmail">Global Support Email</Label>
                  <Input id="supportEmail" defaultValue="support@themrktplace.io" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New Tenant Registration</p>
                  <p className="text-xs text-muted-foreground">Allow anyone to create a store without invitation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Update Platform</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription Tiers</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { name: "Starter", price: "₹299/mo", fee: "2.0%", status: "active" },
                { name: "Growth", price: "₹999/mo", fee: "1.5%", status: "active" },
                { name: "Pro", price: "₹2,999/mo", fee: "1.0%", status: "active" },
                { name: "Enterprise", price: "Custom", fee: "Negotiated", status: "active" },
              ].map((tier) => (
                <div key={tier.name} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div>
                    <p className="text-sm font-semibold">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">{tier.price} + {tier.fee} txn fee</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit Tier</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Policies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enforce MFA</p>
                  <p className="text-xs text-muted-foreground">Require Multi-Factor Authentication for all team members</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Session Timeout</p>
                  <p className="text-xs text-muted-foreground">Duration of inactivity before forced logout (minutes)</p>
                </div>
                <Input className="w-20 h-8" type="number" defaultValue="60" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
