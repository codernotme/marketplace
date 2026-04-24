"use client"

import * as React from "react"

import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { ThemeProvider } from "@/components/theme-provider"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  )
}

export { Providers }