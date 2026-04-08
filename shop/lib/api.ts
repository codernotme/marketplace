import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/shop",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add tenant ID and auth token if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isClient = typeof window !== "undefined";
  const tenantId = isClient ? localStorage.getItem("tenant_id") : null;
  const token = isClient ? localStorage.getItem("token") : null;

  if (tenantId && config.headers) config.headers["X-Tenant-ID"] = tenantId;
  if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

export const createOrder = async (orderData: any) => {
  const response = await api.post("/orders/create", orderData);
  return response.data;
};

export const fetchProducts = async (params: any = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const fetchShopKpi = async () => {
  const response = await api.get("/data/kpi");
  return response.data?.data ?? {};
};

export const fetchShopAnalytics = async () => {
  const response = await api.get("/data/analytics");
  return response.data?.data ?? {};
};

export const fetchShopOrders = async (params: any = {}) => {
  const response = await api.get("/data/orders", { params });
  return response.data?.data ?? [];
};

export default api;
