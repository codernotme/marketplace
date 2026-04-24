"use client"

import * as React from "react"
import { PosHeader } from "./PosHeader"
import { ProductGrid } from "./ProductGrid"
import { PosCart } from "./PosCart"
import { CategorySidebar } from "./CategorySidebar"
import { ShiftManager } from "./ShiftManager"
import { LockScreen } from "./LockScreen"

export function PosTerminal() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")

  return (
    <LockScreen>
      <ShiftManager>
        <div className="flex h-full w-full flex-col bg-background text-foreground overflow-hidden">
        {/* Top Header */}
        <PosHeader />
        
        {/* ... rest of UI ... */}
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
          <div className="w-24 border-r border-border/40 bg-card/30 flex flex-col items-center py-6 gap-6 overflow-y-auto hide-scrollbar animate-in slide-in-from-left-8 duration-500">
            <CategorySidebar active={activeCategory} onChange={setActiveCategory} />
          </div>

          <div className="flex-1 bg-background/50 p-6 overflow-y-auto hide-scrollbar relative animate-in fade-in zoom-in-95 duration-500 delay-100 fill-mode-both">
            <ProductGrid category={activeCategory} />
          </div>

          <div className="w-[420px] bg-card border-l border-border/40 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right-8 duration-500 delay-200 fill-mode-both">
            <PosCart />
          </div>
        </div>
      </div>
    </ShiftManager>
    </LockScreen>
  )
}
