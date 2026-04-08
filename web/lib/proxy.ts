import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchCustomerOrders,
  fetchProductBySlug,
  fetchProducts,
  fetchTrendingProducts,
  fetchNewArrivals,
} from '@/lib/api';

/**
 * Proxy layer for data fetching.
 */
export const proxy = {
  products: {
    getAll: () => fetchProducts(),
    getBySlug: (slug: string) => fetchProductBySlug(slug),
    getTrending: () => fetchTrendingProducts(),
    getNew: () => fetchNewArrivals(),
  },
  categories: {
    getAll: () => fetchCategories(),
    getBySlug: (slug: string) => fetchCategoryBySlug(slug),
  },
  user: {
    getOrders: (_userId: string) => fetchCustomerOrders(),
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
    getProducts: async (_vendorId: string) => {
      return fetchProducts();
    }
  }
};
