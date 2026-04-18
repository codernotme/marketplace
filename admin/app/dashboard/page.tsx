import { Card, CardBody } from "@heroui/react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder cards */}
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody className="py-6">
            <h3 className="text-primary-800 font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-primary-900">0</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="py-6">
            <h3 className="text-default-500 font-medium text-sm">Total Revenue</h3>
            <p className="text-3xl font-bold mt-1">₹0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="py-6">
            <h3 className="text-default-500 font-medium text-sm">Customers</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="py-6">
            <h3 className="text-default-500 font-medium text-sm">Products</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
