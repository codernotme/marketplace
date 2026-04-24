"use client"

import * as React from "react"
import { useProducts } from "../hooks/useInventory"
import { DataTable } from "@/components/common/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, Delete01Icon, Add01Icon } from "@hugeicons/core-free-icons"

export function ProductList() {
  const { data, isLoading } = useProducts()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("name")}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{row.original.category?.name}</span>
        </div>
      )
    },
    {
      accessorKey: "basePrice",
      header: "Base Price",
      cell: ({ row }) => `₹${Number(row.getValue("basePrice")).toFixed(2)}`
    },
    {
      accessorKey: "variants",
      header: "Variants",
      cell: ({ row }) => row.original.variants?.length || 0
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data?.items || []} 
        isLoading={isLoading}
      />
    </div>
  )
}
