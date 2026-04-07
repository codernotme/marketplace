import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { AuthGuard } from "@/components/auth-guard";

export const metadata: Metadata = {
  title: "Dashboard | theMrktPlace SaaS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 w-full min-w-0">
          <DashboardHeader />
          <main className="flex-1 w-full overflow-y-auto">
            <div className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

