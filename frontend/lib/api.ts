import { products, categories, reviews } from '@/data/mock';

// Re-export types as needed
export type ProductType = typeof products[0];
export type CategoryType = typeof categories[0];

// Mock api methods
export const fetchProducts = async () => {
  return new Promise<typeof products>((resolve) => setTimeout(() => resolve(products), 300));
};

export const fetchProductBySlug = async (slug: string) => {
  return new Promise<typeof products[0] | undefined>((resolve) => setTimeout(() => {
    resolve(products.find(p => p.slug === slug));
  }, 300));
};

export const fetchCategories = async () => {
  return new Promise<typeof categories>((resolve) => setTimeout(() => resolve(categories), 300));
};

export const fetchCategoryBySlug = async (slug: string) => {
  return new Promise<typeof categories[0] | undefined>((resolve) => setTimeout(() => {
    resolve(categories.find(c => c.slug === slug));
  }, 300));
};

export const fetchProductsByCategory = async (categorySlug: string) => {
  const cat = categories.find(c => c.slug === categorySlug);
  if (!cat) return [];
  return new Promise<typeof products>((resolve) => setTimeout(() => {
    resolve(products.filter(p => p.category_id === cat.id));
  }, 300));
};

export const fetchProductReviews = async (productId: string) => {
  return new Promise<typeof reviews>((resolve) => setTimeout(() => {
    resolve(reviews.filter(r => r.productId === productId));
  }, 300));
};

export const fetchTrendingProducts = async () => {
  return new Promise<typeof products>((resolve) => setTimeout(() => {
    resolve(products.filter(p => p.is_trending));
  }, 300));
};

