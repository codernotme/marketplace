import { useSaasAuthStore } from "@/store/saas-auth.store";
import { getApiBaseUrl } from "@/lib/api-url";

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = getApiBaseUrl();
  }

  private getHeaders(): HeadersInit {
    const token = useSaasAuthStore.getState().token;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const rawBody = await response.text();
    if (!rawBody) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return JSON.parse(rawBody);
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return {
        message: `Expected JSON response but received ${contentType || "unknown content type"}`,
        raw: rawBody.slice(0, 180),
      };
    }
  }

  private extractErrorMessage(payload: unknown, fallback: string): string {
    if (!payload || typeof payload !== "object") {
      return fallback;
    }

    const data = payload as Record<string, unknown>;
    const direct = data.message;
    if (typeof direct === "string" && direct.trim()) {
      return direct;
    }

    const detail = data.detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    if (detail && typeof detail === "object") {
      const detailMessage = (detail as Record<string, unknown>).message;
      if (typeof detailMessage === "string" && detailMessage.trim()) {
        return detailMessage;
      }
    }

    return fallback;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const payload = await this.parseResponseBody(response);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try refresh
        try {
          await useSaasAuthStore.getState().refreshToken();
          return Promise.reject(new Error("Token refreshed, please retry"));
        } catch {
          useSaasAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }

      throw new Error(this.extractErrorMessage(payload, `HTTP ${response.status}`));
    }

    return (payload as T) ?? ({} as T);
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: "PATCH",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new APIClient();
