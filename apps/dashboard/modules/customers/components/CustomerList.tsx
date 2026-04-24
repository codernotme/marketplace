"use client"

import * as React from "react"
import { useCustomers } from "../hooks/useCustomers"
import { DataTable } from "@/components/common/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, UserAdd01Icon, UserCircleIcon } from "@hugeicons/core-free-icons"

export function CustomerList() {
  const { data, isLoading } = useCustomers()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("name")}</span>
            <span className="text-[10px] text-muted-foreground">{row.original.email || "No email"}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "totalSpend",
      header: "Total Spend",
      cell: ({ row }) => `₹${Number(row.getValue("totalSpend")).toFixed(2)}`
    },
    {
      accessorKey: "loyaltyPoints",
      header: "Loyalty Points",
      cell: ({ row }) => (
        <span className="font-medium text-amber-600">{row.getValue("loyaltyPoints")} pts</span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data?.items || []} 
        isLoading={isLoading}
        searchKey="name"
      />
    </div>
  )
}
