import { Icon } from '@iconify/react';
import Link from 'next/link';

import { fetchCustomerOrders, fetchNotifications } from '@/lib/api';

export default async function AccountOverviewPage() {
  const [orders, notifications] = await Promise.all([fetchCustomerOrders(), fetchNotifications()]);

  const recentOrders = orders.slice(0, 3);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const totalSpend = orders.reduce((sum, order) => sum + order.pricing.grandTotal, 0);

  return (
    <div className="animate-in fade-in duration-300">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">My Account</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight mb-8">Account Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: String(orders.length), icon: 'mdi:shopping-outline' },
          { label: 'Total Spend', value: `$${totalSpend.toFixed(2)}`, icon: 'mdi:currency-usd' },
          { label: 'Unread Alerts', value: String(unreadCount), icon: 'mdi:bell-outline' },
          { label: 'Saved Addresses', value: '2', icon: 'mdi:map-marker-outline' },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center mb-4">
              <Icon icon={card.icon} className="text-xl text-black" />
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">{card.label}</p>
            <p className="font-display text-2xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-black">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              View all
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F5F5] hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-display font-bold text-black text-base">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()} - {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-black">${order.pricing.grandTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase">{order.fulfillmentStatus.replaceAll('_', ' ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-black">Latest Notifications</h2>
            <Link href="/account/notifications" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              Manage
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.slice(0, 4).map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-[#F5F5F5] flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${item.read ? 'bg-gray-300' : 'bg-[#84D347]'}`} />
                <div>
                  <p className="text-sm font-semibold text-black">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
