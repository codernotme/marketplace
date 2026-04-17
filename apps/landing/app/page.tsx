import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowRight01Icon, 
  Store01Icon, 
  ShoppingBag01Icon, 
  GlobalIcon,
  DashboardSquare01Icon,
  SecurityIcon,
  FlashIcon,
  CrownIcon,
  Diamond01Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function LandingHomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-24 pb-24 bg-[#FAFAFA] dark:bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FFE066]/40 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-overlay -z-10 animate-pulse" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#8CE0D8]/40 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-overlay -z-10" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center gap-8">
           <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-2 duration-1000 px-5 py-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-foreground border-border/50 text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="flex items-center gap-2">
                 <HugeiconsIcon icon={CrownIcon} size={16} className="text-amber-500" />
                 Presenting The All-New Marketplace
              </span>
           </Badge>

           <h1 className="animate-in fade-in slide-in-from-bottom-3 duration-1000 delay-100 font-heading text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.85] max-w-5xl text-balance">
             Boldly <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Built.</span> <br />
             Fiercely Branded.
           </h1>
           
           <p className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mt-4">
             The only platform that bridges the gap between your physical store, online marketplace, and enterprise operations with uncompromising luxury.
           </p>
           
           <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300 flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="h-16 px-12 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-transform bg-foreground text-background">
                 Explore Storefront
                 <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" className="ml-2" />
              </Button>
           </div>
        </div>
      </section>

      {/* Colorful Bento Grid Section */}
      <section id="features" className="container mx-auto px-4 md:px-8">
         <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Feature 1: Large Left */}
            <div className="md:col-span-2 md:row-span-2 bg-[#F1F6F9] dark:bg-card p-10 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-sm border border-border/10">
               <div className="relative z-10">
                  <div className="size-16 rounded-3xl bg-blue-500 flex items-center justify-center text-white mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-blue-500/20">
                     <HugeiconsIcon icon={Store01Icon} size={32} />
                  </div>
                  <h3 className="text-4xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white">Hyper-local POS</h3>
                  <p className="text-slate-600 dark:text-muted-foreground text-lg leading-relaxed max-w-md">
                     Blazing fast point of sale that works completely offline and synchronizes your inventory the moment you reconnect.
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[80px] group-hover:bg-blue-400/30 transition-colors duration-500 z-0" />
            </div>

            {/* Feature 2: Top Right Small */}
            <div className="md:col-span-1 md:row-span-1 bg-[#FFF9E6] dark:bg-card p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-sm border border-border/10">
               <div className="relative z-10">
                  <div className="size-14 rounded-3xl bg-amber-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                     <HugeiconsIcon icon={GlobalIcon} size={28} />
                  </div>
                  <h3 className="text-2xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Multi-tenant</h3>
                  <p className="text-slate-600 dark:text-muted-foreground mt-2">One umbrella, thousands of isolated stores.</p>
               </div>
            </div>

            {/* Feature 3: Top Right Small */}
            <div className="md:col-span-1 md:row-span-1 bg-[#FDF0ED] dark:bg-card p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-sm border border-border/10">
               <div className="relative z-10">
                  <div className="size-14 rounded-3xl bg-rose-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                     <HugeiconsIcon icon={FlashIcon} size={28} />
                  </div>
                  <h3 className="text-2xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Performance</h3>
                  <p className="text-slate-600 dark:text-muted-foreground mt-2">Built on Next.js 15 routing.</p>
               </div>
            </div>

            {/* Feature 4: Bottom Right Wide */}
            <div className="md:col-span-2 md:row-span-1 bg-[#E8F5E9] dark:bg-card p-8 rounded-[40px] flex flex-row items-center justify-between group overflow-hidden relative shadow-sm border border-border/10">
               <div className="relative z-10 max-w-[60%]">
                  <div className="size-14 rounded-3xl bg-emerald-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                     <HugeiconsIcon icon={Diamond01Icon} size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Luxury & Scalability</h3>
               </div>
               <div className="absolute top-1/2 right-10 -translate-y-1/2 h-32 w-32 bg-emerald-500/20 blur-[50px] rounded-full" />
            </div>
         </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-24">
         <div className="container mx-auto px-4 md:px-8">
            <div className="bg-foreground text-background rounded-[48px] p-12 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
               <div className="relative z-10 flex flex-col gap-2">
                  <p className="font-heading text-6xl md:text-8xl font-black tracking-tighter">1.2M</p>
                  <p className="text-sm uppercase font-bold tracking-widest text-background/60">Weekly Transactions</p>
               </div>
               <div className="relative z-10 flex flex-col gap-2">
                  <p className="font-heading text-6xl md:text-8xl font-black tracking-tighter">480M</p>
                  <p className="text-sm uppercase font-bold tracking-widest text-background/60">Monthly Volume (USD)</p>
               </div>
               <div className="relative z-10 flex flex-col gap-2">
                  <p className="font-heading text-6xl md:text-8xl font-black tracking-tighter">99.9%</p>
                  <p className="text-sm uppercase font-bold tracking-widest text-background/60">Uptime SLA</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8">
         <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[48px] p-12 md:p-24 text-white text-center relative overflow-hidden flex flex-col items-center gap-10">
            <h2 className="font-heading text-5xl md:text-7xl font-black tracking-tight max-w-4xl z-10 leading-tight">
               Build your empire with us.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 z-10">
               <Link href="http://localhost:3000" target="_blank">
                  <Button size="lg" variant="secondary" className="h-16 px-12 rounded-full text-lg font-bold text-slate-900 bg-white hover:bg-white/90 hover:scale-105 transition-all">
                     View Demo Storefront
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
