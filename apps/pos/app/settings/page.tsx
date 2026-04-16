import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  PrinterIcon, 
  Settings02Icon, 
  UserCircleIcon,
  HelpCircleIcon,
  UsbIcon
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Settings",
};

export default function PosSettingsPage() {
  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="h-16 flex items-center gap-4 px-6 bg-background border-b border-border">
         <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="/"><HugeiconsIcon icon={ArrowLeft01Icon} size={20} /></a>
         </Button>
         <h1 className="font-heading font-bold text-lg">POS Terminal Settings</h1>
      </header>
      
      <div className="p-6 flex flex-col gap-6 overflow-auto max-w-4xl mx-auto w-full">
         <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Hardware & Devices</h2>
            <Card className="border-border/50 shadow-sm">
               <CardContent className="p-0">
                  <div className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                           <HugeiconsIcon icon={PrinterIcon} size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm">Receipt Printer</span>
                           <span className="text-xs text-muted-foreground">Epson TM-T88VI connected via USB</span>
                        </div>
                     </div>
                     <Badge className="bg-green-500/10 text-green-600 border-none">Connected</Badge>
                  </div>
                  <Separator />
                  <div className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                           <HugeiconsIcon icon={UsbIcon} size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm">Barcode Scanner</span>
                           <span className="text-xs text-muted-foreground">Symbol LS2208</span>
                        </div>
                     </div>
                     <Badge variant="outline" className="text-orange-600 border-none bg-orange-500/5 font-bold">Wake to Link</Badge>
                  </div>
               </CardContent>
            </Card>
         </section>

         <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Terminal Preferences</h2>
            <Card className="border-border/50 shadow-sm">
               <CardContent className="p-0">
                  <div className="p-5 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-sm">Offline Mode</p>
                        <p className="text-xs text-muted-foreground">Enable local database sync for offline sales</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="p-5 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-sm">Auto-Print Receipts</p>
                        <p className="text-xs text-muted-foreground">Print receipt automatically after successful payment</p>
                     </div>
                     <Switch />
                  </div>
                  <Separator />
                  <div className="p-5 flex items-center justify-between">
                     <div>
                        <p className="font-bold text-sm">Quick Item Entry</p>
                        <p className="text-xs text-muted-foreground">Hide item configuration for single-variant products</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
               </CardContent>
            </Card>
         </section>

         <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Support & Info</h2>
            <div className="grid grid-cols-2 gap-4">
               <Card className="border-border/50 shadow-sm cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                     <HugeiconsIcon icon={HelpCircleIcon} size={24} className="text-muted-foreground" />
                     <span className="font-bold text-sm">Get Help</span>
                  </CardContent>
               </Card>
               <Card className="border-border/50 shadow-sm cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                     <HugeiconsIcon icon={UserCircleIcon} size={24} className="text-muted-foreground" />
                     <span className="font-bold text-sm">Staff Account</span>
                  </CardContent>
               </Card>
            </div>
         </section>
         
         <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">themrktplace POS v1.0.4-beta</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Terminal ID: T-BLR-001</p>
         </div>
      </div>
    </div>
  );
}
