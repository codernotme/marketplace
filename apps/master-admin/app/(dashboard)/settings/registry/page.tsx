import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  CreditCardIcon, 
  DeliveryTruck01Icon, 
  TaxIcon, 
  Add01Icon,
  Settings02Icon
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Registry — themrktplace Master Admin",
  description: "Global registry for payment gateways, shipping providers, and tax rules.",
};

export default function RegistryPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Platform Registry"
        description="Configure the global ecosystem available to all merchants on the platform."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Payment Gateways */}
        <Card className="bg-card/30 backdrop-blur-md border-border/50 rounded-[32px] overflow-hidden shadow-none">
          <CardHeader>
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <HugeiconsIcon icon={CreditCardIcon} size={20} />
            </div>
            <CardTitle className="text-lg font-black tracking-tight">Payment Gateways</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">Supported financial providers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Stripe</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">Official SDK</span>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-transparent text-[9px] font-black uppercase">Active</Badge>
             </div>
             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/40 opacity-50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Razorpay</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">Beta</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase">Disabled</Badge>
             </div>
             <Button variant="outline" className="w-full rounded-xl border-dashed border-2 h-10 border-primary/20 text-primary/70 hover:bg-primary/5 hover:text-primary transition-all">
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                Add Gateway
             </Button>
          </CardContent>
        </Card>

        {/* Shipping Carriers */}
        <Card className="bg-card/30 backdrop-blur-md border-border/50 rounded-[32px] overflow-hidden shadow-none">
          <CardHeader>
            <div className="size-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              <HugeiconsIcon icon={DeliveryTruck01Icon} size={20} />
            </div>
            <CardTitle className="text-lg font-black tracking-tight">Shipping Carriers</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">Global logistics partners.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">FedEx</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">API Integrated</span>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-transparent text-[9px] font-black uppercase">Active</Badge>
             </div>
             <Button variant="outline" className="w-full rounded-xl border-dashed border-2 h-10 border-primary/20 text-primary/70 hover:bg-primary/5 hover:text-primary transition-all">
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                Register Carrier
             </Button>
          </CardContent>
        </Card>

        {/* Tax Authorities */}
        <Card className="bg-card/30 backdrop-blur-md border-border/50 rounded-[32px] overflow-hidden shadow-none">
          <CardHeader>
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <HugeiconsIcon icon={TaxIcon} size={20} />
            </div>
            <CardTitle className="text-lg font-black tracking-tight">Tax Rule Templates</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">Standardized tax configurations.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-border/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">GST Standard</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">18% Default</span>
                </div>
                <Button size="icon" variant="ghost" className="size-8 rounded-full">
                   <HugeiconsIcon icon={Settings02Icon} size={14} />
                </Button>
             </div>
             <Button variant="outline" className="w-full rounded-xl border-dashed border-2 h-10 border-primary/20 text-primary/70 hover:bg-primary/5 hover:text-primary transition-all">
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                Define Template
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
