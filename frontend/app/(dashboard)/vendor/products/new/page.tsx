import { Button, Input, Textarea, Select, SelectItem, Switch } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/vendor/products" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[--c-border] text-[--c-secondary] hover:text-[--c-primary] hover:border-[--c-primary] transition-all group">
          <Icon icon="lucide:arrow-left" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <h1 className="font-display text-3xl text-[--c-primary]">New Listing</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[--c-border] shadow-sm">
            <h2 className="text-lg font-medium text-[--c-primary] mb-6">Product Information</h2>
            <div className="space-y-6">
              <Input label="Title" labelPlacement="outside" placeholder="E.g. Silk Scarf" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
              <Textarea label="Story / Description" labelPlacement="outside" placeholder="Tell the product's story..." minRows={6} classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none py-3" }} />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[--c-border] shadow-sm">
            <h2 className="text-lg font-medium text-[--c-primary] mb-1">Pricing & Inventory</h2>
            <p className="text-xs text-[--c-muted] mb-6">Manage how this product is sold and tracked.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Price (₹)" type="number" labelPlacement="outside" placeholder="0.00" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
              <Input label="Compare at Price (₹)" type="number" labelPlacement="outside" placeholder="0" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
              <Input label="SKU" labelPlacement="outside" placeholder="PRD-AUTO" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
              <Input label="Initial Inventory" type="number" labelPlacement="outside" placeholder="0" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 space-y-8">
          {/* Status */}
          <div className="bg-white p-6 rounded-2xl border border-[--c-border] shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-semibold text-[--c-primary] uppercase tracking-wider">Publication</h2>
               <Switch defaultSelected color="success" size="sm" />
            </div>
            <p className="text-[13px] text-[--c-secondary] leading-relaxed">Visible to public shoppers immediately upon saving.</p>
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-2xl border border-[--c-border] shadow-sm space-y-6">
            <h2 className="text-sm font-semibold text-[--c-primary] uppercase tracking-wider">Classification</h2>
            <Select aria-label="Category" labelPlacement="outside" placeholder="Category" classNames={{ trigger: "bg-white border border-[--c-border] shadow-none h-12" }}>
              <SelectItem key="men">Menswear</SelectItem>
              <SelectItem key="women">Womenswear</SelectItem>
              <SelectItem key="accessories">Accessories</SelectItem>
            </Select>
            <Input aria-label="Tags" labelPlacement="outside" placeholder="Add tags (vintage, cotton...)" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Button className="w-full h-14 bg-[--c-primary] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
              Publish Listing
            </Button>
            <Button variant="light" as={Link} href="/vendor/products" className="w-full h-12 text-[--c-secondary] rounded-full font-medium">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
