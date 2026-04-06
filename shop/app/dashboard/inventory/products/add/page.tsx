"use client";

import { useState } from "react";
import { Button, Input, Textarea, Switch, Select, SelectItem, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { categories, brands } from "@/lib/mock-data";

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/40">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon icon={icon} className="text-accent text-base" />
        </div>
        <h2 className="font-semibold font-[family-name:var(--font-outfit)]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function AddProductPage() {
  const [trackInventory, setTrackInventory] = useState(true);
  const [isDigital, setIsDigital] = useState(false);
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [allowBackorder, setAllowBackorder] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Add New Product"
        subtitle="Fill in the details below to publish a new product"
        icon="solar:add-square-bold-duotone"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Save as Draft</Button>
            <Button variant="secondary" size="sm">Preview</Button>
            <Button variant="primary" size="sm" className="gap-2">
              <Icon icon="solar:cloud-upload-bold-duotone" className="text-base" />
              Publish
            </Button>
          </div>
        }
      />

      {/* Basic Info */}
      <Section title="Basic Information" icon="solar:document-text-bold-duotone">
        <div className="space-y-4">
          <Input label="Product Title" placeholder="e.g. Apple iPhone 15 Pro Max 256GB" isRequired />
          <Input label="Slug" placeholder="apple-iphone-15-pro-max" description="Auto-generated from title. You can edit it." />
          <Textarea label="Short Description" placeholder="Brief description shown on product cards…" maxRows={3} />
          <Textarea label="Full Description" placeholder="Detailed product description with features, specifications…" minRows={5} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" placeholder="Select category" isRequired>
              {categories.map((cat) => (
                <SelectItem key={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
            <Select label="Brand" placeholder="Select brand">
              {brands.map((brand) => (
                <SelectItem key={brand.id}>{brand.name}</SelectItem>
              ))}
            </Select>
          </div>
          <Input label="Tags" placeholder="Comma-separated: smartphone, 5g, apple…" description="Press Enter or comma to add tags" />
        </div>
      </Section>

      {/* Media */}
      <Section title="Media & Images" icon="solar:gallery-wide-bold-duotone">
        <div>
          <div className="border-2 border-dashed border-border/60 hover:border-accent/50 rounded-2xl p-10 text-center cursor-pointer transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
              <Icon icon="solar:upload-bold-duotone" className="text-accent text-2xl" />
            </div>
            <p className="font-semibold text-sm">Drag & drop images here</p>
            <p className="text-xs text-muted mt-1">PNG, JPG, WEBP up to 10MB each. First image is primary.</p>
            <Button variant="secondary" size="sm" className="mt-3 gap-2">
              <Icon icon="solar:folder-open-bold-duotone" className="text-base" />
              Browse Files
            </Button>
          </div>
          <div className="mt-4">
            <Input label="Video URL (optional)" placeholder="https://youtube.com/… or MP4 URL" />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing" icon="solar:wallet-money-bold-duotone">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (₹)" placeholder="0.00" type="number" isRequired startContent={<span className="text-muted text-sm">₹</span>} />
            <Input label="Compare Price (₹)" placeholder="0.00" type="number" startContent={<span className="text-muted text-sm">₹</span>} description="Strike-through price shown to customers" />
            <Input label="Cost Price (₹)" placeholder="0.00" type="number" startContent={<span className="text-muted text-sm">₹</span>} description="For margin calculation (not shown)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax Rate (%)" placeholder="18" type="number" endContent={<span className="text-muted text-sm">%</span>} />
            <div className="flex items-center gap-3 pt-5">
              <Switch isSelected={taxInclusive} onValueChange={setTaxInclusive} />
              <div>
                <p className="text-sm font-medium">Tax Inclusive</p>
                <p className="text-xs text-muted">Price includes tax</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Inventory */}
      <Section title="Inventory" icon="solar:box-bold-duotone">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
            <div>
              <p className="font-medium text-sm">Track Inventory</p>
              <p className="text-xs text-muted mt-0.5">Monitor and update stock levels</p>
            </div>
            <Switch isSelected={trackInventory} onValueChange={setTrackInventory} />
          </div>
          {trackInventory && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock Quantity" placeholder="0" type="number" />
              <Input label="Low Stock Threshold" placeholder="5" type="number" description="Alert when stock falls below this" />
            </div>
          )}
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
            <div>
              <p className="font-medium text-sm">Allow Backorders</p>
              <p className="text-xs text-muted mt-0.5">Accept orders even when out of stock</p>
            </div>
            <Switch isSelected={allowBackorder} onValueChange={setAllowBackorder} />
          </div>
        </div>
      </Section>

      {/* Shipping */}
      <Section title="Shipping" icon="solar:delivery-bold-duotone">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
            <div>
              <p className="font-medium text-sm">Digital Product</p>
              <p className="text-xs text-muted mt-0.5">Skip shipping for downloadable products</p>
            </div>
            <Switch isSelected={isDigital} onValueChange={setIsDigital} />
          </div>
          {!isDigital && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Weight (kg)" placeholder="0.00" type="number" />
              <Input label="Dimensions (cm)" placeholder="L × W × H" />
            </div>
          )}
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO" icon="solar:global-bold-duotone">
        <div className="space-y-4">
          <Input label="Meta Title" placeholder="SEO-optimized title…" />
          <Textarea label="Meta Description" placeholder="Brief description for search engines (max 160 chars)…" maxRows={3} />
          <Input label="Meta Keywords" placeholder="keyword1, keyword2, keyword3…" />
          <div className="p-4 bg-background rounded-xl border border-border/40">
            <p className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">Search Preview</p>
            <p className="text-blue-400 text-sm font-medium hover:underline cursor-pointer">Product Title — Luminary Store</p>
            <p className="text-green-500 text-xs">luminarystore.com/products/product-slug</p>
            <p className="text-muted text-xs mt-1">Brief description for search engines (max 160 chars)…</p>
          </div>
        </div>
      </Section>

      {/* Flags */}
      <Section title="Product Flags" icon="solar:flag-bold-duotone">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "New Arrival", desc: "Show 'New' badge", value: isNew, onChange: setIsNew },
            { label: "Featured", desc: "Show in featured section", value: isFeatured, onChange: setIsFeatured },
            { label: "Best Seller", desc: "Show best seller badge", value: isBestSeller, onChange: setIsBestSeller },
            { label: "Trending", desc: "Show trending badge", value: isTrending, onChange: setIsTrending },
          ].map((flag) => (
            <div key={flag.label} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
              <div>
                <p className="font-medium text-sm">{flag.label}</p>
                <p className="text-xs text-muted mt-0.5">{flag.desc}</p>
              </div>
              <Switch isSelected={flag.value} onValueChange={flag.onChange} />
            </div>
          ))}
        </div>
      </Section>

      {/* Action bar */}
      <div className="sticky bottom-0 bg-surface/90 backdrop-blur-md border border-border/50 rounded-2xl p-4 flex items-center justify-between">
        <p className="text-sm text-muted">All changes are saved locally until published</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Discard</Button>
          <Button variant="ghost" size="sm">Save Draft</Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:cloud-upload-bold-duotone" className="text-base" />
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
}
