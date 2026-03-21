import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { RecommendationCarousel } from '@/components/product/RecommendationCarousel';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Breadcrumbs, BreadcrumbItem, Button, Accordion, AccordionItem } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import { notFound } from 'next/navigation';

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
      <div className="py-8">
        <Breadcrumbs classNames={{ list: "gap-2 mt-2 mb-8" }}>
          <BreadcrumbItem href="/" classNames={{ item: "text-[--c-muted]" }}>Home</BreadcrumbItem>
          <BreadcrumbItem href="/products" classNames={{ item: "text-[--c-muted]" }}>Products</BreadcrumbItem>
          <BreadcrumbItem classNames={{ item: "text-[--c-primary] font-medium" }}>{product.title}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="w-full lg:w-[55%] flex-shrink-0">
            <ProductImageGallery images={product.images || []} />
          </div>

          {/* Info */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-8 relative">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[--c-muted]">Menswear</span>
               <div className="flex items-center gap-1.5 cursor-pointer group">
                  <Icon icon="lucide:star" className="w-4 h-4 text-[--c-warm-gold]" />
                  <span className="font-body text-sm font-medium text-[--c-primary]">{product.ratings_avg}</span>
                  <span className="text-sm text-[--c-muted] group-hover:text-[--c-primary] underline transition-colors">(124 Reviews)</span>
               </div>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-[-0.04em] text-[--c-primary] mb-4">
              {product.title}
            </h1>

            <div className="font-mono text-2xl font-semibold tracking-[-0.02em] text-[--c-primary] mb-8">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
            </div>

            <p className="font-body text-[15px] font-normal leading-relaxed text-[--c-secondary] mb-8">
              Beautifully crafted with attention to detail. This product represents our commitment to quality materials and modern aesthetic. Designed for everyday versatility.
            </p>

            <div className="mb-10">
               <span className="text-sm font-medium text-[--c-secondary] uppercase tracking-[0.15em] block mb-3">Variants</span>
               <div className="flex flex-wrap gap-2">
                 {product.variants?.map(v => (
                   <button key={v.id} className={`px-5 h-12 rounded-xl border text-sm font-medium transition-all ${v.id === defaultVariantId ? 'bg-[--c-primary] text-white border-transparent' : 'bg-transparent text-[--c-primary] border-[--c-border] hover:border-[--c-primary]'}`}>
                      {v.name}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex gap-4 mb-12">
              <Button size="lg" className="flex-1 bg-[--c-primary] text-white rounded-full h-14 text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95">
                Add to Cart
              </Button>
              <Button isIconOnly variant="bordered" size="lg" className="h-14 w-14 min-w-14 rounded-full border border-[--c-border] text-[--c-primary] hover:border-[--c-primary] transition-all bg-transparent">
                <Icon icon="lucide:heart" className="w-5 h-5" />
              </Button>
            </div>

            <Accordion selectionMode="multiple" defaultExpandedKeys={["details"]} className="-mx-2 border-t border-[--c-border] pt-4">
               <AccordionItem key="details" title="Product Details" classNames={{ title: "font-body text-[15px] font-semibold text-[--c-primary]" }}>
                 <ul className="list-disc pl-5 space-y-2 text-sm text-[--c-secondary] pb-4">
                    <li>Premium materials</li>
                    <li>Designed in Studio</li>
                    <li>Sustainably sourced</li>
                 </ul>
               </AccordionItem>
               <AccordionItem key="shipping" title="Shipping & Returns" classNames={{ title: "font-body text-[15px] font-semibold text-[--c-primary]" }}>
                 <p className="text-sm text-[--c-secondary] pb-4">
                   Free standard shipping on all orders over ₹4999. Returns accepted within 30 days of delivery.
                 </p>
               </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        <div className="mt-24 border-t border-[--c-border] pt-8">
           <RecommendationCarousel title="You May Also Like" products={similarProducts} />
        </div>
      </div>
    </PageWrapper>
  );
}
