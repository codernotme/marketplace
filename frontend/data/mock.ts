export const categories = [
  { id: '1', slug: 'men', name: 'Menswear', is_active: true },
  { id: '2', slug: 'women', name: 'Womenswear', is_active: true },
  { id: '3', slug: 'electronics', name: 'Electronics', is_active: true },
  { id: '4', slug: 'home', name: 'Home Goods', is_active: true }
];

export const products = [
  {
    id: 'p1',
    slug: 'minimalist-watch',
    title: 'Minimalist Leather Watch',
    price: 4999,
    category_id: '1',
    vendor_id: 'v1',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.5,
    is_new: true,
    is_trending: true,
    variants: [
      { id: 'v1', name: 'Black', price: 4999, stock: 10 },
      { id: 'v2', name: 'Brown', price: 4999, stock: 5 }
    ]
  },
  {
    id: 'p2',
    slug: 'wireless-earbuds',
    title: 'Noise Cancelling Earbuds',
    price: 12999,
    category_id: '3',
    vendor_id: 'v1',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.8,
    is_new: false,
    is_trending: true,
    variants: [
      { id: 'v3', name: 'White', price: 12999, stock: 20 }
    ]
  },
  {
    id: 'p3',
    slug: 'canvas-sneakers',
    title: 'Classic Canvas Sneakers',
    price: 2499,
    category_id: '1',
    vendor_id: 'v2',
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.1,
    is_new: false,
    is_trending: false,
    variants: [
      { id: 'v4', name: 'Size 9', price: 2499, stock: 0 },
      { id: 'v5', name: 'Size 10', price: 2499, stock: 15 }
    ]
  },
  {
    id: 'p4',
    slug: 'ceramic-coffee-mug',
    title: 'Handcrafted Ceramic Mug',
    price: 899,
    category_id: '4',
    vendor_id: 'v3',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.9,
    is_new: true,
    is_trending: true,
    variants: [
      { id: 'v6', name: 'Matte Black', price: 899, stock: 30 },
      { id: 'v7', name: 'Speckled White', price: 899, stock: 12 }
    ]
  },
  {
    id: 'p5',
    slug: 'woven-tote-bag',
    title: 'Artisan Woven Tote',
    price: 3499,
    category_id: '2',
    vendor_id: 'v2',
    images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.3,
    is_new: false,
    is_trending: true,
    variants: [
      { id: 'v8', name: 'Natural Sand', price: 3499, stock: 8 }
    ]
  },
  {
    id: 'p6',
    slug: 'mechanical-keyboard',
    title: '65% Mechanical Keyboard',
    price: 8499,
    category_id: '3',
    vendor_id: 'v4',
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'],
    ratings_avg: 4.7,
    is_new: true,
    is_trending: false,
    variants: [
      { id: 'v9', name: 'Tactile Switches', price: 8499, stock: 4 },
      { id: 'v10', name: 'Linear Switches', price: 8499, stock: 6 }
    ]
  }
];
