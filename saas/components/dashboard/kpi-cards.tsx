"use client";

import { Card } from "@heroui/react";
import { tenants } from "@/lib/data/tenants";
import { subscriptions } from "@/lib/data/subscriptions";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

export function KPICards() {
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const pendingTenants = tenants.filter((t) => t.status === "pending").length;
  const suspendedTenants = tenants.filter((t) => t.status === "suspended").length;

  const mrrByPlan = subscriptions.reduce(
    (acc, sub) => {
      const plan = sub.plan_id;
      const price = plan === "plan_004" ? 499 : plan === "plan_003" ? 99 : plan === "plan_002" ? 29 : 0;
      acc[plan] = (acc[plan] || 0) + price;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalMRR = Object.values(mrrByPlan).reduce((a, b) => a + b, 0);
  const totalRevenue = tenants.reduce((sum, t) => sum + t.revenue, 0);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const newSignups = tenants.filter((t) => t.created_at > thirtyDaysAgo).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Tenants</p>
            <p className="text-3xl font-bold mt-2">{activeTenants}</p>
            <p className="text-xs text-gray-500 mt-1">
              {pendingTenants} pending • {suspendedTenants} suspended
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-3xl font-bold mt-2">${totalMRR}</p>
            <p className="text-xs text-gray-500 mt-1">
              {subscriptions.filter((s) => s.status === "active").length} active
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">All-Time Revenue</p>
            <p className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              across {tenants.filter((t) => t.revenue > 0).length} shops
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">New Signups</p>
            <p className="text-3xl font-bold mt-2">{newSignups}</p>
            <p className="text-xs text-gray-500 mt-1">last 30 days</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}

