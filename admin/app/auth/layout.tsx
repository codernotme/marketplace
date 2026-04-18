import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      {/* Left side - dark premium graphic */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-zinc-950 p-12 text-white">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Marketplace Admin</h1>
          <p className="mt-2 text-zinc-400">Standalone eCommerce Management</p>
        </div>
        
        <div className="max-w-md">
          <blockquote className="text-lg font-medium tracking-tight">
            "Streamlining operations, inventory, and customer relations all in a single, powerful platform."
          </blockquote>
          <p className="mt-4 text-sm text-zinc-500">— Built for Next.js 15 & Better Auth</p>
        </div>
      </div>

      {/* Right side - auth forms */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
