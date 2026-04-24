"use client"

import * as React from "react"
import { useSales } from "../hooks/useSales"
import { DataTable } from "@/components/common/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import { format } from "date-fns"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, Download01Icon } from "@hugeicons/core-free-icons"

export function SalesList() {
  const { data, isLoading } = useSales()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("invoiceNumber")}</span>
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy HH:mm")
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => row.original.customer?.name || "Walk-in"
    },
    {
      accessorKey: "grandTotal",
      header: "Total",
      cell: ({ row }) => <span className="font-semibold">₹{Number(row.getValue("grandTotal")).toFixed(2)}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "COMPLETED" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${row.original.id}/invoice`, '_blank')}
          >
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={data?.items || []} 
        isLoading={isLoading}
      />
    </div>
  )
}
