"use client";

import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Separator } from "@workspace/ui/components/separator";
import { Switch } from "@workspace/ui/components/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Settings01Icon, 
  Store01Icon, 
  Notification01Icon, 
  CreditCardIcon, 
  SecurityIcon,
  Tick01Icon,
  GlobalIcon
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <PageHeader
        title="Settings"
        description="Configure your store details, payments, and team members."
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-12 mb-8">
          <TabsTrigger value="general" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <HugeiconsIcon icon={Store01Icon} size={16} data-icon="inline-start" />
             General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <HugeiconsIcon icon={Notification01Icon} size={16} data-icon="inline-start" />
             Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <HugeiconsIcon icon={CreditCardIcon} size={16} data-icon="inline-start" />
             Payments
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <HugeiconsIcon icon={SecurityIcon} size={16} data-icon="inline-start" />
             Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card className="border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight">Store Profile</CardTitle>
              <CardDescription>This information will be displayed on your customer's invoices and storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="store-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Store Name</Label>
                    <Input id="store-name" defaultValue="FashionHub Store" className="h-11 rounded-xl bg-background/50 border-none ring-1 ring-border" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="store-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Contact Email</Label>
                    <Input id="store-email" defaultValue="support@fashionhub.io" className="h-11 rounded-xl bg-background/50 border-none ring-1 ring-border" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="store-domain" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Custom Domain</Label>
                 <div className="flex items-center gap-2">
                    <div className="flex-1 h-11 rounded-xl bg-background/50 border-none ring-1 ring-border px-4 flex items-center text-sm font-medium">
                       fashionhub.themrktplace.com
                    </div>
                    <Button variant="outline" className="rounded-xl h-11 px-6">Manage</Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight">Localization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Currency</Label>
                    <div className="h-11 rounded-xl bg-background/50 border-none ring-1 ring-border px-4 flex items-center justify-between">
                       <span className="text-sm font-medium">Indian Rupee (INR - ₹)</span>
                       <HugeiconsIcon icon={GlobalIcon} size={16} className="text-muted-foreground" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Timezone</Label>
                    <div className="h-11 rounded-xl bg-background/50 border-none ring-1 ring-border px-4 flex items-center">
                       <span className="text-sm font-medium">(GMT+05:30) Mumbai, New Delhi</span>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
           <Card className="border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight">Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <p className="text-sm font-bold tracking-tight">Order Confirmations</p>
                     <p className="text-xs text-muted-foreground">Send an email to customers when their order is confirmed.</p>
                  </div>
                  <Switch defaultChecked />
               </div>
               <Separator className="bg-border/40" />
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <p className="text-sm font-bold tracking-tight">Inventory Alerts</p>
                     <p className="text-xs text-muted-foreground">Notify me when products fall below the low stock threshold.</p>
                  </div>
                  <Switch defaultChecked />
               </div>
               <Separator className="bg-border/40" />
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <p className="text-sm font-bold tracking-tight">New Customer Signup</p>
                     <p className="text-xs text-muted-foreground">Receive a summary of new registrations daily.</p>
                  </div>
                  <Switch />
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Placeholder for other tabs */}
        <TabsContent value="payments">
           <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                 <HugeiconsIcon icon={CreditCardIcon} size={32} className="text-primary" />
              </div>
              <div>
                 <h3 className="text-xl font-black tracking-tight">Payment Gateways</h3>
                 <p className="text-sm text-muted-foreground max-w-[300px] mt-1">Configure Razorpay, Stripe, or Cash on Delivery settings in Phase 5.</p>
              </div>
              <Button className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20 mt-4">Connect Provider</Button>
           </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-border/50 p-2 rounded-2xl shadow-2xl z-50">
         <p className="text-xs font-bold text-muted-foreground px-4">You have unsaved changes</p>
         <Button onClick={handleSave} disabled={loading} className="rounded-xl px-8 h-11 font-black shadow-lg shadow-primary/20">
            {loading ? "Saving..." : (
               <>
                  <HugeiconsIcon icon={Tick01Icon} data-icon="inline-start" />
                  Save Settings
               </>
            )}
         </Button>
      </div>
    </div>
  );
}
