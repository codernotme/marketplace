import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  sku: string;
}

interface PosState {
  cart: CartItem[];
  customer: { name: string; id?: string; email?: string } | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setCustomer: (customer: any) => void;
  
  // Computed
  subtotal: () => number;
  tax: () => number;
  total: () => number;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      cart: [],
      customer: null,

      addItem: (item) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.variantId === item.variantId);
        
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),

      clearCart: () => set({ cart: [], customer: null }),
      
      setCustomer: (customer) => set({ customer }),

      subtotal: () => {
        return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      tax: () => {
        return get().subtotal() * 0.05; // 5% GST example
      },

      total: () => {
        return get().subtotal() + get().tax();
      },
    }),
    {
      name: "pos-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
