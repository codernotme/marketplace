"use server"

import { mockProducts, mockCategories, Product, Category } from "./mock-data";

export async function getProducts(options?: { categorySlug?: string, limit?: number }): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let products = [...mockProducts];
  if (options?.categorySlug) {
    products = products.filter(p => p.category.slug === options.categorySlug);
  }
  if (options?.limit) {
    products = products.slice(0, options.limit);
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(p => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
}
