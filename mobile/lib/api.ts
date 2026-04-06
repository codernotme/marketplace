import { addresses, blogPosts, categories, notifications, orders, products, reviews, storefrontContent } from '@/data/mock';

export const delay = async <T,>(value: T, ms = 180) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const fetchProducts = async () => delay(products);
export const fetchProductBySlug = async (slug: string) => delay(products.find((item) => item.slug === slug));
export const fetchCategories = async () => delay(categories);
export const fetchCategoryBySlug = async (slug: string) => delay(categories.find((item) => item.slug === slug));
export const fetchProductsByCategory = async (slug: string) => delay(products.filter((item) => item.category_id === categories.find((category) => category.slug === slug)?.id));
export const fetchProductReviews = async (productId: string) => delay(reviews.filter((review) => review.productId === productId));
export const fetchTrendingProducts = async () => delay(products.filter((item) => item.is_trending));
export const fetchFeaturedProducts = async () => delay(products.filter((item) => item.is_featured));
export const fetchNewArrivals = async () => delay(products.filter((item) => item.is_new));
export const fetchSearchResults = async (query: string) => delay(!query.trim() ? products : products.filter((item) => [item.title, item.brand, item.description, ...(item.tags || [])].join(' ').toLowerCase().includes(query.trim().toLowerCase())));
export const fetchBlogPosts = async () => delay(blogPosts);
export const fetchBlogPostBySlug = async (slug: string) => delay(blogPosts.find((item) => item.slug === slug));
export const fetchRelatedBlogPosts = async (slug: string, limit = 3) => delay(blogPosts.filter((item) => item.slug !== slug).slice(0, limit));
export const fetchNotifications = async () => delay(notifications);
export const fetchCustomerOrders = async () => delay(orders);
export const fetchCustomerOrderById = async (id: string) => delay(orders.find((item) => item.id === id));
export const fetchCustomerAddresses = async () => delay(addresses);
export const fetchTrackOrder = async (orderNumber: string, email: string) => delay(orders.find((item) => item.orderNumber === orderNumber && item.email.toLowerCase() === email.toLowerCase()));
export const fetchStorefrontContent = async () => delay(storefrontContent);
