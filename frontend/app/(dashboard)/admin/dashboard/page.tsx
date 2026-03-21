import { proxy } from '@/lib/proxy';
import { Card, CardBody } from '@/components/HeroUI';
import { Icon } from '@iconify/react';

export default async function AdminDashboard() {
  const stats = await proxy.admin.getStats();

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="font-display text-3xl text-[--c-primary] mb-8">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-white border border-[--c-border] shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[--c-surface] flex items-center justify-center text-[--c-primary]">
                  <Icon icon={stat.icon} className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('-') || stat.trend === '0%' ? 'bg-default-100 text-[--c-secondary]' : 'bg-success-50 text-[--c-success]'}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-[--c-border] shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-body text-lg font-medium text-[--c-primary] mb-6">Revenue Growth</h3>
            <div className="w-full h-64 bg-[--c-surface] rounded-xl flex items-center justify-center text-[--c-secondary] text-sm group transition-all">
              <Icon icon="lucide:bar-chart-3" className="w-8 h-8 opacity-50 mr-2 group-hover:scale-110 transition-transform" /> (Financial Analytics)
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white border border-[--c-border] shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-body text-lg font-medium text-[--c-primary] mb-6">Recent Platform Activity</h3>
            <div className="space-y-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[--c-primary] flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-[--c-primary]">New vendor registered: <span className="font-medium">Artisan Goods</span></p>
                      <p className="text-xs text-[--c-muted] mt-1">{i * 3}h ago</p>
                    </div>
                 </div>
               ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
