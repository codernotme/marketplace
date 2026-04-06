import React, { createContext, useContext, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantLabel: string;
};

type AppContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['p1', 'p2', 'p5', 'p7']);

  const value = useMemo<AppContextValue>(() => ({
    cartItems,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    addToCart: (item, quantity = 1) => setCartItems((current) => {
      const existing = current.find((currentItem) => currentItem.id === item.id);
      if (existing) {
        return current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, quantity: currentItem.quantity + quantity } : currentItem);
      }

      return [...current, { ...item, quantity }];
    }),
    updateQuantity: (id, quantity) => setCartItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeFromCart: (id) => setCartItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setCartItems([]),
    wishlistIds,
    toggleWishlist: (productId) => setWishlistIds((current) => current.includes(productId) ? current.filter((item) => item !== productId) : [...current, productId]),
  }), [cartItems, wishlistIds]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
