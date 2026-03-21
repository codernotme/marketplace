'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export const ProductCard = ({ product }: { product: any }) => {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <div className="group relative flex flex-col gap-3 w-full cursor-pointer">
      <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[4/5] bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg">
        {/* Badges */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}
        {product.is_new && (
          <span className={`absolute top-3 ${hasDiscount ? 'left-14' : 'left-3'} z-10 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
            NEW
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white shadow-sm hover:shadow-md hover:scale-110 transition-all duration-200 flex items-center justify-center"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Icon icon="mdi:heart-outline" className="w-4 h-4 text-gray-400" />
        </button>

        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-body text-sm font-semibold leading-tight text-gray-900 group-hover:text-black transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Icon icon="mdi:star" className="w-3.5 h-3.5 text-[#F5A623] flex-shrink-0" />
          <span className="font-body text-[12px] font-medium text-gray-700">
            {product.ratings_avg}{' '}
            <span className="text-gray-400 font-normal">({product.ratings_count ?? 0} reviews)</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-display text-base font-bold tracking-tight text-black">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-body text-xs text-gray-400 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
