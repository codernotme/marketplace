import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Navbar } from '@/components/shared/Navbar';

function getRoleFromPath(url: string): 'vendor' | 'customer' | 'admin' {
  if (url.includes('/vendor')) return 'vendor';
  if (url.includes('/admin')) return 'admin';
  return 'customer';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Role is determined server-side based on route segment
  // In production this would come from the session token
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-body">
      <Navbar />
      <div className="flex">
        {/* We pass a fixed role per route group layout file */}
        <DashboardSidebar role="customer" />
        <main className="flex-1 min-w-0 p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
