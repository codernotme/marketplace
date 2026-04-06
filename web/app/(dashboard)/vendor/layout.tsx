import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-body">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="vendor" />
        <main className="flex-1 min-w-0 p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
