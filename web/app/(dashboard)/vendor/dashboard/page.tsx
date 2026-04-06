import { Icon } from '@iconify/react';
import Link from 'next/link';

const stats = [
  { label: 'Total Revenue', value: '$12,840', trend: '+18%', icon: 'mdi:currency-usd', color: 'bg-black', textColor: 'text-black' },
  { label: 'Total Orders', value: '284', trend: '+12%', icon: 'mdi:shopping-outline', color: 'bg-black', textColor: 'text-white' },
  { label: 'Products Listed', value: '47', trend: '+3', icon: 'mdi:package-variant-outline', color: 'bg-[#F5F5F5]', textColor: 'text-black' },
  { label: 'Avg. Rating', value: '4.8★', trend: 'Excellent', icon: 'mdi:star-outline', color: 'bg-[#F5F5F5]', textColor: 'text-black' },
];

const recentOrders = [
  { id: '#TMP-9021', customer: 'Alexa Watson', product: 'Minimalist Leather Watch', amount: 189, status: 'Delivered', date: 'Mar 20' },
  { id: '#TMP-8982', customer: 'Emily Mendez', product: 'Noise Cancelling Earbuds', amount: 159, status: 'Processing', date: 'Mar 19' },
  { id: '#TMP-8901', customer: 'David Swagner', product: 'DR CRZ Varsity Jacket', amount: 349, status: 'Shipped', date: 'Mar 18' },
  { id: '#TMP-8823', customer: 'Sarah Kim', product: 'Ceramic Coffee Mug', amount: 34, status: 'Delivered', date: 'Mar 17' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-50 text-green-700',
  Processing: 'bg-amber-50 text-amber-700',
  Shipped: 'bg-blue-50 text-blue-700',
};

const topProducts = [
  { name: 'Minimalist Leather Watch', sales: 58, revenue: '$10,962', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=60&q=80' },
  { name: 'DR CRZ Varsity Jacket', sales: 35, revenue: '$12,215', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=60&q=80' },
  { name: 'Noise Cancelling Earbuds', sales: 29, revenue: '$4,611', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=60&q=80' },
];

export default function VendorDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Vendor Portal</p>
          <h1 className="font-display text-3xl font-bold text-black">Dashboard Overview</h1>
        </div>
        <Link href="/vendor/products/new" className="bg-black text-white font-bold rounded-full px-5 h-10 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
          <Icon icon="mdi:plus" /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <Icon icon={stat.icon} className={`text-2xl ${stat.textColor} opacity-60`} />
              <span className={`font-body font-bold text-xs ${stat.textColor} opacity-60`}>{stat.trend}</span>
            </div>
            <div>
              <p className={`font-display font-black text-2xl ${stat.textColor}`}>{stat.value}</p>
              <p className={`font-body text-xs font-medium ${stat.textColor} opacity-60 mt-0.5`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-black">Recent Orders</h3>
            <button className="font-body text-xs font-semibold text-gray-400 hover:text-black transition-colors">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-bold text-sm text-black">{order.id}</span>
                    <span className="text-gray-300 text-sm">·</span>
                    <span className="font-body text-xs text-gray-400">{order.date}</span>
                  </div>
                  <p className="font-body text-sm text-gray-500 line-clamp-1">{order.customer} — {order.product}</p>
                </div>
                <span className="font-display font-bold text-black">${order.amount}</span>
                <span className={`font-body font-bold text-xs px-3 py-1 rounded-full flex-shrink-0 ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-black">Top Products</h3>
            <Link href="/vendor/products" className="font-body text-xs font-semibold text-gray-400 hover:text-black transition-colors">
              Manage
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 group cursor-pointer">
                <span className="font-display font-black text-gray-200 text-lg w-5 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-black line-clamp-1 group-hover:text-[#84D347] transition-colors">{p.name}</p>
                  <p className="font-body text-xs text-gray-400">{p.sales} sales</p>
                </div>
                <span className="font-display font-bold text-sm text-black flex-shrink-0">{p.revenue}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
            {[
              { icon: 'mdi:storefront-outline', label: 'View My Store', href: '#' },
              { icon: 'mdi:chart-line', label: 'Sales Analytics', href: '#' },
              { icon: 'mdi:cog-outline', label: 'Store Settings', href: '#' },
            ].map(item => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon icon={item.icon} className="text-sm" />
                </div>
                <span className="font-body font-semibold text-sm text-black">{item.label}</span>
                <Icon icon="lucide:chevron-right" className="ml-auto text-gray-300 group-hover:text-black transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
