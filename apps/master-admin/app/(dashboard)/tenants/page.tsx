import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FilterIcon, SearchIcon } from "@hugeicons/core-free-icons";
import { formatINR, formatDate } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenants — themrktplace Master Admin",
  description: "Manage all tenants on the platform.",
};

const tenants = [
  { id: "t001", name: "FashionHub", domain: "fashionhub.themrktplace.io", plan: "Pro", mrr: 2999, status: "active", created: new Date("2024-11-01") },
  { id: "t002", name: "TechGadgets India", domain: "techgadgets.themrktplace.io", plan: "Growth", mrr: 999, status: "trial", created: new Date("2025-01-15") },
  { id: "t003", name: "ArtisanKitchen", domain: "artisankitchen.themrktplace.io", plan: "Starter", mrr: 299, status: "active", created: new Date("2025-02-20") },
  { id: "t004", name: "SportZone", domain: "sportzone.themrktplace.io", plan: "Enterprise", mrr: 9999, status: "active", created: new Date("2024-06-10") },
  { id: "t005", name: "GreenLeaf Organics", domain: "greenleaf.themrktplace.io", plan: "Growth", mrr: 999, status: "suspended", created: new Date("2024-09-05") },
];

const planVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Enterprise: "default",
  Pro: "default",
  Growth: "secondary",
  Starter: "outline",
};

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  trial: "secondary",
  suspended: "destructive",
};

export default function TenantsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tenants" description="Manage all platform tenants, their plans, and status.">
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Onboard tenant
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{tenants.length} tenants</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <HugeiconsIcon icon={SearchIcon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tenants…" className="pl-9 w-56 h-8 text-sm" />
            </div>
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Tenant</span>
              <span>Domain</span>
              <span>Plan</span>
              <span>MRR</span>
              <span>Created</span>
              <span>Status</span>
            </div>
            {tenants.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium">{t.name}</span>
                <span className="text-xs font-mono text-muted-foreground truncate">{t.domain}</span>
                <Badge variant={planVariant[t.plan] ?? "outline"}>{t.plan}</Badge>
                <span className="text-sm font-semibold tabular-nums">{formatINR(t.mrr)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(t.created)}</span>
                <Badge variant={statusVariant[t.status] ?? "outline"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
