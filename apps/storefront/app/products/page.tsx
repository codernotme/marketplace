import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Sorting01Icon, SearchIcon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our curated selection of premium products.",
};

const products = [
  { id: 1, name: "Minimalist Desk Lamp", price: "₹4,299", category: "Lighting", tag: "New" },
  { id: 2, name: "Ceramic Coffee Set", price: "₹1,899", category: "Kitchen" },
  { id: 3, name: "Linen Bedding Set", price: "₹8,499", category: "Home", tag: "Fev" },
  { id: 4, name: "Walnut Wood Shelf", price: "₹5,200", category: "Furniture" },
  { id: 5, name: "Cotton Tote Bag", price: "₹699", category: "Accessories" },
  { id: 6, name: "Glass Water Carafe", price: "₹1,450", category: "Kitchen" },
  { id: 7, name: "Felt Laptop Sleeve", price: "₹2,100", category: "Tech" },
  { id: 8, name: "Hand-poured Candle", price: "₹750", category: "Home" },
];

export default function ProductsCatalogPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground text-lg">Showing {products.length} curated essentials.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-border py-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <HugeiconsIcon icon={SearchIcon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search catalog..." className="pl-10 h-11 rounded-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <Button variant="outline" className="h-11 px-5 rounded-full md:hidden">
              <HugeiconsIcon icon={FilterIcon} size={18} />
            </Button>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="hidden md:flex h-11 px-5 rounded-full gap-2">
              <HugeiconsIcon icon={FilterIcon} size={18} />
              Category
            </Button>
            <Button variant="outline" className="hidden md:flex h-11 px-5 rounded-full gap-2">
              <HugeiconsIcon icon={FilterIcon} size={18} />
              Price Range
            </Button>
            <div className="flex-1 md:flex-none" />
            <Button variant="ghost" className="h-11 px-4 gap-2 font-medium">
              Sort by
              <HugeiconsIcon icon={Sorting01Icon} size={18} className="text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col group cursor-pointer">
              <div className="aspect-[3/4] bg-muted/30 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center text-muted-foreground/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="m21 8-9 6-9-6"/><path d="M3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"/></svg>
                {product.tag && (
                    <Badge className="absolute top-4 left-4 bg-background text-foreground border-none shadow-sm text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">{product.tag}</Badge>
                )}
                <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                   <Button size="icon" className="rounded-full size-10 shadow-lg bg-background text-foreground hover:bg-primary hover:text-primary-foreground border-none">
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={18} />
                   </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{product.category}</p>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">{product.name}</h3>
                <p className="text-sm font-bold mt-0.5">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="flex justify-center mt-12 pt-12 border-t border-border">
            <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-full w-10 p-0 h-10" disabled>1</Button>
                <Button variant="ghost" className="rounded-full w-10 p-0 h-10">2</Button>
                <Button variant="ghost" className="rounded-full w-10 p-0 h-10">3</Button>
                <span className="mx-2 text-muted-foreground">...</span>
                <Button variant="ghost" className="rounded-full w-10 p-0 h-10">8</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
