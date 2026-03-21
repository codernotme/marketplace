import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { products, categories } from '@/data/mock';

// We mock axios for this local implementation
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mock api methods
export const fetchProducts = async () => {
  return new Promise<typeof products>((resolve) => setTimeout(() => resolve(products), 500));
};

export const fetchProductBySlug = async (slug: string) => {
  return new Promise<typeof products[0] | undefined>((resolve) => setTimeout(() => {
    resolve(products.find(p => p.slug === slug));
  }, 500));
};

export const fetchCategories = async () => {
  return new Promise<typeof categories>((resolve) => setTimeout(() => resolve(categories), 500));
};
