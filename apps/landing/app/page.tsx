"use client";
import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ChartBarLineIcon, FlashIcon, Settings03Icon, GlobalIcon, ArrowRight01Icon, Mouse01Icon, Store01Icon, PackageIcon, CpuIcon, CreditCardIcon, Tick02Icon, AgreementIcon } from "@hugeicons/core-free-icons";

// ─── Decorative Components ───────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

function Orb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("absolute rounded-full blur-[120px] pointer-events-none", className)}
      style={style}
    />
  );
}

// ─── Hero Components ─────────────────────────────────────────────────────────

function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-24 group px-4">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A84C]/20 to-[#8B5CF6]/20 rounded-[32px] blur-3xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
      <div className="relative bg-[#0A0A0A] border border-[#1a1a1a] rounded-[24px] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Mockup Header */}
        <div className="h-10 border-b border-[#1a1a1a] flex items-center px-6 justify-between bg-[#0e0e0e]">
          <div className="flex gap-1.5">
            <div className="size-2 rounded-full bg-[#333]"></div>
            <div className="size-2 rounded-full bg-[#333]"></div>
            <div className="size-2 rounded-full bg-[#333]"></div>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-1.5 w-24 bg-[#1a1a1a] rounded-full"></div>
             <div className="size-5 rounded-full bg-[#1a1a1a]"></div>
          </div>
        </div>
        
        {/* Mockup Body */}
        <div className="p-8 grid grid-cols-12 gap-8 bg-gradient-to-b from-[#0e0e0e] to-black">
          {/* Main Chart Section */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-[#111]/50 border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden group/chart">
               <div className="flex justify-between mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#555] font-black uppercase tracking-widest">Gross Merchandise Volume</p>
                    <h4 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>$482,904.00</h4>
                  </div>
                  <div className="size-10 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/10 flex items-center justify-center">
                    <HugeiconsIcon icon={ChartBarLineIcon} className="size-5 text-[#C9A84C]" />
                  </div>
               </div>
               <div className="flex items-end gap-1.5 h-32">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100, 80, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#C9A84C]/20 rounded-t-md hover:bg-[#C9A84C]/40 transition-colors" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
            </div>
            
            {/* Secondary Widgets */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-[#111]/30 border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-1.5 w-12 bg-[#333] rounded-full"></div>
                    <div className="size-4 rounded bg-[#1a1a1a]"></div>
                  </div>
                  <div className="h-4 w-24 bg-white/5 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#8B5CF6]"></div>
                    </div>
                    <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-[#C9A84C]"></div>
                    </div>
                  </div>
               </div>
               <div className="bg-[#111]/30 border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-1.5 w-12 bg-[#333] rounded-full"></div>
                    <div className="size-4 rounded bg-[#1a1a1a]"></div>
                  </div>
                  <div className="h-4 w-24 bg-white/5 rounded"></div>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="size-6 rounded-full bg-[#1a1a1a] border border-white/5"></div>)}
                  </div>
               </div>
            </div>
          </div>
          
          {/* Sidebar Section */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <div className="flex-1 bg-gradient-to-br from-[#1a1a1a]/40 to-transparent border border-[#1a1a1a] rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="size-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
                     <HugeiconsIcon icon={FlashIcon} className="size-6 text-[#8B5CF6]" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-3/4 bg-[#222] rounded-full"></div>
                    <div className="h-2 w-1/2 bg-[#222] rounded-full"></div>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#1a1a1a]">
                   <div className="h-10 w-full bg-[#1a1a1a] rounded-xl flex items-center px-4">
                      <div className="h-1.5 w-20 bg-[#333] rounded-full"></div>
                   </div>
                </div>
             </div>
             <div className="h-48 bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-2xl p-6 overflow-hidden relative group/alert">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="size-8 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                    <HugeiconsIcon icon={Settings03Icon} className="size-4 text-[#080808]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-sm">System Healthy</p>
                    <p className="text-[#888] text-[10px]">All tenants operational</p>
                  </div>
                </div>
                <HugeiconsIcon icon={GlobalIcon} className="absolute -right-8 -bottom-8 size-32 text-[#C9A84C]/5" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808]">
      <Orb className="w-[1000px] h-[1000px] bg-[#C9A84C] -top-[500px] -left-[300px]" style={{ opacity: 0.08 }} />
      <Orb className="w-[800px] h-[800px] bg-[#8B5CF6] bottom-0 -right-[400px]" style={{ opacity: 0.05 }} />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-[#C9A84C] text-[10px] uppercase tracking-[0.25em] font-black mb-12 animate-in">
          <HugeiconsIcon icon={FlashIcon} className="size-3.5 fill-[#C9A84C]" />
          The Modern Commerce OS for India
        </div>

        <h1 
          className="text-white font-black leading-[0.8] tracking-[-0.06em] mb-10 transition-all duration-1000"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(60px, 14vw, 180px)" }}
        >
          BUILD <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>EMPIRES</span>
        </h1>

        <p className="max-w-2xl mx-auto text-[#888] text-lg md:text-2xl leading-relaxed mb-14 font-medium">
          The unified infrastructure layer for physical retail, online stores, and global marketplaces. Fully multi-tenant, hyper-scalable, and built for performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button className="rounded-full px-12 h-16 font-black bg-[#C9A84C] text-[#080808] text-xl hover:bg-[#E0BF6A] transition-all hover:scale-105 shadow-2xl shadow-[#C9A84C]/20">
            Get Started Free
            <HugeiconsIcon icon={ArrowRight01Icon} className="ms-2 size-6" />
          </Button>
          <a href="#platform" className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors font-bold tracking-widest uppercase text-xs">
            View Platform
            <HugeiconsIcon icon={Mouse01Icon} className="size-5 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>

        <HeroDashboardMockup />
      </div>
    </section>
  );
}

// ─── Bento Grid Section ──────────────────────────────────────────────────────

function FeaturesBento() {
  return (
    <section id="features" className="py-40 bg-[#080808]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <span className="text-[#C9A84C] text-xs font-black uppercase tracking-[0.3em]">Core Modules</span>
            <h2 className="text-white font-black text-5xl md:text-7xl leading-[0.9] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Functional <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1px #C9A84C" }}>Elegance.</span>
            </h2>
          </div>
          <p className="text-[#666] text-xl max-w-sm leading-relaxed">
            Every feature is engineered to remove friction and amplify your growth. No fluff, just results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 h-auto md:h-[800px]">
          {/* Main Large Card */}
          <div className="md:col-span-4 lg:col-span-3 bg-[#0D0D0D] border border-[#1a1a1a] rounded-[32px] p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="size-14 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
                  <HugeiconsIcon icon={Store01Icon} className="size-7 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-white text-3xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Unified POS</h3>
                  <p className="text-[#888] text-lg leading-relaxed max-w-xs transition-colors group-hover:text-[#aaa]">
                    Bridging physical retail and digital sync with zero latency. Even when the internet dies.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-[#C9A84C] text-[10px] font-black uppercase tracking-widest">Offline-First</span>
                <span className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-[#555] text-[10px] font-black uppercase tracking-widest transition-colors group-hover:text-[#888]">Sync Engine</span>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 size-80 bg-[#C9A84C]/5 rounded-full blur-3xl group-hover:bg-[#C9A84C]/10 transition-all duration-700"></div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 bg-[#0D0D0D] border border-[#1a1a1a] rounded-[32px] p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10 space-y-6">
              <div className="size-14 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center border border-[#EC4899]/20">
                <HugeiconsIcon icon={PackageIcon} className="size-7 text-[#EC4899]" />
              </div>
              <h3 className="text-white text-3xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Multi-Tenant SaaS</h3>
              <p className="text-[#888] text-lg leading-relaxed group-hover:text-[#aaa]">
                Isolate merchant data with PostgreSQL RLS. Custom domains and white-labeling baked into the core.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8">
               <div className="size-2 rounded-full bg-[#EC4899] animate-pulse"></div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2 bg-[#0D0D0D] border border-[#1a1a1a] rounded-[32px] p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
             <HugeiconsIcon icon={GlobalIcon} className="size-10 text-[#10B981]" />
             <h4 className="text-white text-xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Global Ready</h4>
             <p className="text-[#666] text-sm leading-relaxed group-hover:text-[#888]">Localized payments, tax calculation, and multi-currency support.</p>
          </div>

          <div className="md:col-span-2 lg:col-span-2 bg-[#0D0D0D] border border-[#1a1a1a] rounded-[32px] p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
             <HugeiconsIcon icon={CpuIcon} className="size-10 text-[#06B6D4]" />
             <h4 className="text-white text-xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>AI Insights</h4>
             <p className="text-[#666] text-sm leading-relaxed group-hover:text-[#888]">Predict inventory needs and detect patterns using advanced ML models.</p>
          </div>

          <div className="md:col-span-4 lg:col-span-2 bg-[#0D0D0D] border border-[#1a1a1a] rounded-[32px] p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform duration-500">
             <HugeiconsIcon icon={CreditCardIcon} className="size-10 text-[#8B5CF6]" />
             <h4 className="text-white text-xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Fluid Billing</h4>
             <p className="text-[#666] text-sm leading-relaxed group-hover:text-[#888]">Prorated upgrades, usage gating, and automated invoicing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Platform Selection UI ───────────────────────────────────────────────────

function PlatformShowcase() {
  const [active, setActive] = useState(0);
  const platforms = [
    { title: "Master Admin", icon: Settings03Icon, color: "#C9A84C", desc: "The command center for your entire platform. Manage tenants, billing, and global metrics." },
    { title: "Merchant Hub", icon: Store01Icon, color: "#8B5CF6", desc: "Inventory management, order fulfillment, and marketing tools for your sellers." },
    { title: "Storefront", icon: GlobalIcon, color: "#10B981", desc: "Lightning fast, SEO optimized customer experiences across every device." },
    { title: "POS Terminal", icon: PackageIcon, color: "#EC4899", desc: "Native terminal application for in-person transactions with full hardware support." }
  ];

  return (
    <section id="platform" className="py-40 bg-black border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <h2 className="text-white font-black text-4xl md:text-7xl leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Four Modules. <br />
            <span className="text-[#444]">One Ecosystem.</span>
          </h2>
          <p className="text-[#777] text-xl font-medium">Modular by design. Unified by data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            {platforms.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-full text-left p-8 rounded-[24px] transition-all duration-500 flex items-center justify-between group",
                  active === i 
                    ? "bg-[#111] border border-white/10 shadow-2xl" 
                    : "opacity-40 hover:opacity-100"
                )}
              >
                <div className="flex gap-6 items-center">
                  <div className={cn("size-12 rounded-xl flex items-center justify-center transition-colors", active === i ? "bg-white/5" : "bg-transparent")}>
                    <HugeiconsIcon icon={p.icon} className={cn("size-6 transition-colors", active === i ? "text-white" : "text-[#555]")} />
                  </div>
                  <span className={cn("text-xl font-black tracking-tight", active === i ? "text-white" : "text-[#888]")} style={{ fontFamily: "'Syne', sans-serif" }}>{p.title}</span>
                </div>
                {active === i && <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 text-white" />}
              </button>
            ))}
          </div>
          
          <div className="lg:col-span-7 aspect-video bg-[#0D0D0D] border border-white/5 rounded-[40px] p-12 relative flex flex-col justify-center overflow-hidden">
             <div 
               className="absolute inset-0 transition-all duration-700 opacity-20 blur-3xl scale-110" 
               style={{ background: `radial-gradient(circle at center, ${platforms[active].color}20, transparent)` }}
             ></div>
             <div className="relative z-10 space-y-8 animate-in">
                <span className="text-[8px] font-black tracking-[0.4em] uppercase text-[#555]">Module Preview</span>
                <h3 className="text-white text-4xl md:text-5xl font-black leading-[0.9]" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {platforms[active].title}
                </h3>
                <p className="text-[#888] text-xl leading-relaxed max-w-lg">
                  {platforms[active].desc}
                </p>
                <Button className="rounded-full px-10 h-14 bg-white text-black font-black hover:bg-white/90">
                  Explore Module
                </Button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ─────────────────────────────────────────────────────────

const plans = [
  { name: "Starter", price: "49", target: "Indie stores" },
  { name: "Growth", price: "199", target: "Scaling Brands", premium: true },
  { name: "Enterprise", price: "Custom", target: "Global Orgs" }
];

function PricingSection() {
  return (
    <section id="pricing" className="py-40 bg-[#080808]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-white font-black text-5xl md:text-8xl leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
            Scale at your <br />
            <span className="text-[#C9A84C]">own pace.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={cn(
                "rounded-[40px] p-10 border transition-all duration-500 group",
                p.premium 
                  ? "bg-[#0A0A0A] border-[#C9A84C]/30 shadow-2xl shadow-[#C9A84C]/5" 
                  : "bg-transparent border-[#1a1a1a] hover:border-white/10"
              )}
            >
              <div className="flex flex-col h-full justify-between gap-12">
                <div className="space-y-6">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#555]">{p.target}</span>
                  <div className="space-y-2">
                    <h4 className="text-white text-3xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>{p.name}</h4>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {p.price !== "Custom" && "$"}
                        {p.price}
                      </span>
                      {p.price !== "Custom" && <span className="text-[#555] text-sm mb-1 font-bold">/mo</span>}
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[1,2,3,4].map(j => (
                      <li key={j} className="flex gap-3 items-center text-[#777] text-sm group-hover:text-[#aaa] transition-colors">
                        <HugeiconsIcon icon={Tick02Icon} size={14} className="text-[#C9A84C]" />
                        <span>Advanced platform feature {j}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={cn("rounded-full h-14 font-black transition-all", p.premium ? "bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90" : "bg-black text-white border border-[#222] hover:border-white/20")}>
                  {p.price === "Custom" ? "Contact Sales" : "Start Trial"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-40 px-6">
       <div className="max-w-6xl mx-auto rounded-[60px] bg-gradient-to-b from-[#111] to-black border border-white/5 p-16 md:p-32 text-center relative overflow-hidden">
          <Orb className="w-[600px] h-[600px] bg-[#C9A84C] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.05 }} />
          <div className="relative z-10 space-y-10">
            <h2 className="text-white font-black text-5xl md:text-9xl tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>
              BUILD THE <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1px #8B5CF6" }}>FUTURE.</span>
            </h2>
            <p className="text-[#666] text-xl md:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
              Join the elite retail network bringing India's commerce into the next decade.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Button className="rounded-full h-16 px-12 bg-[#8B5CF6] text-white font-black text-lg hover:bg-[#8B5CF6]/90 transition-all hover:scale-105 flex items-center gap-3">
                 Get Started
                 <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
               </Button>
               <Button variant="outline" className="rounded-full h-16 px-12 border-[#222] text-white font-black text-lg hover:bg-white/5 transition-all flex items-center gap-3">
                 Book a Demo
                 <HugeiconsIcon icon={AgreementIcon} size={24} />
               </Button>
            </div>
          </div>
       </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="selection:bg-[#C9A84C]/30 selection:text-[#C9A84C]">
      <style jsx global>{`
        .animate-in {
          animation: fade-up 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A84C; }
        
        body { -webkit-font-smoothing: antialiased; }
      `}</style>
      
      <NoiseOverlay />
      <main className="relative z-10">
        <Hero />
        <FeaturesBento />
        <PlatformShowcase />
        <PricingSection />
        <CTA />
      </main>
    </div>
  );
}