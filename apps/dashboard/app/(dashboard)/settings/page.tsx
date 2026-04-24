import { PageHeader } from "@/components/common/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Configure your business profile, tax rates, and billing information."
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="tax" className="rounded-lg">Taxes & GST</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg">Billing & Plan</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Update your business information and store defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input placeholder="Enter business name" defaultValue="The Mrktplace" />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Input placeholder="e.g. Clothing Retail" defaultValue="Fashion" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input placeholder="email@business.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+91 00000 00000" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Manage your GST settings and tax rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className="flex justify-end">
                <Button>Update Tax Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>You are currently on the Professional Plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-bold text-primary">Professional Plan</p>
                  <p className="text-sm text-muted-foreground">Next billing date: May 24, 2026</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
