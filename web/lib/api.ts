import { products, categories, reviews, storefrontContent } from '@/data/mock';

// Re-export types as needed
export type ProductType = typeof products[0];
export type CategoryType = typeof categories[0];

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

const customerAddresses: CustomerAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Ava Sterling',
    phone: '+1 555 010 7788',
    line1: '123 Main Street',
    line2: 'Apartment 4B',
    city: 'San Francisco',
    state: 'California',
    pincode: '94103',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    fullName: 'Ava Sterling',
    phone: '+1 555 010 7788',
    line1: '580 Market Street',
    city: 'San Francisco',
    state: 'California',
    pincode: '94104',
    country: 'United States',
    isDefault: false,
  },
];

const customerOrders: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'MKT-2026-00121',
    email: 'ava@example.com',
    createdAt: '2026-03-20T14:22:00Z',
    pricing: {
      subtotal: 348,
      shippingFee: 0,
      taxTotal: 28,
      discountTotal: 20,
      grandTotal: 356,
    },
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    trackingNumber: 'TRK92019088',
    courier: 'BlueDart',
    trackingUrl: 'https://example.com/tracking/TRK92019088',
    shippingAddress: {
      fullName: 'Ava Sterling',
      phone: '+1 555 010 7788',
      line1: '123 Main Street',
      line2: 'Apartment 4B',
      city: 'San Francisco',
      state: 'California',
      pincode: '94103',
      country: 'United States',
    },
    items: [
      {
        id: 'ord-1-item-1',
        productId: 'p1',
        title: 'Minimalist Leather Watch',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
        variantLabel: 'Black / Silver',
        quantity: 1,
        unitPrice: 189,
        subtotal: 189,
      },
      {
        id: 'ord-1-item-2',
        productId: 'p3',
        title: 'Retro Canvas Sneakers',
        imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=200&q=80',
        variantLabel: 'US 9',
        quantity: 2,
        unitPrice: 79,
        subtotal: 158,
      },
    ],
    timeline: [
      { status: 'pending', note: 'Order placed', createdAt: '2026-03-20T14:22:00Z' },
      { status: 'processing', note: 'Payment confirmed', createdAt: '2026-03-20T14:25:00Z' },
      { status: 'packed', note: 'Items packed', createdAt: '2026-03-21T08:10:00Z' },
      { status: 'shipped', note: 'Package shipped via BlueDart', createdAt: '2026-03-21T13:30:00Z' },
      { status: 'delivered', note: 'Delivered to front desk', createdAt: '2026-03-23T17:05:00Z' },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: 'MKT-2026-00114',
    email: 'ava@example.com',
    createdAt: '2026-03-12T11:45:00Z',
    pricing: {
      subtotal: 159,
      shippingFee: 12,
      taxTotal: 13,
      discountTotal: 0,
      grandTotal: 184,
    },
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    trackingNumber: 'TRK88310117',
    courier: 'Delhivery',
    trackingUrl: 'https://example.com/tracking/TRK88310117',
    shippingAddress: {
      fullName: 'Ava Sterling',
      phone: '+1 555 010 7788',
      line1: '580 Market Street',
      city: 'San Francisco',
      state: 'California',
      pincode: '94104',
      country: 'United States',
    },
    items: [
      {
        id: 'ord-2-item-1',
        productId: 'p2',
        title: 'Noise Cancelling Earbuds Pro',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80',
        variantLabel: 'Midnight Black',
        quantity: 1,
        unitPrice: 159,
        subtotal: 159,
      },
    ],
    timeline: [
      { status: 'pending', note: 'Order placed', createdAt: '2026-03-12T11:45:00Z' },
      { status: 'processing', note: 'Payment confirmed', createdAt: '2026-03-12T11:50:00Z' },
      { status: 'packed', note: 'Packed and labelled', createdAt: '2026-03-13T09:20:00Z' },
      { status: 'shipped', note: 'Shipped via Delhivery', createdAt: '2026-03-13T15:00:00Z' },
    ],
  },
  {
    id: 'ord-3',
    orderNumber: 'MKT-2026-00098',
    email: 'ava@example.com',
    createdAt: '2026-02-28T10:10:00Z',
    pricing: {
      subtotal: 65,
      shippingFee: 0,
      taxTotal: 5,
      discountTotal: 10,
      grandTotal: 60,
    },
    paymentStatus: 'paid',
    fulfillmentStatus: 'cancelled',
    shippingAddress: {
      fullName: 'Ava Sterling',
      phone: '+1 555 010 7788',
      line1: '123 Main Street',
      city: 'San Francisco',
      state: 'California',
      pincode: '94103',
      country: 'United States',
    },
    items: [
      {
        id: 'ord-3-item-1',
        productId: 'p12',
        title: 'Slim Bifold Leather Wallet',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=200&q=80',
        variantLabel: 'Dark Brown',
        quantity: 1,
        unitPrice: 65,
        subtotal: 65,
      },
    ],
    timeline: [
      { status: 'pending', note: 'Order placed', createdAt: '2026-02-28T10:10:00Z' },
      { status: 'cancelled', note: 'Cancelled on customer request', createdAt: '2026-02-28T12:15:00Z' },
    ],
  },
];

const notificationFeed: NotificationRecord[] = [
  {
    id: 'notif-1',
    channel: 'in_app',
    type: 'order_shipped',
    title: 'Order MKT-2026-00114 is on the way',
    body: 'Your package has left our warehouse and is now with Delhivery.',
    createdAt: '2026-03-13T15:05:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    channel: 'email',
    type: 'promo',
    title: 'Flash sale starts tonight',
    body: 'Get up to 30% off selected footwear and accessories.',
    createdAt: '2026-03-10T07:30:00Z',
    read: true,
  },
  {
    id: 'notif-3',
    channel: 'push',
    type: 'wishlist_price_drop',
    title: 'A saved item just got cheaper',
    body: 'Retro Canvas Sneakers are now 20% off for a limited time.',
    createdAt: '2026-03-07T18:10:00Z',
    read: true,
  },
];

const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'top-tech-picks',
    title: 'Top 10 Tech Picks This Season',
    excerpt: 'From wireless earbuds to mechanical keyboards, these are the gadgets everyone is talking about right now.',
    category: 'Electronics',
    author: 'James Hurst',
    avatar: 'https://i.pravatar.cc/48?img=15',
    publishedAt: '2026-03-20',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    tags: ['electronics', 'gadgets', 'buying-guide'],
    content: [
      'Tech trends shift quickly, but a few categories continue to dominate buyer attention: compact audio, ergonomic peripherals, and practical smart-home gear.',
      'When comparing devices, focus first on durability and ecosystem compatibility. Features matter less if the product does not fit your daily workflow.',
      'This season, value is strongest in mid-tier products that include premium features previously found only in flagship launches.',
    ],
  },
  {
    id: 'blog-2',
    slug: 'spring-fashion-trends',
    title: 'Spring Fashion Trends You Need to Know',
    excerpt: 'From earthy tones to bold patterns, this spring fashion is all about personal expression and comfort.',
    category: 'Fashion',
    author: 'Sofia Reyes',
    avatar: 'https://i.pravatar.cc/48?img=5',
    publishedAt: '2026-03-18',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    tags: ['fashion', 'spring', 'style-guide'],
    content: [
      'Designers are balancing expressive silhouettes with functional layering, making spring wardrobes easier to adapt day-to-day.',
      'Muted greens, sand tones, and textured fabrics are shaping the season across both casual and elevated styles.',
    ],
  },
  {
    id: 'blog-3',
    slug: 'home-decor-guide',
    title: 'The Ultimate Home Decor Guide for 2026',
    excerpt: 'Transform your living space with these curated pieces and interior design ideas from our home category.',
    category: 'Home & Living',
    author: 'Ava Sterling',
    avatar: 'https://i.pravatar.cc/48?img=47',
    publishedAt: '2026-03-15',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    tags: ['home', 'decor', 'lifestyle'],
    content: [
      'A strong decor update starts with lighting and material contrast before adding accent pieces.',
      'Neutral bases paired with one high-impact texture can make smaller spaces feel intentional and premium.',
    ],
  },
  {
    id: 'blog-4',
    slug: 'sneaker-culture',
    title: 'Sneaker Culture: From Street to Mainstream',
    excerpt: 'How footwear became the defining fashion statement of a generation, and what to buy right now.',
    category: 'Footwear',
    author: 'Marcus Lee',
    avatar: 'https://i.pravatar.cc/48?img=11',
    publishedAt: '2026-03-12',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    tags: ['footwear', 'streetwear', 'culture'],
    content: [
      'Sneakers now bridge performance design, collectible culture, and everyday wear, creating one of the most active product segments in retail.',
      'Shoppers are prioritizing comfort stacks and long-term versatility over one-season hype.',
    ],
  },
  {
    id: 'blog-5',
    slug: 'sustainable-shopping',
    title: 'How to Shop More Sustainably in 2026',
    excerpt: 'A practical guide to making eco-conscious choices when shopping for clothes, tech, and home goods.',
    category: 'Lifestyle',
    author: 'Sofia Reyes',
    avatar: 'https://i.pravatar.cc/48?img=5',
    publishedAt: '2026-03-10',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    tags: ['sustainability', 'shopping', 'lifestyle'],
    content: [
      'Sustainable shopping is mostly about reducing replacement cycles: buy better, maintain longer, and repair where possible.',
      'Product pages with detailed materials and manufacturing notes can help you compare quality beyond marketing claims.',
    ],
  },
];

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

export const fetchSearchResults = async (query: string) => {
  const loweredQuery = query.trim().toLowerCase();

  return new Promise<typeof products>((resolve) => setTimeout(() => {
    if (!loweredQuery) {
      resolve(products);
      return;
    }

    resolve(
      products.filter((product) => {
        const haystack = [
          product.title,
          product.brand,
          product.description,
          ...(product.tags || []),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(loweredQuery);
      }),
    );
  }, 220));
};

export const fetchCustomerOrders = async () => {
  return new Promise<OrderRecord[]>((resolve) => setTimeout(() => {
    resolve([...customerOrders]);
  }, 260));
};

export const fetchCustomerOrderById = async (id: string) => {
  return new Promise<OrderRecord | undefined>((resolve) => setTimeout(() => {
    resolve(customerOrders.find((order) => order.id === id));
  }, 260));
};

export const fetchTrackOrder = async (orderNumber: string, email: string) => {
  const normalizedOrder = orderNumber.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  return new Promise<OrderRecord | undefined>((resolve) => setTimeout(() => {
    resolve(
      customerOrders.find(
        (order) =>
          order.orderNumber.toUpperCase() === normalizedOrder &&
          order.email.toLowerCase() === normalizedEmail,
      ),
    );
  }, 300));
};

export const fetchCustomerAddresses = async () => {
  return new Promise<CustomerAddress[]>((resolve) => setTimeout(() => {
    resolve([...customerAddresses]);
  }, 260));
};

export const fetchNotifications = async () => {
  return new Promise<NotificationRecord[]>((resolve) => setTimeout(() => {
    resolve([...notificationFeed]);
  }, 260));
};

export const fetchBlogPosts = async () => {
  return new Promise<BlogPost[]>((resolve) => setTimeout(() => {
    resolve([...blogPosts]);
  }, 260));
};

export const fetchBlogPostBySlug = async (slug: string) => {
  return new Promise<BlogPost | undefined>((resolve) => setTimeout(() => {
    resolve(blogPosts.find((post) => post.slug === slug));
  }, 260));
};

export const fetchRelatedBlogPosts = async (slug: string, limit = 3) => {
  return new Promise<BlogPost[]>((resolve) => setTimeout(() => {
    const current = blogPosts.find((post) => post.slug === slug);
    if (!current) {
      resolve(blogPosts.slice(0, limit));
      return;
    }

    resolve(
      blogPosts
        .filter((post) => post.slug !== slug)
        .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
        .slice(0, limit),
    );
  }, 260));
};

export const fetchStorefrontContent = async () => {
  return new Promise<typeof storefrontContent>((resolve) => setTimeout(() => {
    resolve(storefrontContent);
  }, 220));
};

