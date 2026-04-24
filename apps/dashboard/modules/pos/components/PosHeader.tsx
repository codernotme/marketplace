"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, WifiIcon, Search01Icon, Menu01Icon, UserCircleIcon, Settings01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { CloseShiftModal } from "./ShiftManager"
import { Logout01Icon } from "@hugeicons/core-free-icons"

export function PosHeader() {
  const [time, setTime] = React.useState(new Date())
  const [isCloseShiftOpen, setIsCloseShiftOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 z-20">
      
      {/* Left side: Brand & Menu */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <span className="text-lg font-medium tracking-tight text-primary">
            The Mrktplace
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Flagship Store
          </span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-8 relative hidden md:block">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search products by SKU, name or barcode..." 
          className="w-full bg-background/50 border-border/50 pl-10 h-10 rounded-full focus-visible:ring-primary/50 text-sm font-sans"
        />
      </div>

      {/* Right side: Status, Time, User */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
          <HugeiconsIcon icon={WifiIcon} className="w-3.5 h-3.5 text-emerald-500" />
          <span>Online</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-medium font-mono text-foreground/80 border-l border-r border-border/40 px-6">
          <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-primary" />
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Aryan</p>
            <p className="text-xs text-muted-foreground mt-1">Cashier</p>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">AR</AvatarFallback>
          </Avatar>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setIsCloseShiftOpen(true)}
          >
            <HugeiconsIcon icon={Logout01Icon} className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <CloseShiftModal open={isCloseShiftOpen} onOpenChange={setIsCloseShiftOpen} />
    </header>
  )
}
