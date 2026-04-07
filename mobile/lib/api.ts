import { addresses as localAddresses, blogPosts as localBlogPosts, categories as localCategories, notifications as localNotifications, orders as localOrders, products as localProducts, reviews as localReviews, storefrontContent as localStorefrontContent } from '@/data/mock';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
const TENANT_SLUG = process.env.EXPO_PUBLIC_TENANT_SLUG ?? 'demo';

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'X-Tenant-Slug': TENANT_SLUG,
      },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function unwrapList<T>(response: any, fallback: T[]) {
  if (!response) return fallback;
  if (Array.isArray(response)) return response;
  return response.data ?? fallback;
}

function unwrapItem<T>(response: any, fallback?: T) {
  if (!response) return fallback;
  if (Array.isArray(response)) return fallback;
  return response.data ?? response;
}

function normalizeProduct(product: any) {
  if (!product) return product;
  return {
    ...product,
    comparePrice: product.comparePrice ?? product.compare_price ?? null,
    ratings_avg: product.ratings_avg ?? product.ratingsAvg ?? 0,
    ratings_count: product.ratings_count ?? product.ratingsCount ?? 0,
    is_new: product.is_new ?? product.flags?.is_new ?? false,
    is_trending: product.is_trending ?? product.flags?.is_trending ?? false,
    is_featured: product.is_featured ?? product.flags?.is_featured ?? false,
  };
}

function normalizeCategory(category: any) {
  if (!category) return category;
  return {
    ...category,
    count: category.count ?? category.productCount ?? 0,
    is_active: category.is_active ?? category.isActive ?? true,
  };
}

function normalizeOrder(order: any) {
  if (!order) return order;
  return {
    ...order,
    orderNumber: order.orderNumber ?? order.order_number,
    paymentStatus: order.paymentStatus ?? order.payment_status,
    fulfillmentStatus: order.fulfillmentStatus ?? order.fulfillment_status,
    trackingNumber: order.trackingNumber ?? order.tracking_number,
    createdAt: order.createdAt ?? order.created_at,
  };
}

export const fetchProducts = async () => {
  const productsResponse = await apiGet<any>('/shop/products?limit=100');
  return unwrapList(productsResponse, localProducts).map(normalizeProduct);
};

export const fetchProductBySlug = async (slug: string) => {
  const response = await apiGet<any>(`/shop/products/${slug}`);
  return normalizeProduct(unwrapItem(response, localProducts.find((item) => item.slug === slug)));
};

export const fetchCategories = async () => {
  const response = await apiGet<any>('/shop/data/categories');
  return unwrapList(response, localCategories).map(normalizeCategory);
};

export const fetchCategoryBySlug = async (slug: string) => {
  const categories = await fetchCategories();
  return categories.find((item: any) => item.slug === slug);
};

export const fetchProductsByCategory = async (slug: string) => {
  const categories = await fetchCategories();
  const category = categories.find((item: any) => item.slug === slug);
  const products = await fetchProducts();
  return products.filter((item: any) => item.category_id === category?.id || item.category_id === category?.slug);
};

export const fetchProductReviews = async (productId: string) => {
  const response = await apiGet<any>(`/shop/data/reviews?product_id=${encodeURIComponent(productId)}`);
  const fallback = localReviews.filter((item) => item.productId === productId);
  return unwrapList(response, fallback);
};

export const fetchTrendingProducts = async () => (await fetchProducts()).filter((item: any) => item.is_trending);
export const fetchFeaturedProducts = async () => (await fetchProducts()).filter((item: any) => item.is_featured);
export const fetchNewArrivals = async () => (await fetchProducts()).filter((item: any) => item.is_new);

export const fetchSearchResults = async (query: string) => {
  const products = await fetchProducts();
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((item: any) => [item.title, item.brand, item.description, ...(item.tags || [])].join(' ').toLowerCase().includes(term));
};

export const fetchBlogPosts = async () => {
  const response = await apiGet<any>('/shop/data/blog-posts');
  return unwrapList(response, localBlogPosts);
};

export const fetchBlogPostBySlug = async (slug: string) => {
  const posts = await fetchBlogPosts();
  return posts.find((item: any) => item.slug === slug);
};

export const fetchRelatedBlogPosts = async (slug: string, limit = 3) => {
  const posts = await fetchBlogPosts();
  return posts.filter((item: any) => item.slug !== slug).slice(0, limit);
};

export const fetchNotifications = async () => {
  const response = await apiGet<any>('/shop/data/notifications');
  return unwrapList(response, localNotifications);
};

export const fetchCustomerOrders = async () => {
  const response = await apiGet<any>('/shop/data/orders');
  return unwrapList(response, localOrders).map(normalizeOrder);
};

export const fetchCustomerOrderById = async (id: string) => {
  const response = await apiGet<any>(`/shop/data/orders/${encodeURIComponent(id)}`);
  const fallback = localOrders.find((item) => item.id === id || item.orderNumber === id);
  return normalizeOrder(unwrapItem(response, fallback));
};

export const fetchCustomerAddresses = async () => {
  const response = await apiGet<any>('/shop/data/addresses');
  return unwrapList(response, localAddresses);
};

export const fetchTrackOrder = async (orderNumber: string, email: string) => {
  const orders = await fetchCustomerOrders();
  return orders.find((item: any) => item.orderNumber === orderNumber && item.email.toLowerCase() === email.toLowerCase());
};

export const fetchStorefrontContent = async () => localStorefrontContent;