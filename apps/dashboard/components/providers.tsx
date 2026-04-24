"use client"

import * as React from "react"

import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { ThemeProvider } from "@/components/theme-provider"
import { PwaManager } from "./pwa-manager"
import { LicenseGuard } from "./license-guard"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PwaManager />
        <LicenseGuard>
          <TooltipProvider>{children}</TooltipProvider>
        </LicenseGuard>
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export { Providers }
