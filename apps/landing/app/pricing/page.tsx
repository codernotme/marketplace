import { Button } from "@/components/ui/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Simple, transparent pricing for businesses of all sizes.",
};

const plans = [
  {
    name: "Starter",
    price: "₹299",
    description: "Perfect for single location shops and small startups.",
    features: [
      "1 Managed Store",
      "Unlimited Products",
      "Standard POS",
      "Basic Analytics",
      "2% Transaction Fee",
      "Email Support",
    ],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Growth",
    price: "₹999",
    description: "Ideal for growing brands with multiple sales channels.",
    features: [
      "Up to 5 Stores",
      "Omnichannel Sync",
      "Advanced POS Features",
      "Customer Loyalty Program",
      "1.5% Transaction Fee",
      "Priority Support",
      "Marketing Automations",
    ],
    cta: "Try 14 days free",
    popular: true,
  },
  {
    name: "Pro",
    price: "₹2,999",
    description: "For high-volume merchants and complex marketplaces.",
    features: [
      "Unlimited Stores",
      "Marketplace Engine",
      "Custom Checkouts",
      "Advanced Inventory Logic",
      "1.0% Transaction Fee",
      "24/7 Dedicated Support",
      "Dedicated account manager",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="flex flex-col items-center text-center gap-6 mb-20">
        <h1 className="font-heading text-5xl md:text-6xl font-black tracking-tight">Simple Pricing.</h1>
        <p className="text-muted-foreground text-xl max-w-2xl">
          Scale from your first sale to your millionth without hidden costs or technical overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col border-border/50 relative overflow-hidden rounded-[32px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-primary ring-1 ring-primary shadow-xl shadow-primary/5' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 py-1.5 px-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl">
                Most Popular
              </div>
            )}
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-2 leading-relaxed">
                {plan.description}
              </CardDescription>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-muted-foreground font-medium text-lg">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1">
              <div className="flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-primary mt-0.5" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
               <Button 
                variant={plan.popular ? "default" : "outline"} 
                className={`h-14 w-full rounded-full text-base font-bold transition-all ${plan.popular ? 'shadow-lg shadow-primary/20' : ''}`}
               >
                 {plan.cta}
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Enterprise CTA */}
      <div className="mt-24 p-12 bg-muted/30 rounded-[40px] border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
         <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">Need something custom?</h3>
            <p className="text-muted-foreground max-w-md">
               Looking for white-label solutions, on-premise deployment, or custom marketplace algorithms?
            </p>
         </div>
         <Button variant="outline" size="lg" className="h-14 px-10 rounded-full font-bold group">
            Contact Enterprise Sales
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" className="group-hover:translate-x-1 transition-transform" />
         </Button>
      </div>
    </div>
  );
}
