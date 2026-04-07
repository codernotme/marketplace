"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Plan, CreatePlanRequest } from "@/types";
import { Card, Button, Input, Modal, Spinner, Dropdown, Label, TextArea, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreatePlanRequest>({
    code: "",
    name: "",
    description: "",
    monthly_price: 0,
    yearly_price: 0,
    currency: "USD",
    features: [
      { name: "Support", enabled: true },
      { name: "API Access", enabled: false },
    ],
    max_products: 10,
    max_staff: 1,
  });

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: Plan[] }>("/api/saas/plans");
      setPlans(response.data);
    } catch (error) {
      toast.error("Failed to fetch plan registry");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.name) {
      toast.error("Plan code and name are mandatory");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/plans", formData as any);
      toast.success("New tier architected successfully");
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      toast.error("Architecture failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/saas/plans/${id}`);
      toast.success("Tier decommissioned");
      fetchPlans();
    } catch (error) {
      toast.error("Decommission failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:card-2-bold-duotone" className="text-3xl text-primary" />
             Plans & Billing
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Architect your platform's monetization and subscription tiers</p>
        </div>
        <Button 
          variant="primary" 
          className="font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          Create Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner color="accent" size="lg" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing pricing tiers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan._id} 
              className={cn(
                "border hover:border-accent/40 transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col h-full",
                plan.code === "pro" ? "border-accent/30 bg-accent/[0.02]" : "border-border bg-surface"
              )}
            >
              {plan.code === "pro" && (
                <div className="absolute top-0 right-0 p-1">
                   <div className="bg-accent text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">
                      Recommended
                   </div>
                </div>
              )}

              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{plan.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed opacity-80">{plan.description}</p>
                  </div>
                  {!plan.is_active && (
                    <Chip variant="soft" color="danger" size="sm" className="font-black text-[9px] uppercase tracking-wider h-5">Inactive</Chip>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>${plan.monthly_price}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">/ Month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Products Limit</span>
                    <span className="text-xs font-bold">{plan.max_products === 999 ? "∞ Unlimited" : plan.max_products}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Staff Seats</span>
                    <span className="text-xs font-bold">{plan.max_staff}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border/40 pt-6">
                  {plan.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center border", feature.enabled ? "bg-accent/10 border-accent/20 text-accent" : "bg-default-100 border-border text-muted-foreground opacity-50")}>
                        <Icon icon={feature.enabled ? "solar:check-read-bold-duotone" : "solar:close-circle-bold-duotone"} className="text-xs" />
                      </div>
                      <span className={cn("text-xs font-medium", feature.enabled ? "text-foreground" : "text-muted-foreground opacity-40")}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-default-50/50 border-t border-border/50 flex gap-3 mt-auto">
                 <Button variant="outline" className="flex-1 font-bold rounded-xl h-10 border-border text-foreground hover:bg-default-100/50 group">
                    <Icon icon="solar:pen-bold-duotone" className="text-muted group-hover:text-foreground transition-colors" />
                    Edit
                 </Button>
                 <Button 
                   variant="ghost" 
                   isIconOnly 
                   className="h-10 w-10 rounded-xl text-muted-foreground hover:text-danger hover:bg-danger/10"
                   onClick={() => handleDelete(plan._id)}
                 >
                    <Icon icon="solar:trash-bin-trash-bold-duotone" />
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal>
        <Modal.Backdrop 
          isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)}
          variant="blur"
          className="bg-black/60"
        >
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-xl w-full flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 bg-default-50/50 border-b border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:card-2-bold-duotone" className="text-2xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Architect Tier</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Configure platform subscription rules</p>
                   </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Plan Code</Label>
                      <Input
                        placeholder="pro-tier"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                       <Input
                         placeholder="Professional"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Marketing Pitch</Label>
                    <TextArea
                      placeholder="Detail the value proposition..."
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl min-h-[80px]"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Monthly Pricing</Label>
                       <Input
                         type="number"
                         placeholder="0"
                         value={formData.monthly_price.toString()}
                         onChange={(e) => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                         className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yearly Pricing</Label>
                       <Input
                         type="number"
                         placeholder="0"
                         value={formData.yearly_price.toString()}
                         onChange={(e) => setFormData({ ...formData, yearly_price: Number(e.target.value) })}
                         className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Max Products</Label>
                       <Input
                         type="number"
                         value={formData.max_products.toString()}
                         onChange={(e) => setFormData({ ...formData, max_products: Number(e.target.value) })}
                         className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Staff Limit</Label>
                       <Input
                         type="number"
                         value={formData.max_staff.toString()}
                         onChange={(e) => setFormData({ ...formData, max_staff: Number(e.target.value) })}
                         className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                       />
                    </div>
                 </div>
              </Modal.Body>
              <Modal.Footer className="p-6 bg-default-50/50 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 font-bold rounded-xl h-11" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 font-bold rounded-xl h-11 shadow-lg shadow-accent/20" 
                  onClick={handleCreate}
                  isPending={isSaving}
                >
                  Architect Tier
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

