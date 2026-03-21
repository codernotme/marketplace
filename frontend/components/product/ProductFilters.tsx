'use client';

import { Accordion, AccordionItem, Checkbox, CheckboxGroup, Slider, Switch } from '@/components/HeroUI';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState<number[]>([0, 15000]);
  const [inStock, setInStock] = useState(false);
  
  return (
    <div className="w-full flex flex-col gap-6">
      <Accordion selectionMode="multiple" defaultExpandedKeys={["category", "price", "brand"]}>
        <AccordionItem key="category" aria-label="Category" title="Category" classNames={{ title: "font-body text-[15px] font-semibold text-[--c-primary]" }}>
          <div className="flex flex-col gap-2 pl-2 pb-4">
            <a href="/category/men" className="text-sm text-[--c-secondary] hover:text-[--c-primary]">Menswear</a>
            <a href="/category/women" className="text-sm text-[--c-secondary] hover:text-[--c-primary]">Womenswear</a>
            <a href="/category/electronics" className="text-sm text-[--c-secondary] hover:text-[--c-primary]">Electronics</a>
          </div>
        </AccordionItem>
        
        <AccordionItem key="price" aria-label="Price Range" title="Price Range" classNames={{ title: "font-body text-[15px] font-semibold text-[--c-primary]" }}>
          <div className="pb-4">
            <Slider
              aria-label="Price range filter"
              minValue={0}
              maxValue={50000}
              step={500}
              value={priceRange}
              onChange={(val) => setPriceRange(val as number[])}
              formatOptions={{ style: 'currency', currency: 'INR', maximumFractionDigits: 0 }}
              classNames={{
                base: "w-full",
                filler: "bg-[--c-primary]",
                thumb: "bg-[--c-primary] border-2 border-white shadow-md w-5 h-5 data-[dragging=true]:scale-110 transition-transform",
                track: "bg-[--c-border] h-1",
                value: "font-mono text-xs text-[--c-secondary]",
              }}
            />
          </div>
        </AccordionItem>

        <AccordionItem key="brand" aria-label="Brand" title="Brand" classNames={{ title: "font-body text-[15px] font-semibold text-[--c-primary]" }}>
          <div className="pb-4">
            <CheckboxGroup classNames={{ wrapper: "gap-2" }}>
              <Checkbox value="nike" classNames={{ label: "text-sm text-[--c-secondary]" }}>Nike</Checkbox>
              <Checkbox value="adidas" classNames={{ label: "text-sm text-[--c-secondary]" }}>Adidas</Checkbox>
              <Checkbox value="apple" classNames={{ label: "text-sm text-[--c-secondary]" }}>Apple</Checkbox>
            </CheckboxGroup>
          </div>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between px-2 pt-6 border-t border-gray-100 mt-4">
        <span className="font-body text-[15px] font-semibold text-gray-900">In Stock Only</span>
        <Switch 
          isSelected={inStock} 
          onValueChange={setInStock}
          color="default"
        />
      </div>
    </div>
  );
};
