import { getProductBySlug } from "../../actions/product";
import { notFound } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, StarIcon, Truck01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  // Usually we'd extract sizes from variants dynamically, hardcoded for UI prototyping
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["#F5F5DC", "#000000", "#4B5320"];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb / Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium">
         <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
         Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
           <div className="aspect-[4/5] bg-muted/20 rounded-[32px] overflow-hidden relative group">
             {product.featuredImage ? (
               <img 
                 src={product.featuredImage} 
                 alt={product.name} 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                 No Image Available
               </div>
             )}
           </div>
           
           {/* Thumbnails */}
           <div className="flex gap-4 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
             {[1,2,3,4].map((i) => (
               <div key={i} className={`size-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer ${i === 1 ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  {product.featuredImage ? (
                    <img src={product.featuredImage} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted/20" />
                  )}
               </div>
             ))}
           </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col py-4">
           <div className="mb-8">
             <Badge variant="outline" className="mb-4 text-xs font-bold uppercase tracking-widest">{product.category.name}</Badge>
             <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight mb-4">{product.name}</h1>
             
             <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-bold">${product.variants[0]?.price.toFixed(2)}</p>
                {product.variants[0]?.comparePrice && (
                  <p className="text-xl text-muted-foreground line-through">${product.variants[0].comparePrice.toFixed(2)}</p>
                )}
             </div>

             <div className="flex items-center gap-2 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <HugeiconsIcon key={i} icon={StarIcon} size={18} fill="currentColor" />
                ))}
                <span className="text-sm font-medium text-muted-foreground ml-2">(128 reviews)</span>
             </div>

             <p className="text-lg text-muted-foreground leading-relaxed">
               {product.description}
             </p>
           </div>

           {/* Selectors */}
           <div className="flex flex-col gap-6 mb-10">
              {/* Color */}
              <div>
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-sm">Color <span className="text-muted-foreground font-normal ml-2">Beige</span></h3>
                 </div>
                 <div className="flex gap-3">
                   {colors.map((color, idx) => (
                     <button 
                       key={color} 
                       className={`size-10 rounded-full border-2 focus:outline-none transition-all ${idx === 0 ? 'border-primary scale-110' : 'border-transparent hover:scale-110'}`}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
              </div>

              {/* Size */}
              <div>
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-sm">Size</h3>
                   <a href="#" className="text-sm text-primary underline underline-offset-4 decoration-primary/30 font-medium">Size Guide</a>
                 </div>
                 <div className="flex flex-wrap gap-3">
                   {sizes.map((size) => (
                     <button 
                       key={size} 
                       className={`h-12 px-6 rounded-2xl border font-bold focus:outline-none transition-all ${size === "M" ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 bg-transparent hover:border-primary/50'}`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
              </div>
           </div>

           {/* Actions */}
           <div className="flex gap-4 w-full mb-8">
              <Button size="lg" className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                 <HugeiconsIcon icon={ShoppingCart01Icon} className="mr-2" size={24} />
                 Add to Cart
              </Button>
           </div>

           {/* Info Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 items-center">
                 <div className="size-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <HugeiconsIcon icon={Truck01Icon} size={20} className="text-primary" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">Free Shipping</h4>
                    <p className="text-xs text-muted-foreground">On orders over $150</p>
                 </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 items-center">
                 <div className="size-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <HugeiconsIcon icon={StarIcon} size={20} className="text-primary" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">Lifetime Warranty</h4>
                    <p className="text-xs text-muted-foreground">We stand by our products</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
