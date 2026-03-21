'use client';

import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/HeroUI';
import Link from 'next/link';

export const CartSummary = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const { items } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST mock
  const shipping = subtotal > 4999 ? 0 : 99;
  const total = items.length > 0 ? (subtotal + tax + shipping) : 0;

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 pb-4 border-b border-[--c-border]">
        <div className="flex justify-between text-sm">
          <span className="text-[--c-secondary]">Subtotal</span>
          <span className="font-mono font-medium text-[--c-primary]">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[--c-secondary]">Estimated Tax (18%)</span>
          <span className="font-mono font-medium text-[--c-primary]">
             {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(tax)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[--c-secondary]">Shipping</span>
          <span className="font-mono font-medium text-[--c-primary]">
            {shipping === 0 ? 'Free' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(shipping)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-end pb-6">
        <span className="text-[15px] font-semibold text-[--c-primary]">Total</span>
        <span className="font-mono text-xl font-bold text-[--c-primary]">
           {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)}
        </span>
      </div>

      {!isCheckout && (
        <Button 
          as={Link} 
          href="/checkout"
          className="w-full bg-[--c-primary] text-white rounded-full h-14 text-[15px] font-medium tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};
