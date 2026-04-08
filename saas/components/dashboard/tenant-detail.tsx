"use client";

import { useState } from "react";
import { Card, Button, Chip } from "@heroui/react";
import { tenants } from "@/lib/data/tenants";
import { subscriptions } from "@/lib/data/subscriptions";
import { configs } from "@/lib/data/configs";
import { plans } from "@/lib/data/plans";
import { CheckCircle2, XCircle } from "lucide-react";

interface TenantDetailProps {
  tenantId: string;
}

const statusColors = {
  active: "bg-green-50 border-green-200",
  pending: "bg-yellow-50 border-yellow-200",
  suspended: "bg-red-50 border-red-200",
  deleted: "bg-gray-50 border-gray-200",
};

export function TenantDetail({ tenantId }: TenantDetailProps) {
  const tenant = tenants.find((t) => t.id === tenantId);
  const subscription = subscriptions.find((s) => s.tenant_id === tenantId);
  const config = configs.find((c) => c.tenant_id === tenantId);
  const plan = plans.find((p) => p.id === subscription?.plan_id);
  const [showSuspend, setShowSuspend] = useState(false);

  if (!tenant) return <div className="text-red-600">Tenant not found</div>;

  const onboardingProgress = (tenant.onboarding_step / 5) * 100;
  const configStatus = {
    razorpay: !!config?.razorpay_key_id,
    resend: !!config?.resend_api_key,
    telegram: !!config?.telegram_bot_token,
    smtp: !!config?.smtp_host,
    customDomain: !!config?.custom_domain,
  };

  return (
    <div className="space-y-6">
      <div className={`border rounded-lg p-6 ${statusColors[tenant.status]}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={tenant.logo_url}
              alt={tenant.shop_name}
              className="w-16 h-16 rounded-lg bg-gray-100"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant.shop_name}</h1>
              <p className="text-gray-600">{tenant.shop_slug}</p>
              <div className="flex gap-2 mt-2">
                <Chip size="sm" variant="soft">{tenant.status}</Chip>
                <Chip size="sm" variant="soft">{tenant.plan}</Chip>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Owner</p>
            <p className="font-medium">{tenant.owner_name}</p>
            <p className="text-sm text-gray-600">{tenant.owner_email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{tenant.order_count}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">All-Time Revenue</p>
          <p className="text-3xl font-bold">${tenant.revenue.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Created</p>
          <p className="font-medium">{new Date(tenant.created_at).toLocaleDateString()}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Onboarding Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Step {tenant.onboarding_step} of 5</span>
            <span className="text-sm font-medium">{Math.round(onboardingProgress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-default-200">
            <div className="h-full bg-primary" style={{ width: `${onboardingProgress}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {tenant.onboarding_complete ? "Onboarding completed" : "Onboarding in progress"}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription</h3>
        {subscription && plan && (
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-medium">{plan.display_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Cycle</p>
                <p className="font-medium capitalize">{subscription.billing_cycle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Period</p>
              <p className="text-sm">
                {new Date(subscription.current_period_start).toLocaleDateString()} -{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(configStatus).map(([key, isSet]) => (
            <div key={key} className="flex items-center gap-2">
              {isSet ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-300" />
              )}
              <span className="text-sm capitalize">
                {key === "customDomain" ? "Custom Domain" : key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline">Impersonate Tenant</Button>
        <Button variant="outline" className="text-orange-600 hover:text-orange-700">
          Change Plan
        </Button>
        {tenant.status === "active" && (
          <Button
            variant="danger"
            onClick={() => setShowSuspend(!showSuspend)}
          >
            Suspend Tenant
          </Button>
        )}
        {tenant.status === "suspended" && (
          <Button className="bg-green-600 hover:bg-green-700">
            Reactivate Tenant
          </Button>
        )}
      </div>

      {showSuspend && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-900 mb-3">Are you sure? This action will:</p>
          <ul className="text-sm text-red-800 space-y-1 mb-4">
            <li>• Block tenant from accessing their dashboard</li>
            <li>• Stop processing orders</li>
            <li>• Pause all integrations</li>
          </ul>
          <div className="flex gap-2">
            <Button variant="danger">Confirm Suspension</Button>
            <Button variant="outline" onClick={() => setShowSuspend(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

