import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? 'demo';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: 'customer' | null;
  
  // Backward compatibility with mock forms
  login: (tokensOrEmail: TokenPair | string, userOrPassword?: User | string, role?: 'customer') => void | Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      role: null,

      login: async (tokensOrEmail, userOrPassword, role = 'customer') => {
        // If it's the old signature (TokenPair, User)
        if (typeof tokensOrEmail === 'object' && typeof userOrPassword === 'object') {
          set({
            user: userOrPassword,
            accessToken: tokensOrEmail.accessToken,
            refreshTokenValue: tokensOrEmail.refreshToken,
            isAuthenticated: true,
            role
          });
          return;
        }

        // New signature (email, password)
        const email = tokensOrEmail as string;
        const password = userOrPassword as string;
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE_URL}/shop/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Tenant-Slug': TENANT_SLUG },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || data.message || 'Login failed');
          set({
            user: data.user,
            accessToken: data.token,
            refreshTokenValue: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            role: 'customer'
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE_URL}/shop/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Tenant-Slug': TENANT_SLUG },
            body: JSON.stringify({ name, email, password, phone: null })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || data.message || 'Registration failed');
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => set({ user: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false, role: null, error: null }),
      setUser: (user) => set({ user })
    }),
    { name: 'web-auth-store' }
  )
);
