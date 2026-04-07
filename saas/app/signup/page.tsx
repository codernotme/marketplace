"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Button, Input, Card, Checkbox, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError, isAuthenticated } = useSaasAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All identification fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Security keys do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Security key must be at least 8 characters");
      return;
    }

    if (!formData.agreed) {
      toast.error("Platform governance agreement required");
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success("Identity provisioned. Awaiting verification.");
    } catch (err: any) {
      toast.error(err.message || "Credential provisioning failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-inter selection:bg-accent/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[140px] animate-pulse duration-700" />
      </div>

      <div className="w-full max-w-[480px] relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Branding Area */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md relative group">
            <div className="absolute inset-0 bg-white/5 rounded-[22px] animate-ping opacity-20 scale-125 pointer-events-none" />
            <Image src="/logo.svg" alt="theMrktPlace" width={32} height={32} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              Provision Access
            </h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-1 ml-1">
              Join the Dashboard Governance
            </p>
          </div>
        </div>

        {/* Signup Nexus */}
        <Card className="bg-[#121214]/60 backdrop-blur-3xl border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-8 rounded-[40px] overflow-visible ring-1 ring-white/10">
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                Credential Request
              </h2>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                All new administrator accounts require owner verification before dashboard unlock.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 py-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    Full Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/[0.03] border-white/5 h-12 rounded-2xl group transition-all"
                  />
                </div>
                <div className="space-y-1.5 py-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    Admin Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@vault.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/[0.03] border-white/5 h-12 rounded-2xl group transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 py-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  Master Security Key
                </label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                      <Icon icon="solar:key-minimalistic-bold-duotone" className="text-lg" />
                   </div>
                   <Input
                    type="password"
                    placeholder="At least 8 unique characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 bg-white/[0.03] border-white/5 h-12 rounded-2xl group transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 py-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  Verify Key
                </label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                      <Icon icon="solar:shield-check-bold-duotone" className="text-lg" />
                   </div>
                   <Input
                    type="password"
                    placeholder="Re-enter security key"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-11 bg-white/[0.03] border-white/5 h-12 rounded-2xl group transition-all"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                 <div className="flex items-center gap-2">
                    <Checkbox 
                        id="agreed"
                        isSelected={formData.agreed}
                        onChange={(checked) => setFormData({ ...formData, agreed: checked as unknown as boolean })}
                        className="border-white/20"
                    />
                    <label htmlFor="agreed" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">
                        Agree to platform governance
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-normal pl-7">
                    I understand that my account will remain inactive and frozen until a platform supervisor verifies my identity and assigns a restricted access role.
                  </p>
              </div>

              <Button
                type="submit"
                isDisabled={isLoading}
                className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-white text-black hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                   <div className="flex items-center gap-2">
                      <Spinner className="size-4 animate-spin text-black" />
                      <span>Provisioning...</span>
                   </div>
                ) : "Provision identity"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-zinc-500 font-medium">
                Established account?{" "}
                <Link href="/login" className="text-white hover:text-accent font-bold transition-all underline underline-offset-4 decoration-white/20">
                  Secure Sign In
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Support Link */}
        <div className="flex items-center justify-center gap-4 text-zinc-600">
           <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Documentation</a>
           <span className="w-1 h-1 rounded-full bg-zinc-800" />
           <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy Shield</a>
        </div>
      </div>
    </div>
  );
}
