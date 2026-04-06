import { fetchProductsByCategory, fetchCategoryBySlug, fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { SortDropdown } from '@/components/product/SortDropdown';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, allProducts] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchProductsByCategory(slug),
    fetchProducts(),
  ]);

  if (!category) {
    notFound();
  }

  const displayProducts = products.length > 0 ? products : allProducts;

  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
        {/* Category Banner */}
        <div className="relative w-full h-[240px] md:h-[320px] rounded-3xl overflow-hidden mt-6 mb-10">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body font-medium text-sm mb-4">
                <Icon icon="lucide:arrow-left" /> Home
              </Link>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">{category.name}</h1>
              <p className="font-body text-white/70 mt-2">{category.count} products available</p>
            </div>
          </div>
        </div>

        {/* Products Area */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-black mb-1">
              {displayProducts.length} Products in {category.name}
            </h2>
          </div>
          <SortDropdown />
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start pb-20">
          <aside className="w-full md:w-64 flex-shrink-0 sticky top-24 hidden md:block">
            <ProductFilters />
          </aside>
          <div className="flex-1 w-full">
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#F5F5F5] rounded-3xl">
                <Icon icon="mdi:package-variant-remove" className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-500 mb-6">Check back soon for new arrivals in this category.</p>
                <Link href="/products" className="bg-black text-white rounded-full px-6 h-11 flex items-center w-fit mx-auto gap-2 font-semibold font-body text-sm hover:scale-105 transition-transform">
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
