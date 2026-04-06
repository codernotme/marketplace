"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative bg-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-violet-500/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {siteConfig.name}
            </span>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6 border border-accent/20">
              <Icon icon="solar:stars-minimalistic-bold-duotone" />
              <span>Premium Admin Experience</span>
            </div>
            <h1 className="text-4xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              Manage your store with <span className="text-accent">unprecedented</span> clarity.
            </h1>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Join thousands of brands who trust {siteConfig.name} for their daily operations and strategy.
            </p>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border shadow-2xl shadow-accent/5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border-2 border-surface overflow-hidden hover:translate-y-1 transition-transform">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted font-medium">
                Used by <span className="text-foreground font-bold">50,000+</span> teams worldwide
              </p>
            </div>
          </div>

          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name} Core Systems.
          </p>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
              <Image src="/logo.svg" alt="Logo" width={28} height={28} />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "var(--font-outfit)" }}>Welcome back</h2>
            <p className="text-muted">Enter your credentials to access the command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Email Address</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Password</Label>
                  <Link href="#" className="text-xs font-bold text-accent hover:underline">Forgot?</Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent" />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 rounded-2xl shadow-xl shadow-accent/20 font-bold"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/setup" className="text-accent font-bold hover:underline">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
