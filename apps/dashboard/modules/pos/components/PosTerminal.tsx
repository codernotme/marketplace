"use client"

import * as React from "react"
import { PosHeader } from "./PosHeader"
import { ProductGrid } from "./ProductGrid"
import { PosCart } from "./PosCart"
import { CategorySidebar } from "./CategorySidebar"

export function PosTerminal() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <PosHeader />

      {/* Main POS Interface */}
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
        
        {/* Left Category Sidebar - Minimalist, Icon/Text based */}
        <div 
          className="w-24 border-r border-border/40 bg-card/30 flex flex-col items-center py-6 gap-6 overflow-y-auto hide-scrollbar animate-in slide-in-from-left-8 duration-500"
        >
          <CategorySidebar active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Center Product Grid */}
        <div 
          className="flex-1 bg-background/50 p-6 overflow-y-auto hide-scrollbar relative animate-in fade-in zoom-in-95 duration-500 delay-100 fill-mode-both"
        >
          <ProductGrid category={activeCategory} />
        </div>

        {/* Right Cart Sidebar - Glassmorphic floating feel */}
        <div 
          className="w-[420px] bg-card border-l border-border/40 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right-8 duration-500 delay-200 fill-mode-both"
        >
          <PosCart />
        </div>
      </div>
    </div>
  )
}
