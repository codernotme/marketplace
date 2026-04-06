// ──────────────────────────────────────────────────
// Site / Store Configuration
// ──────────────────────────────────────────────────
export const siteConfig = {
  name: "Luminary Store",
  tagline: "Premium Marketplace for Modern Living",
  currency: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  language: "en",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  socialLinks: {
    instagram: "https://instagram.com/luminarystore",
    twitter: "https://twitter.com/luminarystore",
    facebook: "https://facebook.com/luminarystore",
  },
  contactEmail: "support@luminarystore.com",
  phone: "+91 98765 43210",
  address: "42, Innovation Hub, Koramangala, Bengaluru - 560034",
};

// ──────────────────────────────────────────────────
// Admin User
// ──────────────────────────────────────────────────
export const adminUser = {
  id: "usr_admin",
  name: "Aryan Sharma",
  email: "aryan@luminarystore.com",
  role: "admin",
  avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Aryan",
  lastLogin: "2026-04-06T09:30:00Z",
};

// ──────────────────────────────────────────────────
// Dashboard KPIs
// ──────────────────────────────────────────────────
export const kpiData = {
  todayRevenue: 48250,
  todayOrders: 23,
  todayCustomers: 8,
  totalRevenue: 4820500,
  totalOrders: 2341,
  totalProducts: 528,
  totalCustomers: 1289,
  pendingOrders: 47,
  lowStockItems: 12,
  pendingQueries: 8,
  telegramBotStatus: "active" as "active" | "inactive",
  weeklyRevenue: [12800, 18200, 14500, 21300, 19600, 25100, 48250],
  weeklyDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  monthlyRevenue: [
    { month: "Oct", revenue: 285000 },
    { month: "Nov", revenue: 312000 },
    { month: "Dec", revenue: 498000 },
    { month: "Jan", revenue: 345000 },
    { month: "Feb", revenue: 389000 },
    { month: "Mar", revenue: 421000 },
    { month: "Apr", revenue: 48250 },
  ],
  revenueThisMonth: 421000,
  revenueLastMonth: 389000,
};

// ──────────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────────
export const categories = [
  { id: "cat_1", name: "Electronics", slug: "electronics", parentId: null, icon: "solar:cpu-bolt-bold-duotone", image: "", isActive: true, productCount: 142, sortOrder: 1 },
  { id: "cat_2", name: "Smartphones", slug: "smartphones", parentId: "cat_1", icon: "solar:phone-bold-duotone", image: "", isActive: true, productCount: 58, sortOrder: 1 },
  { id: "cat_3", name: "Laptops", slug: "laptops", parentId: "cat_1", icon: "solar:laptop-bold-duotone", image: "", isActive: true, productCount: 34, sortOrder: 2 },
  { id: "cat_4", name: "Fashion", slug: "fashion", parentId: null, icon: "solar:t-shirt-bold-duotone", image: "", isActive: true, productCount: 218, sortOrder: 2 },
  { id: "cat_5", name: "Men's Clothing", slug: "mens-clothing", parentId: "cat_4", icon: "solar:men-bold-duotone", image: "", isActive: true, productCount: 98, sortOrder: 1 },
  { id: "cat_6", name: "Women's Clothing", slug: "womens-clothing", parentId: "cat_4", icon: "solar:women-bold-duotone", image: "", isActive: true, productCount: 120, sortOrder: 2 },
  { id: "cat_7", name: "Home & Living", slug: "home-living", parentId: null, icon: "solar:home-bold-duotone", image: "", isActive: true, productCount: 95, sortOrder: 3 },
  { id: "cat_8", name: "Sports & Fitness", slug: "sports-fitness", parentId: null, icon: "solar:running-round-bold-duotone", image: "", isActive: true, productCount: 73, sortOrder: 4 },
];

// ──────────────────────────────────────────────────
// Brands
// ──────────────────────────────────────────────────
export const brands = [
  { id: "brand_1", name: "Apple", slug: "apple", logo: "", isActive: true, productCount: 45 },
  { id: "brand_2", name: "Samsung", slug: "samsung", logo: "", isActive: true, productCount: 62 },
  { id: "brand_3", name: "Nike", slug: "nike", logo: "", isActive: true, productCount: 88 },
  { id: "brand_4", name: "Adidas", slug: "adidas", logo: "", isActive: true, productCount: 74 },
  { id: "brand_5", name: "Sony", slug: "sony", logo: "", isActive: true, productCount: 38 },
  { id: "brand_6", name: "Puma", slug: "puma", logo: "", isActive: true, productCount: 52 },
];

// ──────────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────────
export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  images: string[];
  tags: string[];
  updatedAt: string;
  salesCount: number;
}

export const products: Product[] = [
  { id: "prod_1", title: "Apple iPhone 15 Pro Max 256GB", slug: "apple-iphone-15-pro-max", sku: "APL-IP15PM-256", category: "Smartphones", brand: "Apple", price: 149900, comparePrice: 159900, costPrice: 128000, stock: 28, lowStockThreshold: 10, status: "active", isNew: true, isFeatured: true, isBestSeller: true, isTrending: true, images: [], tags: ["smartphone", "apple", "5g"], updatedAt: "2026-04-05T12:00:00Z", salesCount: 312 },
  { id: "prod_2", title: "Samsung Galaxy S24 Ultra 512GB", slug: "samsung-galaxy-s24-ultra", sku: "SAM-GS24U-512", category: "Smartphones", brand: "Samsung", price: 134999, comparePrice: 144999, costPrice: 112000, stock: 0, lowStockThreshold: 5, status: "active", isNew: true, isFeatured: true, isBestSeller: false, isTrending: true, images: [], tags: ["smartphone", "samsung", "5g"], updatedAt: "2026-04-04T10:00:00Z", salesCount: 198 },
  { id: "prod_3", title: "Sony WH-1000XM5 Noise Cancelling Headphones", slug: "sony-wh1000xm5", sku: "SNY-WH1000XM5", category: "Electronics", brand: "Sony", price: 29990, comparePrice: 35000, costPrice: 22000, stock: 45, lowStockThreshold: 8, status: "active", isNew: false, isFeatured: false, isBestSeller: true, isTrending: false, images: [], tags: ["audio", "headphones", "noise-cancelling"], updatedAt: "2026-04-03T08:00:00Z", salesCount: 475 },
  { id: "prod_4", title: "Nike Air Max 270 React", slug: "nike-air-max-270-react", sku: "NKE-AM270R-10", category: "Sports & Fitness", brand: "Nike", price: 12995, comparePrice: 15000, costPrice: 8000, stock: 7, lowStockThreshold: 10, status: "active", isNew: false, isFeatured: true, isBestSeller: false, isTrending: true, images: [], tags: ["shoes", "running", "nike"], updatedAt: "2026-04-02T15:00:00Z", salesCount: 632 },
  { id: "prod_5", title: "MacBook Pro 16\" M3 Pro 512GB", slug: "macbook-pro-16-m3", sku: "APL-MBP16-M3-512", category: "Laptops", brand: "Apple", price: 249900, comparePrice: 259900, costPrice: 210000, stock: 15, lowStockThreshold: 5, status: "active", isNew: true, isFeatured: true, isBestSeller: false, isTrending: false, images: [], tags: ["laptop", "apple", "m3"], updatedAt: "2026-04-01T09:00:00Z", salesCount: 89 },
  { id: "prod_6", title: "Adidas Ultraboost 22 Running Shoes", slug: "adidas-ultraboost-22", sku: "ADI-UB22-WHT-10", category: "Sports & Fitness", brand: "Adidas", price: 16999, comparePrice: 18999, costPrice: 11000, stock: 32, lowStockThreshold: 10, status: "active", isNew: false, isFeatured: false, isBestSeller: true, isTrending: false, images: [], tags: ["shoes", "running", "adidas"], updatedAt: "2026-03-30T14:00:00Z", salesCount: 541 },
  { id: "prod_7", title: "Puma RS-X3 Puzzle Sneakers", slug: "puma-rsx3-puzzle", sku: "PMA-RSX3-PUZ-9", category: "Fashion", brand: "Puma", price: 8499, comparePrice: 9999, costPrice: 5200, stock: 3, lowStockThreshold: 8, status: "active", isNew: false, isFeatured: false, isBestSeller: false, isTrending: false, images: [], tags: ["shoes", "casual", "puma"], updatedAt: "2026-03-28T11:00:00Z", salesCount: 128 },
  { id: "prod_8", title: "Samsung 49\" OLED Curved Monitor", slug: "samsung-49-oled-curved", sku: "SAM-OLED49C", category: "Electronics", brand: "Samsung", price: 89990, comparePrice: 99990, costPrice: 72000, stock: 0, lowStockThreshold: 3, status: "draft", isNew: true, isFeatured: false, isBestSeller: false, isTrending: false, images: [], tags: ["monitor", "curved", "gaming"], updatedAt: "2026-03-25T09:00:00Z", salesCount: 0 },
];

// ──────────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "upi" | "cod" | "netbanking";

export interface Order {
  id: string;
  orderNumber: string;
  customer: { id: string; name: string; email: string; phone: string };
  items: { productId: string; title: string; variant: string; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fulfillmentStatus: OrderStatus;
  shippingAddress: { line1: string; city: string; state: string; pincode: string };
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  updatedAt: string;
  source: "web" | "mobile" | "admin";
}

export const orders: Order[] = [
  { id: "ord_1", orderNumber: "ORD-2026-4521", customer: { id: "cust_1", name: "Priya Mehta", email: "priya@example.com", phone: "9876543210" }, items: [{ productId: "prod_1", title: "Apple iPhone 15 Pro Max", variant: "256GB / Black", qty: 1, price: 149900 }], subtotal: 149900, shippingCost: 0, tax: 26982, discount: 5000, total: 171882, paymentStatus: "paid", paymentMethod: "razorpay", fulfillmentStatus: "shipped", shippingAddress: { line1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" }, trackingNumber: "DEL123456789", courier: "Delhivery", createdAt: "2026-04-06T08:30:00Z", updatedAt: "2026-04-06T10:00:00Z", source: "web" },
  { id: "ord_2", orderNumber: "ORD-2026-4520", customer: { id: "cust_2", name: "Rahul Gupta", email: "rahul@example.com", phone: "9765432109" }, items: [{ productId: "prod_3", title: "Sony WH-1000XM5", variant: "Black", qty: 1, price: 29990 }, { productId: "prod_6", title: "Adidas Ultraboost 22", variant: "White / 10", qty: 2, price: 16999 }], subtotal: 63988, shippingCost: 99, tax: 11517, discount: 0, total: 75604, paymentStatus: "paid", paymentMethod: "upi", fulfillmentStatus: "processing", shippingAddress: { line1: "5, Sector 18", city: "Noida", state: "Uttar Pradesh", pincode: "201301" }, createdAt: "2026-04-06T07:15:00Z", updatedAt: "2026-04-06T09:00:00Z", source: "mobile" },
  { id: "ord_3", orderNumber: "ORD-2026-4519", customer: { id: "cust_3", name: "Ananya Singh", email: "ananya@example.com", phone: "9654321098" }, items: [{ productId: "prod_5", title: "MacBook Pro 16\" M3", variant: "512GB / Silver", qty: 1, price: 249900 }], subtotal: 249900, shippingCost: 0, tax: 44982, discount: 10000, total: 284882, paymentStatus: "paid", paymentMethod: "netbanking", fulfillmentStatus: "pending", shippingAddress: { line1: "8, Anna Salai", city: "Chennai", state: "Tamil Nadu", pincode: "600002" }, createdAt: "2026-04-06T06:00:00Z", updatedAt: "2026-04-06T06:00:00Z", source: "web" },
  { id: "ord_4", orderNumber: "ORD-2026-4518", customer: { id: "cust_4", name: "Vikram Patel", email: "vikram@example.com", phone: "9543210987" }, items: [{ productId: "prod_4", title: "Nike Air Max 270", variant: "White / 10", qty: 1, price: 12995 }], subtotal: 12995, shippingCost: 49, tax: 2339, discount: 0, total: 15383, paymentStatus: "paid", paymentMethod: "cod", fulfillmentStatus: "delivered", shippingAddress: { line1: "23, FC Road", city: "Pune", state: "Maharashtra", pincode: "411005" }, trackingNumber: "SHR987654321", courier: "Shiprocket", createdAt: "2026-04-04T14:00:00Z", updatedAt: "2026-04-06T11:00:00Z", source: "web" },
  { id: "ord_5", orderNumber: "ORD-2026-4517", customer: { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com", phone: "9432109876" }, items: [{ productId: "prod_2", title: "Samsung Galaxy S24 Ultra", variant: "512GB / Titanium Gray", qty: 1, price: 134999 }], subtotal: 134999, shippingCost: 0, tax: 24299, discount: 5000, total: 154298, paymentStatus: "failed", paymentMethod: "razorpay", fulfillmentStatus: "cancelled", shippingAddress: { line1: "17, Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: "500034" }, createdAt: "2026-04-05T16:00:00Z", updatedAt: "2026-04-05T17:00:00Z", source: "mobile" },
  { id: "ord_6", orderNumber: "ORD-2026-4516", customer: { id: "cust_1", name: "Priya Mehta", email: "priya@example.com", phone: "9876543210" }, items: [{ productId: "prod_7", title: "Puma RS-X3 Puzzle", variant: "Multi / 9", qty: 1, price: 8499 }], subtotal: 8499, shippingCost: 49, tax: 1529, discount: 500, total: 9577, paymentStatus: "paid", paymentMethod: "upi", fulfillmentStatus: "delivered", shippingAddress: { line1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" }, trackingNumber: "DEL098765432", courier: "Delhivery", createdAt: "2026-04-03T10:00:00Z", updatedAt: "2026-04-05T14:00:00Z", source: "web" },
];

// ──────────────────────────────────────────────────
// Customers
// ──────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  tags: string[];
  joinedAt: string;
  lastOrderAt: string;
  city: string;
  state: string;
  isActive: boolean;
}

export const customers: Customer[] = [
  { id: "cust_1", name: "Priya Mehta", email: "priya@example.com", phone: "9876543210", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Priya", totalOrders: 8, totalSpent: 342500, avgOrderValue: 42812, tags: ["vip", "repeat"], joinedAt: "2025-06-15T00:00:00Z", lastOrderAt: "2026-04-06T08:30:00Z", city: "Bengaluru", state: "Karnataka", isActive: true },
  { id: "cust_2", name: "Rahul Gupta", email: "rahul@example.com", phone: "9765432109", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul", totalOrders: 5, totalSpent: 185000, avgOrderValue: 37000, tags: ["regular"], joinedAt: "2025-08-20T00:00:00Z", lastOrderAt: "2026-04-06T07:15:00Z", city: "Noida", state: "Uttar Pradesh", isActive: true },
  { id: "cust_3", name: "Ananya Singh", email: "ananya@example.com", phone: "9654321098", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ananya", totalOrders: 3, totalSpent: 498000, avgOrderValue: 166000, tags: ["premium", "vip"], joinedAt: "2025-07-10T00:00:00Z", lastOrderAt: "2026-04-06T06:00:00Z", city: "Chennai", state: "Tamil Nadu", isActive: true },
  { id: "cust_4", name: "Vikram Patel", email: "vikram@example.com", phone: "9543210987", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Vikram", totalOrders: 12, totalSpent: 89500, avgOrderValue: 7458, tags: ["budget", "regular"], joinedAt: "2025-04-05T00:00:00Z", lastOrderAt: "2026-04-04T14:00:00Z", city: "Pune", state: "Maharashtra", isActive: true },
  { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com", phone: "9432109876", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Deepika", totalOrders: 2, totalSpent: 28500, avgOrderValue: 14250, tags: ["new"], joinedAt: "2026-03-01T00:00:00Z", lastOrderAt: "2026-04-05T16:00:00Z", city: "Hyderabad", state: "Telangana", isActive: false },
  { id: "cust_6", name: "Arjun Kapoor", email: "arjun@example.com", phone: "9321098765", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Arjun", totalOrders: 6, totalSpent: 221000, avgOrderValue: 36833, tags: ["regular", "electronics"], joinedAt: "2025-10-12T00:00:00Z", lastOrderAt: "2026-03-28T10:00:00Z", city: "Mumbai", state: "Maharashtra", isActive: true },
];

// ──────────────────────────────────────────────────
// Coupons
// ──────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "bxgy";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usedCount: number;
  usageLimit: number;
  perUserLimit: number;
  expiresAt: string;
  isActive: boolean;
  applicableTo: "all" | "category" | "product";
}

export const coupons: Coupon[] = [
  { id: "coupon_1", code: "WELCOME20", type: "percentage", value: 20, minOrderValue: 500, maxDiscount: 2000, usedCount: 234, usageLimit: 1000, perUserLimit: 1, expiresAt: "2026-12-31T00:00:00Z", isActive: true, applicableTo: "all" },
  { id: "coupon_2", code: "SAVE500", type: "fixed", value: 500, minOrderValue: 2000, usedCount: 89, usageLimit: 500, perUserLimit: 2, expiresAt: "2026-06-30T00:00:00Z", isActive: true, applicableTo: "all" },
  { id: "coupon_3", code: "FREESHIP", type: "free_shipping", value: 0, minOrderValue: 999, usedCount: 342, usageLimit: 2000, perUserLimit: 5, expiresAt: "2026-05-31T00:00:00Z", isActive: true, applicableTo: "all" },
  { id: "coupon_4", code: "TECH15", type: "percentage", value: 15, minOrderValue: 5000, maxDiscount: 5000, usedCount: 45, usageLimit: 200, perUserLimit: 1, expiresAt: "2026-04-30T00:00:00Z", isActive: false, applicableTo: "category" },
];

// ──────────────────────────────────────────────────
// Support Tickets
// ──────────────────────────────────────────────────
export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  subject: string;
  customer: { id: string; name: string; email: string };
  orderId?: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  messages: { from: "customer" | "admin"; text: string; at: string }[];
  createdAt: string;
  updatedAt: string;
}

export const tickets: Ticket[] = [
  { id: "tkt_1", subject: "Order not delivered after 7 days", customer: { id: "cust_2", name: "Rahul Gupta", email: "rahul@example.com" }, orderId: "ord_2", status: "open", priority: "high", category: "Delivery", messages: [{ from: "customer", text: "My order ORD-2026-4520 was supposed to arrive 3 days ago but I haven't received it.", at: "2026-04-06T11:00:00Z" }], createdAt: "2026-04-06T11:00:00Z", updatedAt: "2026-04-06T11:00:00Z" },
  { id: "tkt_2", subject: "Request for refund on cancelled order", customer: { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com" }, orderId: "ord_5", status: "in_progress", priority: "medium", category: "Refund", messages: [{ from: "customer", text: "My order was cancelled but I haven't received refund yet.", at: "2026-04-05T18:00:00Z" }, { from: "admin", text: "We have initiated the refund. It will reflect in 5-7 business days.", at: "2026-04-06T09:00:00Z" }], createdAt: "2026-04-05T18:00:00Z", updatedAt: "2026-04-06T09:00:00Z" },
  { id: "tkt_3", subject: "Product quality issue with headphones", customer: { id: "cust_6", name: "Arjun Kapoor", email: "arjun@example.com" }, status: "resolved", priority: "low", category: "Product Quality", messages: [{ from: "customer", text: "The left earcup seems to have lower volume than the right.", at: "2026-04-02T10:00:00Z" }, { from: "admin", text: "We are sending a replacement unit. Return label attached.", at: "2026-04-03T11:00:00Z" }], createdAt: "2026-04-02T10:00:00Z", updatedAt: "2026-04-04T09:00:00Z" },
];

// ──────────────────────────────────────────────────
// Analytics Data
// ──────────────────────────────────────────────────
export const analyticsData = {
  salesOverview: kpiData.monthlyRevenue,
  topProducts: [
    { title: "Apple iPhone 15 Pro Max", revenue: 46768800, units: 312 },
    { title: "Sony WH-1000XM5", revenue: 14245250, units: 475 },
    { title: "Adidas Ultraboost 22", revenue: 9196459, units: 541 },
    { title: "Nike Air Max 270", revenue: 8212940, units: 632 },
    { title: "Samsung Galaxy S24 Ultra", revenue: 26717802, units: 198 },
  ],
  newVsReturning: [
    { name: "New Customers", value: 342 },
    { name: "Returning Customers", value: 947 },
  ],
  conversionFunnel: [
    { stage: "Visited", count: 45200 },
    { stage: "Added to Cart", count: 12800 },
    { stage: "Checkout", count: 4200 },
    { stage: "Paid", count: 2341 },
  ],
};

// ──────────────────────────────────────────────────
// Recent Activity
// ──────────────────────────────────────────────────
export const recentActivity = [
  { id: 1, type: "order", message: "New order #ORD-2026-4521 from Priya Mehta", time: "5 mins ago", icon: "solar:cart-large-bold-duotone" },
  { id: 2, type: "customer", message: "New customer registration: Deepika Joshi", time: "1 hr ago", icon: "solar:user-plus-bold-duotone" },
  { id: 3, type: "product", message: "Low stock alert: Puma RS-X3 (3 left)", time: "2 hrs ago", icon: "solar:box-bold-duotone" },
  { id: 4, type: "ticket", message: "New support ticket from Rahul Gupta", time: "3 hrs ago", icon: "solar:chat-round-bold-duotone" },
  { id: 5, type: "order", message: "Order #ORD-2026-4520 updated to Processing", time: "4 hrs ago", icon: "solar:cart-check-bold-duotone" },
];

// ──────────────────────────────────────────────────
// Team Members
// ──────────────────────────────────────────────────
export const teamMembers = [
  { id: "team_1", name: "Aryan Sharma", email: "aryan@luminarystore.com", role: "admin", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Aryan", isActive: true },
  { id: "team_2", name: "Neha Verma", email: "neha@luminarystore.com", role: "manager", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Neha", isActive: true },
  { id: "team_3", name: "Rohan Das", email: "rohan@luminarystore.com", role: "support", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Rohan", isActive: true },
  { id: "team_4", name: "Meera Iyer", email: "meera@luminarystore.com", role: "viewer", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Meera", isActive: false },
];

// ──────────────────────────────────────────────────
// Email Templates
// ──────────────────────────────────────────────────
export const emailTemplates = [
  { id: "et_1", name: "Order Confirmed", subject: "Your order #{{order_number}} is confirmed! 🎉", isActive: true },
  { id: "et_2", name: "Order Shipped", subject: "Your order #{{order_number}} is on its way! 🚚", isActive: true },
  { id: "et_3", name: "Order Delivered", subject: "Your order #{{order_number}} has been delivered! ✅", isActive: true },
  { id: "et_4", name: "Order Cancelled", subject: "Order #{{order_number}} has been cancelled.", isActive: true },
  { id: "et_5", name: "Refund Initiated", subject: "Refund processed for order #{{order_number}}", isActive: true },
  { id: "et_6", name: "Welcome Email", subject: "Welcome to {{store_name}}! 👋", isActive: true },
  { id: "et_7", name: "Password Reset", subject: "Reset your password — {{store_name}}", isActive: true },
];

// ──────────────────────────────────────────────────
// Banners
// ──────────────────────────────────────────────────
export const banners = [
  { id: "ban_1", title: "Summer Sale Banner", placement: "Hero Slider", link: "/sale", isActive: true, startsAt: "2026-04-01T00:00:00Z", endsAt: "2026-04-30T00:00:00Z", clicks: 1243, impressions: 45200 },
  { id: "ban_2", title: "New Arrivals Mid Banner", placement: "Mid-Banner", link: "/new-arrivals", isActive: true, startsAt: "2026-04-01T00:00:00Z", endsAt: "2026-04-30T00:00:00Z", clicks: 876, impressions: 32100 },
  { id: "ban_3", title: "Electronics Sale Popup", placement: "Popup", link: "/electronics", isActive: false, startsAt: "2026-05-01T00:00:00Z", endsAt: "2026-05-15T00:00:00Z", clicks: 0, impressions: 0 },
];

// ──────────────────────────────────────────────────
// Navigation items for sidebar
// ──────────────────────────────────────────────────
export interface NavItem {
  key: string;
  label: string;
  icon: string;
  href?: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "solar:chart-2-bold-duotone", href: "/dashboard" },
  {
    key: "inventory", label: "Inventory", icon: "solar:box-bold-duotone",
    children: [
      { key: "products", label: "All Products", icon: "solar:tag-bold-duotone", href: "/dashboard/inventory/products" },
      { key: "add-product", label: "Add Product", icon: "solar:add-square-bold-duotone", href: "/dashboard/inventory/products/add" },
      { key: "categories", label: "Categories", icon: "solar:folder-bold-duotone", href: "/dashboard/inventory/categories" },
      { key: "brands", label: "Brands", icon: "solar:shield-star-bold-duotone", href: "/dashboard/inventory/brands" },
    ],
  },
  {
    key: "orders", label: "Orders", icon: "solar:cart-large-bold-duotone",
    children: [
      { key: "all-orders", label: "All Orders", icon: "solar:list-bold-duotone", href: "/dashboard/orders" },
      { key: "pending", label: "Pending", icon: "solar:clock-circle-bold-duotone", href: "/dashboard/orders?status=pending" },
      { key: "processing", label: "Processing", icon: "solar:settings-bold-duotone", href: "/dashboard/orders?status=processing" },
      { key: "shipped", label: "Shipped", icon: "solar:delivery-bold-duotone", href: "/dashboard/orders?status=shipped" },
      { key: "delivered", label: "Delivered", icon: "solar:check-circle-bold-duotone", href: "/dashboard/orders?status=delivered" },
      { key: "cancelled", label: "Cancelled / Returns", icon: "solar:close-circle-bold-duotone", href: "/dashboard/orders?status=cancelled" },
    ],
  },
  {
    key: "customers", label: "Customers", icon: "solar:users-group-two-rounded-bold-duotone",
    children: [
      { key: "all-customers", label: "All Customers", icon: "solar:user-bold-duotone", href: "/dashboard/customers" },
      { key: "segments", label: "Segments / Tags", icon: "solar:tag-price-bold-duotone", href: "/dashboard/customers/segments" },
    ],
  },
  {
    key: "queries", label: "Customer Queries", icon: "solar:chat-round-bold-duotone",
    children: [
      { key: "open-tickets", label: "Open Tickets", icon: "solar:inbox-bold-duotone", href: "/dashboard/queries?status=open" },
      { key: "in-progress", label: "In Progress", icon: "solar:chat-dots-bold-duotone", href: "/dashboard/queries?status=in_progress" },
      { key: "resolved", label: "Resolved", icon: "solar:check-read-bold-duotone", href: "/dashboard/queries?status=resolved" },
    ],
  },
  {
    key: "marketing", label: "Marketing", icon: "solar:megaphone-bold-duotone",
    children: [
      { key: "banners", label: "Banners & Ads", icon: "solar:gallery-wide-bold-duotone", href: "/dashboard/marketing/banners" },
      { key: "coupons", label: "Discounts & Coupons", icon: "solar:ticket-sale-bold-duotone", href: "/dashboard/marketing/coupons" },
      { key: "featured", label: "Featured / Best Sellers", icon: "solar:star-bold-duotone", href: "/dashboard/marketing/featured" },
    ],
  },
  {
    key: "mails", label: "Mails", icon: "solar:letter-bold-duotone",
    children: [
      { key: "templates", label: "Email Templates", icon: "solar:document-text-bold-duotone", href: "/dashboard/mails/templates" },
      { key: "campaigns", label: "Broadcast Campaign", icon: "solar:send-bold-duotone", href: "/dashboard/mails/campaigns" },
    ],
  },
  {
    key: "analytics", label: "Analytics", icon: "solar:graph-up-bold-duotone",
    children: [
      { key: "sales-overview", label: "Sales Overview", icon: "solar:chart-bold-duotone", href: "/dashboard/analytics/sales" },
      { key: "product-performance", label: "Product Performance", icon: "solar:star-ring-bold-duotone", href: "/dashboard/analytics/products" },
      { key: "customer-insights", label: "Customer Insights", icon: "solar:user-graph-bold-duotone", href: "/dashboard/analytics/customers" },
    ],
  },
  {
    key: "finance", label: "Finance", icon: "solar:wallet-money-bold-duotone",
    children: [
      { key: "sales-report", label: "Sales Report", icon: "solar:document-bold-duotone", href: "/dashboard/finance/sales" },
      { key: "invoices", label: "Invoices", icon: "solar:bill-list-bold-duotone", href: "/dashboard/finance/invoices" },
      { key: "payment-logs", label: "Payment Logs", icon: "solar:card-bold-duotone", href: "/dashboard/finance/payments" },
    ],
  },
  {
    key: "delivery", label: "Delivery", icon: "solar:delivery-bold-duotone",
    children: [
      { key: "shipping-zones", label: "Shipping Zones", icon: "solar:map-bold-duotone", href: "/dashboard/delivery/zones" },
      { key: "courier", label: "Courier Settings", icon: "solar:box-minimalistic-bold-duotone", href: "/dashboard/delivery/couriers" },
    ],
  },
  {
    key: "telegram", label: "Telegram Bot", icon: "solar:chat-round-dots-bold-duotone",
    children: [
      { key: "bot-config", label: "Bot Config", icon: "solar:settings-bold-duotone", href: "/dashboard/telegram/config" },
      { key: "alerts", label: "Alert Settings", icon: "solar:bell-bold-duotone", href: "/dashboard/telegram/alerts" },
    ],
  },
  {
    key: "settings", label: "Settings", icon: "solar:settings-minimalistic-bold-duotone",
    children: [
      { key: "general", label: "General", icon: "solar:info-circle-bold-duotone", href: "/dashboard/settings/general" },
      { key: "branding", label: "Branding", icon: "solar:pallete-2-bold-duotone", href: "/dashboard/settings/branding" },
      { key: "payments", label: "Payments", icon: "solar:card-2-bold-duotone", href: "/dashboard/settings/payments" },
      { key: "team", label: "Team Members", icon: "solar:users-group-rounded-bold-duotone", href: "/dashboard/settings/team" },
      { key: "api", label: "API / Integrations", icon: "solar:code-bold-duotone", href: "/dashboard/settings/api" },
    ],
  },
];
