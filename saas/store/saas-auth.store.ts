import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiBaseUrl } from "@/lib/api-url";

export interface SaasUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "support";
  avatar?: string;
}

interface SaasAuthStore {
  user: SaasUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: SaasUser) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

export const useSaasAuthStore = create<SaasAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/saas/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }

          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/saas/auth/refresh`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${get().token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Token refresh failed");
          }

          const data = await response.json();
          set({ token: data.token });
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null });
          throw error;
        }
      },
    }),
    {
      name: "saas-auth",
      version: 1,
    }
  )
);
