"use client";
import { useState, useEffect, useRef } from "react";

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icons = {
  Store: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 9l1-5h16l1 5" /><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
      <path d="M5 20V11m14 9V11" /><rect x="9" y="14" width="6" height="6" rx="1" />
    </svg>
  ),
  Lightning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Cpu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12h18M3 6h18M3 18h12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-4" />
    </svg>
  ),
  Package: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M16.5 9.4L7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
};

// ─── Noise Texture Overlay ────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee({ items }) {
  return (
    <div className="overflow-hidden py-4 border-y border-[#222]">
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee-track { animation: marquee 28s linear infinite; display: flex; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-8 text-[#555] text-sm font-medium tracking-[0.2em] uppercase whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Floating Orb ─────────────────────────────────────────────────────────────
function Orb({ className, style }) {
  return (
    <div
      className={cn("absolute rounded-full pointer-events-none blur-[100px] opacity-30", className)}
      style={style}
    />
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Platform", "Features", "Pricing", "About"];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-xl border-b border-[#1a1a1a] py-3"
          : "py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span
            className="font-black text-white tracking-[-0.04em]"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px" }}
          >
            themrktplace
          </span>
          <span className="text-[#C9A84C] text-[9px] tracking-[0.25em] uppercase font-medium">
            by Tackle Studioz
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[#888] hover:text-white text-sm tracking-wide transition-colors duration-200"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-[#888] hover:text-white text-sm transition-colors">Sign in</button>
          <button className="bg-[#C9A84C] hover:bg-[#E0BF6A] text-[#080808] text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 tracking-wide">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white w-6 h-6"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-[#1a1a1a] px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[#aaa] hover:text-white text-lg font-medium tracking-wide transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l}
            </a>
          ))}
          <button className="mt-4 bg-[#C9A84C] text-[#080808] font-bold py-3 rounded-full tracking-wide">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#080808]">
      {/* Orbs */}
      <Orb className="w-[700px] h-[700px] bg-[#C9A84C] top-[-200px] right-[-200px]" />
      <Orb className="w-[500px] h-[500px] bg-[#1a5c4a] bottom-[-100px] left-[-100px]" />
      <Orb className="w-[300px] h-[300px] bg-[#8B5CF6] top-[40%] left-[20%]" style={{ opacity: 0.1 }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-bold px-4 py-2 rounded-full mb-10 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          Presenting themrktplace — by Tackle Studioz
        </div>

        {/* Headline */}
        <div className="overflow-hidden mb-3">
          <h1
            className={cn(
              "text-white font-black leading-[0.88] tracking-[-0.04em] transition-all duration-700 delay-100",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            )}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 9vw, 130px)",
            }}
          >
            Commerce.
          </h1>
        </div>
        <div className="overflow-hidden mb-3">
          <h1
            className={cn(
              "font-black leading-[0.88] tracking-[-0.04em] transition-all duration-700 delay-200",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            )}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 9vw, 130px)",
              WebkitTextStroke: "2px #C9A84C",
              color: "transparent",
            }}
          >
            Elevated.
          </h1>
        </div>
        <div className="overflow-hidden mb-12">
          <h1
            className={cn(
              "text-white font-black leading-[0.88] tracking-[-0.04em] transition-all duration-700 delay-300",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            )}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 9vw, 130px)",
            }}
          >
            Unmatched.
          </h1>
        </div>

        {/* Subtext + CTA row */}
        <div
          className={cn(
            "flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 transition-all duration-700 delay-[400ms]",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <p className="text-[#777] text-lg md:text-xl leading-relaxed max-w-lg">
            The only unified platform bridging your <span className="text-white font-medium">physical store</span>,{" "}
            <span className="text-white font-medium">online marketplace</span>, and{" "}
            <span className="text-white font-medium">enterprise operations</span> — with zero compromise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button className="group flex items-center gap-3 bg-[#C9A84C] hover:bg-[#E0BF6A] text-[#080808] font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-base tracking-wide">
              Start Building
              <span className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <Icons.ArrowRight />
              </span>
            </button>
            <button className="flex items-center gap-3 border border-[#2a2a2a] hover:border-[#C9A84C]/50 text-white px-8 py-4 rounded-full transition-all duration-300 text-base tracking-wide bg-transparent hover:bg-[#C9A84C]/5">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating product cards - decorative */}
        <div
          className={cn(
            "hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-500",
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          )}
        >
          <div className="relative w-72">
            {/* Card 1 */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#888] text-xs tracking-widest uppercase">Today's Revenue</span>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">↑ 24%</span>
              </div>
              <div className="text-white font-black text-3xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                $48,290
              </div>
              <div className="mt-3 flex gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#C9A84C]/20 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-[#C9A84C] rounded-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="h-16 relative" />
            </div>
            {/* Card 2 */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 shadow-2xl ml-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-black text-white">JD</div>
                <div>
                  <div className="text-white text-sm font-semibold">New Order #4821</div>
                  <div className="text-[#666] text-xs">2 mins ago · $320.00</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full font-medium">Paid</span>
                <span className="text-[#555] text-xs">via Stripe Terminal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#444]">
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C]/50 to-transparent" />
      </div>
    </section>
  );
}

// ─── Marquee Section ──────────────────────────────────────────────────────────
function MarqueeSection() {
  return (
    <Marquee
      items={[
        "Multi-Tenant SaaS", "POS Terminal", "eCommerce", "Offline Mode",
        "Stripe Integration", "AI-Powered", "Real-Time Sync", "Enterprise Ready",
        "Next.js 15", "shadcn/ui", "Tackle Studioz",
      ]}
    />
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Icons.Store,
    label: "01",
    title: "Unified POS",
    description: "Blazing-fast point-of-sale with full offline capability. Works without internet, syncs instantly on reconnect.",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-transparent",
    tags: ["Offline-first", "Stripe Terminal", "Receipt printing"],
  },
  {
    icon: Icons.Globe,
    label: "02",
    title: "eCommerce Engine",
    description: "White-labeled storefronts per tenant. SSR, ISR, lightning Lighthouse scores, SEO-ready out of the box.",
    accent: "#10B981",
    bg: "from-[#10B981]/10 to-transparent",
    tags: ["Next.js ISR", "Custom domains", "Multi-currency"],
  },
  {
    icon: Icons.Shield,
    label: "03",
    title: "Enterprise Security",
    description: "PostgreSQL Row-Level Security, JWT rotation, PCI-DSS SAQ-A compliant, full audit logging.",
    accent: "#8B5CF6",
    bg: "from-[#8B5CF6]/10 to-transparent",
    tags: ["PCI-DSS", "GDPR", "SOC2 roadmap"],
  },
  {
    icon: Icons.Cpu,
    label: "04",
    title: "AI-Powered",
    description: "Smart reorder suggestions, AI product descriptions, collaborative filtering recommendations, fraud scoring.",
    accent: "#EC4899",
    bg: "from-[#EC4899]/10 to-transparent",
    tags: ["Claude API", "RAG Chatbot", "Fraud detection"],
  },
  {
    icon: Icons.Chart,
    label: "05",
    title: "Unified Analytics",
    description: "One dashboard. Online + in-store sales, cohort analysis, CLV, real-time ticker, custom report builder.",
    accent: "#F97316",
    bg: "from-[#F97316]/10 to-transparent",
    tags: ["Real-time", "Custom reports", "Export"],
  },
  {
    icon: Icons.Package,
    label: "06",
    title: "Multi-Tenant SaaS",
    description: "Serve thousands of isolated merchants. Per-tenant subdomains, custom domains, tiered plans with hard limits.",
    accent: "#06B6D4",
    bg: "from-[#06B6D4]/10 to-transparent",
    tags: ["Subdomain routing", "Plan limits", "Billing"],
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#080808] py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
              Platform Features
            </span>
            <h2
              className="text-white font-black tracking-[-0.04em] leading-[0.9]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px, 6vw, 80px)" }}
            >
              Everything you need.<br />
              <span style={{ WebkitTextStroke: "1.5px #C9A84C", color: "transparent" }}>
                Nothing you don't.
              </span>
            </h2>
          </div>
          <p className="text-[#777] text-lg max-w-sm leading-relaxed">
            6 core modules, unified into one commerce operating system.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a] rounded-3xl overflow-hidden border border-[#1a1a1a]">
          {features.map((f, i) => (
            <div
              key={i}
              className={cn(
                "group relative bg-[#080808] p-8 md:p-10 overflow-hidden cursor-pointer transition-all duration-500",
                "hover:bg-[#0E0E0E]"
              )}
            >
              {/* Gradient hover fill */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", f.bg)} />

              <div className="relative z-10">
                {/* Number + icon row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[#333] text-xs font-mono tracking-widest">{f.label}</span>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${f.accent}15`, color: f.accent, padding: "10px" }}
                  >
                    <f.icon />
                  </div>
                </div>

                <h3
                  className="text-white text-2xl font-black tracking-tight mb-3"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">{f.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: `${f.accent}30`, color: f.accent, background: `${f.accent}08` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div
                  className="mt-8 w-8 h-8 rounded-full flex items-center justify-center border border-[#2a2a2a] group-hover:border-current transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  style={{ color: f.accent }}
                >
                  <div className="w-4 h-4"><Icons.ArrowRight /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: 1200000, suffix: "+", label: "Weekly Transactions", note: "processed across all tenants" },
    { value: 480, suffix: "M+", label: "Monthly Volume", note: "USD across the platform" },
    { value: 99.9, suffix: "%", label: "Uptime SLA", note: "guaranteed reliability" },
    { value: 10, suffix: "ms", label: "Avg API Latency", note: "p95 response time" },
  ];

  return (
    <section className="bg-[#080808] py-24 border-y border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Big ticker strip */}
        <div className="bg-[#0D0D0D] border border-[#1a1a1a] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1a1a1a]">
            {stats.map((s, i) => (
              <div key={i} className="p-10 md:p-12 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div
                    className="font-black text-white tracking-[-0.04em] mb-2"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 4vw, 60px)" }}
                  >
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-white font-semibold text-base mb-1">{s.label}</div>
                  <div className="text-[#555] text-sm">{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Platform Modules ─────────────────────────────────────────────────────────
function PlatformSection() {
  const [active, setActive] = useState(0);

  const modules = [
    {
      name: "SaaS Admin",
      desc: "Global platform management with full tenant control. Provision merchants, manage billing, monitor health, impersonate for support.",
      visual: "Admin",
      color: "#C9A84C",
    },
    {
      name: "POS Terminal",
      desc: "Touch-optimized, offline-first POS. Full cart management, multi-tender, barcode scanning, receipt printing. Syncs on reconnect.",
      visual: "POS",
      color: "#10B981",
    },
    {
      name: "eCommerce Store",
      desc: "White-labeled storefronts with SSR, ISR, custom domains. Full checkout, Apple Pay, abandoned cart recovery, reviews.",
      visual: "Store",
      color: "#8B5CF6",
    },
    {
      name: "Mobile App",
      desc: "React Native app for inventory management, reporting, barcode scanning, and push notifications. Coming Phase 2.",
      visual: "Mobile",
      color: "#EC4899",
    },
  ];

  const mod = modules[active];

  return (
    <section id="platform" className="bg-[#080808] py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
            Four Modules
          </span>
          <h2
            className="text-white font-black tracking-[-0.04em]"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 70px)" }}
          >
            One operating system<br />
            <span className="text-[#444]">for modern commerce.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {modules.map((m, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "text-left p-6 rounded-2xl border transition-all duration-300 group",
                  active === i
                    ? "border-[#C9A84C]/30 bg-[#0D0D0D]"
                    : "border-[#111] bg-transparent hover:bg-[#0A0A0A] hover:border-[#222]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-base transition-colors duration-200"
                    style={{ fontFamily: "'Syne', sans-serif", color: active === i ? m.color : "#888" }}
                  >
                    {m.name}
                  </span>
                  {active === i && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                  )}
                </div>
                {active === i && (
                  <p className="text-[#666] text-sm mt-3 leading-relaxed">{m.desc}</p>
                )}
              </button>
            ))}
          </div>

          {/* Visual panel */}
          <div className="lg:col-span-3 rounded-3xl border border-[#1a1a1a] bg-[#0D0D0D] overflow-hidden min-h-[400px] relative flex flex-col items-center justify-center p-12">
            <Orb
              className="w-64 h-64"
              style={{ background: mod.color, top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }}
            />
            <div
              className="text-[120px] md:text-[180px] font-black tracking-[-0.08em] leading-none select-none transition-all duration-500"
              style={{ fontFamily: "'Syne', sans-serif", WebkitTextStroke: `2px ${mod.color}`, color: "transparent", opacity: 0.4 }}
            >
              {mod.visual}
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
              <span className="text-[#444] text-xs tracking-[0.2em] uppercase">{mod.name} Module</span>
              <span className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: `${mod.color}30`, color: mod.color }}>
                {active === 3 ? "Phase 2" : "Available now"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "49",
    desc: "Perfect for independent merchants getting started.",
    features: ["1 Location", "5 Staff members", "500 Products", "1,000 monthly orders", "POS + eCommerce", "Email support"],
    cta: "Start free trial",
    accent: "#888",
    highlight: false,
  },
  {
    name: "Growth",
    price: "149",
    desc: "For scaling businesses that need more power.",
    features: ["5 Locations", "25 Staff members", "10,000 Products", "20,000 monthly orders", "Custom domain", "AI features", "Priority support"],
    cta: "Start free trial",
    accent: "#C9A84C",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Unlimited scale, white-label, dedicated infrastructure.",
    features: ["Unlimited locations", "Unlimited staff", "Unlimited products", "Unlimited orders", "White-label", "AI + ML features", "SLA + dedicated support"],
    cta: "Contact sales",
    accent: "#10B981",
    highlight: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="bg-[#080808] py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold mb-4 block">Pricing</span>
          <h2
            className="text-white font-black tracking-[-0.04em] mb-5"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 70px)" }}
          >
            Straightforward pricing.<br />
            <span style={{ WebkitTextStroke: "1.5px #C9A84C", color: "transparent" }}>Extraordinary value.</span>
          </h2>
          <p className="text-[#666] text-lg max-w-lg mx-auto">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative rounded-3xl p-8 md:p-10 border transition-all duration-300 hover:-translate-y-1",
                plan.highlight
                  ? "border-[#C9A84C]/40 bg-[#0D0D0D]"
                  : "border-[#1a1a1a] bg-[#0A0A0A]"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#C9A84C] text-[#080808] text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <span className="text-[#555] text-xs tracking-[0.2em] uppercase font-medium">{plan.name}</span>
                <div className="mt-3 flex items-end gap-1">
                  {plan.price !== "Custom" && <span className="text-[#555] text-2xl font-bold mt-1">$</span>}
                  <span
                    className="text-white font-black tracking-[-0.04em] leading-none"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: plan.price === "Custom" ? "36px" : "60px" }}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-[#555] text-base mb-2">/mo</span>}
                </div>
                <p className="text-[#555] text-sm mt-3 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex flex-col gap-3 mb-10">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${plan.accent}20`, color: plan.accent, padding: "3px" }}
                    >
                      <Icons.Check />
                    </div>
                    <span className="text-[#888] text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <button
                className={cn(
                  "w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105",
                  plan.highlight
                    ? "bg-[#C9A84C] text-[#080808] hover:bg-[#E0BF6A]"
                    : "border border-[#2a2a2a] text-white hover:border-[#444] bg-transparent"
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "themrktplace replaced 4 different tools we were paying for. Our checkout conversion went up 31% in the first month.",
    name: "Aisha Nkosi",
    role: "Founder, Kente & Co.",
    avatar: "AN",
    color: "#C9A84C",
  },
  {
    quote: "The offline POS is a game-changer. We operate in a market with spotty wifi — now we never miss a sale.",
    name: "Marco Ferreira",
    role: "Owner, Casa Moderna",
    avatar: "MF",
    color: "#10B981",
  },
  {
    quote: "Onboarded 200 merchants on the platform in 3 weeks. The multi-tenant architecture is rock solid.",
    name: "Priya Chandrasekaran",
    role: "CTO, RetailOS",
    avatar: "PC",
    color: "#8B5CF6",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-[#080808] py-24 border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
            What merchants say
          </span>
          <h2
            className="text-white font-black tracking-[-0.04em]"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Trusted by builders<br />
            <span className="text-[#333]">across the globe.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border border-[#1a1a1a] bg-[#0A0A0A] rounded-2xl p-8 hover:border-[#2a2a2a] transition-colors duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-3.5 h-3.5 text-[#C9A84C]"><Icons.Star /></div>
                ))}
              </div>
              <blockquote className="text-[#888] text-base leading-relaxed mb-8 group-hover:text-[#aaa] transition-colors duration-300">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: `${t.color}30`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-[#555] text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="bg-[#080808] py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[48px] overflow-hidden border border-[#1a1a1a] p-16 md:p-28 text-center">
          {/* Background */}
          <div className="absolute inset-0 bg-[#0D0D0D]" />
          <Orb className="w-[600px] h-[600px] bg-[#C9A84C] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.06 }} />
          <Orb className="w-[300px] h-[300px] bg-[#8B5CF6] top-0 right-0" style={{ opacity: 0.08 }} />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold">
              Ready to launch?
            </span>
            <h2
              className="text-white font-black tracking-[-0.04em] leading-[0.9]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(48px, 8vw, 110px)" }}
            >
              Build your empire.
            </h2>
            <p className="text-[#666] text-xl max-w-md leading-relaxed">
              Join hundreds of merchants already powering their commerce with themrktplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="group flex items-center gap-3 bg-[#C9A84C] hover:bg-[#E0BF6A] text-[#080808] font-bold px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 text-base tracking-wide">
                Start for free — 14 days
                <span className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <Icons.ArrowRight />
                </span>
              </button>
              <button className="flex items-center gap-3 border border-[#2a2a2a] text-white px-10 py-5 rounded-full transition-all duration-300 hover:border-[#444] text-base tracking-wide">
                Book a demo
              </button>
            </div>

            <p className="text-[#444] text-sm mt-2">
              No credit card required · Cancel anytime · by{" "}
              <span className="text-[#C9A84C]">Tackle Studioz</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Platform",
      links: ["POS Terminal", "eCommerce", "SaaS Admin", "Mobile App", "Integrations"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API Reference", "Status Page", "Changelog", "GitHub"],
    },
    {
      title: "Company",
      links: ["About Tackle Studioz", "Blog", "Careers", "Press Kit", "Contact"],
    },
  ];

  return (
    <footer className="bg-[#080808] border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-6">
              <span
                className="font-black text-white tracking-[-0.04em]"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px" }}
              >
                themrktplace
              </span>
              <span className="text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase font-medium mt-1">
                by Tackle Studioz
              </span>
            </div>
            <p className="text-[#555] text-sm leading-relaxed max-w-xs">
              The unified commerce operating system for physical stores, online marketplaces, and enterprise operations.
            </p>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <span className="text-[#444] text-xs tracking-[0.2em] uppercase font-medium mb-5 block">
                {col.title}
              </span>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <a key={l} href="#" className="text-[#666] hover:text-white text-sm transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#111] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#444] text-sm">
            © 2025 Tackle Studioz. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-[#444] hover:text-[#888] text-sm transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body, html {
          background: #080808;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A84C; }

        ::selection { background: #C9A84C30; color: #C9A84C; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fade-up 0.7s ease forwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <NoiseOverlay />
      <Nav />
      <main>
        <Hero />
        <MarqueeSection />
        <FeaturesSection />
        <StatsSection />
        <PlatformSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}