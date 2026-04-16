import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  SearchIcon, 
  ShoppingCart01Icon, 
  UserIcon, 
  Settings02Icon, 
  Delete01Icon,
  ShoppingBag01Icon,
  CheckmarkCircle01Icon,
  CalculatorIcon
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Terminal",
};

const products = [
  { id: 1, name: "Espresso", price: 120, cat: "Beverages", stock: 15 },
  { id: 2, name: "Cappuccino", price: 180, cat: "Beverages", stock: 8 },
  { id: 3, name: "Chicken Sandwich", price: 240, cat: "Food", stock: 5 },
  { id: 4, name: "Blueberry Muffin", price: 150, cat: "Food", stock: 12 },
  { id: 5, name: "Iced Latte", price: 200, cat: "Beverages", stock: 20 },
  { id: 6, name: "Croissant", price: 110, cat: "Food", stock: 10 },
  { id: 7, name: "Green Tea", price: 90, cat: "Beverages", stock: 25 },
  { id: 8, name: "Bottled Water", price: 40, cat: "Beverages", stock: 50 },
  { id: 9, name: "Bagel with Cream Cheese", price: 170, cat: "Food", stock: 6 },
  { id: 10, name: "Avocado Toast", price: 320, cat: "Food", stock: 4 },
];

export default function PosTerminalPage() {
  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* POS Top Bar */}
      <header className="h-16 flex items-center justify-between px-6 bg-background border-b border-border shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
               <span className="font-heading font-bold text-lg tracking-tight">themrktplace POS</span>
            </div>
            <div className="relative w-80">
               <HugeiconsIcon icon={SearchIcon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <Input placeholder="Search items or scan barcode..." className="pl-10 h-10 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cashier</p>
               <p className="text-sm font-semibold">Aryan Shah</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm"><HugeiconsIcon icon={UserIcon} size={18} /></Button>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm"><HugeiconsIcon icon={Settings02Icon} size={18} /></Button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Product Grid */}
        <main className="flex-1 flex flex-col overflow-hidden">
           <div className="p-4 flex gap-2 border-b border-border bg-background">
              <Badge className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground">All Items</Badge>
              <Badge variant="outline" className="px-4 py-1.5 rounded-full hover:bg-muted cursor-pointer transition-colors border-none">Beverages</Badge>
              <Badge variant="outline" className="px-4 py-1.5 rounded-full hover:bg-muted cursor-pointer transition-colors border-none">Food</Badge>
              <Badge variant="outline" className="px-4 py-1.5 rounded-full hover:bg-muted cursor-pointer transition-colors border-none">Merch</Badge>
           </div>
           
           <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                 {products.map((p) => (
                    <Card key={p.id} className="border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.98]">
                       <CardContent className="p-4 flex flex-col gap-3">
                          <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground/20">
                             <HugeiconsIcon icon={ShoppingBag01Icon} size={32} />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{p.name}</h4>
                             <p className="text-xs text-muted-foreground">{p.cat}</p>
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                             <span className="font-black text-sm">₹{p.price}</span>
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${p.stock < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                {p.stock} in stock
                             </span>
                          </div>
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </ScrollArea>
        </main>

        {/* Right Panel: Cart/Checkout */}
        <aside className="w-[400px] flex flex-col bg-background border-l border-border shrink-0">
           <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="text-primary" />
                 <h2 className="text-lg font-bold tracking-tight">Current Order</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-2 rounded-full h-9">
                 <HugeiconsIcon icon={Delete01Icon} size={16} />
                 Clear
              </Button>
           </div>
           
           <ScrollArea className="flex-1">
              <div className="p-6 flex flex-col gap-4">
                 {[
                    { name: "Espresso", qty: 2, price: 240 },
                    { name: "Chicken Sandwich", qty: 1, price: 240 },
                    { name: "Blueberry Muffin", qty: 3, price: 450 },
                 ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                       <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm">{item.name}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-xs text-muted-foreground">₹{item.price / item.qty} × {item.qty}</span>
                             <button className="text-[10px] font-bold uppercase text-primary tracking-widest hover:underline">Edit</button>
                          </div>
                       </div>
                       <span className="font-bold text-sm">₹{item.price}</span>
                    </div>
                 ))}
                 
                 {/* Empty State Mock */}
                 {/*
                 <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-50">
                    <HugeiconsIcon icon={ShoppingCart01Icon} size={48} />
                    <p className="text-sm font-medium">No items added yet</p>
                 </div>
                 */}
              </div>
           </ScrollArea>
           
           <div className="p-6 bg-muted/20 flex flex-col gap-4 rounded-t-[32px] border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] pt-8 mt-auto">
              <div className="flex flex-col gap-2">
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹930.00</span>
                 </div>
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (5% GST)</span>
                    <span>₹46.50</span>
                 </div>
                 <div className="flex justify-between text-xl font-black mt-2">
                    <span>Total</span>
                    <span className="text-primary font-heading">₹976.50</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                 <Button variant="outline" className="h-14 rounded-2xl font-bold flex flex-col gap-1 items-center justify-center border-2 border-border/50 hover:border-primary/30">
                    <HugeiconsIcon icon={CalculatorIcon} size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Hold Order</span>
                 </Button>
                 <Button className="h-14 rounded-2xl font-bold flex flex-col gap-1 items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 shadow-xl shadow-green-600/10">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Pay Now</span>
                 </Button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
