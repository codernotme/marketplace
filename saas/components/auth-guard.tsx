"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Spinner } from "@/components/ui/spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "superadmin" | "support";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, isHydrated } = useSaasAuthStore();

  useEffect(() => {
    if (!isHydrated || isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else if (requiredRole && user?.role !== requiredRole) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, isHydrated, requiredRole, user, router]);

  if (!isHydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

