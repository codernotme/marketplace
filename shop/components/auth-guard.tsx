"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

import { useShopAuthStore } from "@/lib/auth-store";
import { ForbiddenAccessScreen } from "@/components/forbidden-access-screen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, user } = useShopAuthStore();
  const hasShopAccess = (user?.module_access ?? ["shop"]).includes("shop");

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner color="accent" />
      </div>
    );
  }

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return null;
  }

  if (isAuthenticated && pathname.startsWith("/dashboard")) {
    if (!hasShopAccess) {
      return <ForbiddenAccessScreen />;
    }
  }

  return <>{children}</>;
}
