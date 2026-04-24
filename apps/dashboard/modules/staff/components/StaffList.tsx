"use client"

import * as React from "react"
import { useStaffList } from "../hooks/useStaff"
import { DataTable } from "@/components/common/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserAdd01Icon, Edit01Icon } from "@hugeicons/core-free-icons"

export function StaffList() {
  const { data, isLoading } = useStaffList()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "Staff Member",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.user?.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{row.original.position}</span>
        </div>
      )
    },
    {
      accessorKey: "employeeCode",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("employeeCode")}</span>
    },
    {
      accessorKey: "commissionRate",
      header: "Comm. Rate",
      cell: ({ row }) => `${row.getValue("commissionRate")}%`
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
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data || []} 
        isLoading={isLoading}
      />
    </div>
  )
}
