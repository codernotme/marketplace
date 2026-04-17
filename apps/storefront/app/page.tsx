import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { getProducts, getCategories } from "./actions/product";
import Link from "next/link";

export default async function StorefrontHomePage() {
  const products = await getProducts({ limit: 4 });
  const categories = await getCategories();

  // Background colors for category cards
  const categoryColors = ["bg-sky-100 dark:bg-sky-900/40", "bg-emerald-100 dark:bg-emerald-900/40", "bg-rose-100 dark:bg-rose-900/40"];

  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* Dynamic Glassmorphic Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 blur-[100px] rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <Badge variant="outline" className="w-fit px-4 py-1.5 text-primary border-primary/20 bg-background/50 backdrop-blur-sm uppercase tracking-widest text-xs font-bold shadow-sm">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Big Sale - 50% Off
              </span>
            </Badge>
            <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-pretty">
              Elevate your <span className="text-secondary-foreground italic font-serif opacity-80">everyday</span> essentials.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Curated collections from the world's most innovative independent designers. Minimalist aesthetic, maximalist impact.
            </p>
            <div className="flex gap-4 mt-6">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform duration-300">
                Shop Collection
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" className="ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex relative h-full items-center justify-center">
            <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=80" 
                 alt="Hero Model" 
                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
               <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Featured Item</p>
                    <p className="text-2xl font-black text-white">Loose Fit Hoodie</p>
                  </div>
                  <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                     <HugeiconsIcon icon={ShoppingCart01Icon} size={24} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Collections */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-4xl font-black tracking-tight mb-2">Categories</h2>
            <p className="text-muted-foreground text-lg">Thoughtfully organized for your lifestyle.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((cat, idx) => (
            <Card key={cat.id} className="border-border/30 overflow-hidden group cursor-pointer rounded-[32px] hover:shadow-xl transition-all duration-300">
              <CardContent className="p-2 relative h-[400px]">
                <div className={`absolute inset-2 rounded-[24px] overflow-hidden ${categoryColors[idx % categoryColors.length]}`}>
                   {cat.imageUrl && (
                     <img 
                       src={cat.imageUrl} 
                       alt={cat.name} 
                       className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 dark:opacity-40 group-hover:scale-110 transition-transform duration-700"
                     />
                   )}
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-black/40 to-transparent">
                      <h3 className="font-heading font-black text-4xl text-white tracking-tight mb-2">{cat.name}</h3>
                      <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-bold">
                        Explore
                      </span>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-8 mb-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-4xl font-black tracking-tight mb-2">Editor's Picks</h2>
            <p className="text-muted-foreground text-lg">Most loved items this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="flex flex-col group">
              <div className="aspect-[3/4] bg-muted/30 rounded-[24px] mb-5 relative overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-xl transition-all duration-500">
                {product.featuredImage ? (
                  <img src={product.featuredImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={48} className="text-muted-foreground/30" />
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                
                <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                   <Button size="icon" className="rounded-full size-12 shadow-xl bg-background text-foreground hover:bg-primary hover:text-primary-foreground transform active:scale-95 transition-all">
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
                   </Button>
                </div>
              </div>
              <div className="flex justify-between items-start gap-2">
                 <div>
                   <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{product.category?.name || "Uncategorized"}</p>
                   <h4 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h4>
                 </div>
                 <p className="text-lg font-black bg-muted/50 px-3 py-1 rounded-xl">
                   ${product.variants[0]?.price.toFixed(2)}
                 </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
