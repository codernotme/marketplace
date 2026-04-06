'use client';

import { Chip } from '@/components/HeroUI';

export const ProductVariantSelector = ({ variants, selected, onSelect }: { variants: any[], selected: string, onSelect: (id: string) => void }) => {
  if (!variants || variants.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-[--c-secondary] uppercase tracking-[0.15em]">Variants</span>
      <div className="flex flex-wrap gap-2">
        {variants.map(v => {
          const isSelected = selected === v.id;
          const isOOS = v.stock === 0;
          
          return (
            <Chip
              key={v.id}
              as="button"
              onClick={() => !isOOS && onSelect(v.id)}
              variant={isSelected ? "solid" : "bordered"}
              className={`
                px-4 h-10 rounded-xl cursor-pointer transition-all duration-200
                ${isSelected ? 'bg-[--c-primary] text-white border-transparent' : 'bg-transparent text-[--c-primary] border border-[--c-border] hover:border-[--c-primary]'}
                ${isOOS ? 'opacity-50 line-through cursor-not-allowed hover:border-[--c-border]' : ''}
              `}
            >
              {v.name}
            </Chip>
          )
        })}
      </div>
    </div>
  );
};
