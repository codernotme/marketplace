import { fetchProductBySlug, fetchProducts, fetchProductReviews } from '@/lib/api';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    fetchProductBySlug(slug),
    fetchProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const reviews = await fetchProductReviews(product.id);
  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.comparePrice!) * 100) : 0;
  const inStock = (product.variants?.[0]?.stock ?? 0) > 0;

  return (
    <PageWrapper>
      <div className="bg-[#F9F9F9] min-h-screen pb-28 lg:pb-16 font-body">
        {/* Top Breadcrumb Nav */}
        <div className="bg-gray border-b border-gray-100 py-4 px-4 md:px-8 max-w-7xl mx-auto flex items-center gap-3 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Icon icon="lucide:chevron-right" className="text-xs" />
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <Icon icon="lucide:chevron-right" className="text-xs" />
          <span className="text-black font-semibold line-clamp-1">{product.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* === GALLERY === */}
            <div className="w-full lg:w-[52%] flex-shrink-0">
              <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-sm mb-4">
                {hasDiscount && (
                  <span className="absolute top-4 left-4 z-10 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-full">
                    -{discountPct}%
                  </span>
                )}
                {product.is_new && (
                  <span className={`absolute top-4 ${hasDiscount ? 'left-[4.5rem]' : 'left-4'} z-10 bg-black text-white font-bold text-xs px-3 py-1.5 rounded-full`}>
                    NEW
                  </span>
                )}
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {product.images.map((img, i) => (
                    <div key={i} className={`w-20 h-20 flex-shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${i === 0 ? 'border-black' : 'border-transparent hover:border-gray-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* === INFO PANEL === */}
            <div className="w-full lg:w-[48%] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347]">{product.brand}</span>
                <button className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Icon icon="mdi:heart-outline" className="text-xl" />
                </button>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight leading-tight mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(star => (
                    <Icon key={star} icon="mdi:star" className={star <= Math.round(product.ratings_avg || 5) ? "text-[#FFB800] text-base" : "text-gray-200 text-base"} />
                  ))}
                </div>
                <span className="font-bold text-black text-sm">{product.ratings_avg}</span>
                <span className="text-sm text-gray-400 font-medium">({product.ratings_count} Reviews)</span>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-4xl font-black text-black tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="font-body text-lg text-gray-400 line-through">${product.comparePrice!.toFixed(2)}</span>
                )}
              </div>

              <p className="font-body text-gray-500 text-sm leading-relaxed mb-6 border-b border-gray-100 pb-6">
                {product.description}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-body font-bold text-black text-sm">Select Option</h3>
                    <button className="text-xs text-gray-400 underline font-body">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => (
                      <button key={v.id} className={`px-5 h-11 rounded-full font-body font-semibold text-sm transition-all border ${idx === 0 ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'} ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={v.stock === 0}>
                        {v.name}{v.stock === 0 ? ' (sold out)' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center bg-[#F5F5F5] rounded-full p-1">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors text-black font-bold text-lg">-</button>
                  <span className="w-10 text-center font-bold text-black">1</span>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors text-black font-bold text-lg">+</button>
                </div>
                <span className="font-body text-sm text-gray-400">{product.variants?.[0]?.stock ?? 0} units left</span>
              </div>

              <div className="flex gap-4 mb-8">
                <Button variant="bordered" className="flex-1 h-14 border-2 border-gray-200 rounded-2xl font-bold text-black flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-colors font-body text-base">
                  <Icon icon="mdi:cart-outline" className="text-xl" /> Add to Cart
                </Button>
                <Button className="flex-1 h-14 bg-black rounded-2xl font-bold text-white hover:scale-[1.02] shadow-xl transition-transform font-body text-base">
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: 'mdi:truck-delivery-outline', text: 'Free Shipping over $100' },
                  { icon: 'mdi:shield-check-outline', text: '2-Year Warranty' },
                  { icon: 'mdi:rotate-left', text: '30-Day Returns' },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 bg-[#F5F5F5] rounded-full px-4 py-2">
                    <Icon icon={badge.icon} className="text-lg text-[#84D347]" />
                    <span className="font-body text-xs font-semibold text-gray-700">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === REVIEWS SECTION === */}
          <div className="mt-20 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-black">Customer Reviews</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <Icon key={star} icon="mdi:star" className={star <= Math.round(product.ratings_avg || 5) ? "text-[#FFB800] text-lg" : "text-gray-200 text-lg"} />
                    ))}
                  </div>
                  <span className="font-bold text-black">{product.ratings_avg} out of 5</span>
                  <span className="text-gray-400 text-sm font-body">({product.ratings_count} reviews)</span>
                </div>
              </div>
              <button className="bg-black text-white font-bold rounded-full px-6 h-11 font-body text-sm hover:scale-105 transition-transform">
                Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { author: 'Alexa Watson', avatar: 'https://i.pravatar.cc/100?img=1', rating: 5, date: 'Mar 15, 2026', text: 'Absolutely love this product! Stylish and comfortable. Highly recommend to everyone.' },
                { author: 'Emily Mendez', avatar: 'https://i.pravatar.cc/100?img=5', rating: 5, date: 'Mar 10, 2026', text: 'Great purchase, the quality exceeded my expectations. Will definitely buy again.' },
                { author: 'David Swagner', avatar: 'https://i.pravatar.cc/100?img=11', rating: 4, date: 'Mar 05, 2026', text: 'Really solid product overall. Fast delivery and amazing packaging.' },
                ...(reviews.map(r => ({ author: r.author, avatar: r.avatar, rating: r.rating, date: r.date, text: r.text })))
              ].slice(0, 3).map((r, i) => (
                <div key={i} className="bg-[#F5F5F5] rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-black text-sm">{r.author}</p>
                      <p className="font-body text-xs text-gray-400">{r.date}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Icon key={s} icon="mdi:star" className={s <= r.rating ? "text-[#FFB800] text-sm" : "text-gray-200 text-sm"} />)}
                    </div>
                  </div>
                  <p className="font-body text-gray-700 text-sm leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* === RELATED PRODUCTS === */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-16 pb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-3xl font-bold text-black">You May Also Like</h2>
                <Link href="/products" className="font-body text-sm font-semibold text-gray-400 hover:text-black flex items-center gap-1">
                  See All <Icon icon="lucide:chevron-right" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
