import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — Master Admin Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
              S
            </div>
            <span className={cn("text-xl font-bold tracking-tight")}>themrktplace SUPER</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <blockquote className="text-2xl font-semibold leading-snug">
            "Platform Governance & Infrastructure Control."
          </blockquote>
          <p className="text-sm opacity-60">Authorized Personnel Only</p>
        </div>

        <div className="relative z-10">
          <ul className="flex flex-col gap-2 text-sm opacity-90">
            {["Tenant management", "System health monitoring", "Security auditing", "Global configuration"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/60" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 bg-background text-foreground">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
