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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Plans & Billing</h1>
          <p className="text-slate-400 mt-1">Manage subscription plans and pricing</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
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
            <Card key={plan._id} className="border-slate-800 bg-slate-900 hover:border-orange-500/50 transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
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
                  <span className="text-3xl font-bold text-white">${plan.price_monthly}</span>
                  <span className="text-slate-400">/month</span>
                </div>

                {/* Limits */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Max Products</span>
                    <span className="text-white font-medium">{plan.max_products === 999 ? "Unlimited" : plan.max_products}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Max Orders/Mo</span>
                    <span className="text-white font-medium">{plan.max_orders_monthly.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Users Allowed</span>
                    <span className="text-white font-medium">{plan.max_users}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {feature.enabled ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={feature.enabled ? "text-white" : "text-slate-500"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-white hover:bg-slate-800">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-slate-400 hover:text-white">
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
      starter: "10 GB",
      pro: "100 GB",
      enterprise: "1 TB",
    },
    {
      feature: "Team Members",
      free: "1",
      starter: "3",
      pro: "10",
      enterprise: "Unlimited",
    },
    {
      feature: "Custom Domain",
      free: "✗",
      starter: "✓",
      pro: "✓",
      enterprise: "✓",
    },
    {
      feature: "Telegram Bot",
      free: "✗",
      starter: "✓",
      pro: "✓",
      enterprise: "✓",
    },
    {
      feature: "Analytics",
      free: "Basic",
      starter: "Basic",
      pro: "Advanced",
      enterprise: "Advanced",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Plans & Billing</h1>
        <p className="text-gray-600 mt-2">Manage subscription plans and view all active subscriptions</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const subCount = getSubscriptionCount(plan.id);
            return (
              <Card key={plan.id} className="p-6 border-2 hover:border-blue-400 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.display_name}</h3>
                  {plan.price_monthly > 0 && (
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      ${plan.price_monthly}
                      <span className="text-sm text-gray-600">/mo</span>
                    </p>
                  )}
                  {plan.price_monthly === 0 && (
                    <p className="text-2xl font-bold text-green-600 mt-2">Free</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{subCount} active subscriptions</p>
                <Badge variant="outline" className="mb-4">
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button variant="outline" className="w-full">
                  Edit Plan
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Free</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Starter</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Pro</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {planDetails.map((detail) => (
                <tr key={detail.feature} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{detail.feature}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{detail.free}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{detail.starter}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{detail.pro}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{detail.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
