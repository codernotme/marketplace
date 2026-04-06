'use client';

import { Select, SelectItem } from '@/components/HeroUI';
import { useRouter, useSearchParams } from 'next/navigation';

export const SortDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'popular';

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Select
      aria-label="Sort By"
      selectedKeys={[currentSort]}
      onChange={handleSelectionChange}
      classNames={{
        trigger: "bg-white border border-[--c-border] rounded-xl h-12 data-[hover=true]:border-[--c-border-hover] data-[open=true]:border-[--c-primary] shadow-none transition-all duration-200 min-w-[200px]",
        value: "text-sm text-[--c-primary]",
        popoverContent: "rounded-xl border border-[--c-border] shadow-lg bg-white p-1",
        listboxWrapper: "rounded-xl",
      }}
    >
      <SelectItem key="popular" textValue="Most Popular">Most Popular</SelectItem>
      <SelectItem key="newest" textValue="Newest First">Newest First</SelectItem>
      <SelectItem key="price_asc" textValue="Price: Low to High">Price: Low to High</SelectItem>
      <SelectItem key="price_desc" textValue="Price: High to Low">Price: High to Low</SelectItem>
      <SelectItem key="rating" textValue="Top Rated">Top Rated</SelectItem>
    </Select>
  );
};
