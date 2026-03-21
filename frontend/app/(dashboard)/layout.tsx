import { AuthGuard } from '@/components/shared/AuthGuard';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // In a real app, we'd get the role from the auth store or a server-side session
  // For the mock, we can just determine it based on the URL or the store
  const role = 'customer'; // Default fallback

  return (
    <AuthGuard>
      <div className="flex w-full h-full overflow-hidden">
        {children}
      </div>
    </AuthGuard>
  );
}
