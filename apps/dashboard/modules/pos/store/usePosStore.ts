import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  variantId: string
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  taxRate: number
  imageUrl?: string
}

interface PosState {
  cart: CartItem[]
  selectedCustomer: any | null
  heldCarts: { id: string; cart: CartItem[]; customer: any | null; createdAt: number }[]
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  setCustomer: (customer: any | null) => void
  holdCart: () => void
  resumeCart: (id: string) => void
  deleteHeldCart: (id: string) => void
  
  // Computed
  subtotal: () => number
  taxTotal: () => number
  grandTotal: () => number
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedCustomer: null,
      heldCarts: [],

      addItem: (item) => {
        const cart = get().cart
        const existing = cart.find((i) => i.variantId === item.variantId)
        
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (variantId) => {
        set({ cart: get().cart.filter((i) => i.variantId !== variantId) })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set({
          cart: get().cart.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ cart: [], selectedCustomer: null }),

      setCustomer: (customer) => set({ selectedCustomer: customer }),

      holdCart: () => {
        const { cart, selectedCustomer, heldCarts } = get()
        if (cart.length === 0) return
        
        const newHeldCart = {
          id: Math.random().toString(36).substring(7),
          cart: [...cart],
          customer: selectedCustomer,
          createdAt: Date.now()
        }
        
        set({
          heldCarts: [newHeldCart, ...heldCarts],
          cart: [],
          selectedCustomer: null
        })
      },

      resumeCart: (id) => {
        const { heldCarts, cart } = get()
        const held = heldCarts.find(h => h.id === id)
        if (!held) return

        // If current cart is not empty, hold it first? 
        // For now just swap
        set({
          cart: held.cart,
          selectedCustomer: held.customer,
          heldCarts: heldCarts.filter(h => h.id !== id)
        })
      },

      deleteHeldCart: (id) => {
        set({ heldCarts: get().heldCarts.filter(h => h.id !== id) })
      },

      subtotal: () => {
        return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },

      taxTotal: () => {
        return get().cart.reduce(
          (acc, item) => acc + (item.price * item.quantity * item.taxRate) / 100,
          0
        )
      },

      grandTotal: () => {
        return get().subtotal() + get().taxTotal()
      },
    }),
    {
      name: 'themrktplace-pos-storage',
    }
  )
)
