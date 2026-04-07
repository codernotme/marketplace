import { categories as localCategories, products as localProducts, reviews as localReviews, storefrontContent as localStorefrontContent } from '@/data/mock';

const localAddresses: CustomerAddress[] = [];
const localBlogPosts: BlogPost[] = [];
const localNotifications: NotificationRecord[] = [];
const localOrders: OrderRecord[] = [];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? 'demo';

type ApiResponse<T> = { data?: T; total?: number } | T;

const requestInit = {
  headers: {
    'X-Tenant-Slug': TENANT_SLUG,
  },
  cache: 'no-store' as const,
};

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, requestInit);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
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

function normalizeReview(review: any) {
  if (!review) return review;
  return {
    ...review,
    productId: review.productId ?? review.product_id,
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

function unwrapList<T>(response: ApiResponse<T[]> | null, fallback: T[]) {
  if (!response) return fallback;
  if (Array.isArray(response)) return response;
  return response.data ?? fallback;
}

function unwrapItem<T>(response: ApiResponse<T> | null, fallback: T | undefined = undefined) {
  if (!response) return fallback;
  if (Array.isArray(response)) return fallback;
  return ((response as { data?: T }).data ?? response) as T;
}

export type ProductType = typeof localProducts[0];
export type CategoryType = typeof localCategories[0];

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderTimelineEvent {
  status: string;
  note: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  imageUrl: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  email: string;
  createdAt: string;
  pricing: {
    subtotal: number;
    shippingFee: number;
    taxTotal: number;
    discountTotal: number;
    grandTotal: number;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus:
    | 'pending'
    | 'processing'
    | 'packed'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  shippingAddress: Omit<CustomerAddress, 'id' | 'isDefault' | 'label'>;
  items: OrderItem[];
  timeline: OrderTimelineEvent[];
}

export interface NotificationRecord {
  id: string;
  channel: 'email' | 'push' | 'in_app';
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  avatar: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
  content: string[];
  tags: string[];
}

export const fetchProducts = async () => {
  const productsResponse = await apiGet<ApiResponse<any[]>>('/shop/products?limit=100');
  const items = unwrapList(productsResponse, localProducts).map(normalizeProduct);
  return items;
};

export const fetchProductBySlug = async (slug: string) => {
  const response = await apiGet<ApiResponse<any>>(`/shop/products/${slug}`);
  const product = unwrapItem(response, localProducts.find((item) => item.slug === slug));
  return normalizeProduct(product);
};

export const fetchCategories = async () => {
  const response = await apiGet<ApiResponse<any[]>>('/shop/data/categories');
  return unwrapList(response, localCategories).map(normalizeCategory);
};

export const fetchCategoryBySlug = async (slug: string) => {
  const categories = await fetchCategories();
  return categories.find((item) => item.slug === slug);
};

export const fetchProductsByCategory = async (slug: string) => {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);
  const products = await fetchProducts();
  return products.filter((item) => item.category_id === category?.id || item.category_id === category?.slug);
};

export const fetchProductReviews = async (productId: string) => {
  const response = await apiGet<ApiResponse<any[]>>(`/shop/data/reviews?product_id=${encodeURIComponent(productId)}`);
  return unwrapList(response, localReviews.filter((review) => review.productId === productId)).map(normalizeReview);
};

export const fetchTrendingProducts = async () => (await fetchProducts()).filter((item) => item.is_trending);
export const fetchFeaturedProducts = async () => (await fetchProducts()).filter((item) => item.is_featured);
export const fetchNewArrivals = async () => (await fetchProducts()).filter((item) => item.is_new);

export const fetchSearchResults = async (query: string) => {
  const products = await fetchProducts();
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((item) => [item.title, item.brand, item.description, ...(item.tags || [])].join(' ').toLowerCase().includes(term));
};

export const fetchBlogPosts = async () => {
  const response = await apiGet<ApiResponse<any[]>>('/shop/data/blog-posts');
  return unwrapList(response, localBlogPosts) as BlogPost[];
};

export const fetchBlogPostBySlug = async (slug: string) => {
  const posts = await fetchBlogPosts();
  return posts.find((item) => item.slug === slug);
};

export const fetchRelatedBlogPosts = async (slug: string, limit = 3) => {
  const posts = await fetchBlogPosts();
  return posts.filter((item) => item.slug !== slug).slice(0, limit);
};

export const fetchNotifications = async () => {
  const response = await apiGet<ApiResponse<any[]>>('/shop/data/notifications');
  return unwrapList(response, localNotifications) as NotificationRecord[];
};

export const fetchCustomerOrders = async () => {
  const response = await apiGet<ApiResponse<any[]>>('/shop/data/orders');
  return unwrapList(response, localOrders).map(normalizeOrder);
};

export const fetchCustomerOrderById = async (id: string) => {
  const response = await apiGet<ApiResponse<any>>(`/shop/data/orders/${encodeURIComponent(id)}`);
  const order = unwrapItem(response, localOrders.find((item: OrderRecord) => item.id === id || item.orderNumber === id));
  return normalizeOrder(order);
};

export const fetchCustomerAddresses = async () => {
  const response = await apiGet<ApiResponse<any[]>>('/shop/data/addresses');
  return unwrapList(response, localAddresses) as CustomerAddress[];
};

export const fetchTrackOrder = async (orderNumber: string, email: string) => {
  const orders = await fetchCustomerOrders();
  return orders.find((item) => item.orderNumber === orderNumber && item.email.toLowerCase() === email.toLowerCase());
};

export const fetchStorefrontContent = async () => {
  const response = await apiGet('/shop/data/storefront-content');
  return response ?? localStorefrontContent;
};