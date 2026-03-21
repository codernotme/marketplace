'use client';

import { useState } from 'react';
import { Image } from '@/components/HeroUI';

export const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto scrollbar-hide py-1 md:py-0 w-full md:w-20 lg:w-24">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImg(idx)}
            className={`relative flex-shrink-0 w-20 h-24 md:w-full md:h-28 lg:h-32 rounded-xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-[--c-primary]' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <Image src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-none" removeWrapper />
          </button>
        ))}
      </div>
      
      {/* Main Image */}
      <div className="flex-1 order-1 md:order-2 bg-[--c-surface] rounded-2xl overflow-hidden relative aspect-square md:aspect-[4/5]">
        <Image 
          src={images[activeImg] || ''} 
          alt="Product image" 
          className="w-full h-full object-cover rounded-none hover:scale-110 transition-transform duration-700 cursor-zoom-in" 
          removeWrapper 
        />
      </div>
    </div>
  );
};
