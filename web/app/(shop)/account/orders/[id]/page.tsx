import { Icon } from '@iconify/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fetchCustomerOrderById } from '@/lib/api';

const statusOrder = ['pending', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await fetchCustomerOrderById(id);

  if (!order) {
    notFound();
  }

  const progressIndex = statusOrder.indexOf(order.fulfillmentStatus);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Order Detail</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-black">{order.orderNumber}</h1>
        </div>
        <Link href="/account/orders" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
          Back to orders
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold text-black mb-5">Items</h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="bg-[#F5F5F5] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.variantLabel || 'Default variant'} - Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-display font-bold text-black">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold text-black mb-5">Tracking Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={`${event.status}-${event.createdAt}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        progressIndex >= 0 && index <= progressIndex ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon icon="mdi:check" className="text-sm" />
                    </div>
                    {index !== order.timeline.length - 1 && <div className="w-px h-8 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold uppercase text-black">{event.status.replaceAll('_', ' ')}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-black mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">${order.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-black">${order.pricing.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-semibold text-black">${order.pricing.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-semibold text-black">-${order.pricing.discountTotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="font-display font-bold text-black">${order.pricing.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-black mb-4">Shipping Address</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-10 px-4 rounded-full bg-black text-white text-sm font-semibold items-center"
              >
                Track Shipment
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
