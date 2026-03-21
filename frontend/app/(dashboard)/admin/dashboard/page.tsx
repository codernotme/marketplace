import { Icon } from '@iconify/react';
import Link from 'next/link';

const stats = [
  { label: 'Total Revenue', value: '$284,920', trend: '+22%', icon: 'mdi:currency-usd', bg: 'bg-[#84D347]', text: 'text-black' },
  { label: 'Active Users', value: '12,481', trend: '+8%', icon: 'mdi:account-group-outline', bg: 'bg-black', text: 'text-white' },
  { label: 'Total Orders', value: '4,892', trend: '+15%', icon: 'mdi:shopping-outline', bg: 'bg-[#F5F5F5]', text: 'text-black' },
  { label: 'Active Vendors', value: '147', trend: '+3', icon: 'mdi:storefront-outline', bg: 'bg-[#F5F5F5]', text: 'text-black' },
];

const recentActivity = [
  { icon: 'mdi:account-plus-outline', text: 'New user registered', sub: 'Sofia Reyes joined the platform', time: '2m ago', color: 'bg-blue-50 text-blue-600' },
  { icon: 'mdi:storefront-outline', text: 'New vendor approved', sub: 'Terra Studio listed 12 products', time: '18m ago', color: 'bg-green-50 text-green-600' },
  { icon: 'mdi:shopping-outline', text: 'Large order placed', sub: '#TMP-9021 — $828 total', time: '1h ago', color: 'bg-[#84D347]/20 text-[#5a9a2a]' },
  { icon: 'mdi:alert-circle-outline', text: 'Product flagged for review', sub: 'Possible price violation detected', time: '3h ago', color: 'bg-red-50 text-red-600' },
  { icon: 'mdi:account-off-outline', text: 'User account suspended', sub: 'Fraud prevention triggered', time: '5h ago', color: 'bg-amber-50 text-amber-600' },
];

const topVendors = [
  { name: 'Timecraft Co.', orders: 142, revenue: '$56,230', avatar: 'https://i.pravatar.cc/40?img=1' },
  { name: 'SoundLab', orders: 98, revenue: '$34,800', avatar: 'https://i.pravatar.cc/40?img=3' },
  { name: 'DR CRZ Studio', orders: 76, revenue: '$48,120', avatar: 'https://i.pravatar.cc/40?img=7' },
  { name: 'KeyForge', orders: 54, revenue: '$19,440', avatar: 'https://i.pravatar.cc/40?img=11' },
];

export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Admin</p>
          <h1 className="font-display text-3xl font-bold text-black">Platform Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-gray-200 text-black font-bold rounded-full px-4 h-9 flex items-center gap-2 font-body text-sm hover:border-black transition-colors">
            <Icon icon="mdi:export" className="text-sm" /> Export
          </button>
          <Link href="/admin/users" className="bg-black text-white font-bold rounded-full px-5 h-9 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
            <Icon icon="mdi:account-group" /> Users
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <Icon icon={stat.icon} className={`text-2xl ${stat.text} opacity-60`} />
              <span className={`font-body font-bold text-xs ${stat.text} opacity-60`}>{stat.trend}</span>
            </div>
            <div>
              <p className={`font-display font-black text-2xl tracking-tight ${stat.text}`}>{stat.value}</p>
              <p className={`font-body text-xs font-medium ${stat.text} opacity-60 mt-0.5`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-black">Recent Activity</h3>
            <button className="font-body text-xs font-semibold text-gray-400 hover:text-black transition-colors">View All</button>
          </div>
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#F9F9F9] transition-colors cursor-pointer group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon icon={item.icon} className="text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-black">{item.text}</p>
                  <p className="font-body text-xs text-gray-400 mt-0.5 line-clamp-1">{item.sub}</p>
                </div>
                <span className="font-body text-xs text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-black">Top Vendors</h3>
            <button className="font-body text-xs font-semibold text-gray-400 hover:text-black transition-colors">Manage</button>
          </div>
          <div className="flex flex-col gap-4">
            {topVendors.map((vendor, i) => (
              <div key={vendor.name} className="flex items-center gap-3 group cursor-pointer">
                <span className="font-display font-black text-gray-200 w-5 text-lg">{i + 1}</span>
                <img src={vendor.avatar} alt={vendor.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-black group-hover:text-[#84D347] transition-colors line-clamp-1">{vendor.name}</p>
                  <p className="font-body text-xs text-gray-400">{vendor.orders} orders</p>
                </div>
                <span className="font-display font-bold text-sm text-black">{vendor.revenue}</span>
              </div>
            ))}
          </div>

          {/* Quick admin actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
            {[
              { icon: 'mdi:store-check-outline', label: 'Approve Vendors', href: '#' },
              { icon: 'mdi:flag-outline', label: 'Review Flagged', href: '#' },
              { icon: 'mdi:chart-box-outline', label: 'Full Analytics', href: '#' },
            ].map(item => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon icon={item.icon} className="text-sm" />
                </div>
                <span className="font-body font-semibold text-sm text-black flex-1">{item.label}</span>
                <Icon icon="lucide:chevron-right" className="text-gray-300 group-hover:text-black transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
