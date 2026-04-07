"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Button, Input, Card, Checkbox, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, user } = useSaasAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.is_verified) {
        router.push("/dashboard");
      } else {
        router.push("/pending-verification");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      toast.error("Security credentials required");
      return;
    }

    try {
      await login(email, password);
      // store effects will trigger the redirect in useEffect
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-inter selection:bg-accent/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[140px] animate-pulse duration-700" />
        <div className="absolute top-[30%] right-[10%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[30%] left-[10%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Branding Area */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md relative group">
            <div className="absolute inset-0 bg-white/5 rounded-[22px] animate-ping opacity-20 scale-125 pointer-events-none" />
            <Image src="/logo.svg" alt="theMrktPlace" width={32} height={32} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              The Dashboard
            </h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-1 ml-1">
              theMrktPlace Governance
            </p>
          </div>
        </div>

        {/* Login Nexus */}
        <Card className="bg-[#121214]/60 backdrop-blur-3xl border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-8 rounded-[40px] overflow-visible ring-1 ring-white/10">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                Identity Access
              </h2>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Unlock platform architecture and governance streams.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 py-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  Administrator ID
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                    <Icon icon="solar:user-id-bold-duotone" className="text-lg" />
                  </div>
                  <Input
                    type="email"
                    placeholder="admin@themrktplace.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-white/[0.03] border-white/5 h-12 rounded-2xl group-hover:bg-white/[0.06] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5 py-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    Security Key
                  </label>
                  <Link href="/forgot" className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors">
                    Lost Key?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                    <Icon icon="solar:key-minimalistic-bold-duotone" className="text-lg" />
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-white/[0.03] border-white/5 h-12 rounded-2xl group-hover:bg-white/[0.06] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    className="border-white/20"
                  />
                  <label htmlFor="remember" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">
                    Remember Identity
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                isDisabled={isLoading}
                className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" color="current" />
                    <span>Synchronizing...</span>
                  </div>
                ) : "Initiate Access"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-zinc-500 font-medium">
                No credentials?{" "}
                <Link href="/signup" className="text-white hover:text-accent font-bold transition-all underline underline-offset-4 decoration-white/20">
                  Provision Account
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Support Link */}
        <div className="flex items-center justify-center gap-4 text-zinc-600">
          <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Security Manual</a>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">System Support</a>
        </div>
      </div>
    </div>
  );
}

