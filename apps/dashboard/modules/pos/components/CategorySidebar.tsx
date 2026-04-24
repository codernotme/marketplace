"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquare01Icon, Coffee02Icon, Shirt01Icon, Watch01Icon, LaptopProgrammingIcon, FireIcon } from "@hugeicons/core-free-icons"
import { cn } from "@workspace/ui/lib/utils"

interface CategorySidebarProps {
  active: string
  onChange: (id: string) => void
}

const CATEGORIES = [
  { id: "all", label: "All", icon: DashboardSquare01Icon },
  { id: "hot", label: "Hot", icon: FireIcon },
  { id: "apparel", label: "Apparel", icon: Shirt01Icon },
  { id: "tech", label: "Tech", icon: LaptopProgrammingIcon },
  { id: "accessories", label: "Accessories", icon: Watch01Icon },
  { id: "cafe", label: "Cafe", icon: Coffee02Icon },
]

export function CategorySidebar({ active, onChange }: CategorySidebarProps) {
  return (
    <div className="flex flex-col gap-4 w-full px-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id
        
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3 transition-all duration-300",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            <HugeiconsIcon 
              icon={cat.icon} 
              className={cn("w-6 h-6", isActive ? "text-primary-foreground" : "text-foreground/70 group-hover:text-primary")} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
            <span className="text-[10px] font-medium tracking-wide uppercase">{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
