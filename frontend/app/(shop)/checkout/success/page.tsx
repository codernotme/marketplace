import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen flex items-center justify-center p-6 font-body">
      <div className="max-w-lg w-full text-center">
        {/* Animated check circle */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          <div className="absolute inset-0 bg-[#84D347]/20 rounded-full animate-ping" />
          <div className="relative w-28 h-28 bg-[#84D347] rounded-full flex items-center justify-center shadow-xl">
            <Icon icon="mdi:check-bold" className="text-5xl text-black" />
          </div>
        </div>

        <h1 className="font-display text-5xl font-black text-black tracking-tight mb-3">
          Order Confirmed!
        </h1>
        <p className="font-body text-gray-500 text-lg mb-2">
          Thank you for shopping with <strong className="text-black">themrktplace</strong>!
        </p>
        <p className="font-body text-gray-400 text-sm mb-10">
          We&apos;ve sent your receipt and shipping details to your email address. Your order will arrive within 3–5 business days.
        </p>

        {/* Order summary card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 text-left">
          <h3 className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-4">Order Summary</h3>
          <div className="flex flex-col gap-3 text-sm font-body">
            {[
              { label: 'Order ID', value: '#TMP-9421' },
              { label: 'Date', value: 'March 21, 2026' },
              { label: 'Shipping to', value: '123 Main St, San Francisco, CA' },
              { label: 'Estimated Delivery', value: 'March 24–26, 2026' },
              { label: 'Total Charged', value: '$550.00' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-400 font-medium">{row.label}</span>
                <span className="font-semibold text-black">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/user/orders" className="flex-1 h-14 border-2 border-gray-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:border-black transition-colors font-body text-sm">
            <Icon icon="mdi:shopping-outline" /> Track Order
          </Link>
          <Link href="/products" className="flex-1 h-14 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg font-body text-sm">
            Continue Shopping <Icon icon="lucide:arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
