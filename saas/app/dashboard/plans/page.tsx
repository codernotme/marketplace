"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Plan } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Check, X } from "lucide-react";

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
            description: "For beginners",
            price_monthly: 0,
            currency: "USD",
            features: [
              { name: "5 Products", enabled: true },
              { name: "Basic Analytics", enabled: true },
              { name: "Email Support", enabled: false },
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
            description: "For growing businesses",
            price_monthly: 299,
            currency: "USD",
            features: [
              { name: "Unlimited Products", enabled: true },
              { name: "Advanced Analytics", enabled: true },
              { name: "Priority Support", enabled: true },
            ],
            max_products: 999,
            max_orders_monthly: 5000,
            max_users: 10,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plans & Billing</h1>
          <p className="text-muted-foreground mt-1">Manage subscription plans and pricing</p>
        </div>
        <Button className="w-full sm:w-auto bg-linear-to-r from-foreground to-muted-foreground hover:from-foreground/90 hover:to-muted-foreground/90 text-background">
          <Plus className="mr-2 w-4 h-4" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan._id} className="border-border bg-card hover:border-orange-500/50 transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  {!plan.is_active && (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">${plan.price_monthly}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Limits */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max Products</span>
                    <span className="text-foreground font-medium">{plan.max_products === 999 ? "Unlimited" : plan.max_products}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max Orders/Mo</span>
                    <span className="text-foreground font-medium">{plan.max_orders_monthly.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Users Allowed</span>
                    <span className="text-foreground font-medium">{plan.max_users}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 border-t border-border pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {feature.enabled ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={feature.enabled ? "text-foreground" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-border text-foreground hover:bg-muted">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

