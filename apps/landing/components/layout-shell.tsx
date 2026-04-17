"use client";

import { useState, useEffect } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { ArrowRight01Icon, Cancel01Icon, Menu01Icon, GithubIcon, TwitterIcon, Linkedin01Icon } from "@hugeicons/core-free-icons";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 z-[100] w-full transition-all duration-500",
      scrolled ? "bg-black/90 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent py-6"
    )}>
      <div className="container flex items-center justify-between mx-auto px-6 md:px-8">
        <a href="/" className="flex flex-col leading-none group transition-transform hover:scale-105 active:scale-95">
          <span className="text-white text-2xl font-black tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>themrktplace</span>
          <span className="text-[#C9A84C] text-[9px] tracking-[0.25em] uppercase font-black">by Tackle Studioz</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          <a href="#features" className="transition-all hover:text-[#C9A84C] hover:translate-y-[-1px]">Features</a>
          <a href="#platform" className="transition-all hover:text-[#C9A84C] hover:translate-y-[-1px]">Platform</a>
          <a href="#pricing" className="transition-all hover:text-[#C9A84C] hover:translate-y-[-1px]">Pricing</a>
          <a href="/docs" className="transition-all hover:text-white hover:translate-y-[-1px]">Docs</a>
        </nav>

        <div className="flex items-center gap-6">
          <a href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors hidden sm:block">Log in</a>
          <Button className="rounded-full px-8 h-12 font-black bg-[#C9A84C] text-[#080808] text-[10px] uppercase tracking-[0.15em] hover:bg-[#E0BF6A] transition-all hover:scale-105 flex items-center gap-2 border-none shadow-xl shadow-[#C9A84C]/10">
            Get Started
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
          
          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[65px] bg-black z-40 md:hidden animate-in fade-in slide-in-from-top-4">
           <div className="flex flex-col p-10 gap-10">
              {["Features", "Platform", "Pricing", "Docs"].map((l, i) => (
                <a 
                  key={l} 
                  href={`#${l.toLowerCase()}`} 
                  className="text-4xl font-black tracking-tighter text-white animate-in" 
                  style={{ fontFamily: "'Syne', sans-serif", animationDelay: `${i * 100}ms` }}
                  onClick={() => setMobileOpen(false)}
                >
                  {l}
                </a>
              ))}
              <Separator className="bg-white/5" />
              <Button className="w-full rounded-2xl h-20 bg-[#C9A84C] text-black font-black text-xl uppercase tracking-widest shadow-2xl shadow-[#C9A84C]/20">
                Get Started
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
              </Button>
           </div>
        </div>
      )}
    </header>
  );
}

export function MainFooter() {
  return (
    <footer className="py-24 bg-[#050505] border-t border-white/5 relative z-10 overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 size-[500px] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />
       
       <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 text-left">
             <div className="space-y-8 flex flex-col items-start">
               <div className="flex flex-col leading-none">
                  <span className="font-black text-white tracking-tighter text-3xl" style={{ fontFamily: "'Syne', sans-serif" }}>themrktplace</span>
                  <span className="text-[#C9A84C] text-[10px] tracking-[0.4em] uppercase font-black">By Tackle Studioz</span>
               </div>
               <p className="text-[#555] text-sm leading-relaxed max-w-xs font-medium">
                 The only OS your commerce operation will ever need. Engineering excellence for modern builders and high-growth platforms.
               </p>
               <div className="flex gap-4 pt-2">
                  {[GithubIcon, TwitterIcon, Linkedin01Icon].map((Icon, i) => (
                    <a key={i} href="#" className="p-3 bg-white/5 rounded-xl text-[#555] hover:text-white hover:bg-[#C9A84C]/20 transition-all border border-white/5">
                       <HugeiconsIcon icon={Icon} size={18} />
                    </a>
                  ))}
               </div>
             </div>
             
             {[
               { title: "Platform", links: ["SaaS Admin", "Merchant Hub", "Storefront", "POS Terminal"] },
               { title: "Resources", links: ["Documentation", "API Reference", "Status Page", "Changelog"] },
               { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] }
             ].map((col) => (
               <div key={col.title} className="space-y-8">
                 <h5 className="text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-30">{col.title}</h5>
                 <ul className="space-y-5">
                   {col.links.map(l => (
                     <li key={l}>
                       <a href="#" className="text-[#444] hover:text-white transition-all text-sm font-bold flex items-center group">
                         <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden text-[#C9A84C]">
                           <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="mr-2" />
                         </span>
                         {l}
                       </a>
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
             <div className="flex flex-col md:flex-row items-center gap-4">
               <p className="text-[#333] text-[10px] font-black uppercase tracking-[0.2em]">© 2025 Tackle Studioz. Engineered for impact.</p>
               <Separator orientation="vertical" className="h-4 bg-white/5 hidden md:block" />
               <p className="text-[#333] text-[10px] font-black uppercase tracking-[0.2em]">Crafted with precision in Bengaluru.</p>
             </div>
             <div className="flex gap-8">
                {["Privacy", "Terms", "Legal"].map(l => (
                  <a key={l} href="#" className="text-[#333] hover:text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em] transition-colors">{l}</a>
                ))}
             </div>
          </div>
       </div>
    </footer>
  );
}
