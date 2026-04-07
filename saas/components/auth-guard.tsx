"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Spinner } from "@heroui/react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "saas_admin" | "support";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, isHydrated } = useSaasAuthStore();

  useEffect(() => {
    if (!isHydrated || isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else if (!user?.is_verified) {
      router.push("/pending-verification");
    } else if (requiredRole && user?.role !== requiredRole) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, isHydrated, requiredRole, user, router]);

  if (!isHydrated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner color="accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user?.is_verified && pathname !== "/pending-verification") {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

