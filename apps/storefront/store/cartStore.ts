import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartLineItem {
  variantId: string
  productName: string
  sku: string
  size?: string
  color?: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartStoreState {
  items: CartLineItem[]
  addItem: (item: Omit<CartLineItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }],
          }
        })
      },
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }))
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'themrktplace-customer-cart',
    }
  )
)

