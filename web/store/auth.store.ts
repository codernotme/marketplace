import { create } from 'zustand';

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
  isAuthenticated: boolean;
  role: 'customer' | 'vendor' | 'admin' | null;
  login: (tokens: TokenPair, user: User, role?: 'customer' | 'vendor' | 'admin') => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  role: null,
  login: (tokens, user, role = 'customer') => set({
    user,
    accessToken: tokens.accessToken,
    isAuthenticated: true,
    role
  }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false, role: null }),
  setUser: (user) => set({ user })
}));
