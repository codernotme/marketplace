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
      <div className="min-h-screen bg-slate-950">
        <DashboardSidebar />
        <DashboardHeader />
        <main className="md:ml-64 pt-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
