"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Plan } from "@/types";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get<{ data: Plan[] }>("/api/saas/plans");
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        // Mock data
        setPlans([
          {
            _id: "plan_001",
            name: "Free",
            slug: "free",
            description: "Essential toolkit for small scale artisans.",
            price_monthly: 0,
            currency: "USD",
            features: [
              { name: "5 Active Products", enabled: true },
              { name: "Basic Analytics", enabled: true },
              { name: "Community Support", enabled: true },
              { name: "SLA Guarantees", enabled: false },
            ],
            max_products: 5,
            max_orders_monthly: 50,
            max_users: 1,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            _id: "plan_002",
            name: "Pro",
            slug: "pro",
            description: "Scale your empire with advanced logistics.",
            price_monthly: 299,
            currency: "USD",
            features: [
              { name: "Unlimited Products", enabled: true },
              { name: "Advanced Insights", enabled: true },
              { name: "Priority Support", enabled: true },
              { name: "Custom Domain", enabled: true },
            ],
            max_products: 999,
            max_orders_monthly: 5000,
            max_users: 10,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            _id: "plan_003",
            name: "Enterprise",
            slug: "enterprise",
            description: "Bespoke solutions for global marketplaces.",
            price_monthly: 999,
            currency: "USD",
            features: [
              { name: "Infinite Scale", enabled: true },
              { name: "Dedicated Manager", enabled: true },
              { name: "Custom API Nodes", enabled: true },
              { name: "Full White Label", enabled: true },
            ],
            max_products: 9999,
            max_orders_monthly: 100000,
            max_users: 100,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Plans & Billing"
        subtitle="Architect your platform's monetization and subscription tiers"
        icon="solar:card-2-bold-duotone"
        actions={
          <Button variant="primary" className="font-bold gap-2">
            <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
            Create Plan
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner color="accent" size="lg" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing pricing tiers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan._id} 
              className={cn(
                "border hover:border-accent/40 transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col h-full",
                plan.slug === "pro" ? "border-accent/30 bg-accent/[0.02]" : "border-border bg-surface"
              )}
            >
              {plan.slug === "pro" && (
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
                    <Chip variant="soft" color="danger" size="sm" className="font-black text-[9px] uppercase tracking-wider">Inactive</Chip>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>${plan.price_monthly}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">/ Month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Products Limit</span>
                    <span className="text-xs font-bold">{plan.max_products === 999 ? "∞ Unlimited" : plan.max_products}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Monthly Orders</span>
                    <span className="text-xs font-bold">{plan.max_orders_monthly.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">User Seats</span>
                    <span className="text-xs font-bold">{plan.max_users}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border/40 pt-6">
                  {plan.features.map((feature, idx) => (
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
                 <Button variant="ghost" isIconOnly className="h-10 w-10 rounded-xl text-muted-foreground hover:text-danger hover:bg-danger/10">
                    <Icon icon="solar:trash-bin-trash-bold-duotone" />
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

