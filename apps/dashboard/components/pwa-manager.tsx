"use client"

import { useEffect } from "react"
import { useSync } from "@/modules/pos/hooks/useSync"

export function PwaManager() {
  const { syncPendingSales, syncProducts } = useSync()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  useEffect(() => {
    // Initial sync
    syncPendingSales()
    syncProducts()
  }, [])

  return null
}
