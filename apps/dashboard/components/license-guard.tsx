"use client"

import * as React from "react"
import { useActiveLicense } from "@/modules/license/hooks/useLicense"
import { HugeiconsIcon } from "@hugeicons/react"
import { Shield01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export function LicenseGuard({ children }: { children: React.ReactNode }) {
  const { isInactive, isLoading } = useActiveLicense()

  if (isLoading) return null

  if (isInactive) {
    return (
      <div className="fixed inset-0 z-[300] bg-background flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center text-destructive mb-4 animate-bounce">
          <HugeiconsIcon icon={Shield01Icon} className="w-12 h-12" />
        </div>
        
        <div className="max-w-md space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Access Restricted</h1>
          <p className="text-muted-foreground">
            Your subscription has been suspended or has expired. Access to the dashboard is locked until a valid license is activated.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button size="lg" className="h-14 text-lg font-bold shadow-xl shadow-primary/20" asChild>
            <Link href="/settings/billing">
              <HugeiconsIcon icon={ShoppingCart01Icon} className="w-5 h-5 mr-2" />
              Renew License
            </Link>
          </Button>
          <Button variant="ghost" className="h-12" onClick={() => window.location.href = '/login'}>
            Sign Out
          </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          The Mrktplace Compliance System
        </p>
      </div>
    )
  }

  return <>{children}</>
}
