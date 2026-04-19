import { Card } from "@heroui/react";
import { getDashboardMetrics } from "@/actions/dashboard";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-accent border border-accent/20 shadow-sm">
          <Card.Content className="py-6">
            <h3 className="text-accent font-medium text-sm">Total Orders</h3>
            <p className="text-3xl font-bold text-accent mt-1">{metrics.totalOrders}</p>
          </Card.Content>
        </Card>
        
        <Card className="shadow-sm">
          <Card.Content className="py-6">
            <h3 className="text-muted font-medium text-sm">Total Revenue</h3>
            <p className="text-3xl font-bold mt-1">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(metrics.totalRevenue)}
            </p>
          </Card.Content>
        </Card>

        <Card className="shadow-sm">
          <Card.Content className="py-6">
            <h3 className="text-muted font-medium text-sm">Active Customers</h3>
            <p className="text-3xl font-bold mt-1">{metrics.activeCustomers}</p>
          </Card.Content>
        </Card>

        <Card className="shadow-sm">
          <Card.Content className="py-6">
            <h3 className="text-muted font-medium text-sm">Active Products</h3>
            <p className="text-3xl font-bold mt-1">{metrics.totalProducts}</p>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-2 shadow-sm">
          <Card.Content className="py-6">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            <div className="flex flex-col items-center justify-center py-12 text-muted">
              <p>No recent activity yet.</p>
            </div>
          </Card.Content>
        </Card>

        <Card className="shadow-sm">
          <Card.Content className="py-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <a href="/dashboard/products/new" className="text-sm text-accent hover:underline hover:bg-accent/5 p-2 rounded-md transition flex items-center">
                + Add new product
              </a>
              <a href="/dashboard/discounts/new" className="text-sm text-accent hover:underline hover:bg-accent/5 p-2 rounded-md transition flex items-center">
                + Create discount code
              </a>
              <a href="/dashboard/settings" className="text-sm text-accent hover:underline hover:bg-accent/5 p-2 rounded-md transition flex items-center">
                ⚙️ Configure store settings
              </a>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
