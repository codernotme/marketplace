'use client';
import { useCartStore } from '@/store/cart.store';
import { Button, Image } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { PageWrapper } from '@/components/shared/PageWrapper';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-black mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F5F5] rounded-3xl">
            <Icon icon="mdi:cart-remove" className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <Button as={Link} href="/products" className="bg-black text-white rounded-full px-8 h-12 font-semibold hover:scale-105 transition-transform">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 flex flex-col gap-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 items-center p-4 border border-gray-100 rounded-3xl hover:shadow-sm transition-shadow">
                  <div className="w-24 h-24 bg-[#F5F5F5] rounded-2xl overflow-hidden flex-shrink-0 p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-gray-900 text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.variantLabel}</p>
                    <div className="font-display font-bold text-black mt-1">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#F5F5F5] rounded-full p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors text-black font-medium">-</button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors text-black font-medium">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Icon icon="lucide:x" className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-1">
              <div className="bg-[#F5F5F5] rounded-3xl p-8 sticky top-28">
                <h3 className="font-display text-xl font-bold text-black mb-6">Order Summary</h3>
                <div className="flex flex-col gap-4 text-sm font-medium text-gray-600 border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-black">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-display font-semibold text-lg text-black">Total</span>
                  <span className="font-display font-bold text-2xl text-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
                </div>
                <Button as={Link} href="/checkout" className="w-full bg-black text-white rounded-full h-14 font-bold text-lg hover:scale-[1.02] shadow-sm transition-transform">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
