import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Download01Icon, ArrowRight01Icon, Building01Icon } from "@hugeicons/core-free-icons";
import { formatDateTime } from "@workspace/ui/lib/formatters";
import { DataTable } from "@workspace/ui/components/data-table";
import { cn } from "@workspace/ui/lib/utils";
import { getTenants } from "@/app/actions/master";
import { TenantWizard } from "@/components/tenants/tenant-wizard";
import { ViewIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenants — themrktplace Master Admin",
  description: "Manage and monitor all platform tenant instances.",
};

const columns = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }: any) => (
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
    cell: ({ row }: any) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
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
    cell: ({ row }: any) => {
      const tenant = row.original;
      // In dev, we use subdomain on localhost. In prod, we'd use the mapping.
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

export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Tenants"
        description="Monitor healthy usage and configuration across all merchant accounts."
      >
        <Button variant="outline" size="sm" className="rounded-full shadow-none bg-background">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export Data
        </Button>
        <Button size="sm" className="rounded-full shadow-none px-5">
          Export Data
        </Button>
        <TenantWizard />
      </PageHeader>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Accounts", value: tenants.length, detail: "across all regions" },
          { label: "Active Today", value: Math.ceil(tenants.length * 0.8), detail: "+4% from yesterday" },
          { label: "Pending Setup", value: 3, detail: "awaiting validation" },
          { label: "Compliance", value: "98%", detail: "security health score" },
        ].map((m) => (
          <div key={m.label} className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{m.label}</p>
            <p className="text-2xl font-black mt-1 tabular-nums">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-card/20 backdrop-blur-md rounded-[40px] border border-border/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <DataTable 
          columns={columns as any} 
          data={tenants} 
          searchColumn="name"
          searchPlaceholder="Search system by name..."
        />
      </div>
    </div>
  );
}
