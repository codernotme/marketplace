import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, ArrowLeft01Icon, Package01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Inventory",
};

const inventory = [
  { id: 1, name: "Espresso Beans (500g)", stock: 12, cat: "Supplies", price: "₹850" },
  { id: 2, name: "Whole Milk (1L)", stock: 5, cat: "Supplies", price: "₹65" },
  { id: 3, name: "Sugar Packets (100)", stock: 45, cat: "Supplies", price: "₹120" },
  { id: 4, name: "Paper Cups (8oz)", stock: 1200, cat: "Packaging", price: "₹2.5/ea" },
  { id: 5, name: "Sourdough Loaf", stock: 8, cat: "Food", price: "₹340" },
];

export default function PosInventoryPage() {
  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="h-16 flex items-center justify-between px-6 bg-background border-b border-border">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
               <a href="/"><HugeiconsIcon icon={ArrowLeft01Icon} size={20} /></a>
            </Button>
            <h1 className="font-heading font-bold text-lg">Inventory Management</h1>
         </div>
         <Button className="rounded-full gap-2 font-bold h-10">
            <HugeiconsIcon icon={Add01Icon} size={18} />
            Quick Restock
         </Button>
      </header>
      
      <div className="p-6 flex flex-col gap-6 overflow-auto">
         <div className="relative">
            <HugeiconsIcon icon={SearchIcon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search inventory or scan SKU..." className="pl-11 h-12 rounded-2xl bg-background border-border shadow-sm focus-visible:ring-1 focus-visible:ring-primary" />
         </div>

         <div className="grid gap-4">
            {inventory.map((item) => (
               <Card key={item.id} className="border-border/50 shadow-sm">
                  <CardContent className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/30">
                           <HugeiconsIcon icon={Package01Icon} size={24} />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm tracking-tight">{item.name}</span>
                           <span className="text-xs text-muted-foreground">{item.cat} • {item.price}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-12">
                        <div className="flex flex-col items-center">
                           <span className={`text-lg font-black ${item.stock < 10 ? 'text-orange-500' : 'text-foreground'}`}>
                              {item.stock}
                           </span>
                           <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Available</span>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" className="rounded-xl h-9 px-4">-</Button>
                           <Button variant="outline" size="sm" className="rounded-xl h-9 px-4">+</Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
