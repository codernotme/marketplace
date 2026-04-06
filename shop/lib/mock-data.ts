// ──────────────────────────────────────────────────
// Site / Store Configuration — themrktplace
// ──────────────────────────────────────────────────
export const siteConfig = {
  name: "themrktplace",
  tagline: "The most innovative store for curated essentials.",
  currency: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  language: "en",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  socialLinks: {
    instagram: "https://instagram.com/themrktplace",
    twitter: "https://twitter.com/themrktplace",
    facebook: "https://facebook.com/themrktplace",
    youtube: "https://youtube.com/@themrktplace",
  },
  contactEmail: "support@themrktplace.com",
  phone: "+91 98765 43210",
  address: "42, Innovation Hub, Koramangala, Bengaluru - 560034",
};

// ──────────────────────────────────────────────────
// Admin User
// ──────────────────────────────────────────────────
export const adminUser = {
  id: "usr_admin",
  name: "Aryan Bajpai",
  email: "aryan@themrktplace.com",
  role: "admin" as const,
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
  totalProducts: 505,
  totalCustomers: 1289,
  pendingOrders: 47,
  lowStockItems: 4,
  pendingQueries: 3,
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
// Categories (merged from web/data/mock.ts)
// ──────────────────────────────────────────────────
export const categories = [
  { id: "1", slug: "men", name: "Menswear", icon: "solar:tshirt-bold-duotone", image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 129 },
  { id: "2", slug: "women", name: "Womenswear", icon: "solar:bag-heart-bold-duotone", image: "https://images.unsplash.com/photo-1519412096601-7b7b85a55553?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 98 },
  { id: "3", slug: "electronics", name: "Electronics", icon: "solar:laptop-bold-duotone", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 74 },
  { id: "4", slug: "home", name: "Home Goods", icon: "solar:sofa-bold-duotone", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 56 },
  { id: "5", slug: "shoes", name: "Footwear", icon: "solar:running-bold-duotone", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 85 },
  { id: "6", slug: "accessories", name: "Accessories", icon: "solar:watch-round-bold-duotone", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", parentId: null, isActive: true, productCount: 63 },
];

// ──────────────────────────────────────────────────
// Brands (merged from web/data/mock.ts)
// ──────────────────────────────────────────────────
export const brands = [
  { id: "b1", name: "Nike", slug: "nike", logo: "", isActive: true, productCount: 88 },
  { id: "b2", name: "Adidas", slug: "adidas", logo: "", isActive: true, productCount: 74 },
  { id: "b3", name: "Apple", slug: "apple", logo: "", isActive: true, productCount: 45 },
  { id: "b4", name: "Sony", slug: "sony", logo: "", isActive: true, productCount: 38 },
  { id: "b5", name: "Zara", slug: "zara", logo: "", isActive: true, productCount: 52 },
  { id: "b6", name: "H&M", slug: "hm", logo: "", isActive: true, productCount: 40 },
  { id: "b7", name: "Timecraft Co.", slug: "timecraft", logo: "", isActive: true, productCount: 12 },
  { id: "b8", name: "SoundLab", slug: "soundlab", logo: "", isActive: true, productCount: 8 },
  { id: "b9", name: "StreetKix", slug: "streetkix", logo: "", isActive: true, productCount: 15 },
  { id: "b10", name: "KeyForge", slug: "keyforge", logo: "", isActive: true, productCount: 6 },
  { id: "b11", name: "DR CRZ Studio", slug: "drcrz", logo: "", isActive: true, productCount: 9 },
  { id: "b12", name: "FlexForm", slug: "flexform", logo: "", isActive: true, productCount: 18 },
];

// ──────────────────────────────────────────────────
// Products (from web/data/mock.ts)
// ──────────────────────────────────────────────────
export type ProductStatus = "active" | "draft" | "archived";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category_id: string;
  brand: string;
  images: string[];
  ratings_avg: number;
  ratings_count: number;
  is_new: boolean;
  is_trending: boolean;
  is_featured: boolean;
  tags: string[];
  variants: ProductVariant[];
  status: ProductStatus;
  sku: string;
}

export const products: Product[] = [
  {
    id: "p1", slug: "minimalist-watch", title: "Minimalist Leather Watch", sku: "TIM-MLW-001",
    description: "A beautifully crafted minimalist timepiece featuring a genuine Italian leather strap and Swiss quartz movement. Water resistant up to 50m.",
    price: 18900, comparePrice: 24900, category_id: "6", brand: "Timecraft Co.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.9, ratings_count: 1283, is_new: true, is_trending: true, is_featured: true,
    tags: ["watches", "accessories", "leather"],
    variants: [{ id: "v1a", name: "Black / Silver", price: 18900, stock: 10 }, { id: "v1b", name: "Brown / Gold", price: 20900, stock: 5 }],
    status: "active",
  },
  {
    id: "p2", slug: "wireless-earbuds", title: "Noise Cancelling Earbuds Pro", sku: "SND-NCE-001",
    description: "Premium wireless earbuds with industry-leading active noise cancellation. 28-hour total battery life. IPX4 water resistant.",
    price: 15900, comparePrice: 21900, category_id: "3", brand: "SoundLab",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.8, ratings_count: 2190, is_new: false, is_trending: true, is_featured: true,
    tags: ["electronics", "audio", "wireless"],
    variants: [{ id: "v2a", name: "Matte White", price: 15900, stock: 20 }, { id: "v2b", name: "Midnight Black", price: 15900, stock: 18 }],
    status: "active",
  },
  {
    id: "p3", slug: "canvas-sneakers", title: "Retro Canvas Sneakers", sku: "SKX-RCS-001",
    description: "Inspired by classic 70s court shoes. Vulcanized rubber sole for superior grip.",
    price: 7900, comparePrice: 9900, category_id: "5", brand: "StreetKix",
    images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.3, ratings_count: 892, is_new: false, is_trending: false, is_featured: false,
    tags: ["shoes", "sneakers", "retro"],
    variants: [{ id: "v3a", name: "US 8", price: 7900, stock: 0 }, { id: "v3b", name: "US 9", price: 7900, stock: 15 }, { id: "v3c", name: "US 10", price: 7900, stock: 8 }],
    status: "active",
  },
  {
    id: "p4", slug: "ceramic-coffee-mug", title: "Handcrafted Ceramic Mug", sku: "TRR-HCM-001",
    description: "Each mug is individually hand-thrown and glazed by local artisans. Microwave and dishwasher safe. Holds 12 oz.",
    price: 3400, comparePrice: null, category_id: "4", brand: "Timecraft Co.",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.9, ratings_count: 674, is_new: true, is_trending: true, is_featured: false,
    tags: ["home", "kitchen", "ceramic"],
    variants: [{ id: "v4a", name: "Matte Black", price: 3400, stock: 30 }, { id: "v4b", name: "Speckled White", price: 3400, stock: 12 }, { id: "v4c", name: "Terracotta", price: 3600, stock: 7 }],
    status: "active",
  },
  {
    id: "p5", slug: "woven-tote-bag", title: "Artisan Woven Tote Bag", sku: "BHL-WTB-001",
    description: "Hand-woven from natural seagrass by skilled craftspeople. Spacious interior with cotton lining.",
    price: 8900, comparePrice: 12000, category_id: "2", brand: "H&M",
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.3, ratings_count: 341, is_new: false, is_trending: true, is_featured: true,
    tags: ["bags", "women", "accessories"],
    variants: [{ id: "v5a", name: "Natural Sand", price: 8900, stock: 8 }],
    status: "active",
  },
  {
    id: "p6", slug: "mechanical-keyboard", title: "65% Mechanical Keyboard", sku: "KFG-MK65-001",
    description: "Hot-swappable PCB, premium PBT doubleshot keycaps, and full RGB backlighting. Perfect compact keyboard for enthusiasts.",
    price: 12900, comparePrice: 15900, category_id: "3", brand: "KeyForge",
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.7, ratings_count: 512, is_new: true, is_trending: false, is_featured: true,
    tags: ["electronics", "computers", "gaming"],
    variants: [{ id: "v6a", name: "Tactile (Brown)", price: 12900, stock: 4 }, { id: "v6b", name: "Linear (Red)", price: 12900, stock: 6 }],
    status: "draft",
  },
  {
    id: "p7", slug: "varsity-jacket", title: "DR CRZ Varsity Jacket", sku: "DRC-VJK-001",
    description: "Premium heavyweight leather varsity jacket with custom embroidery. Wool body with genuine leather sleeves.",
    price: 34900, comparePrice: 44900, category_id: "1", brand: "DR CRZ Studio",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.8, ratings_count: 873, is_new: true, is_trending: true, is_featured: true,
    tags: ["jacket", "men", "outerwear"],
    variants: [{ id: "v7a", name: "S", price: 34900, stock: 3 }, { id: "v7b", name: "M", price: 34900, stock: 8 }, { id: "v7c", name: "L", price: 34900, stock: 12 }, { id: "v7d", name: "XL", price: 34900, stock: 5 }],
    status: "active",
  },
  {
    id: "p8", slug: "running-shoes", title: "Nike Tech Hera Runners", sku: "NKE-THR-001",
    description: "Lightweight mesh upper with React foam cushioning. Trusted by marathon runners and trail enthusiasts alike.",
    price: 16900, comparePrice: 19900, category_id: "5", brand: "Nike",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.9, ratings_count: 3204, is_new: false, is_trending: true, is_featured: false,
    tags: ["shoes", "running", "nike"],
    variants: [{ id: "v8a", name: "Triple White", price: 16900, stock: 22 }, { id: "v8b", name: "Black / Red", price: 16900, stock: 11 }],
    status: "active",
  },
  {
    id: "p9", slug: "linen-shirt", title: "Casual Linen Summer Shirt", sku: "CST-LSS-001",
    description: "Breathable, natural linen shirt. Button-down collar, relaxed fit. Garment washed for extra softness.",
    price: 5900, comparePrice: 7900, category_id: "1", brand: "Zara",
    images: ["https://images.unsplash.com/photo-1588591795084-1770cb3be374?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.5, ratings_count: 471, is_new: false, is_trending: false, is_featured: false,
    tags: ["shirts", "men", "summer"],
    variants: [{ id: "v9a", name: "Off White", price: 5900, stock: 18 }, { id: "v9b", name: "Sage Green", price: 5900, stock: 9 }],
    status: "active",
  },
  {
    id: "p10", slug: "yoga-pants", title: "High-Rise Sculpt Yoga Pants", sku: "FFM-YPH-001",
    description: "Compression fit yoga leggings with a high-rise waistband. Squat-proof 4-way stretch fabric with side pockets.",
    price: 6900, comparePrice: 8900, category_id: "2", brand: "FlexForm",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.6, ratings_count: 987, is_new: true, is_trending: true, is_featured: false,
    tags: ["women", "activewear", "yoga"],
    variants: [{ id: "v10a", name: "XS / Black", price: 6900, stock: 14 }, { id: "v10b", name: "S / Black", price: 6900, stock: 22 }, { id: "v10c", name: "M / Black", price: 6900, stock: 16 }],
    status: "active",
  },
  {
    id: "p11", slug: "table-lamp", title: "Nordic Arc Table Lamp", sku: "LNX-TAL-001",
    description: "Minimalist Scandinavian-inspired table lamp with brushed brass arc arm and natural marble base. LED bulb included.",
    price: 11900, comparePrice: null, category_id: "4", brand: "Zara",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.7, ratings_count: 289, is_new: false, is_trending: false, is_featured: false,
    tags: ["home", "lighting", "decor"],
    variants: [{ id: "v11a", name: "Brass + White Marble", price: 11900, stock: 7 }],
    status: "active",
  },
  {
    id: "p12", slug: "leather-wallet", title: "Slim Bifold Leather Wallet", sku: "HRC-LWB-001",
    description: "Full-grain vegetable-tanned leather that ages beautifully. RFID blocking lining, 6 card slots, 2 cash pockets.",
    price: 6500, comparePrice: 8500, category_id: "1", brand: "DR CRZ Studio",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"],
    ratings_avg: 4.8, ratings_count: 1042, is_new: false, is_trending: false, is_featured: false,
    tags: ["accessories", "men", "leather"],
    variants: [{ id: "v12a", name: "Dark Brown", price: 6500, stock: 25 }, { id: "v12b", name: "Cognac Tan", price: 6500, stock: 19 }],
    status: "active",
  },
];

// ──────────────────────────────────────────────────
// Reviews (from web/data/mock.ts)
// ──────────────────────────────────────────────────
export const reviews = [
  { id: "r1", productId: "p1", author: "Alexa Watson", avatar: "https://i.pravatar.cc/100?img=1", rating: 5, date: "2026-03-15", text: "Absolutely love this product! Stylish and comfortable. Highly recommend!" },
  { id: "r2", productId: "p1", author: "Emily Mendez", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, date: "2026-03-10", text: "Great purchase, the quality exceeded my expectations." },
  { id: "r3", productId: "p1", author: "David Swagner", avatar: "https://i.pravatar.cc/100?img=11", rating: 4, date: "2026-03-05", text: "Really solid product. Fast delivery and amazing packaging." },
  { id: "r4", productId: "p2", author: "Sarah Kim", avatar: "https://i.pravatar.cc/100?img=9", rating: 5, date: "2026-03-14", text: "Best earbuds I've ever used. The noise cancellation is impressive!" },
  { id: "r5", productId: "p3", author: "Marcus Lee", avatar: "https://i.pravatar.cc/100?img=7", rating: 4, date: "2026-03-12", text: "Love the classic look. Very comfortable for daily use." },
];

// ──────────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "upi" | "cod" | "netbanking";

export interface DeliveryAgent {
  id: string;
  name: string;
  trackingUrl: string;
  courier: string;
  assignedAt: string;
}

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
  currentStage: number; // 0: Pending, 1: Processing, 2: Packed, 3: Shipped, 4: Delivered
  shippingAddress: { line1: string; city: string; state: string; pincode: string };
  deliveryAgents: DeliveryAgent[];
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  updatedAt: string;
  source: "web" | "mobile" | "admin";
}

export const orders: Order[] = [
  {
    id: "ord_1",
    orderNumber: "ORD-2026-4521",
    customer: { id: "cust_1", name: "Priya Mehta", email: "priya@example.com", phone: "9876543210" },
    items: [{ productId: "p7", title: "DR CRZ Varsity Jacket", variant: "M", qty: 1, price: 34900 }],
    subtotal: 34900, shippingCost: 0, tax: 6282, discount: 1500, total: 39682,
    paymentStatus: "paid", paymentMethod: "razorpay",
    fulfillmentStatus: "shipped",
    currentStage: 3,
    shippingAddress: { line1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
    deliveryAgents: [
      { id: "da_1", name: "Ramesh Kumar", courier: "Delhivery", trackingUrl: "https://delhivery.com/track/DEL123456789", assignedAt: "2026-04-06T10:00:00Z" }
    ],
    trackingNumber: "DEL123456789", courier: "Delhivery",
    createdAt: "2026-04-06T08:30:00Z", updatedAt: "2026-04-06T10:00:00Z", source: "web"
  },
  {
    id: "ord_2",
    orderNumber: "ORD-2026-4520",
    customer: { id: "cust_2", name: "Rahul Gupta", email: "rahul@example.com", phone: "9765432109" },
    items: [{ productId: "p2", title: "Noise Cancelling Earbuds Pro", variant: "Midnight Black", qty: 1, price: 15900 }, { productId: "p8", title: "Nike Tech Hera Runners", variant: "Triple White", qty: 1, price: 16900 }],
    subtotal: 32800, shippingCost: 99, tax: 5904, discount: 0, total: 38803,
    paymentStatus: "paid", paymentMethod: "upi",
    fulfillmentStatus: "processing",
    currentStage: 1,
    shippingAddress: { line1: "5, Sector 18", city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
    deliveryAgents: [],
    createdAt: "2026-04-06T07:15:00Z", updatedAt: "2026-04-06T09:00:00Z", source: "mobile"
  },
  {
    id: "ord_3",
    orderNumber: "ORD-2026-4519",
    customer: { id: "cust_3", name: "Ananya Singh", email: "ananya@example.com", phone: "9654321098" },
    items: [{ productId: "p1", title: "Minimalist Leather Watch", variant: "Brown / Gold", qty: 1, price: 20900 }],
    subtotal: 20900, shippingCost: 0, tax: 3762, discount: 0, total: 24662,
    paymentStatus: "paid", paymentMethod: "netbanking",
    fulfillmentStatus: "pending",
    currentStage: 0,
    shippingAddress: { line1: "8, Anna Salai", city: "Chennai", state: "Tamil Nadu", pincode: "600002" },
    deliveryAgents: [],
    createdAt: "2026-04-06T06:00:00Z", updatedAt: "2026-04-06T06:00:00Z", source: "web"
  },
  {
    id: "ord_4",
    orderNumber: "ORD-2026-4518",
    customer: { id: "cust_4", name: "Vikram Patel", email: "vikram@example.com", phone: "9543210987" },
    items: [{ productId: "p10", title: "High-Rise Sculpt Yoga Pants", variant: "M / Black", qty: 2, price: 6900 }],
    subtotal: 13800, shippingCost: 49, tax: 2484, discount: 500, total: 15833,
    paymentStatus: "paid", paymentMethod: "cod",
    fulfillmentStatus: "delivered",
    currentStage: 4,
    shippingAddress: { line1: "23, FC Road", city: "Pune", state: "Maharashtra", pincode: "411005" },
    deliveryAgents: [
      { id: "da_2", name: "Suresh Patil", courier: "Shiprocket", trackingUrl: "https://shiprocket.co/track/SHR987654321", assignedAt: "2026-04-06T11:00:00Z" }
    ],
    trackingNumber: "SHR987654321", courier: "Shiprocket",
    createdAt: "2026-04-04T14:00:00Z", updatedAt: "2026-04-06T11:00:00Z", source: "web"
  },
  {
    id: "ord_5",
    orderNumber: "ORD-2026-4517",
    customer: { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com", phone: "9432109876" },
    items: [{ productId: "p6", title: "65% Mechanical Keyboard", variant: "Linear (Red)", qty: 1, price: 12900 }],
    subtotal: 12900, shippingCost: 0, tax: 2322, discount: 0, total: 15222,
    paymentStatus: "failed", paymentMethod: "razorpay",
    fulfillmentStatus: "cancelled",
    currentStage: 0,
    shippingAddress: { line1: "17, Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: "500034" },
    deliveryAgents: [],
    createdAt: "2026-04-05T16:00:00Z", updatedAt: "2026-04-05T17:00:00Z", source: "mobile"
  },
  {
    id: "ord_6",
    orderNumber: "ORD-2026-4516",
    customer: { id: "cust_6", name: "Arjun Kapoor", email: "arjun@example.com", phone: "9321098765" },
    items: [{ productId: "p3", title: "Retro Canvas Sneakers", variant: "US 9", qty: 1, price: 7900 }],
    subtotal: 7900, shippingCost: 49, tax: 1422, discount: 0, total: 9371,
    paymentStatus: "paid", paymentMethod: "upi",
    fulfillmentStatus: "delivered",
    currentStage: 4,
    shippingAddress: { line1: "45, Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    deliveryAgents: [
      { id: "da_3", name: "Amit Shah", courier: "Delhivery", trackingUrl: "https://delhivery.com/track/DEL098765432", assignedAt: "2026-04-05T14:00:00Z" }
    ],
    trackingNumber: "DEL098765432", courier: "Delhivery",
    createdAt: "2026-04-03T10:00:00Z", updatedAt: "2026-04-05T14:00:00Z", source: "web"
  },
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
  { id: "cust_1", name: "Priya Mehta", email: "priya@example.com", phone: "9876543210", avatar: "https://i.pravatar.cc/100?img=1", totalOrders: 8, totalSpent: 342500, avgOrderValue: 42812, tags: ["vip", "repeat"], joinedAt: "2025-06-15T00:00:00Z", lastOrderAt: "2026-04-06T08:30:00Z", city: "Bengaluru", state: "Karnataka", isActive: true },
  { id: "cust_2", name: "Rahul Gupta", email: "rahul@example.com", phone: "9765432109", avatar: "https://i.pravatar.cc/100?img=11", totalOrders: 5, totalSpent: 185000, avgOrderValue: 37000, tags: ["regular"], joinedAt: "2025-08-20T00:00:00Z", lastOrderAt: "2026-04-06T07:15:00Z", city: "Noida", state: "Uttar Pradesh", isActive: true },
  { id: "cust_3", name: "Ananya Singh", email: "ananya@example.com", phone: "9654321098", avatar: "https://i.pravatar.cc/100?img=5", totalOrders: 3, totalSpent: 498000, avgOrderValue: 166000, tags: ["premium", "vip"], joinedAt: "2025-07-10T00:00:00Z", lastOrderAt: "2026-04-06T06:00:00Z", city: "Chennai", state: "Tamil Nadu", isActive: true },
  { id: "cust_4", name: "Vikram Patel", email: "vikram@example.com", phone: "9543210987", avatar: "https://i.pravatar.cc/100?img=7", totalOrders: 12, totalSpent: 89500, avgOrderValue: 7458, tags: ["budget", "regular"], joinedAt: "2025-04-05T00:00:00Z", lastOrderAt: "2026-04-04T14:00:00Z", city: "Pune", state: "Maharashtra", isActive: true },
  { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com", phone: "9432109876", avatar: "https://i.pravatar.cc/100?img=9", totalOrders: 2, totalSpent: 28500, avgOrderValue: 14250, tags: ["new"], joinedAt: "2026-03-01T00:00:00Z", lastOrderAt: "2026-04-05T16:00:00Z", city: "Hyderabad", state: "Telangana", isActive: false },
  { id: "cust_6", name: "Arjun Kapoor", email: "arjun@example.com", phone: "9321098765", avatar: "https://i.pravatar.cc/100?img=3", totalOrders: 6, totalSpent: 221000, avgOrderValue: 36833, tags: ["regular", "electronics"], joinedAt: "2025-10-12T00:00:00Z", lastOrderAt: "2026-03-28T10:00:00Z", city: "Mumbai", state: "Maharashtra", isActive: true },
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
  { id: "tkt_2", subject: "Refund request on cancelled order", customer: { id: "cust_5", name: "Deepika Joshi", email: "deepika@example.com" }, orderId: "ord_5", status: "in_progress", priority: "medium", category: "Refund", messages: [{ from: "customer", text: "My order was cancelled but I haven't received refund yet.", at: "2026-04-05T18:00:00Z" }, { from: "admin", text: "We have initiated the refund. It will reflect in 5-7 business days.", at: "2026-04-06T09:00:00Z" }], createdAt: "2026-04-05T18:00:00Z", updatedAt: "2026-04-06T09:00:00Z" },
  { id: "tkt_3", subject: "Product quality issue with headphones", customer: { id: "cust_6", name: "Arjun Kapoor", email: "arjun@example.com" }, status: "resolved", priority: "low", category: "Product Quality", messages: [{ from: "customer", text: "The left earcup seems to have lower volume than the right.", at: "2026-04-02T10:00:00Z" }, { from: "admin", text: "We are sending a replacement unit. Return label attached.", at: "2026-04-03T11:00:00Z" }], createdAt: "2026-04-02T10:00:00Z", updatedAt: "2026-04-04T09:00:00Z" },
];

// ──────────────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────────────
export const analyticsData = {
  salesOverview: kpiData.monthlyRevenue,
  topProducts: [
    { title: "Nike Tech Hera Runners", revenue: 8468800, units: 501 },
    { title: "Noise Cancelling Earbuds Pro", revenue: 6120000, units: 384 },
    { title: "DR CRZ Varsity Jacket", revenue: 5623000, units: 161 },
    { title: "Minimalist Leather Watch", revenue: 4899000, units: 260 },
    { title: "High-Rise Sculpt Yoga Pants", revenue: 3622000, units: 525 },
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
  { id: 3, type: "product", message: "Low stock alert: Retro Canvas Sneakers (US 8 — 0 left)", time: "2 hrs ago", icon: "solar:box-bold-duotone" },
  { id: 4, type: "ticket", message: "New support ticket from Rahul Gupta", time: "3 hrs ago", icon: "solar:chat-round-bold-duotone" },
  { id: 5, type: "order", message: "Order #ORD-2026-4520 updated to Processing", time: "4 hrs ago", icon: "solar:refresh-bold-duotone" },
];

// ──────────────────────────────────────────────────
// Team Members
// ──────────────────────────────────────────────────
export const teamMembers = [
  { id: "team_1", name: "Aryan Bajpai", email: "aryan@themrktplace.com", role: "admin", avatar: "https://i.pravatar.cc/100?img=68", isActive: true },
  { id: "team_2", name: "Neha Verma", email: "neha@themrktplace.com", role: "manager", avatar: "https://i.pravatar.cc/100?img=47", isActive: true },
  { id: "team_3", name: "Rohan Das", email: "rohan@themrktplace.com", role: "support", avatar: "https://i.pravatar.cc/100?img=52", isActive: true },
  { id: "team_4", name: "Meera Iyer", email: "meera@themrktplace.com", role: "viewer", avatar: "https://i.pravatar.cc/100?img=42", isActive: false },
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
  { id: "et_6", name: "Welcome Email", subject: "Welcome to themrktplace! 👋", isActive: true },
  { id: "et_7", name: "Password Reset", subject: "Reset your password — themrktplace", isActive: true },
];

// ──────────────────────────────────────────────────
// Banners
// ──────────────────────────────────────────────────
export const banners = [
  { id: "ban_1", title: "New Season Arrivals", placement: "Hero Slider", link: "/new-arrivals", isActive: true, startsAt: "2026-04-01T00:00:00Z", endsAt: "2026-04-30T00:00:00Z", clicks: 1243, impressions: 45200 },
  { id: "ban_2", title: "DR CRZ Varsity Deal", placement: "Mid-Banner", link: "/products/varsity-jacket", isActive: true, startsAt: "2026-04-01T00:00:00Z", endsAt: "2026-04-30T00:00:00Z", clicks: 876, impressions: 32100 },
  { id: "ban_3", title: "Electronics Popup Sale", placement: "Popup", link: "/category/electronics", isActive: false, startsAt: "2026-05-01T00:00:00Z", endsAt: "2026-05-15T00:00:00Z", clicks: 0, impressions: 0 },
];

// ──────────────────────────────────────────────────
// Storefront Content (from web/data/mock.ts)
// ──────────────────────────────────────────────────
export const storefrontContent = {
  brand: {
    siteName: "themrktplace",
    logoText: "tm.",
  },
  home: {
    hero: {
      badge: "New Season Arrivals",
      titleLead: "Shop the",
      titleHighlight: "Future",
      titleTail: "of Style.",
      description: "Curated collections from the world's most innovative brands. Premium quality, authentic products, delivered to your door.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80",
      primaryCta: { label: "Shop Now", href: "/products" },
      secondaryCta: { label: "Browse Men", href: "/category/men" },
      stats: [
        { value: "12K+", label: "Happy Customers" },
        { value: "500+", label: "Products" },
      ],
    },
    marqueeItems: ["New Arrivals", "Free Shipping", "Top Brands", "Authentic Gear", "Exclusive Drops", "Best Sellers"],
    deal: {
      badge: "Deal of the Day",
      title: "DR CRZ Varsity Jacket",
      description: "Limited stock. Up to 25% off premium outerwear.",
      ctaLabel: "Shop Deal",
      ctaHref: "/products/varsity-jacket",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    },
    testimonials: [
      { name: "Alexa Watson", avatar: "https://i.pravatar.cc/100?img=1", rating: 5, text: "Absolutely love this platform! Stylish products and super fast delivery.", product: "Minimalist Watch" },
      { name: "Emily Mendez", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, text: "The quality of their products exceeded my expectations completely.", product: "Varsity Jacket" },
      { name: "David Swagner", avatar: "https://i.pravatar.cc/100?img=11", rating: 5, text: "Amazing customer service, genuine products, and beautiful packaging.", product: "Earbuds Pro" },
    ],
  },
};

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
      { key: "categories", label: "Categories", icon: "solar:folder-bold-duotone", href: "/dashboard/inventory/categories" },
      { key: "brands", label: "Brands", icon: "solar:shield-star-bold-duotone", href: "/dashboard/inventory/brands" },
    ],
  },
  {
    key: "orders-group", label: "Orders", icon: "solar:cart-large-bold-duotone",
    children: [
      { key: "all-orders", label: "All Orders", icon: "solar:list-bold-duotone", href: "/dashboard/orders" },
      { key: "pending", label: "Pending", icon: "solar:clock-circle-bold-duotone", href: "/dashboard/orders?status=pending" },
      { key: "processing", label: "Processing", icon: "solar:refresh-bold-duotone", href: "/dashboard/orders?status=processing" },
      { key: "shipped", label: "Shipped", icon: "solar:delivery-bold-duotone", href: "/dashboard/orders?status=shipped" },
      { key: "delivered", label: "Delivered", icon: "solar:check-circle-bold-duotone", href: "/dashboard/orders?status=delivered" },
      { key: "cancelled", label: "Cancelled", icon: "solar:close-circle-bold-duotone", href: "/dashboard/orders?status=cancelled" },
    ],
  },
  {
    key: "content-group", label: "Content", icon: "solar:document-bold-duotone",
    children: [
      { key: "blog", label: "Blog Posts", icon: "solar:pen-new-square-bold-duotone", href: "/dashboard/blog" },
      { key: "pages", label: "Static Pages", icon: "solar:notebook-bold-duotone", href: "/dashboard/pages" },
    ],
  },
  {
    key: "customers-group", label: "Customers", icon: "solar:users-group-two-rounded-bold-duotone",
    children: [
      { key: "all-customers", label: "All Customers", icon: "solar:user-bold-duotone", href: "/dashboard/customers" },
    ],
  },
  {
    key: "queries", label: "Customer Queries", icon: "solar:chat-round-bold-duotone",
    children: [
      { key: "all-queries", label: "All Tickets", icon: "solar:inbox-bold-duotone", href: "/dashboard/queries" },
    ],
  },
  {
    key: "marketing", label: "Marketing", icon: "solar:graph-bold-duotone",
    children: [
      { key: "banners", label: "Banners & Ads", icon: "solar:gallery-wide-bold-duotone", href: "/dashboard/marketing/banners" },
      { key: "coupons", label: "Discounts & Coupons", icon: "solar:ticket-sale-bold-duotone", href: "/dashboard/marketing/coupons" },
    ],
  },
  {
    key: "mails", label: "Mails", icon: "solar:letter-bold-duotone",
    children: [
      { key: "templates", label: "Email Templates", icon: "solar:document-text-bold-duotone", href: "/dashboard/mails/templates" },
    ],
  },
  {
    key: "analytics", label: "Analytics", icon: "solar:graph-up-bold-duotone",
    children: [
      { key: "sales-overview", label: "Sales Overview", icon: "solar:chart-bold-duotone", href: "/dashboard/analytics/sales" },
    ],
  },
  {
    key: "finance", label: "Finance", icon: "solar:wallet-money-bold-duotone",
    children: [
      { key: "sales-report", label: "Sales Report", icon: "solar:document-bold-duotone", href: "/dashboard/finance/sales" },
    ],
  },
  {
    key: "telegram", label: "Telegram Bot", icon: "solar:chat-round-dots-bold-duotone",
    href: "/dashboard/telegram",
  },
  {
    key: "settings", label: "Settings", icon: "solar:settings-minimalistic-bold-duotone",
    href: "/dashboard/settings",
  },
];

// ──────────────────────────────────────────────────
// Blog Content
// ──────────────────────────────────────────────────
export type BlogPost = {
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
};

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "top-tech-picks",
    title: "Top 10 Tech Picks This Season",
    excerpt: "From wireless earbuds to mechanical keyboards, these are the gadgets everyone is talking about right now.",
    category: "Electronics",
    author: "James Hurst",
    avatar: "https://i.pravatar.cc/48?img=15",
    publishedAt: "2026-03-20",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["electronics", "gadgets", "buying-guide"],
    content: [
      "Tech trends shift quickly, but a few categories continue to dominate buyer attention: compact audio, ergonomic peripherals, and practical smart-home gear.",
      "When comparing devices, focus first on durability and ecosystem compatibility.",
    ],
  },
  {
    id: "blog-2",
    slug: "spring-fashion-trends",
    title: "Spring Fashion Trends You Need to Know",
    excerpt: "From earthy tones to bold patterns, this spring fashion is all about personal expression and comfort.",
    category: "Fashion",
    author: "Sofia Reyes",
    avatar: "https://i.pravatar.cc/48?img=5",
    publishedAt: "2026-03-18",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["fashion", "spring", "style-guide"],
    content: [
      "Designers are balancing expressive silhouettes with functional layering.",
    ],
  },
];
