import { KPICards } from "@/components/dashboard/kpi-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { AuditFeed } from "@/components/dashboard/audit-feed";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform KPIs and Performance Overview</p>
      </div>

      <KPICards />
      <RevenueChart />
      <AuditFeed />
    </div>
  );
}
