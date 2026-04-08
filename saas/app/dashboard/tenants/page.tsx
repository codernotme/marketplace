"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Tenant, TenantListResponse } from "@/types";
import { Card, Button, Input, InputGroup, Chip, Modal, Spinner, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig: Record<string, { color: "warning" | "success" | "danger" | "default", icon: string }> = {
  active: { color: "success", icon: "solar:check-circle-bold-duotone" },
  suspended: { color: "danger", icon: "solar:shield-warning-bold-duotone" },
  pending: { color: "warning", icon: "solar:clock-circle-bold-duotone" },
};

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    owner_email: "",
    plan_code: "starter",
  });

  const planOptions = [
    { code: "free", label: "Free", modules: ["shop"], sales: false },
    { code: "starter", label: "Starter", modules: ["shop"], sales: false },
    { code: "intermediate", label: "Intermediate", modules: ["shop", "web"], sales: false },
    { code: "growth", label: "Growth", modules: ["shop", "web", "app"], sales: false },
    { code: "enterprise", label: "Enterprise", modules: ["shop", "web", "app"], sales: true },
  ] as const;

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const response = await apiClient.get<TenantListResponse>(`/api/saas/tenants?${params.toString()}`);
      setTenants(response.data);
    } catch (error) {
      toast.error("Failed to fetch tenants from stream");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [search, statusFilter]);

  const handleCreateTenant = async () => {
    if (!formData.name || !formData.slug || !formData.owner_email) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/tenants", formData);
      toast.success("Tenant provisioned successfully");
      setIsModalOpen(false);
      setFormData({ name: "", slug: "", owner_email: "", plan_code: "starter" });
      fetchTenants();
    } catch (error) {
      toast.error("Provisioning failed: Check logs");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-3xl text-primary" />
             Tenants
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Manage marketplace shops and physical locations</p>
        </div>
        <Button 
          variant="primary" 
          className="font-bold flex items-center gap-2 shadow-lg shadow-accent-soft-hover"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          Provision Tenant
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex-1 min-w-75">
          <InputGroup className="max-w-md bg-default-100/50 border border-border/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent-soft-hover transition-all">
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
        
        <div className="flex items-center gap-2 p-1 bg-default-100/50 border border-border/50 rounded-xl overflow-hidden">
           {["all", "active", "pending", "suspended"].map((status) => (
             <button
               key={status}
               onClick={() => setStatusFilter(status)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 statusFilter === status 
                   ? "bg-background text-accent shadow-sm" 
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
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tier</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr key="loading">
                   <td colSpan={5} className="py-20 text-center">
                      <Spinner color="accent" />
                      <p className="mt-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hydrating tenant stream...</p>
                   </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr key="empty">
                   <td colSpan={5} className="py-20 text-center text-muted-foreground italic text-sm">
                      No tenants found matching your criteria.
                   </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent-soft-hover text-accent flex items-center justify-center font-black text-xs">
                            {tenant.name?.charAt(0).toUpperCase() || "T"}
                         </div>
                         <div>
                            <p className="font-bold text-sm tracking-tight">{tenant.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 opacity-60">/{tenant.slug}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-sm">{tenant.owner_name}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-60">{tenant.owner_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={tenant.plan === "enterprise" ? "accent" : tenant.plan === "growth" ? "success" : tenant.plan === "intermediate" ? "warning" : "default"}
                        className="font-black text-[10px] uppercase tracking-wider h-6 pr-2"
                      >
                         <Icon icon="solar:crown-bold-duotone" className="mr-1 -mt-px" />
                        {tenant.plan || tenant.plan_code || "Starter"}
                      </Chip>
                      {tenant.module_access?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tenant.module_access.map((module) => (
                            <Chip key={module} size="sm" variant="soft" className="text-[9px] font-black uppercase tracking-wider h-5">
                              {module}
                            </Chip>
                          ))}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          tenant.status === "active" ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
                          tenant.status === "suspended" ? "bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-warning shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
                          {tenant.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button title="Tenant actions" aria-label="Tenant actions" className="flex items-center justify-center rounded-full h-8 w-8 opacity-60 hover:opacity-100 hover:bg-default-100 transition-all outline-none">
                              <Icon icon="solar:menu-dots-bold-duotone" className="text-lg" />
                           </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-45 bg-background border border-border shadow-xl rounded-2xl p-1">
                           <Dropdown.Menu onAction={(key) => {
                             if (key === "view") router.push(`/dashboard/tenants/${tenant._id}`);
                           }}>
                             <Dropdown.Item id="view" textValue="Details" className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                               <Icon icon="solar:eye-bold-duotone" className="text-lg opacity-60" />
                               <span className="text-xs font-bold">View Profile</span>
                             </Dropdown.Item>
                             <Dropdown.Item id="suspend" textValue="Suspend" className="flex items-center gap-2 p-2 hover:bg-danger/10 text-danger rounded-lg">
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

      <Modal>
        <Modal.Backdrop 
          isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)}
          variant="blur"
          className="bg-black/60"
        >
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-lg w-full flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 bg-default-50/50 border-b border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:shop-add-bold-duotone" className="text-2xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tight">Provision New Tenant</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Spin up a new marketplace instance</p>
                   </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shop Name</Label>
                      <Input
                        placeholder="Nexus Store"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shop Slug</Label>
                      <Input
                        placeholder="nexus-store"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Owner Email</Label>
                    <Input
                      type="email"
                      placeholder="owner@store.com"
                      value={formData.owner_email}
                      onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subscription Tier</Label>
                    <div className="flex items-center gap-3 p-1 bg-default-100/50 border border-border/50 rounded-xl">
                      {planOptions.map((plan) => (
                        <button
                          key={plan.code}
                          type="button"
                          onClick={() => setFormData({ ...formData, plan_code: plan.code })}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.plan_code === plan.code 
                              ? "bg-background text-accent shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {plan.label}
                        </button>
                      ))}
                    </div>
                 </div>
                 <div className="rounded-2xl border border-border/60 bg-default-50/70 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Module access by tier</p>
                    <div className="space-y-2 text-xs">
                      {planOptions.map((plan) => (
                        <div key={plan.code} className="flex items-center justify-between gap-4">
                          <span className="font-bold capitalize">{plan.label}</span>
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {plan.modules.map((module) => (
                              <Chip key={module} size="sm" variant="soft" className="text-[9px] font-black uppercase tracking-wider h-5">
                                {module}
                              </Chip>
                            ))}
                            {plan.sales ? (
                              <Chip size="sm" variant="soft" color="warning" className="text-[9px] font-black uppercase tracking-wider h-5">
                                contact sales
                              </Chip>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </Modal.Body>
              <Modal.Footer className="p-6 bg-default-50/50 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 font-bold rounded-xl h-11" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 font-bold rounded-xl h-11 shadow-lg shadow-accent-soft-hover" 
                  onClick={handleCreateTenant}
                  isPending={isSaving}
                >
                  Confirm Provisioning
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

