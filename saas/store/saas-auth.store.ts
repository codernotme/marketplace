import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiBaseUrl } from "@/lib/api-url";
import { SaasUser } from "@/types";

const SESSION_ENDPOINT = "/api/session";

async function createSession(token: string, refreshToken?: string | null): Promise<void> {
  await fetch(SESSION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, refreshToken }),
  });
}

async function clearSession(): Promise<void> {
  await fetch(SESSION_ENDPOINT, {
    method: "DELETE",
  });
}


async function parseBody(response: Response): Promise<Record<string, unknown> | null> {
  const rawBody = await response.text();
  if (!rawBody) {
    return null;
  }
  try {
    return JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return {
      message: `Expected JSON response but received non-JSON payload: ${rawBody.slice(0, 140)}`,
    };
  }
}

function normalizeAuthError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message?.trim();
  if (!message) {
    return fallback;
  }

  const lowered = message.toLowerCase();
  if (lowered.includes("failed to fetch") || lowered.includes("networkerror") || lowered.includes("err_connection_refused")) {
    return "Backend is unreachable on http://localhost:8000. Start backend server and retry signup/login.";
  }

  return message;
}

interface SaasAuthStore {
  user: SaasUser | null;
  token: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

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

          const data = (await parseBody(response)) ?? {};

          if (!response.ok) {
            const detail = (data.detail as Record<string, unknown> | undefined)?.message;
            const message =
              (typeof detail === "string" && detail) ||
              (typeof data.message === "string" ? data.message : "Login failed");
            throw new Error(message);
          }

          set({
            user: data.user as SaasUser,
            token: data.token as string,
            refreshTokenValue: data.refresh_token as string,
            isAuthenticated: true,
            isLoading: false,
          });
          await createSession(data.token as string, (data.refresh_token as string) || null);
        } catch (error) {
          const message = normalizeAuthError(error, "Login failed");
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/saas/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          const data = (await parseBody(response)) ?? {};

          if (!response.ok) {
            const detail = (data.detail as Record<string, unknown> | undefined)?.message;
            const message =
              (typeof detail === "string" && detail) ||
              (typeof data.message === "string" ? data.message : "Signup failed");
            throw new Error(message);
          }

          set({
            user: data.user as SaasUser,
            token: data.token as string,
            refreshTokenValue: data.refresh_token as string,
            isAuthenticated: true,
            isLoading: false,
          });
          await createSession(data.token as string, (data.refresh_token as string) || null);
        } catch (error) {
          const message = normalizeAuthError(error, "Signup failed");
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        void clearSession();
        set({
          user: null,
          token: null,
          refreshTokenValue: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        try {
          const refreshTokenValue = get().refreshTokenValue;
          if (!refreshTokenValue) {
            throw new Error("Missing refresh token");
          }

          const response = await fetch(`${getApiBaseUrl()}/api/saas/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshTokenValue }),
          });

          const data = (await parseBody(response)) ?? {};

          if (!response.ok) {
            throw new Error("Token refresh failed");
          }

          set({ token: data.token as string });
          await createSession(data.token as string, refreshTokenValue);
        } catch (error) {
          await clearSession();
          set({ isAuthenticated: false, user: null, token: null, refreshTokenValue: null });
          throw error;
        }
      },
    }),
    {
      name: "saas-auth",
      version: 3,
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as any;
        if (version < 3) {
          return {
            ...state,
            refreshTokenValue: null,
            error: null,
            isLoading: false,
            isAuthenticated: state.isAuthenticated ?? false,
            user: state.user ?? null,
            token: state.token ?? null,
          };
        }
        return state;
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          if (state.token) {
            void createSession(state.token, state.refreshTokenValue);
          } else {
            void clearSession();
          }
        }
      },
    }
  )
);
