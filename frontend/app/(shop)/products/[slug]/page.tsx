import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { RecommendationCarousel } from '@/components/product/RecommendationCarousel';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  const similarProducts = await fetchProducts();

  if (!product) {
    notFound();
  }

  const defaultVariantId = product.variants?.[0]?.id || '';

  return (
    <PageWrapper>
      <div className="bg-[#F5F5F5] min-h-screen pb-24 lg:pb-0 font-body">
        {/* Top Navbar / Back Button Overlay */}
        <div className="pt-6 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/products" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                <Icon icon="lucide:arrow-left" className="text-xl text-black" />
            </Link>
            <span className="font-display font-bold text-lg text-black">{product.title}</span>
            <div className="w-10 h-10 bg-white rounded-full relative flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <Icon icon="mdi:cart-outline" className="text-xl text-black" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">12</span>
            </div>
        </div>

        {/* Product View */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row mt-6">
            
            {/* Gallery Section */}
            <div className="w-full lg:w-1/2 p-4 md:p-8 flex justify-center items-center">
                <div className="w-full max-w-md bg-transparent relative">
                    <img src={product.images?.[0]} alt={product.title} className="w-full h-auto object-contain mix-blend-multiply drop-shadow-2xl" />
                </div>
            </div>

            {/* Info Section (Sliding Card on Mobile, Sticky on Desktop) */}
            <div className="w-full lg:w-1/2 bg-white rounded-t-[40px] lg:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-6 md:p-10 relative mt-[-20px] lg:mt-8 z-10 lg:sticky lg:top-24">
                
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 lg:hidden"></div>

                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-black tracking-tight">{product.title}</h1>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Authentic Gear</p>
                    </div>
                    <button className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-red-50 transition-colors text-black hover:text-red-500">
                        <Icon icon="mdi:heart-outline" className="text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-6 cursor-pointer group">
                  <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                          <Icon key={star} icon="mdi:star" className={star <= Math.round(product.ratings_avg || 5) ? "text-[#FFB800] text-lg" : "text-gray-200 text-lg"} />
                      ))}
                  </div>
                  <span className="font-bold text-black">{product.ratings_avg}</span>
                  <span className="text-sm text-gray-400 font-medium">(1283 Reviews)</span>
                </div>

                <div className="font-display text-4xl font-black text-black tracking-tight mb-8">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(product.price)}
                </div>

                {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-black mb-4">Size</h3>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((size, idx) => (
                                <button key={size} className={`w-12 h-12 rounded-full font-bold text-sm transition-colors border ${idx === 1 ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="font-bold text-black mb-2">Description</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        The {product.title} is a stylish and versatile piece designed to provide both fashion and functionality. Crafted with attention to detail. <span className="text-black font-bold cursor-pointer">Read more...</span>
                    </p>
                </div>

                {/* Bottom Action Bar (Fixed on Mobile, absolute bottom on Desktop panel) */}
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 md:p-6 border-t border-gray-100 lg:relative lg:border-none lg:p-0 flex gap-4 z-50">
                    <Button variant="bordered" className="flex-1 h-14 border-2 border-gray-200 rounded-2xl font-bold text-black text-lg flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-colors">
                        <Icon icon="mdi:cart-outline" className="text-xl" /> Add to cart
                    </Button>
                    <Button className="flex-1 h-14 bg-black rounded-2xl font-bold text-white text-lg hover:scale-[1.02] shadow-xl transition-transform">
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
}
