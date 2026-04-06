import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-body">
      <Navbar />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
