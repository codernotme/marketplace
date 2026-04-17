"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Tick01Icon, ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { provisionTenant, getSubscriptionPlans, getUsers } from "@/app/actions/master";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

const tenantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  planId: z.string().min(1, "Please select a plan"),
  ownerId: z.string().min(1, "Please select an owner"),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

export function TenantWizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      slug: "",
      planId: "",
      ownerId: "",
    },
  });

  useEffect(() => {
    if (open) {
      async function loadData() {
        const [p, u] = await Promise.all([getSubscriptionPlans(), getUsers()]);
        setPlans(p.length > 0 ? p : [
            { id: "basic", name: "Basic", price: 29 },
            { id: "pro", name: "Pro", price: 99 },
            { id: "ent", name: "Enterprise", price: 499 },
        ]);
        setUsers(u);
      }
      loadData();
    }
  }, [open]);

  const name = form.watch("name");
  useEffect(() => {
    if (step === 1) {
      const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      form.setValue("slug", slug);
    }
  }, [name, form, step]);

  async function onSubmit(values: TenantFormValues) {
    setLoading(true);
    try {
      await provisionTenant(values);
      toast.success("Tenant provisioned successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
      router.refresh();
    } catch (error) {
      toast.error("Failed to provision tenant.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const nextStep = async () => {
    const fields = step === 1 ? ["name", "slug"] : step === 2 ? ["planId"] : ["ownerId"];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) { setStep(1); form.reset(); } }}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full shadow-none px-5">
           <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
           Provision Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[40px] border-none shadow-2xl bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
            <DialogHeader className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= step ? "bg-primary" : "bg-primary/10")} />
                    ))}
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                    {step === 1 && "Identity & Brand"}
                    {step === 2 && "Growth Plan"}
                    {step === 3 && "Governance"}
                </DialogTitle>
                <DialogDescription className="text-xs font-medium">
                    {step === 1 && "Define the unique presence of this organization."}
                    {step === 2 && "Select the infrastructure tier for this merchant."}
                    {step === 3 && "Assign primary ownership and access control."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Legal Name</Label>
                            <Input 
                                id="name" 
                                {...form.register("name")} 
                                placeholder="e.g. Acme Corporation" 
                                className="h-12 rounded-2xl bg-background/50 border-border/50 focus:ring-primary shadow-none"
                            />
                            {form.formState.errors.name && <p className="text-[10px] text-destructive font-bold ml-1">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Unique Slug</Label>
                            <div className="relative">
                                <Input 
                                    id="slug" 
                                    {...form.register("slug")} 
                                    placeholder="acme-corp"
                                    className="h-12 rounded-2xl bg-background/50 border-border/50 focus:ring-primary shadow-none pr-32"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/50 uppercase tracking-tight">
                                    .themrktplace.io
                                </div>
                            </div>
                            {form.formState.errors.slug && <p className="text-[10px] text-destructive font-bold ml-1">{form.formState.errors.slug.message}</p>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id}
                                onClick={() => form.setValue("planId", plan.id)}
                                className={cn(
                                    "p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between",
                                    form.watch("planId") === plan.id 
                                        ? "border-primary bg-primary/5 shadow-inner" 
                                        : "border-border/50 hover:bg-muted/50"
                                )}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-black tracking-tight">{plan.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Base infrastructure</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-black tracking-tight">${plan.price}<span className="text-[10px] text-muted-foreground font-medium">/mo</span></span>
                                    <div className={cn("size-5 rounded-full border flex items-center justify-center transition-all", form.watch("planId") === plan.id ? "bg-primary border-primary text-white" : "border-border")}>
                                        {form.watch("planId") === plan.id && <HugeiconsIcon icon={Tick01Icon} size={10} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Primary Owner</Label>
                            <Select onValueChange={(v) => form.setValue("ownerId", v)}>
                                <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-border/50 shadow-none">
                                    <SelectValue placeholder="Select an existing user..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={u.id} className="rounded-xl">
                                            {u.name} ({u.email})
                                        </SelectItem>
                                    ))}
                                    {users.length === 0 && <p className="p-4 text-[10px] text-muted-foreground text-center font-bold uppercase">No users found</p>}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.ownerId && <p className="text-[10px] text-destructive font-bold ml-1">{form.formState.errors.ownerId.message}</p>}
                        </div>
                        <div className="p-4 rounded-2xl bg-warning/5 border border-warning/20">
                            <p className="text-[10px] text-warning font-bold uppercase tracking-widest leading-relaxed">
                                NOTE: The owner will receive an automated welcome email with login instructions once provisioned.
                            </p>
                        </div>
                    </div>
                )}
            </form>
        </div>

        <div className="p-6 bg-muted/30 border-t border-border/40 flex items-center justify-between">
            {step > 1 ? (
                <Button variant="ghost" className="rounded-full font-bold text-xs" onClick={prevStep}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" size={14} />
                    Back
                </Button>
            ) : <div />}
            
            {step < 3 ? (
                <Button className="rounded-full px-8 font-black text-xs shadow-lg shadow-primary/20" onClick={nextStep}>
                    Next Step
                    <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" size={14} />
                </Button>
            ) : (
                <Button 
                    className="rounded-full px-8 font-black text-xs shadow-lg shadow-primary/20" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    {loading ? "Provisioning..." : "Finalize Instance"}
                    {!loading && <HugeiconsIcon icon={Tick01Icon} data-icon="inline-end" size={14} />}
                </Button>
            ) }
        </div>
      </DialogContent>
    </Dialog>
  );
}
