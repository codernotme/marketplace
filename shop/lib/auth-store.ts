"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "demo";
const API_BASE = "/api/backend/shop/auth";

type ShopUser = {
  id: string;
  tenant_id?: string;
  tenant_slug?: string;
  name: string;
  email: string;
  role: string;
  plan_code?: string;
  plan_name?: string;
  module_access?: Array<"shop" | "web" | "app">;
  is_active?: boolean;
  is_email_verified?: boolean;
};

type ShopAuthState = {
  user: ShopUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string | null }) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  clearError: () => void;
  logout: () => void;
  setHydrated: (value: boolean) => void;
};

function parseApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const value = data as {
    detail?: string | { message?: string };
    message?: string;
  };

  if (typeof value.detail === "string") {
    return value.detail;
  }
  if (value.detail && typeof value.detail === "object" && typeof value.detail.message === "string") {
    return value.detail.message;
  }
  if (typeof value.message === "string") {
    return value.message;
  }

  return fallback;
}

export const useShopAuthStore = create<ShopAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      setHydrated: (value) => set({ isHydrated: value }),

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Slug": TENANT_SLUG,
            },
            body: JSON.stringify({ email, password }),
          });

          const data = (await response.json()) as {
            token?: string;
            refresh_token?: string;
            user?: ShopUser;
          };

          if (!response.ok || !data.token || !data.user) {
            const message = parseApiError(data, "Unable to sign in. Please check your credentials.");
            throw new Error(message);
          }

          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("tenant_id", data.user.tenant_id ?? "");
          }

          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refresh_token ?? null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          set({ isLoading: false, error: message, isAuthenticated: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Slug": TENANT_SLUG,
            },
            body: JSON.stringify(payload),
          });

          const data = (await response.json()) as { message?: string };
          if (!response.ok) {
            throw new Error(parseApiError(data, "Unable to create account."));
          }

          set({ isLoading: false, error: null });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      verifyEmailOtp: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE}/verify-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Slug": TENANT_SLUG,
            },
            body: JSON.stringify({ email, otp }),
          });

          const data = (await response.json()) as {
            token?: string;
            refresh_token?: string;
            user?: ShopUser;
          };

          if (!response.ok || !data.token || !data.user) {
            throw new Error(parseApiError(data, "OTP verification failed."));
          }

          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("tenant_id", data.user.tenant_id ?? "");
          }

          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refresh_token ?? null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "OTP verification failed";
          set({ isLoading: false, error: message, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("tenant_id");
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "shop-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
