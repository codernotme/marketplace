import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";

export default function StorefrontHomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <Badge variant="outline" className="w-fit px-3 py-1 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] font-bold">
              New Season 2026
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Elevate your <span className="text-primary italic">everyday</span> essentials.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Curated collections from the world's most innovative independent designers. Minimalist aesthetic, maximalist impact.
            </p>
            <div className="flex gap-4 mt-2">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold">
                Shop Collection
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-semibold">
                Our Story
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl relative overflow-hidden group">
               {/* Hero Image Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                 <HugeiconsIcon icon={ShoppingCart01Icon} size={200} />
               </div>
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/80 backdrop-blur-md rounded-xl border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-sm font-semibold">Featured Item</p>
                  <p className="text-xs text-muted-foreground">Minimal Canvas Tote • ₹2,499</p>
               </div>
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
      </section>

      {/* Categories / Collections */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight">Shop by Collection</h2>
            <p className="text-muted-foreground">Thoughtfully organized for your lifestyle.</p>
          </div>
          <Button variant="ghost" className="text-primary font-medium">
            View All Categories
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Minimalist Living", items: "24 items", color: "bg-slate-100" },
            { title: "Modern Tech", items: "18 items", color: "bg-zinc-100" },
            { title: "Artisan Decor", items: "12 items", color: "bg-stone-100" },
          ].map((cat) => (
            <Card key={cat.title} className="border-none shadow-none group cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                <div className={`aspect-[16/10] ${cat.color} flex items-center justify-center rounded-2xl group-hover:scale-[1.02] transition-transform duration-500`}>
                   <span className="text-primary/20 font-heading font-black text-4xl uppercase tracking-tighter opacity-10">{cat.title}</span>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-lg">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.items}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight">Editor's Picks</h2>
            <p className="text-muted-foreground">Most loved items this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Sleek Water Bottle", price: "₹1,299", category: "Outdoor" },
            { name: "Leather Journal", price: "₹899", category: "Office" },
            { name: "Wool Blend Throw", price: "₹3,499", category: "Home" },
            { name: "Wireless Headphones", price: "₹5,999", category: "Tech" },
          ].map((product) => (
            <div key={product.name} className="flex flex-col group cursor-pointer">
              <div className="aspect-[3/4] bg-muted/30 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center text-muted-foreground/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.9 11c.2-1.4 0-2.9-.6-4.2a6.3 6.3 0 0 0-1.8-2.3 6.2 6.2 0 0 0-3.1-1.4A6.3 6.3 0 0 0 11 3.7c-1.4-.2-2.9 0-4.2.6a6.3 6.3 0 0 0-2.3 1.8 6.2 6.2 0 0 0-1.4 3.1 6.3 6.3 0 0 0 .5 4.3c-.2 1.4 0 2.9.6 4.2a6.3 6.3 0 0 0 1.8 2.3 6.2 6.2 0 0 0 3.1 1.4 6.3 6.3 0 0 0 4.4-.6c1.4.2 2.9 0 4.2-.6a6.3 6.3 0 0 0 2.3-1.8 6.2 6.2 0 0 0 1.4-3.1 6.3 6.3 0 0 0-.5-4.3z"/></svg>
                <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                   <Button size="icon" className="rounded-full size-10 shadow-lg">
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={18} />
                   </Button>
                </div>
              </div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">{product.category}</p>
              <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
              <p className="text-sm font-bold">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-primary rounded-[32px] p-8 md:p-16 text-primary-foreground flex flex-col items-center text-center gap-6 relative overflow-hidden">
           <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Join the marketplace.</h2>
           <p className="text-primary-foreground/80 max-w-lg">
             Subscribe to get early access to new collections and exclusive discounts from our merchants.
           </p>
           <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4 relative z-10">
              <input 
                className="flex-1 h-14 rounded-full bg-white/10 border border-white/20 px-6 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm" 
                placeholder="Enter your email"
              />
              <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full font-bold">
                Subscribe
              </Button>
           </div>
           {/* Abstract pattern */}
           <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
              <div className="absolute top-0 left-0 w-96 h-96 border-[40px] border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 border-[40px] border-white rounded-full translate-x-1/3 translate-y-1/3" />
           </div>
        </div>
      </section>
    </div>
  );
}
