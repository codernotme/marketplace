"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSaasAuthStore } from "@/store/saas-auth.store";
import { Spinner } from "@/components/ui/spinner";

export function Redirect() {
  const router = useRouter();
  const { isAuthenticated } = useSaasAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
    setIsReady(true);
  }, [isAuthenticated, router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return null;
}

