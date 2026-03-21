'use client';
import { Button, Image } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="group relative flex flex-col gap-3 w-full cursor-pointer">
      <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[4/5] bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md">
        {/* Wishlist Button - Floating */}
        <Button
          isIconOnly
          variant="flat"
          className="absolute top-4 right-4 z-20 w-10 h-10 min-w-10 rounded-full bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Icon icon="mdi:heart-outline" className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </Button>

        <Image
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover  rounded-none mix-blend-multiply drop-shadow-sm"
          removeWrapper
        />
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-body text-base font-semibold leading-tight text-gray-900 group-hover:text-black transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Icon icon="mdi:star" className="w-4 h-4 text-[#F5A623]" />
          <span className="font-body text-[13px] font-medium text-gray-800">
            {product.ratings_avg} <span className="text-gray-400 font-normal">({Math.floor(Math.random() * 5000 + 100)} Reviews)</span>
          </span>
        </div>
        <div className="font-display text-lg font-bold tracking-tight text-black mt-1">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
        </div>
      </div>
    </div>
  );
};
