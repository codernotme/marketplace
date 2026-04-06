import { Icon } from '@iconify/react';
import Link from 'next/link';

import { fetchCustomerOrders } from '@/lib/api';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  packed: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-violet-50 text-violet-700',
  out_for_delivery: 'bg-cyan-50 text-cyan-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus = (params.status || 'all').toLowerCase();
  const orders = await fetchCustomerOrders();

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter((order) => order.fulfillmentStatus.toLowerCase() === selectedStatus);

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="animate-in fade-in duration-300">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">My Orders</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">Order History</h1>

      <div className="flex gap-2 flex-wrap mb-7">
        {statuses.map((status) => {
          const isActive = selectedStatus === status;
          const href = status === 'all' ? '/account/orders' : `/account/orders?status=${status}`;

          return (
            <Link
              key={status}
              href={href}
              className={`px-4 h-9 rounded-full text-sm font-semibold transition-colors flex items-center ${
                isActive ? 'bg-black text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replaceAll('_', ' ')}
            </Link>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center">
          <Icon icon="mdi:package-variant-remove" className="mx-auto text-5xl text-gray-300 mb-3" />
          <h2 className="font-display text-2xl font-bold text-black mb-2">No orders found</h2>
          <p className="text-gray-500 text-sm mb-6">There are no orders for this status yet.</p>
          <Link href="/products" className="inline-flex items-center h-11 px-6 rounded-full bg-black text-white font-semibold text-sm">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Order</p>
                    <p className="font-display font-bold text-black text-sm">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Date</p>
                    <p className="text-sm text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Items</p>
                    <p className="text-sm text-gray-700 font-medium">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Total</p>
                    <p className="font-display font-bold text-black">${order.pricing.grandTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${statusColor[order.fulfillmentStatus] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {order.fulfillmentStatus.replaceAll('_', ' ')}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="h-9 px-4 rounded-full border border-gray-200 text-sm font-semibold text-black hover:border-black transition-colors flex items-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
