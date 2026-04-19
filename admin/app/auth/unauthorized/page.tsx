"use client";

import { Card, Button } from "@heroui/react";
import { ShieldAlert, LogOut, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-danger-50 via-background to-primary-50 px-4">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger-400 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <Card className="z-10 w-full max-w-lg p-8 shadow-2xl backdrop-blur-md bg-background/80 border-1 border-divider">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="p-4 rounded-2xl bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 animate-bounce">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Pending</h1>
            <p className="text-default-500 text-lg">
              Registration successful! However, your account is currently in a 
              <span className="font-semibold text-danger"> pending review</span> state.
            </p>
          </div>

          <div className="w-full p-4 rounded-xl bg-default-50 border-1 border-divider flex items-start gap-4 text-left">
            <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">What happens next?</p>
              <p className="text-xs text-default-500 mt-1 leading-relaxed">
                A Master Administrator needs to assign you a specific role (e.g., Store Manager) 
                before you can access the dashboard. Please contact your system administrator.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 mt-4">
            <Button 
              variant="primary"
              className="w-full h-12 font-semibold shadow-lg shadow-primary/20"
              onClick={() => router.refresh()}
            >
              Check Status
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 font-semibold"
              onClick={handleSignOut}
            >
              <div className="flex items-center gap-2">
                <LogOut size={18} />
                <span>Sign Out</span>
              </div>
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-divider w-full">
            <Link 
              href="mailto:admin@marketplace.com" 
              className="text-sm text-default-400 hover:text-primary transition-colors font-medium inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
