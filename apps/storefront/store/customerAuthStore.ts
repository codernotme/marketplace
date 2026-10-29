import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  loyaltyPoints?: number
  storeCredit?: number
}

interface CustomerAuthState {
  customer: CustomerProfile | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (token: string, customer: CustomerProfile) => void
  logout: () => void
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      customer: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token, customer) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token)
        }
        set({ customer, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
        }
        set({ customer: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'themrktplace-customer-auth',
    }
  )
)

