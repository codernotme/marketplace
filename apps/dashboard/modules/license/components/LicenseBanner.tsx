"use client"

import * as React from "react"
import { useActiveLicense } from "../hooks/useLicense"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export function LicenseBanner() {
  const { license, isExpired, isInactive, isLoading } = useActiveLicense()

  if (isLoading || (!isExpired && !isInactive)) return null

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-between z-50">
      <div className="flex items-center gap-2 text-sm font-medium">
        <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 animate-pulse" />
        {isExpired ? "Your license has expired. Please renew to continue using all features." : "No active license found."}
      </div>
      <Button size="sm" variant="secondary" asChild className="h-7 text-[10px] font-bold uppercase tracking-wider">
        <Link href="/settings/billing">Renew Now</Link>
      </Button>
    </div>
  )
}
