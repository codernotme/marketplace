import { Icon } from '@iconify/react';
import Link from 'next/link';

import { ProductCard } from '@/components/product/ProductCard';
import { fetchSearchResults } from '@/lib/api';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const results = await fetchSearchResults(query);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Search</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight">Find Products</h1>
        </div>

        <form action="/search" className="mb-8 bg-[#F5F5F5] rounded-2xl px-4 h-14 flex items-center gap-3">
          <Icon icon="lucide:search" className="text-gray-400 text-lg" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by product, brand, or tag"
            className="bg-transparent w-full h-full outline-none text-sm text-black"
          />
          <button className="h-9 px-4 rounded-full bg-black text-white text-sm font-semibold">Search</button>
        </form>

        {query ? (
          <p className="text-sm text-gray-500 mb-6">
            Showing {results.length} result(s) for <span className="text-black font-semibold">{query}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-6">Enter a keyword to search the catalog.</p>
        )}

        {results.length === 0 ? (
          <div className="bg-[#F5F5F5] rounded-3xl p-12 text-center">
            <Icon icon="mdi:database-search-outline" className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="font-display text-2xl font-bold text-black mb-2">No matching products</h2>
            <p className="text-gray-500 mb-6">Try another keyword or explore all categories.</p>
            <Link href="/products" className="inline-flex h-11 px-6 rounded-full bg-black text-white text-sm font-semibold items-center">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
