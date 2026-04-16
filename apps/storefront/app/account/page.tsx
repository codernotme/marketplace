import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Package01Icon, 
  Settings02Icon, 
  MapLocation01Icon, 
  CreditCard01Icon,
  Logout01Icon,
  ShoppingBag01Icon
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, orders, and addresses.",
};

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="size-24 border-4 border-background shadow-xl">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">Aryan Shah</h1>
              <p className="text-muted-foreground">aryan@example.com • Member since 2026</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full gap-2">
            <HugeiconsIcon icon={Logout01Icon} size={18} />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="h-14 p-1 bg-muted/50 rounded-2xl w-full md:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="orders" className="rounded-xl px-6 h-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="rounded-xl px-6 h-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <HugeiconsIcon icon={MapLocation01Icon} size={18} />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl px-6 h-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <HugeiconsIcon icon={CreditCard01Icon} size={18} />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-6 h-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <HugeiconsIcon icon={Settings02Icon} size={18} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-8 flex flex-col gap-4">
             <Card className="border-border/50 overflow-hidden rounded-[24px]">
                <CardHeader className="bg-muted/30">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-8 text-sm">
                         <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Order Placed</span>
                            <span className="font-semibold text-foreground">April 12, 2026</span>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Total</span>
                            <span className="font-semibold text-foreground">₹4,449</span>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Ship to</span>
                            <span className="font-semibold text-foreground">Aryan Shah</span>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-muted-foreground text-xs font-medium">Order #MRP-29501</span>
                         <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Arriving Tuesday</Badge>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="py-6 flex flex-col md:flex-row justify-between gap-6">
                   <div className="flex gap-6">
                      <div className="size-20 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground/30">
                         <HugeiconsIcon icon={Package01Icon} size={24} />
                      </div>
                      <div className="flex flex-col justify-center">
                         <h4 className="font-bold text-lg">Minimalist Desk Lamp</h4>
                         <p className="text-sm text-muted-foreground">Qty: 1 • Color: Matte Black</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-full px-6">Track Package</Button>
                      <Button className="rounded-full px-6">View Details</Button>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
             <Card className="max-w-2xl border-border shadow-none rounded-[24px]">
                <CardHeader>
                   <CardTitle>Profile Information</CardTitle>
                   <CardDescription>Update your personal details and how we reach you.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input className="h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Aryan Shah" />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input className="h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="aryan@themrktplace.io" />
                   </div>
                   <Button className="w-fit rounded-full px-8 h-12 font-bold mt-2">Save Changes</Button>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
