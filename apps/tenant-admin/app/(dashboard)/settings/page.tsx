import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — themrktplace",
  description: "Store profile, tax, notifications, and staff settings.",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure your store profile, tax rules, notifications, and team access."
      />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="api">API & Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Store Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeName">Store name</Label>
                  <Input id="storeName" defaultValue="My Awesome Store" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeEmail">Contact email</Label>
                  <Input id="storeEmail" type="email" defaultValue="hello@mystore.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="storeAddress">Store address</Label>
                <Input id="storeAddress" placeholder="123 Main St, Mumbai, MH 400001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currency">Default currency</Label>
                  <Input id="currency" defaultValue="INR (₹)" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="Asia/Kolkata (IST)" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">GST Registration</p>
                  <p className="text-xs text-muted-foreground">Enable GST calculations for orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" placeholder="27AAPFU0939F1ZV" className="font-mono" />
              </div>
              <div className="flex justify-end">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { label: "New order received", desc: "Get notified when a customer places an order", defaultChecked: true },
                { label: "Order shipped", desc: "When a fulfillment is marked as shipped", defaultChecked: true },
                { label: "Low stock alert", desc: "When a product falls below reorder threshold", defaultChecked: true },
                { label: "New customer signup", desc: "When a customer creates an account", defaultChecked: false },
                { label: "Failed payment", desc: "When a payment attempt fails", defaultChecked: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Staff Members</CardTitle>
              <Button size="sm">Invite staff</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { name: "Aryan Shah", email: "aryan@store.com", role: "Owner", status: "active" },
                  { name: "Priya Kumar", email: "priya@store.com", role: "Manager", status: "active" },
                  { name: "Rahul Das", email: "rahul@store.com", role: "Support", status: "pending" },
                ].map((s) => (
                  <div key={s.email} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{s.role}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">API Keys</CardTitle>
              <Button size="sm">Generate key</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Use API keys to authenticate your custom integrations and webhooks.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Production Key", key: "sk_live_••••••••••••3a4b", created: "Jan 15, 2026", lastUsed: "2h ago" },
                  { name: "Webhook Secret", key: "whsec_••••••••••••7c9d", created: "Feb 01, 2026", lastUsed: "5d ago" },
                ].map((k) => (
                  <div key={k.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">{k.name}</p>
                      <code className="text-xs text-muted-foreground font-mono">{k.key}</code>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Created {k.created}</span>
                      <span>•</span>
                      <span>Used {k.lastUsed}</span>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
