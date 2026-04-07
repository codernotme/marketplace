"use client";

import { useSaasAuthStore } from "@/store/saas-auth.store";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

export default function PendingVerificationPage() {
  const { user, logout, isAuthenticated } = useSaasAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.is_verified) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-inter selection:bg-accent/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse duration-700" />
      </div>

      <Card className="max-w-md w-full bg-[#121214]/80 backdrop-blur-2xl border border-white/5 shadow-2xl p-8 rounded-[32px] relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/20 flex items-center justify-center shadow-inner relative group">
            <div className="absolute inset-0 bg-warning/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Icon icon="solar:shield-warning-bold-duotone" className="text-4xl text-warning relative z-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Verification Pending
            </h1>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              Welcome, <span className="text-white font-bold">{user?.name}</span>. Your administrative access is currently frozen awaiting verification from the platform owner.
            </p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-left">
             <Icon icon="solar:info-circle-bold-duotone" className="text-xl text-accent shrink-0 mt-0.5" />
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Security Protocol</p>
                <p className="text-[11px] text-zinc-500 font-medium leading-normal">
                   To protect marketplace integrity, all new accounts must be manually audited before dashboard access is permitted.
                </p>
             </div>
          </div>

          <div className="flex flex-col w-full gap-3">
             <Button 
               variant="primary" 
               className="w-full h-12 rounded-2xl font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
               onClick={() => window.location.reload()}
             >
                Check Approval Status
             </Button>
             <Button 
               variant="ghost" 
               className="w-full h-12 rounded-2xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
               onClick={() => logout()}
             >
                Sign out
             </Button>
          </div>

          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
             theMrktPlace Governance Engine
          </p>
        </div>
      </Card>
    </div>
  );
}
