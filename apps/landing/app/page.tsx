import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowRight01Icon, 
  Store01Icon, 
  ShoppingBag01Icon, 
  Agreement01Icon,
  GlobalIcon,
  DashboardSquare01Icon,
  SecurityIcon,
  FlashIcon
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";

export default function LandingHomePage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-32">
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center gap-8">
           <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-2 duration-1000 px-4 py-1.5 rounded-full bg-primary/5 text-primary border-primary/20 text-xs font-bold uppercase tracking-widest">
              Available now across India
           </Badge>
           <h1 className="animate-in fade-in slide-in-from-bottom-3 duration-1000 delay-100 font-heading text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl">
             Commerce at the <br />
             <span className="text-primary italic">speed</span> of light.
           </h1>
           <p className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
             The only platform that bridges the gap between your physical store, online marketplace, and enterprise operations. Built for the next billion users.
           </p>
           <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300 flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="h-14 px-10 rounded-full text-base font-bold shadow-2xl shadow-primary/30">
                 Launch your shop
                 <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-base font-bold bg-background/50 backdrop-blur-sm">
                 Book a demo
              </Button>
           </div>
           
           {/* Mockup / Visual */}
           <div className="mt-20 w-full max-w-6xl aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[32px] border border-border/50 shadow-2xl relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
              <div className="relative flex items-center justify-center gap-8">
                 <HugeiconsIcon icon={DashboardSquare01Icon} size={160} className="text-primary/20 group-hover:scale-110 transition-transform duration-700" />
                 <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-primary/20 rounded-full" />
                    <div className="h-4 w-48 bg-primary/10 rounded-full" />
                    <div className="h-4 w-24 bg-primary/5 rounded-full" />
                 </div>
              </div>
              {/* Floating badges */}
              <div className="absolute top-1/4 left-10 p-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-border shadow-lg hidden lg:block animate-bounce-subtle">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 font-bold">₹</div>
                    <div>
                       <p className="text-xs font-bold tracking-tight">+14.2% Growth</p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Real-time GMV</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 md:px-8">
         <div className="flex flex-col items-center text-center gap-4 mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">One platform. Infinite scale.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
               We've consolidated the entire commerce stack so you can focus on building your brand.
            </p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { 
                 title: "Hyper-local POS", 
                 desc: "Blazing fast point of sale that works offline and syncs instantly when you're back.", 
                 icon: Store01Icon, 
                 color: "bg-blue-500" 
               },
               { 
                 title: "Enterprise Multi-tenant", 
                 desc: "Run thousands of independent stores under one umbrella with isolated data and unified billing.", 
                 icon: GlobalIcon, 
                 color: "bg-purple-500" 
               },
               { 
                 title: "Marketplace Engine", 
                 desc: "Power complex multi-vendor ecosystems with automated split payments and shipping orchestration.", 
                 icon: ShoppingBag01Icon, 
                 color: "bg-indigo-500" 
               },
               { 
                 title: "Deep Analytics", 
                 desc: "Get actionable insights across every touchpoint, from customer churn to inventory velocity.", 
                 icon: DashboardSquare01Icon, 
                 color: "bg-emerald-500" 
               },
               { 
                 title: "Fortified Security", 
                 desc: "Bank-grade encryption, PCI compliance, and role-based access control built-in from day one.", 
                 icon: SecurityIcon, 
                 color: "bg-rose-500" 
               },
               { 
                 title: "Modern Tech Stack", 
                 desc: "Built on Next.js, tRPC, and Supabase for ultimate performance and developer experience.", 
                 icon: FlashIcon, 
                 color: "bg-amber-500" 
               },
            ].map((f) => (
               <Card key={f.title} className="border-border/50 bg-muted/20 hover:bg-muted/40 transition-all duration-300 group cursor-default">
                  <CardContent className="p-8 flex flex-col gap-4">
                     <div className={`size-12 rounded-2xl ${f.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                        <HugeiconsIcon icon={f.icon} size={24} />
                     </div>
                     <h3 className="text-xl font-bold tracking-tight mt-2">{f.title}</h3>
                     <p className="text-muted-foreground leading-relaxed text-sm">
                        {f.desc}
                     </p>
                  </CardContent>
               </Card>
            ))}
         </div>
      </section>

      {/* Trust / Stats */}
      <section className="bg-muted/30 py-24">
         <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
               <p className="font-heading text-5xl font-black tracking-tight mb-2">1.2M+</p>
               <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Weekly Transactions</p>
            </div>
            <div>
               <p className="font-heading text-5xl font-black tracking-tight mb-2">₹480Cr</p>
               <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Monthly GMV</p>
            </div>
            <div>
               <p className="font-heading text-5xl font-black tracking-tight mb-2">14,200</p>
               <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Active Merchants</p>
            </div>
            <div>
               <p className="font-heading text-5xl font-black tracking-tight mb-2">99.99%</p>
               <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Platform Uptime</p>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8">
         <div className="bg-primary rounded-[48px] p-8 md:p-24 text-primary-foreground text-center relative overflow-hidden flex flex-col items-center gap-8">
            <h2 className="font-heading text-4xl md:text-7xl font-bold tracking-tight max-w-4xl z-10">
               Ready to build the future of commerce?
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl z-10">
               Join thousands of businesses already scaling on themrktplace. No credit card required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 z-10">
               <Button size="lg" variant="secondary" className="h-16 px-12 rounded-full text-lg font-bold">
                  Start for free
               </Button>
               <Button variant="outline" size="lg" className="h-16 px-12 rounded-full text-lg font-bold bg-white/5 border-white/20 hover:bg-white/10 hover:text-white">
                  Talk to sales
               </Button>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
         </div>
      </section>
    </div>
  );
}
