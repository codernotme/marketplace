import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, ArrowLeft01Icon, InvoiceIcon } from "@hugeicons/core-free-icons";
import { formatINR, formatDate } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS History",
};

const orders = [
  { id: "MRP-901", total: 1250, status: "completed", date: new Date(), items: 4 },
  { id: "MRP-902", total: 450, status: "completed", date: new Date(Date.now() - 3600000), items: 2 },
  { id: "MRP-903", total: 180, status: "voided", date: new Date(Date.now() - 7200000), items: 1 },
  { id: "MRP-904", total: 2999, status: "completed", date: new Date(Date.now() - 86400000), items: 7 },
  { id: "MRP-905", total: 950, status: "completed", date: new Date(Date.now() - 172800000), items: 3 },
];

export default function PosOrdersPage() {
  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="h-16 flex items-center gap-4 px-6 bg-background border-b border-border">
         <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="/"><HugeiconsIcon icon={ArrowLeft01Icon} size={20} /></a>
         </Button>
         <h1 className="font-heading font-bold text-lg">Transaction History</h1>
      </header>
      
      <div className="p-6 flex flex-col gap-6 overflow-auto">
         <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">{orders.length} transactions in last 48 hours</p>
            <Button variant="outline" size="sm" className="rounded-full gap-2">
               <HugeiconsIcon icon={FilterIcon} size={16} />
               Filter
            </Button>
         </div>

         <div className="grid gap-4">
            {orders.map((o) => (
               <Card key={o.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center ${o.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                           <HugeiconsIcon icon={InvoiceIcon} size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm tracking-tight">{o.id}</span>
                           <span className="text-xs text-muted-foreground">{formatDate(o.date)} • {o.items} items</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                           <span className="font-black text-sm">{formatINR(o.total)}</span>
                           <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest border-none p-0 ${o.status === 'completed' ? 'text-green-500' : 'text-destructive'}`}>
                              {o.status}
                           </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-muted transition-colors">
                           <HugeiconsIcon icon={ArrowLeft01Icon} className="rotate-180" size={18} />
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
