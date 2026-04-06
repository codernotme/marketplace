'use client';

import { useCartStore, CartItem as CartItemType } from '@/store/cart.store';
import { Image } from '@/components/HeroUI';
import { Icon } from '@iconify/react';

export const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-[--c-border] bg-white">
      <div className="w-20 h-24 bg-[--c-surface] rounded-xl flex-shrink-0 overflow-hidden">
        <Image src={item.image} alt={item.name} className="w-full h-full object-cover rounded-none" removeWrapper />
      </div>
      <div className="flex flex-col flex-1 pb-1">
        <div className="flex justify-between items-start gap-2">
           <div>
             <h4 className="font-body text-[15px] font-medium text-[--c-primary] leading-tight">{item.name}</h4>
             <span className="text-xs text-[--c-secondary] mt-1 block">Variant: {item.variantLabel}</span>
           </div>
           <button onClick={() => removeItem(item.id)} className="text-[--c-muted] hover:text-[--c-danger] transition-colors p-1">
             <Icon icon="lucide:x" className="w-4 h-4" />
           </button>
        </div>
        <div className="mt-auto flex justify-between items-end">
           <div className="flex items-center border border-[--c-border] rounded-full h-8">
              <button 
                className="w-8 h-full flex items-center justify-center text-[--c-secondary] hover:text-[--c-primary] disabled:opacity-50"
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                <Icon icon="lucide:minus" className="w-3 h-3" />
              </button>
              <span className="font-mono text-sm font-medium w-6 text-center text-[--c-primary]">{item.quantity}</span>
              <button 
                className="w-8 h-full flex items-center justify-center text-[--c-secondary] hover:text-[--c-primary]"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Icon icon="lucide:plus" className="w-3 h-3" />
              </button>
           </div>
           <div className="font-mono text-[15px] font-semibold text-[--c-primary]">
             {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
           </div>
        </div>
      </div>
    </div>
  );
};
