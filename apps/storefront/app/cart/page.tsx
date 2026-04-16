import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, ShoppingCart01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your items before checkout.",
};

const cartItems = [
  { id: 1, name: "Minimalist Desk Lamp", price: 4299, category: "Lighting", quantity: 1 },
  { id: 2, name: "Ceramic Coffee Set", price: 1899, category: "Kitchen", quantity: 2 },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="font-heading text-4xl font-bold tracking-tight mb-10">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-border group">
                  <div className="w-24 h-32 bg-muted/30 rounded-xl flex items-center justify-center text-muted-foreground/30 shrink-0">
                     <HugeiconsIcon icon={ShoppingCart01Icon} size={32} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{item.category}</p>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                      </div>
                      <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-full h-10 px-1">
                         <button className="w-8 h-full flex items-center justify-center hover:bg-muted rounded-full">−</button>
                         <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                         <button className="w-8 h-full flex items-center justify-center hover:bg-muted rounded-full">+</button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                         <HugeiconsIcon icon={Delete01Icon} size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Continue Shopping
                </Button>
                <Button variant="outline" className="text-muted-foreground">
                  Update Cart
                </Button>
              </div>
            </>
          ) : (
            <div className="py-20 flex flex-col items-center gap-6 text-center">
               <div className="size-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={40} />
               </div>
               <div>
                  <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
                  <p className="text-muted-foreground mt-2">Looks like you haven't added anything yet.</p>
               </div>
               <Button size="lg" className="rounded-full px-8 mt-4">Browse Catalog</Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="border-border/50 bg-muted/20 shadow-none rounded-[24px] sticky top-28">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-medium">₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button size="lg" className="h-14 w-full rounded-full text-base font-bold" asChild>
                <a href="/checkout">
                  Proceed to Checkout
                  <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
