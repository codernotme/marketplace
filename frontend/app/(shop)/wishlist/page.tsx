import { fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function WishlistPage() {
  const products = await fetchProducts();
  // Simulate wishlist with a slice of products
  const wishlistItems = products.slice(0, 3);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Icon icon="mdi:heart" className="text-4xl text-red-500" />
          <h1 className="font-display text-4xl font-bold tracking-tight text-black">My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F5F5] rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No items yet</h2>
            <p className="text-gray-500 mb-8">Items you favorite will appear here.</p>
            <Link href="/products" className="inline-flex items-center justify-center bg-black text-white rounded-full px-8 h-12 font-semibold hover:scale-105 transition-transform">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
