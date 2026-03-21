'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const AuthGuard = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requiredRole && role !== requiredRole) {
        router.push('/');
      }
    }
  }, [isAuthenticated, role, requiredRole, router, mounted]);

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
