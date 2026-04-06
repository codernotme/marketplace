import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/lib/data/plans";
import { subscriptions } from "@/lib/data/subscriptions";
import { Check } from "lucide-react";

export default function PlansPage() {
  const getSubscriptionCount = (planId: string) => {
    return subscriptions.filter((s) => s.plan_id === planId).length;
  };

  const planDetails = [
    {
      feature: "Products",
      free: "50",
      starter: "500",
      pro: "5,000",
      enterprise: "Unlimited",
    },
    {
      feature: "Orders/Month",
      free: "100",
      starter: "1,000",
      pro: "10,000",
      enterprise: "Unlimited",
    },
    {
      feature: "Storage",
      free: "1 GB",
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
