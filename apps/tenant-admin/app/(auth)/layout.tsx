import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
              M
            </div>
            <span className={cn("text-xl font-bold tracking-tight")}>themrktplace</span>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="text-2xl font-semibold leading-snug mb-6">
            "The platform that scales with your ambition."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Aryan</p>
              <p className="text-xs opacity-70">Founder, themrktplace</p>
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="relative z-10">
          <ul className="flex flex-col gap-2 text-sm opacity-90">
            {["Multi-tenant architecture", "99.9% uptime SLA", "AI-powered insights", "Global payment support"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary-foreground/60" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
