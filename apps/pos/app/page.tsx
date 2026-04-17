"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  ShoppingCart01Icon, 
  UserIcon, 
  Settings02Icon, 
  Delete01Icon,
  ShoppingBag01Icon,
  CheckmarkCircle01Icon,
  Calculator01Icon,
  RefreshIcon
} from "@hugeicons/react";
import { formatINR } from "@workspace/ui/lib/formatters";
import { usePosStore } from "@/lib/store";
import { getPosProducts, createPosOrder } from "@/app/actions/pos";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

export default function PosTerminalPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [checkingOut, setCheckingOut] = useState(false);

  // Store
  const { cart, addItem, removeItem, updateQuantity, clearCart, subtotal, tax, total } = usePosStore();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getPosProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.variants?.[0]?.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setCheckingOut(true);
    try {
      await createPosOrder({
        items: cart,
        total: total(),
        subtotal: subtotal(),
        email: "pos-customer@themrktplace.com", // Placeholder for POS checkout
      });
      toast.success("Order processed successfully!");
      clearCart();
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)))];

  return (
    <div className="h-screen flex flex-col bg-muted/20 animate-in fade-in duration-700">
      {/* POS Top Bar */}
      <header className="h-16 flex items-center justify-between px-6 bg-background border-b border-border shrink-0 z-10">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">P</div>
               <span className="font-heading font-bold text-lg tracking-tight">themrktplace POS</span>
            </div>
            <div className="relative w-80">
               <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <Input 
                 placeholder="Search items or scan barcode..." 
                 className="pl-10 h-10 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden md:flex">
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Terminal 01</p>
               <p className="text-sm font-semibold">Store Front</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-background border-border/50"><HugeiconsIcon icon={RefreshIcon} size={18} onClick={() => window.location.reload()} /></Button>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-background border-border/50"><HugeiconsIcon icon={UserIcon} size={18} /></Button>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-background border-border/50"><HugeiconsIcon icon={Settings02Icon} size={18} /></Button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Product Grid */}
        <main className="flex-1 flex flex-col overflow-hidden bg-muted/10">
           <div className="p-4 flex gap-2 overflow-x-auto bg-background/50 backdrop-blur-md border-b border-border/50 scrollbar-hide">
              {categories.map((cat: any) => (
                <Badge 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full cursor-pointer transition-all border-none font-medium text-xs shadow-sm",
                    activeCategory === cat ? "bg-primary text-primary-foreground scale-105" : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  {cat}
                </Badge>
              ))}
           </div>
           
           <ScrollArea className="flex-1 p-6">
              {loading ? (
                <div className="flex h-full items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                  {filteredProducts.map((p) => {
                    const variant = p.variants?.[0];
                    return (
                      <Card 
                        key={p.id} 
                        onClick={() => variant && addItem({
                          id: p.id,
                          variantId: variant.id,
                          name: p.name,
                          price: variant.price,
                          quantity: 1,
                          sku: variant.sku || "N/A"
                        })}
                        className="border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-2px] transition-all cursor-pointer group active:scale-[0.96] bg-background rounded-2xl overflow-hidden"
                      >
                        <CardContent className="p-0 flex flex-col h-full">
                           <div className="aspect-square bg-muted/20 flex items-center justify-center text-muted-foreground/30 relative overflow-hidden">
                              <HugeiconsIcon icon={ShoppingBag01Icon} size={40} className="group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                           </div>
                           <div className="p-4 flex flex-col gap-2">
                              <div className="min-h-[40px]">
                                <h4 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-2">{p.name}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{p.category?.name || "Uncategorized"}</p>
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40">
                                 <span className="font-black text-sm text-primary">{formatINR(variant?.price || 0)}</span>
                                 <span className={cn(
                                   "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                   (variant?.stock || 0) < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                 )}>
                                    {variant?.stock || 0} left
                                 </span>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
           </ScrollArea>
        </main>

        {/* Right Panel: Cart/Checkout */}
        <aside className="w-[420px] flex flex-col bg-background border-l border-border shrink-0 shadow-2xl z-20">
           <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/5">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl">
                   <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="text-primary" />
                 </div>
                 <h2 className="text-lg font-black tracking-tight">Active Ticket</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive gap-2 rounded-full h-9 hover:bg-destructive/10"
                onClick={clearCart}
              >
                 <HugeiconsIcon icon={Delete01Icon} size={16} />
                 Clear
              </Button>
           </div>
           
           <ScrollArea className="flex-1">
              <div className="p-6 flex flex-col gap-1">
                 {cart.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-24 text-center gap-4 opacity-30">
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={64} strokeWidth={1} />
                      <p className="text-sm font-semibold tracking-tight">Your cart is empty</p>
                   </div>
                 ) : (
                   cart.map((item, idx) => (
                      <div key={item.variantId} className="group p-3 -mx-3 rounded-2xl hover:bg-muted/30 transition-all flex justify-between items-start gap-4 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 40}ms` }}>
                         <div className="flex flex-col gap-1 flex-1">
                            <span className="font-bold text-[13px] leading-tight block">{item.name}</span>
                            <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center bg-background border border-border/50 rounded-lg overflow-hidden h-7">
                                  <button 
                                    className="px-2 hover:bg-muted transition-colors text-lg"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span className="px-2 font-black text-xs min-w-[30px] text-center">{item.quantity}</span>
                                  <button 
                                    className="px-2 hover:bg-muted transition-colors text-lg"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                               </div>
                               <span className="text-[10px] text-muted-foreground font-medium">{formatINR(item.price)} ea.</span>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className="font-black text-sm text-primary">{formatINR(item.price * item.quantity)}</span>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all bg-destructive/5 rounded-lg"
                            >
                               <HugeiconsIcon icon={Delete01Icon} size={14} />
                            </button>
                         </div>
                      </div>
                   ))
                 )}
              </div>
           </ScrollArea>
           
           <div className="p-8 bg-muted/30 backdrop-blur-xl flex flex-col gap-6 rounded-t-[40px] border-t border-border shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] mt-auto">
              <div className="flex flex-col gap-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-black text-foreground">{formatINR(subtotal())}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Tax (5% GST)</span>
                    <span className="tabular-nums font-black text-foreground">{formatINR(tax())}</span>
                 </div>
                 <Separator className="bg-border/50 my-1" />
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Grand Total</span>
                    <span className="text-3xl font-black tabular-nums tracking-tighter text-primary">
                      {formatINR(total())}
                    </span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <Button variant="outline" className="h-16 rounded-2xl font-bold flex flex-col gap-1 items-center justify-center border-2 border-border/50 hover:bg-background hover:scale-[1.02] transition-all bg-background shadow-sm">
                    <HugeiconsIcon icon={Calculator01Icon} size={20} className="text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-[0.15em] font-black text-muted-foreground">Hold Ticket</span>
                 </Button>
                 <Button 
                   onClick={handleCheckout}
                   disabled={checkingOut || cart.length === 0}
                   className="h-16 rounded-2xl font-black flex flex-col gap-1 items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                 >
                    {checkingOut ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <>
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] uppercase tracking-[0.2em]">Settle {formatINR(total(), true)}</span>
                      </>
                    )}
                 </Button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
