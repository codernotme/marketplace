"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@workspace/ui/components/data-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Building01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { formatDateTime } from "@workspace/ui/lib/formatters";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { BulkActions } from "./bulk-actions";
import { useRouter } from "next/navigation";

interface TenantTableProps {
  data: any[];
}

export function TenantTable({ data }: TenantTableProps) {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] rounded-md"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] rounded-md"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
             <HugeiconsIcon icon={Building01Icon} size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{row.original.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{row.original.slug}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        return (
          <Badge className={cn(
            "border-transparent shadow-none text-[10px] uppercase font-black tracking-tight h-5",
            status === "active" ? "bg-success/10 text-success" : 
            status === "suspended" ? "bg-destructive/10 text-destructive" :
            "bg-warning/10 text-warning"
          )}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tenant = row.original;
        const impersonateUrl = `http://admin.${tenant.slug}.localhost:3000`;
        
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild title="Impersonate" className="rounded-full h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
              <a href={impersonateUrl} target="_blank" rel="noopener noreferrer">
                <HugeiconsIcon icon={ViewIcon} size={14} />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
              <Link href={`/dashboard/tenants/${tenant.id}`}>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchColumn="name"
      searchPlaceholder="Search system by name..."
      renderToolbar={(table) => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map((r: any) => r.original.id);
        
        return (
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <BulkActions 
                selectedIds={selectedIds} 
                onComplete={() => {
                  table.resetRowSelection();
                  router.refresh();
                }} 
              />
            )}
          </div>
        );
      }}
    />
  );
}
