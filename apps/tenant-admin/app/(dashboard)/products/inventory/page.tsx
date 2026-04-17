"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PackageIcon, 
  PackageSelectionIcon, 
  PencilEdit01Icon, 
  Alert01Icon,
  CheckmarkCircle01Icon,
  SearchIcon,
  ArrowUp01Icon,
  ArrowDown01Icon
} from "@hugeicons/core-free-icons";
import { DataTable } from "@workspace/ui/components/data-table";
import { getInventory, adjustStock } from "@/app/actions/inventory";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("Restock");
  const [adjusting, setAdjusting] = useState(false);

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjust = async () => {
    if (!selectedVariant || !adjustmentValue) return;
    
    setAdjusting(true);
    try {
      await adjustStock(selectedVariant.id, parseInt(adjustmentValue), adjustmentReason);
      toast.success("Stock adjusted successfully");
      setSelectedVariant(null);
      setAdjustmentValue("");
      loadInventory();
    } catch (error) {
      toast.error("Failed to adjust stock");
    } finally {
      setAdjusting(false);
    }
  };

  const columns = [
    {
      accessorKey: "product.name",
      header: "Product",
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{row.original.product.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            {row.original.product.category?.name || "No Category"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }: any) => <span className="font-mono text-xs">{row.original.sku || "N/A"}</span>,
    },
    {
      accessorKey: "stock",
      header: "On Hand",
      cell: ({ row }: any) => {
        const stock = row.original.stock;
        return (
          <div className="flex items-center gap-2 font-black tabular-nums">
            <span className={cn(stock < 10 ? "text-destructive" : stock < 20 ? "text-warning" : "text-success")}>
              {stock}
            </span>
            {stock < 10 && <HugeiconsIcon icon={Alert01Icon} size={12} className="text-destructive animate-pulse" />}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 px-3 gap-2 text-[11px]"
              onClick={() => setSelectedVariant(row.original)}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              Adjust
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl backdrop-blur-xl bg-background/80">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tight">Adjust Inventory</DialogTitle>
              <DialogDescription className="text-xs">
                {selectedVariant?.product?.name} ({selectedVariant?.sku})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Stock: {selectedVariant?.stock}</p>
                 <Input
                   type="number"
                   placeholder="Enter adjustment Amount"
                   className="h-12 rounded-2xl bg-muted/30 border-none font-bold text-lg"
                   value={adjustmentValue}
                   onChange={(e) => setAdjustmentValue(e.target.value)}
                 />
                 <p className="text-[10px] text-muted-foreground ml-1 italic italic">Use negative numbers to decrease stock</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reason for adjustment</p>
                 <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                    <SelectTrigger className="h-11 rounded-2xl bg-muted/30 border-none">
                       <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Restock">Restock / New Shipment</SelectItem>
                       <SelectItem value="Return">Customer Return</SelectItem>
                       <SelectItem value="Damaged">Damaged / Expired</SelectItem>
                       <SelectItem value="Correction">Inventory Correction</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                onClick={handleAdjust} 
                disabled={adjusting || !adjustmentValue}
                className="rounded-2xl h-12 w-full shadow-lg shadow-primary/20 font-bold"
              >
                {adjusting ? "Updating..." : "Confirm adjustment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Inventory"
        description="Track and update your stock levels across variants."
      >
        <Button variant="outline" size="sm" className="rounded-full shadow-none bg-card/50 backdrop-blur-sm">
           <HugeiconsIcon icon={PackageSelectionIcon} data-icon="inline-start" />
           Transfer
        </Button>
        <Button size="sm" className="rounded-full shadow-none px-5">
           <HugeiconsIcon icon={PackageIcon} data-icon="inline-start" />
           Receive Items
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
         {[
           { label: "Low Stock Items", value: inventory.filter(i => i.stock < 10).length, color: "text-destructive", icon: Alert01Icon },
           { label: "Total Units", value: inventory.reduce((acc, i) => acc + i.stock, 0), color: "text-primary", icon: PackageIcon },
           { label: "Inventory Value", value: "₹3.4L", color: "text-foreground", icon: CheckmarkCircle01Icon },
         ].map((stat) => (
           <Card key={stat.label} className="border-none shadow-sm bg-card/40 backdrop-blur-sm rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl">
                 <HugeiconsIcon icon={stat.icon} size={20} className={stat.color} />
              </div>
           </Card>
         ))}
      </div>

      <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <DataTable 
          columns={columns as any} 
          data={inventory} 
          searchColumn="sku"
          searchPlaceholder="Search by SKU..."
        />
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
   return (
      <div className={cn("bg-card border border-border rounded-lg", className)}>
         {children}
      </div>
   )
}
