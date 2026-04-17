import { getTenants } from "@/app/actions/master";
import { TenantWizard } from "@/components/tenants/tenant-wizard";
import { TenantTable } from "@/components/tenants/tenant-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenants — themrktplace Master Admin",
  description: "Manage and monitor all platform tenant instances.",
};

import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";

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
        <TenantTable data={tenants} />
      </div>
    </div>
  );
}
