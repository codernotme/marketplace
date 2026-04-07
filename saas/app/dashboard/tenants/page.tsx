"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Tenant, TenantListResponse } from "@/types";
import { Card, Button, Input, InputGroup, Chip, Dropdown, Spinner, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: "warning" | "success" | "danger" | "default", icon: string }> = {
  pending: { color: "warning", icon: "solar:clock-circle-bold-duotone" },
  active: { color: "success", icon: "solar:check-circle-bold-duotone" },
  suspended: { color: "danger", icon: "solar:shield-warning-bold-duotone" },
  deleted: { color: "default", icon: "solar:trash-bin-trash-bold-duotone" },
};

const planConfig: Record<string, { color: "default" | "primary" | "secondary" }> = {
  free: { color: "default" },
  starter: { color: "default" },
  pro: { color: "primary" },
  enterprise: { color: "secondary" },
};

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        });
        const data = await apiClient.get<TenantListResponse>(
          `/api/saas/tenants?${params.toString()}`
        );
        setTenants(data.data);
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        // Use mock data for demo
        setTenants([
          {
            _id: "tenant_001",
            shop_name: "TechHub Store",
            shop_slug: "techhub-store",
            owner_name: "John Doe",
            owner_email: "john@techhub.com",
            owner_phone: "+1-234-567-8900",
            status: "active",
            plan: "pro",
            created_at: "2024-01-10T08:00:00Z",
            order_count: 1240,
            revenue: 45680,
            onboarding_step: 5,
            onboarding_complete: true
          },
          {
            _id: "tenant_002",
            shop_name: "Fashion Boutique",
            shop_slug: "fashion-boutique",
            owner_name: "Sarah Williams",
            owner_email: "sarah@fashionboutique.com",
            owner_phone: "+1-234-567-8901",
            status: "active",
            plan: "starter",
            created_at: "2024-02-15T10:00:00Z",
            order_count: 580,
            revenue: 18920,
            onboarding_step: 5,
            onboarding_complete: true
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [search, statusFilter, page]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Tenants"
        subtitle="Manage marketplace shops and physical locations"
        icon="solar:users-group-two-rounded-bold-duotone"
        actions={
          <Link href="/dashboard/tenants/create">
            <Button 
              variant="primary" 
              className="font-bold flex items-center gap-2"
            >
              <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
              Create Tenant
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex-1 min-w-[300px]">
          <InputGroup className="max-w-md bg-default-100/50 border border-border/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <InputGroup.Prefix className="pl-3 text-muted-foreground">
              <Icon icon="solar:magnifer-linear" className="text-default-400" width={18} />
            </InputGroup.Prefix>
            <Input
              placeholder="Search by shop name, email or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2"
            />
          </InputGroup>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-default-100 rounded-xl overflow-hidden">
           {["all", "active", "pending", "suspended"].map((status) => (
             <button
               key={status}
               onClick={() => setStatusFilter(status)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                 statusFilter === status 
                   ? "bg-background text-primary shadow-sm" 
                   : "text-muted-foreground hover:text-foreground"
               )}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Shop Info</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ownership</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Plan</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Activity</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center">
                      <Spinner color="accent" />
                      <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Fetching tenants...</p>
                   </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-muted-foreground italic">
                      No tenants found matching your criteria.
                   </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-default-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                            {tenant.shop_name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-sm">{tenant.shop_name}</p>
                            <p className="text-xs text-muted-foreground tracking-tight">{tenant.shop_slug}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-sm">{tenant.owner_name}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{tenant.owner_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        className="font-black text-[10px] uppercase tracking-wider h-6"
                      >
                        {tenant.plan}
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          tenant.status === "active" ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
                          tenant.status === "suspended" ? "bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-warning shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
                          {tenant.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <div>
                          <p className="font-black text-sm">{tenant.order_count ?? 0}</p>
                          <p className="text-[10px] text-success font-bold tracking-tight">${(tenant.revenue ?? 0).toLocaleString()}</p>
                       </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Dropdown>
                        <Dropdown.Trigger>
                           <Button isIconOnly variant="ghost" className="rounded-full">
                              <Icon icon="solar:menu-dots-bold-duotone" className="text-lg opacity-60 hover:opacity-100" />
                           </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[180px] bg-background border border-border shadow-xl rounded-2xl p-1">
                           <Dropdown.Menu onAction={(key) => {
                             if (key === "view") router.push(`/dashboard/tenants/${tenant._id}`);
                           }}>
                             <Dropdown.Item id="view" textValue="Details" className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                               <Icon icon="solar:eye-bold-duotone" className="text-lg opacity-60" />
                               <span className="text-xs font-bold">View Profile</span>
                             </Dropdown.Item>
                             <Dropdown.Item id="edit" textValue="Edit" className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                               <Icon icon="solar:pen-new-square-bold-duotone" className="text-lg opacity-60" />
                               <span className="text-xs font-bold">Edit Details</span>
                             </Dropdown.Item>
                             <Dropdown.Item id="suspend" textValue="Suspend" className="flex items-center gap-2 p-2 hover:bg-danger/10 text-danger rounded-lg mt-1">
                               <Icon icon="solar:shield-warning-bold-duotone" className="text-lg" />
                               <span className="text-xs font-bold">Suspend Access</span>
                             </Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

