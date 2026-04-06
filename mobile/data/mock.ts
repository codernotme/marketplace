export const storefrontContent = {
  brand: {
    siteName: 'themrktplace',
    logoText: 'tm.',
    defaultHeaderSubtitle: 'Curated drops',
  },
  home: {
    hero: {
      badge: 'New Season Arrivals',
      title: 'Shop the Future of Style.',
      highlight: 'Future',
      description: 'Curated collections from the world\'s most innovative brands. Premium quality, authentic products, delivered to your door.',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80',
      primaryCtaLabel: 'Shop Now',
      primaryCtaHref: '/shop',
      secondaryCtaLabel: 'Browse Men',
      secondaryCtaHref: '/category/men',
      stats: [
        { label: 'Happy Customers', value: '12K+' },
        { label: 'Products', value: '500+' },
      ],
    },
    marqueeItems: ['New Arrivals', 'Free Shipping', 'Top Brands', 'Authentic Gear', 'Exclusive Drops', 'Best Sellers'],
    sections: {
      categories: { eyebrow: 'Browse', title: 'Shop by Category', actionLabel: 'See all', actionHref: '/shop' },
      trending: { eyebrow: 'Hot Right Now', title: 'Trending Products', actionLabel: 'See more', actionHref: '/shop' },
      featured: { eyebrow: 'Handpicked', title: 'Featured Collection' },
      reviews: { eyebrow: 'Reviews', title: 'What Customers Say' },
      blog: { eyebrow: 'Stories', title: 'Blog Posts', actionLabel: 'Latest', actionHref: '/blog' },
    },
    deal: {
      badge: 'Deal of the day',
      title: 'DR CRZ Varsity Jacket',
      description: 'Limited stock. Up to 25% off premium outerwear.',
      ctaLabel: 'Shop Deal',
      ctaHref: '/products/varsity-jacket',
    },
    newsletter: {
      eyebrow: 'Insider access',
      title: 'Get Exclusive Offers First',
      description: 'Subscribe to our insider list and get early access to deals, drops and new arrivals.',
      placeholder: 'Enter your email...',
      ctaLabel: 'Subscribe',
    },
  },
  shop: {
    title: 'Full Catalogue',
    subtitle: 'Browse',
    searchLeadingLabel: 'Search',
    searchPlaceholder: 'T-shirts, Jackets, Earbuds...',
    filterChips: ['All', 'Relevance', 'Price', 'Newest', 'Rating', 'Best Sellers'],
    categoriesHeading: 'Categories',
    countSuffix: 'Products',
  },
  account: {
    title: 'Account Hub',
    subtitle: 'My account',
    stats: [
      { label: 'Saved Items', source: 'wishlist' },
      { label: 'Cart Items', source: 'cart' },
      { label: 'Orders', source: 'static', value: '3' },
      { label: 'Alerts', source: 'static', value: '2' },
    ],
    shortcuts: [
      { label: 'My Orders', href: '/account/orders' },
      { label: 'Addresses', href: '/account/addresses' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Notifications', href: '/account/notifications' },
      { label: 'Profile', href: '/account/profile' },
      { label: 'Track Order', href: '/track' },
    ],
  },
  about: {
    headerTitle: 'About Us',
    headerSubtitle: 'Company',
    paragraphs: [
      'We build curated ecommerce experiences focused on quality products, clear discovery, and a fast checkout flow.',
      'The mobile app mirrors the storefront catalogue, account journeys, and content sections so customers can move between web and app without losing context.',
    ],
  },
  contact: {
    headerTitle: 'Contact',
    headerSubtitle: 'Support',
    fields: {
      name: { placeholder: 'Name' },
      email: { placeholder: 'Email' },
      message: { placeholder: 'Message' },
    },
    submitLabel: 'Send Message',
  },
  faq: {
    headerTitle: 'FAQ',
    headerSubtitle: 'Help',
    items: [
      ['How long does shipping take?', 'Standard shipping usually takes 3-5 business days depending on location.'],
      ['Can I return an item?', 'Yes, returns are accepted within the return window as long as the product is unused.'],
      ['How do I track my order?', 'Use the Track Order page with your order number and email address.'],
    ],
  },
  legal: {
    privacy: {
      headerTitle: 'Privacy Policy',
      headerSubtitle: 'Legal',
      paragraphs: [
        'We only use the data needed to process orders, support accounts, and improve the storefront experience.',
        'This mobile clone uses local mock data only. No external personal data is transmitted from these screens.',
      ],
    },
    refund: {
      headerTitle: 'Refund Policy',
      headerSubtitle: 'Legal',
      paragraphs: [
        'Refunds are reviewed once a return is received and inspected.',
        'Approved refunds are issued back to the original payment method after processing.',
      ],
    },
    terms: {
      headerTitle: 'Terms of Service',
      headerSubtitle: 'Legal',
      paragraphs: [
        'By using the store you agree to standard commerce terms, product availability, and order processing rules.',
        'All product content, images, and mock checkout interactions are provided for demonstration inside this Expo clone.',
      ],
    },
  },
  auth: {
    login: {
      headerTitle: 'Sign In',
      headerSubtitle: 'Welcome back',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '••••••••',
      submitLabel: 'Sign In',
      secondaryLabel: 'Create Account',
      forgotLabel: 'Forgot Password?',
    },
    register: {
      headerTitle: 'Create Account',
      headerSubtitle: 'Join themrktplace',
      firstNamePlaceholder: 'First name',
      lastNamePlaceholder: 'Last name',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'At least 8 characters',
      submitLabel: 'Create Account',
      secondaryLabel: 'Already have an account? Sign In',
    },
    forgotPassword: {
      headerTitle: 'Forgot Password',
      headerSubtitle: 'Reset your account password',
      emailPlaceholder: 'you@example.com',
      submitLabel: 'Send Reset Link',
      successTitle: 'Check your inbox',
      successDescription: 'We sent a reset link to your email. It expires in 30 minutes.',
      secondaryLabel: 'Back to Sign In',
    },
  },
};

export const categories = [
  { id: '1', slug: 'men', name: 'Menswear', icon: 'shirt', image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=600&q=80', count: 129 },
  { id: '2', slug: 'women', name: 'Womenswear', icon: 'bag', image: 'https://images.unsplash.com/photo-1519412096601-7b7b85a55553?auto=format&fit=crop&w=600&q=80', count: 98 },
  { id: '3', slug: 'electronics', name: 'Electronics', icon: 'laptopcomputer', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80', count: 74 },
  { id: '4', slug: 'home', name: 'Home Goods', icon: 'sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', count: 56 },
  { id: '5', slug: 'shoes', name: 'Footwear', icon: 'shoeprints.fill', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', count: 85 },
  { id: '6', slug: 'accessories', name: 'Accessories', icon: 'applewatch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', count: 63 },
];

export const reviews = [
  { id: 'r1', productId: 'p1', author: 'Alexa Watson', avatar: 'https://i.pravatar.cc/100?img=1', rating: 5, date: '2026-03-15', text: 'Absolutely love this product! Stylish and comfortable. Highly recommend to everyone.' },
  { id: 'r2', productId: 'p1', author: 'Emily Mendez', avatar: 'https://i.pravatar.cc/100?img=5', rating: 5, date: '2026-03-10', text: 'Great purchase, the quality exceeded my expectations. Will definitely buy again.' },
  { id: 'r3', productId: 'p1', author: 'David Swagner', avatar: 'https://i.pravatar.cc/100?img=11', rating: 4, date: '2026-03-05', text: 'Really solid product overall. The delivery was fast and packaging was amazing.' },
  { id: 'r4', productId: 'p2', author: 'Sarah Kim', avatar: 'https://i.pravatar.cc/100?img=9', rating: 5, date: '2026-03-14', text: 'Best earbuds Ive ever used. The noise cancellation is impressive!' },
  { id: 'r5', productId: 'p3', author: 'Marcus Lee', avatar: 'https://i.pravatar.cc/100?img=7', rating: 4, date: '2026-03-12', text: 'Love the classic look. Very comfortable for daily use.' },
];

export const products = [
  { id: 'p1', slug: 'minimalist-watch', title: 'Minimalist Leather Watch', description: 'A beautifully crafted minimalist timepiece featuring a genuine Italian leather strap and Swiss quartz movement. Water resistant up to 50m.', price: 189, comparePrice: 249, category_id: '6', brand: 'Timecraft Co.', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.9, ratings_count: 1283, is_new: true, is_trending: true, is_featured: true, tags: ['watches', 'accessories', 'leather'], variants: [{ id: 'v1a', name: 'Black / Silver', price: 189, stock: 10 }, { id: 'v1b', name: 'Brown / Gold', price: 209, stock: 5 }] },
  { id: 'p2', slug: 'wireless-earbuds', title: 'Noise Cancelling Earbuds Pro', description: 'Premium wireless earbuds with industry-leading active noise cancellation. 28-hour total battery life with the compact charging case.', price: 159, comparePrice: 219, category_id: '3', brand: 'SoundLab', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.8, ratings_count: 2190, is_new: false, is_trending: true, is_featured: true, tags: ['electronics', 'audio', 'wireless'], variants: [{ id: 'v2a', name: 'Matte White', price: 159, stock: 20 }, { id: 'v2b', name: 'Midnight Black', price: 159, stock: 18 }] },
  { id: 'p3', slug: 'canvas-sneakers', title: 'Retro Canvas Sneakers', description: 'Inspired by classic 70s court shoes, these retro canvas sneakers deliver authentic vintage style with modern comfort insoles.', price: 79, comparePrice: 99, category_id: '5', brand: 'StreetKix', images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.3, ratings_count: 892, is_new: false, is_trending: false, is_featured: false, tags: ['shoes', 'sneakers', 'retro'], variants: [{ id: 'v3a', name: 'US 8', price: 79, stock: 0 }, { id: 'v3b', name: 'US 9', price: 79, stock: 15 }, { id: 'v3c', name: 'US 10', price: 79, stock: 8 }] },
  { id: 'p4', slug: 'ceramic-coffee-mug', title: 'Handcrafted Ceramic Mug', description: 'Each mug is individually hand-thrown and glazed by local artisans, making every piece truly one-of-a-kind.', price: 34, comparePrice: null, category_id: '4', brand: 'Terra Studio', images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.9, ratings_count: 674, is_new: true, is_trending: true, is_featured: false, tags: ['home', 'kitchen', 'ceramic'], variants: [{ id: 'v4a', name: 'Matte Black', price: 34, stock: 30 }, { id: 'v4b', name: 'Speckled White', price: 34, stock: 12 }, { id: 'v4c', name: 'Terracotta', price: 36, stock: 7 }] },
  { id: 'p5', slug: 'woven-tote-bag', title: 'Artisan Woven Tote Bag', description: 'Hand-woven from natural seagrass by skilled craftspeople. Spacious interior with a durable cotton lining.', price: 89, comparePrice: 120, category_id: '2', brand: 'Boho Luxe', images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.3, ratings_count: 341, is_new: false, is_trending: true, is_featured: true, tags: ['bags', 'women', 'accessories'], variants: [{ id: 'v5a', name: 'Natural Sand', price: 89, stock: 8 }] },
  { id: 'p6', slug: 'mechanical-keyboard', title: '65% Mechanical Keyboard', description: 'The perfect compact keyboard for enthusiasts and developers alike. Hot-swappable PCB and premium keycaps.', price: 129, comparePrice: 159, category_id: '3', brand: 'KeyForge', images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.7, ratings_count: 512, is_new: true, is_trending: false, is_featured: true, tags: ['electronics', 'computers', 'gaming'], variants: [{ id: 'v6a', name: 'Tactile (Brown)', price: 129, stock: 4 }, { id: 'v6b', name: 'Linear (Red)', price: 129, stock: 6 }] },
  { id: 'p7', slug: 'varsity-jacket', title: 'DR CRZ Varsity Jacket', description: 'Premium heavyweight leather varsity jacket with custom embroidery. Wool body with genuine leather sleeves.', price: 349, comparePrice: 449, category_id: '1', brand: 'DR CRZ Studio', images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.8, ratings_count: 873, is_new: true, is_trending: true, is_featured: true, tags: ['jacket', 'men', 'outerwear'], variants: [{ id: 'v7a', name: 'S', price: 349, stock: 3 }, { id: 'v7b', name: 'M', price: 349, stock: 8 }, { id: 'v7c', name: 'L', price: 349, stock: 12 }, { id: 'v7d', name: 'XL', price: 349, stock: 5 }] },
  { id: 'p8', slug: 'running-shoes', title: 'Nike Tech Hera Runners', description: 'Designed for speed. Lightweight mesh upper with React foam cushioning provides a smooth, springy ride.', price: 169, comparePrice: 199, category_id: '5', brand: 'Nike', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.9, ratings_count: 3204, is_new: false, is_trending: true, is_featured: false, tags: ['shoes', 'running', 'nike'], variants: [{ id: 'v8a', name: 'Triple White', price: 169, stock: 22 }, { id: 'v8b', name: 'Black / Red', price: 169, stock: 11 }] },
  { id: 'p9', slug: 'linen-shirt', title: 'Casual Linen Summer Shirt', description: 'Breathable, natural linen shirt. Perfect for warm climates and casual occasions. Button-down collar, relaxed fit.', price: 59, comparePrice: 79, category_id: '1', brand: 'Coastal & Co.', images: ['https://images.unsplash.com/photo-1588591795084-1770cb3be374?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.5, ratings_count: 471, is_new: false, is_trending: false, is_featured: false, tags: ['shirts', 'men', 'summer'], variants: [{ id: 'v9a', name: 'Off White', price: 59, stock: 18 }, { id: 'v9b', name: 'Sage Green', price: 59, stock: 9 }] },
  { id: 'p10', slug: 'yoga-pants', title: 'High-Rise Sculpt Yoga Pants', description: 'Compression fit yoga leggings with a high-rise waistband. Side pockets for your essentials.', price: 69, comparePrice: 89, category_id: '2', brand: 'FlexForm', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80'], ratings_avg: 4.6, ratings_count: 987, is_new: true, is_trending: true, is_featured: false, tags: ['women', 'activewear', 'yoga'], variants: [{ id: 'v10a', name: 'XS / Black', price: 69, stock: 14 }, { id: 'v10b', name: 'S / Black', price: 69, stock: 22 }, { id: 'v10c', name: 'M / Black', price: 69, stock: 16 }] },
];

export const blogPosts = [
  { id: 'blog-1', slug: 'top-tech-picks', title: 'Top 10 Tech Picks This Season', excerpt: 'From wireless earbuds to mechanical keyboards, these are the gadgets everyone is talking about right now.', category: 'Electronics', author: 'James Hurst', avatar: 'https://i.pravatar.cc/48?img=15', publishedAt: '2026-03-20', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80', featured: true, content: ['Tech trends shift quickly, but a few categories continue to dominate buyer attention.', 'When comparing devices, focus first on durability and ecosystem compatibility.'], tags: ['electronics', 'gadgets'] },
  { id: 'blog-2', slug: 'spring-fashion-trends', title: 'Spring Fashion Trends You Need to Know', excerpt: 'From earthy tones to bold patterns, this spring fashion is all about personal expression and comfort.', category: 'Fashion', author: 'Sofia Reyes', avatar: 'https://i.pravatar.cc/48?img=5', publishedAt: '2026-03-18', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80', featured: false, content: ['Designers are balancing expressive silhouettes with functional layering.', 'Muted greens, sand tones, and textured fabrics are shaping the season.'], tags: ['fashion', 'spring'] },
  { id: 'blog-3', slug: 'home-decor-guide', title: 'The Ultimate Home Decor Guide for 2026', excerpt: 'Transform your living space with these curated pieces and interior design ideas from our home category.', category: 'Home & Living', author: 'Ava Sterling', avatar: 'https://i.pravatar.cc/48?img=47', publishedAt: '2026-03-15', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', featured: false, content: ['A strong decor update starts with lighting and material contrast.', 'Neutral bases paired with one high-impact texture can make smaller spaces feel premium.'], tags: ['home', 'decor'] },
  { id: 'blog-4', slug: 'sneaker-culture', title: 'Sneaker Culture: From Street to Mainstream', excerpt: 'How footwear became the defining fashion statement of a generation, and what to buy right now.', category: 'Footwear', author: 'Marcus Lee', avatar: 'https://i.pravatar.cc/48?img=11', publishedAt: '2026-03-12', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', featured: false, content: ['Sneakers now bridge performance design, collectible culture, and everyday wear.', 'Shoppers are prioritizing comfort stacks and long-term versatility.'], tags: ['footwear', 'streetwear'] },
];

export const notifications = [
  { id: 'notif-1', channel: 'in_app', type: 'order_shipped', title: 'Order MKT-2026-00114 is on the way', body: 'Your package has left our warehouse and is now with Delhivery.', createdAt: '2026-03-13T15:05:00Z', read: false },
  { id: 'notif-2', channel: 'email', type: 'promo', title: 'Flash sale starts tonight', body: 'Get up to 30% off selected footwear and accessories.', createdAt: '2026-03-10T07:30:00Z', read: true },
  { id: 'notif-3', channel: 'push', type: 'wishlist_price_drop', title: 'A saved item just got cheaper', body: 'Retro Canvas Sneakers are now 20% off for a limited time.', createdAt: '2026-03-07T18:10:00Z', read: true },
];

export const addresses = [
  { id: 'addr-1', label: 'Home', fullName: 'Ava Sterling', phone: '+1 555 010 7788', line1: '123 Main Street', line2: 'Apartment 4B', city: 'San Francisco', state: 'California', pincode: '94103', country: 'United States', isDefault: true },
  { id: 'addr-2', label: 'Work', fullName: 'Ava Sterling', phone: '+1 555 010 7788', line1: '580 Market Street', city: 'San Francisco', state: 'California', pincode: '94104', country: 'United States', isDefault: false },
];

export const orders = [
  { id: 'ord-1', orderNumber: 'MKT-2026-00121', email: 'ava@example.com', createdAt: '2026-03-20T14:22:00Z', pricing: { subtotal: 348, shippingFee: 0, taxTotal: 28, discountTotal: 20, grandTotal: 356 }, paymentStatus: 'paid', fulfillmentStatus: 'delivered', trackingNumber: 'TRK92019088', courier: 'BlueDart', trackingUrl: 'https://example.com/tracking/TRK92019088', shippingAddress: { fullName: 'Ava Sterling', phone: '+1 555 010 7788', line1: '123 Main Street', line2: 'Apartment 4B', city: 'San Francisco', state: 'California', pincode: '94103', country: 'United States' }, items: [{ id: 'ord-1-item-1', productId: 'p1', title: 'Minimalist Leather Watch', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80', variantLabel: 'Black / Silver', quantity: 1, unitPrice: 189, subtotal: 189 }], timeline: [{ status: 'pending', note: 'Order placed', createdAt: '2026-03-20T14:22:00Z' }, { status: 'shipped', note: 'Package shipped via BlueDart', createdAt: '2026-03-21T13:30:00Z' }, { status: 'delivered', note: 'Delivered to front desk', createdAt: '2026-03-23T17:05:00Z' }] },
  { id: 'ord-2', orderNumber: 'MKT-2026-00114', email: 'ava@example.com', createdAt: '2026-03-12T11:45:00Z', pricing: { subtotal: 159, shippingFee: 12, taxTotal: 13, discountTotal: 0, grandTotal: 184 }, paymentStatus: 'paid', fulfillmentStatus: 'shipped', trackingNumber: 'TRK88310117', courier: 'Delhivery', trackingUrl: 'https://example.com/tracking/TRK88310117', shippingAddress: { fullName: 'Ava Sterling', phone: '+1 555 010 7788', line1: '580 Market Street', city: 'San Francisco', state: 'California', pincode: '94104', country: 'United States' }, items: [{ id: 'ord-2-item-1', productId: 'p2', title: 'Noise Cancelling Earbuds Pro', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80', variantLabel: 'Midnight Black', quantity: 1, unitPrice: 159, subtotal: 159 }], timeline: [{ status: 'pending', note: 'Order placed', createdAt: '2026-03-12T11:45:00Z' }, { status: 'shipped', note: 'Shipped via Delhivery', createdAt: '2026-03-13T15:00:00Z' }] },
];
