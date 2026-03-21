import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <DashboardSidebar role="vendor" />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
