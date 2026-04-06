"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscriptions } from "@/lib/data/subscriptions";
import { tenants } from "@/lib/data/tenants";
import { plans } from "@/lib/data/plans";
import { AlertCircle } from "lucide-react";

const statusColors = {
  active: "bg-green-100 text-green-800",
  past_due: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  trialing: "bg-blue-100 text-blue-800",
};

export default function SubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = subscriptions.filter(
    (sub) => statusFilter === "all" || sub.status === statusFilter
  );

  const getTenantName = (tenantId: string) => {
    return tenants.find((t) => t.id === tenantId)?.shop_name || "Unknown";
  };

  const getPlanName = (planId: string) => {
    return plans.find((p) => p.id === planId)?.display_name || "Unknown";
  };

  const getPlanPrice = (planId: string) => {
    return plans.find((p) => p.id === planId)?.price_monthly || 0;
  };

  const totalMRR = filtered.reduce((sum, sub) => {
    if (sub.status === "active") {
      return sum + getPlanPrice(sub.plan_id);
    }
    return sum;
  }, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-2">View and manage all tenant subscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Active</p>
          <p className="text-3xl font-bold">
            {subscriptions.filter((s) => s.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Past Due</p>
          <p className="text-3xl font-bold text-red-600">
            {subscriptions.filter((s) => s.status === "past_due").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-3xl font-bold">${totalMRR}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Subscriptions</h3>
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Billing</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Period</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">MRR</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{getTenantName(sub.tenant_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{getPlanName(sub.plan_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[sub.status as keyof typeof statusColors]
                      }`}
                    >
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm capitalize">{sub.billing_cycle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(sub.current_period_start).toLocaleDateString()} -{" "}
                      {new Date(sub.current_period_end).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">${getPlanPrice(sub.plan_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {subscriptions.some((s) => s.status === "past_due") && (
        <Card className="mt-6 p-4 bg-red-50 border-red-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">
                {subscriptions.filter((s) => s.status === "past_due").length} subscription
                {subscriptions.filter((s) => s.status === "past_due").length !== 1 ? "s" : ""} are past due
              </p>
              <p className="text-sm text-red-800 mt-1">
                Please follow up with these tenants regarding payment issues.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

