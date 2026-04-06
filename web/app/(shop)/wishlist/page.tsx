import { fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function WishlistPage() {
  const products = await fetchProducts();
  // Simulate wishlist with featured products
  const wishlistItems = products.filter(p => p.is_featured).slice(0, 6);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-white py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Saved</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-black">My Wishlist</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-gray-500 font-medium">{wishlistItems.length} items saved</span>
            {wishlistItems.length > 0 && (
              <Link href="/products" className="bg-black text-black font-bold rounded-full px-6 h-10 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
                <Icon icon="mdi:cart-plus" /> Add All to Cart
              </Link>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-32 bg-[#F5F5F5] rounded-3xl">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Icon icon="mdi:heart-outline" className="text-5xl text-gray-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-black mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 font-body">Tap the heart icon on any product to save it here.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-black text-white rounded-full px-8 h-12 font-bold hover:scale-105 transition-transform font-body text-sm shadow-lg">
              Discover Products <Icon icon="lucide:arrow-right" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {wishlistItems.map((product) => (
                <div key={product.id} className="group relative">
                  <button className="absolute top-4 right-4 z-30 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                    <Icon icon="mdi:heart" className="text-red-500 text-xl" />
                  </button>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-20 pt-12 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-bold text-black">You Might Also Like</h2>
                <Link href="/products" className="font-body text-sm font-semibold text-gray-400 hover:text-black flex items-center gap-1">
                  See All <Icon icon="lucide:chevron-right" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.filter(p => !p.is_featured).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
