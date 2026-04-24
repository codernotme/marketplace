"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

interface ProductGridProps {
  category: string
}

// Temporary Mock Data for Stage 1 UI scaffolding
const MOCK_PRODUCTS = [
  { id: "1", name: "Premium Leather Jacket", price: 299.99, category: "apparel", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "2", name: "Minimalist Watch", price: 199.00, category: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "3", name: "Wireless Earbuds Pro", price: 249.50, category: "tech", image: "https://images.unsplash.com/photo-1590658268037-6f1401ba6b10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "4", name: "Artisan Coffee Beans", price: 24.00, category: "cafe", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "5", name: "Canvas Tote Bag", price: 35.00, category: "accessories", image: "https://images.unsplash.com/photo-1597820334272-91e84eb3d0f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "6", name: "Silk Blend Scarf", price: 85.00, category: "apparel", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "7", name: "Smart Speaker Home", price: 129.99, category: "tech", image: "https://images.unsplash.com/photo-1589003071536-4148b5982ab7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "8", name: "Matcha Latte Kit", price: 45.00, category: "cafe", image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
]

export function ProductGrid({ category }: ProductGridProps) {
  
  const filteredProducts = React.useMemo(() => {
    if (category === "all" || category === "hot") return MOCK_PRODUCTS
    return MOCK_PRODUCTS.filter(p => p.category === category)
  }, [category])

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight capitalize">{category === "hot" ? "Trending Items" : `${category} Products`}</h2>
          <p className="text-sm text-muted-foreground font-sans mt-1">Select items to add to current order</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-24">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="group relative flex flex-col rounded-2xl bg-card border border-border/40 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <button className="absolute bottom-3 right-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-sans font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="mt-auto pt-2 flex items-center justify-between">
                <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
