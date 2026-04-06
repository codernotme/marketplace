'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';

const mockOrders = [
  { id: '#TMP-8821', date: 'Mar 20, 2026', status: 'Delivered', total: 348, items: 3, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&q=80' },
  { id: '#TMP-8734', date: 'Mar 15, 2026', status: 'Shipped', total: 159, items: 1, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=80&q=80' },
  { id: '#TMP-8651', date: 'Mar 10, 2026', status: 'Processing', total: 89, items: 2, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=80&q=80' },
  { id: '#TMP-8512', date: 'Feb 28, 2026', status: 'Delivered', total: 229, items: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&q=80' },
  { id: '#TMP-8401', date: 'Feb 20, 2026', status: 'Cancelled', total: 65, items: 1, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=80&q=80' },
];

const statusConfig: Record<string, { color: string; icon: string }> = {
  Delivered: { color: 'bg-green-50 text-green-700', icon: 'mdi:check-circle' },
  Shipped: { color: 'bg-blue-50 text-blue-700', icon: 'mdi:truck-delivery-outline' },
  Processing: { color: 'bg-amber-50 text-amber-700', icon: 'mdi:clock-outline' },
  Cancelled: { color: 'bg-red-50 text-red-600', icon: 'mdi:close-circle-outline' },
};

export default function UserOrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];
  const filtered = activeFilter === 'All' ? mockOrders : mockOrders.filter(o => o.status === activeFilter);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">My Account</p>
          <h1 className="font-display text-3xl font-bold text-black">Order History</h1>
        </div>
        <Link href="/products" className="bg-black text-white font-bold rounded-full px-5 h-10 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
          <Icon icon="mdi:plus" /> New Order
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`font-body text-sm font-semibold px-4 py-2 rounded-full transition-colors ${activeFilter === f ? 'bg-black text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#F5F5F5] rounded-3xl">
          <Icon icon="mdi:package-variant-remove" className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="font-display font-bold text-xl text-black mb-2">No orders here</p>
          <p className="text-gray-500 font-body text-sm">Looks like you haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status];
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Product thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                  <img src={order.image} alt="order" className="w-full h-full object-cover mix-blend-multiply" />
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Order ID</p>
                    <p className="font-display font-bold text-black text-sm">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Date</p>
                    <p className="font-body text-sm text-gray-700">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Total</p>
                    <p className="font-display font-bold text-black">${order.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Items</p>
                    <p className="font-body text-sm text-gray-700">{order.items} items</p>
                  </div>
                </div>

                {/* Status + Action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`flex items-center gap-1.5 font-body font-bold text-xs px-3 py-1.5 rounded-full ${cfg.color}`}>
                    <Icon icon={cfg.icon} /> {order.status}
                  </span>
                  <button className="font-body text-sm font-semibold text-gray-400 hover:text-black transition-colors border border-gray-200 rounded-full px-4 py-1.5 hover:border-black">
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
