import { products, categories } from '@/data/mock';

/**
 * Proxy layer for data fetching to allow easy switching between 
 * mock data and real API endpoints.
 */
export const proxy = {
  products: {
    getAll: () => Promise.resolve(products),
    getBySlug: (slug: string) => Promise.resolve(products.find(p => p.slug === slug)),
    getTrending: () => Promise.resolve(products.filter(p => p.is_trending)),
    getNew: () => Promise.resolve(products.filter(p => p.is_new)),
  },
  categories: {
    getAll: () => Promise.resolve(categories),
    getBySlug: (slug: string) => Promise.resolve(categories.find(c => c.slug === slug)),
  },
  user: {
    getOrders: (userId: string) => {
      // Mocked orders for specific user
      return Promise.resolve([
        { id: 'ORD-1234', date: 'Oct 24, 2026', total: 4999, status: 'Delivered', items: 1 },
        { id: 'ORD-1235', date: 'Oct 18, 2026', total: 12999, status: 'Processing', items: 2 },
      ]);
    },
    getProfile: (userId: string) => {
      return Promise.resolve({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        joined: '2025-01-12'
      });
    }
  },
  admin: {
    getStats: () => Promise.resolve([
      { label: 'Total Users', value: '1,245', icon: 'lucide:users', trend: '+12%' },
      { label: 'Active Vendors', value: '84', icon: 'lucide:store', trend: '+5%' },
      { label: 'Platform Revenue', value: '₹2.4M', icon: 'lucide:indian-rupee', trend: '+18%' },
      { label: 'Support Tickets', value: '12', icon: 'lucide:life-buoy', trend: '-2' },
    ]),
    getUsers: () => Promise.resolve([
      { id: 1, name: 'Aryan Mehta', email: 'aryan@example.com', role: 'Admin', status: 'Active', joined: '2025-01-12' },
      { id: 2, name: 'Jane Smith', email: 'jane@brand.com', role: 'Vendor', status: 'Active', joined: '2026-02-15' },
      { id: 3, name: 'John Doe', email: 'john@gmail.com', role: 'Customer', status: 'Inactive', joined: '2026-03-21' },
    ])
  },
  vendor: {
    getStats: (vendorId: string) => Promise.resolve([
      { label: 'Total Revenue', value: '₹14,500', icon: 'lucide:indian-rupee', trend: '+12.5%' },
      { label: 'Orders', value: '45', icon: 'lucide:shopping-bag', trend: '+5.2%' },
      { label: 'Products', value: '12', icon: 'lucide:package', trend: '0%' },
      { label: 'Avg Rating', value: '4.8', icon: 'lucide:star', trend: '+0.1' },
    ]),
    getProducts: (vendorId: string) => Promise.resolve(products.filter(p => p.vendor_id === vendorId))
  }
};
