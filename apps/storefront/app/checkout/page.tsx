import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCard01Icon, Location01Icon, DeliveryTruck01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Securely complete your purchase.",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Step 1: Shipping */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">1</div>
                <h2 className="text-2xl font-bold tracking-tight">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" />
                 </div>
                 <div className="flex flex-col gap-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St, Apartment 4B" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" />
                 </div>
                 <div className="flex flex-col gap-2 text-sm">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" placeholder="400001" />
                 </div>
              </div>
            </section>

            <Separator />

            {/* Step 2: Delivery */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">2</div>
                <h2 className="text-2xl font-bold tracking-tight">Delivery Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-primary bg-primary/5 cursor-pointer relative overflow-hidden">
                   <CardContent className="p-4 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-sm">Standard Delivery</span>
                         <span className="font-bold text-sm">₹150</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Arrives in 3-5 business days</p>
                   </CardContent>
                </Card>
                <Card className="border-border hover:border-primary/50 cursor-pointer transition-colors">
                   <CardContent className="p-4 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-sm">Express Shipping</span>
                         <span className="font-bold text-sm">₹450</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Arrives in 1-2 business days</p>
                   </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Step 3: Payment */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">3</div>
                <h2 className="text-2xl font-bold tracking-tight">Payment Method</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                 <Card className="border-border p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <Badge variant="outline" className="h-10 px-4 rounded-lg bg-muted/50 border-primary font-bold">Razorpay</Badge>
                       <span className="text-sm text-muted-foreground">Pay securely via UPI, Cards, or Netbanking</span>
                    </div>
                    <p className="text-xs text-muted-foreground">You will be redirected to Razorpay to complete your payment securely.</p>
                 </Card>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
             <Card className="border-border shadow-none rounded-[24px] sticky top-28 bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">Your Order</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                   <div className="flex flex-col gap-3">
                      {[
                        { name: "Minimalist Desk Lamp", price: "₹4,299", qty: 1 },
                        { name: "Ceramic Coffee Set", price: "₹3,798", qty: 2 },
                      ].map((item) => (
                        <div key={item.name} className="flex justify-between items-start gap-4 text-sm">
                           <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground">Qty: {item.qty}</span>
                           </div>
                           <span className="font-semibold">{item.price}</span>
                        </div>
                      ))}
                   </div>
                   <Separator />
                   <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹8,097</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>₹150</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Estimated Tax</span>
                        <span>₹405</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mt-2">
                        <span>Total</span>
                        <span>₹8,652</span>
                      </div>
                   </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button size="lg" className="h-14 w-full rounded-full text-base font-bold shadow-xl shadow-primary/20">
                     Complete Purchase
                  </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
