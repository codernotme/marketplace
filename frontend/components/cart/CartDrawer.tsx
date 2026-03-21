'use client';

import { useCartStore } from '@/store/cart.store';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer, items, itemCount } = useCartStore();

  return (
    <Drawer isOpen={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} placement="right" size="sm" classNames={{ base: "bg-white", header: "border-b border-[--c-border] px-6 py-4", body: "px-6 py-0 scrollbar-hide", footer: "border-t border-[--c-border] px-6 py-6" }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2">
          <Icon icon="lucide:shopping-bag" className="text-[--c-primary] text-xl" />
          <span className="font-display text-xl font-medium tracking-tight text-[--c-primary]">Your Cart</span>
          <span className="text-sm font-body font-normal text-[--c-secondary] bg-[--c-surface] px-2 py-0.5 rounded-full ml-1">{itemCount}</span>
        </DrawerHeader>
        
        <DrawerBody>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-[--c-secondary]">
              <Icon icon="lucide:shopping-bag" className="text-6xl text-[--c-border] mb-4" />
              <h3 className="text-lg font-medium text-[--c-primary]">Your cart is empty</h3>
              <p className="text-sm">Looks like you haven't added anything yet.</p>
              <Button 
                 onPress={closeDrawer}
                 className="mt-6 bg-[--c-surface] text-[--c-primary] rounded-full px-8 font-medium hover:bg-[--c-border-hover]"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </DrawerBody>
        
        {items.length > 0 && (
          <DrawerFooter className="flex-col">
            <CartSummary />
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
