import { fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button, Image } from '@/components/HeroUI';
import Link from 'next/link';

export default async function HomePage() {
  const products = await fetchProducts();

  const categories = ['All', 'Menswear', 'Womenswear', 'Electronics', 'Home Goods', 'Accessories'];

  return (
    <div className="flex flex-col w-full pb-20 bg-white">
      <PageWrapper>
        
        {/* Special Offers Banner - Maniro Style */}
        <div className="relative w-full rounded-[2.5rem] bg-black overflow-hidden mt-8 mb-12 flex items-center justify-between p-10 shadow-lg h-[240px]">
           <div className="relative z-10 text-white max-w-sm">
             <h2 className="font-display text-4xl lg:text-5xl tracking-tight font-medium mb-3">Special Offers</h2>
             <p className="font-body text-gray-300 text-sm md:text-base leading-relaxed mb-6">Discover the new collection with an exclusive 30% discount on select premium items.</p>
             <Button as={Link} href="/products" className="bg-white text-black font-semibold rounded-full px-8 h-12 shadow-md hover:scale-105 transition-transform">
               Shop Now
             </Button>
           </div>
           
           {/* Decorative Image area */}
           <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10 w-24"></div>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80" alt="Promo" className="w-full h-full object-cover opacity-60" />
           </div>
        </div>

        {/* Categories Pill Scroller */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide mb-10 pb-2">
          {categories.map((cat, idx) => (
            <button 
              key={cat}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-body text-sm font-semibold transition-all duration-200 ${idx === 0 ? 'bg-black text-white shadow-md' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200 hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular Products Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-black tracking-tight">Popular Products</h2>
          <Link href="/products" className="font-body text-sm font-semibold text-gray-400 hover:text-black transition-colors">
            See More
          </Link>
        </div>

        {/* Grid matching the UI Kit */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </PageWrapper>
    </div>
  );
}
