import { proxy } from '@/lib/proxy';
import { Card, CardBody } from '@/components/HeroUI';
import { Icon } from '@iconify/react';

export default async function VendorDashboard() {
  const stats = await proxy.vendor.getStats('mock-vendor-id');

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="font-display text-3xl text-[--c-primary] mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-white border border-[--c-border] shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[--c-surface] flex items-center justify-center text-[--c-primary]">
                  <Icon icon={stat.icon} className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-success-50 text-[--c-success]' : 'bg-default-100 text-[--c-secondary]'}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm text-[--c-secondary] mb-1">{stat.label}</p>
                <p className="font-mono text-2xl font-semibold text-[--c-primary]">{stat.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-[--c-border] shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-body text-lg font-medium text-[--c-primary]">Recent Orders</h3>
              <a href="/vendor/orders" className="text-sm font-medium text-[--c-primary] hover:text-[--c-secondary] transition-colors underline-offset-4 hover:underline">View All</a>
            </div>
            <div className="text-center py-20 text-[--c-secondary] text-sm">
              <Icon icon="lucide:inbox" className="w-12 h-12 mx-auto text-[--c-border] mb-4 opacity-50" />
              <p>No recent orders to display.</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[--c-border] shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-body text-lg font-medium text-[--c-primary] mb-6">Top Products</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-[--c-surface] flex-shrink-0 group-hover:scale-105 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[--c-primary] group-hover:text-[--c-primary]/80 transition-colors">Premium Watch {i}</p>
                    <p className="text-xs text-[--c-secondary]">{15 - i} Sales</p>
                  </div>
                  <div className="font-mono text-sm font-semibold text-[--c-primary]">₹{(5000 - i * 500).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
