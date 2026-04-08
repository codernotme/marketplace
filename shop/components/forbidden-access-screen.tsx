"use client";

import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useShopAuthStore } from "@/lib/auth-store";

export function ForbiddenAccessScreen() {
  const logout = useShopAuthStore((state) => state.logout);
  const planName = useShopAuthStore((state) => state.user?.plan_name ?? state.user?.plan_code ?? "your current plan");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_40%),linear-gradient(180deg,#0b0f14_0%,#111827_100%)] px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-lg border border-white/10 bg-white/95 shadow-2xl rounded-[2rem] p-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Icon icon="solar:lock-keyhole-bold-duotone" className="text-3xl" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground">Access restricted</p>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Shop dashboard is not included</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is currently on {planName}. This plan does not include access to the shop dashboard.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-default-50 p-4 text-sm text-muted-foreground">
          Upgrade your plan to enable the shop module, or contact sales if you need a custom package with additional modules.
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" className="flex-1 font-bold" onClick={logout}>
            Sign out
          </Button>
          <Button variant="outline" className="flex-1 font-bold" onClick={() => window.location.assign("/login")}>
            Back to login
          </Button>
        </div>
      </Card>
    </div>
  );
}