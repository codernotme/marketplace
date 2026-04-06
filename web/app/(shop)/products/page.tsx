import { fetchProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { SortDropdown } from '@/components/product/SortDropdown';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const products = await fetchProducts();

  return (
    <PageWrapper>
      <div className="bg-white min-h-screen">
          <div className="pt-6 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 text-black hover:bg-[#F5F5F5] px-4 py-2 rounded-full transition-colors font-bold font-body">
                <Icon icon="lucide:arrow-left" className="text-xl" /> Back
            </Link>
            <div className="bg-[#F5F5F5] rounded-full px-6 py-3 flex-1 max-w-lg mx-4 items-center gap-2 hidden md:flex">
                <Icon icon="lucide:search" className="text-gray-400 text-lg" />
                <input type="text" placeholder="Search for T-shirts, Jackets..." className="bg-transparent border-none outline-none w-full text-black font-medium" />
                <button><Icon icon="lucide:sliders-horizontal" className="text-xl text-black hover:text-[#84D347] transition-colors" /></button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                <div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-black mb-1">Result for Jackets</h1>
                    <p className="font-body text-sm font-medium text-gray-500">{products.length} Products</p>
                </div>
                <SortDropdown />
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Sidebar / Filters */}
              <aside className="w-full md:w-64 flex-shrink-0 sticky top-24 hidden md:block">
                <ProductFilters />
              </aside>

              {/* Main Content */}
              <div className="flex-1 w-full pb-20">
                <ProductGrid products={products} />
              </div>
            </div>
          </div>
      </div>
    </PageWrapper>
  );
}
