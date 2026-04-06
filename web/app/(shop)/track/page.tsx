import { Icon } from '@iconify/react';
import Link from 'next/link';

import { fetchTrackOrder } from '@/lib/api';

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; email?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order || '';
  const email = params.email || '';

  const order = orderNumber && email ? await fetchTrackOrder(orderNumber, email) : undefined;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="mb-8 text-center">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Order Tracking</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-black tracking-tight mb-3">Track Your Order</h1>
          <p className="text-gray-500 text-sm md:text-base">Enter your order number and checkout email to view live status.</p>
        </div>

        <form action="/track" className="bg-[#F5F5F5] rounded-3xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 mb-8">
          <input
            name="order"
            defaultValue={orderNumber}
            placeholder="Order number (e.g. MKT-2026-00121)"
            className="h-12 rounded-xl bg-white px-4 text-sm outline-none border border-transparent focus:border-black"
          />
          <input
            name="email"
            defaultValue={email}
            placeholder="Email address"
            className="h-12 rounded-xl bg-white px-4 text-sm outline-none border border-transparent focus:border-black"
          />
          <button className="h-12 px-6 rounded-xl bg-black text-white text-sm font-semibold">Track</button>
        </form>

        {orderNumber && email && !order && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700 mb-6">
            We could not find an order with that order number and email combination.
          </div>
        )}

        {order && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Order</p>
                  <h2 className="font-display text-2xl font-bold text-black">{order.orderNumber}</h2>
                </div>
                <span className="text-xs uppercase font-bold bg-[#F5F5F5] text-black rounded-full px-3 py-1.5">
                  {order.fulfillmentStatus.replaceAll('_', ' ')}
                </span>
              </div>

              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={`${event.status}-${event.createdAt}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                        <Icon icon="mdi:check" className="text-xs" />
                      </div>
                      {index !== order.timeline.length - 1 && <div className="w-px h-7 bg-gray-200 mt-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase text-black">{event.status.replaceAll('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{event.note}</p>
                      <p className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-black mb-4">Shipment</h3>
              <p className="text-sm text-gray-600 mb-2">
                Courier: <span className="text-black font-semibold">{order.courier || 'Not assigned'}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Tracking #: <span className="text-black font-semibold">{order.trackingNumber || 'Pending'}</span>
              </p>
              <Link href={`/account/orders/${order.id}`} className="inline-flex h-10 px-4 rounded-full bg-black text-white text-sm font-semibold items-center">
                Open Full Details
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
