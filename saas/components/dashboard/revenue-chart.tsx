"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { tenants } from "@/lib/data/tenants";
import { plans } from "@/lib/data/plans";

export function RevenueChart() {
  const planNames = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  const planRevenue = tenants.reduce(
    (acc, tenant) => {
      const plan = planNames[tenant.plan as keyof typeof planNames];
      const existing = acc.find((p) => p.name === plan);
      if (existing) {
        existing.revenue += tenant.revenue;
        existing.count += 1;
      } else {
        acc.push({ name: plan, revenue: tenant.revenue, count: 1 });
      }
      return acc;
    },
    [] as Array<{ name: string; revenue: number; count: number }>
  );

  const subscriptionStatus = [
    { status: "Active", count: tenants.filter((t) => t.status === "active").length },
    { status: "Pending", count: tenants.filter((t) => t.status === "pending").length },
    { status: "Suspended", count: tenants.filter((t) => t.status === "suspended").length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue by Plan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={planRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tenant Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subscriptionStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

