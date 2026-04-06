'use client';

import { ProductCard } from './ProductCard';
import { ScrollShadow } from '@/components/HeroUI';

export const RecommendationCarousel = ({ products, title }: { products: any[], title: string }) => {
  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-[--c-primary]">{title}</h2>
        <a href="/products" className="font-body text-sm font-medium tracking-wide text-[--c-secondary] hover:text-[--c-primary] flex items-center gap-1 transition-colors">
          View All <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      
      <ScrollShadow orientation="horizontal" className="w-full pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="flex gap-4 md:gap-6 pb-2 min-w-max">
          {products.map(p => (
            <div key={p.id} className="w-[280px] md:w-[320px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
};
