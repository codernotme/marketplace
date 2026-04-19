import { Card } from "@heroui/react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to your Portal</h1>
      <p className="text-default-500">Manage your orders, profile, and discover rewards.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card variant="default" className="bg-primary-50/50 border-primary-100/50">
          <Card.Content className="py-6">
            <h3 className="text-primary-800 font-medium">Recent Orders</h3>
            <p className="text-3xl font-bold text-primary-900 mt-1">0</p>
          </Card.Content>
        </Card>
        
        <Card variant="default">
          <Card.Content className="py-6">
            <h3 className="text-default-500 font-medium text-sm">Reward Points</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </Card.Content>
        </Card>

        <Card variant="default">
          <Card.Content className="py-6">
            <h3 className="text-default-500 font-medium text-sm">Wishlist Items</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </Card.Content>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card variant="default">
          <Card.Content className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-default-400">You have no recent activity.</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
