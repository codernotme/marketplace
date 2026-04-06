import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantLabel: string;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  isDrawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  itemCount: 0,
  isDrawerOpen: false,
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    let newItems;
    if (existing) {
      newItems = state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
    } else {
      newItems = [...state.items, item];
    }
    return { items: newItems, itemCount: sumQty(newItems) };
  }),
  removeItem: (itemId) => set((state) => {
    const newItems = state.items.filter(i => i.id !== itemId);
    return { items: newItems, itemCount: sumQty(newItems) };
  }),
  updateQuantity: (itemId, qty) => set((state) => {
    const newItems = state.items.map(i => i.id === itemId ? { ...i, quantity: qty } : i);
    return { items: newItems, itemCount: sumQty(newItems) };
  }),
  clearCart: () => set({ items: [], itemCount: 0 }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false })
}));

function sumQty(items: CartItem[]) {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
