"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function CreateTenantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    plan_code: "free",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleProvision = async () => {
    if (!formData.shop_name || !formData.owner_name || !formData.owner_email) {
      toast.error("All required fields must be completed");
      return;
    }

    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/tenants", {
        name: formData.shop_name,
        slug: generateSlug(formData.shop_name),
        owner_email: formData.owner_email,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone || undefined,
        plan_code: formData.plan_code,
      });
      toast.success(formData.plan_code === "enterprise" ? "Enterprise lead captured" : "Tenant provisioned successfully");
      router.push("/dashboard/tenants");
    } catch (error) {
      toast.error("Provisioning failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div>
      <Link href="/dashboard/tenants">
        <Button variant="ghost" className="mb-4 gap-2">
          <Icon icon="solar:arrow-left-bold-duotone" className="text-base" />
          Back to Tenants
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create New Tenant</h1>
        <p className="text-gray-600 mt-2">Provision a new shop with the platform</p>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Shop Name *
            </label>
            <Input
              value={formData.shop_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("shop_name", e.target.value)}
              placeholder="e.g., Tech Hub Store"
              required
            />
            {formData.shop_name && (
              <p className="text-xs text-gray-500 mt-1">
                Slug: {generateSlug(formData.shop_name)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Owner Name *
              </label>
              <Input
                value={formData.owner_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("owner_name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Owner Email *
              </label>
              <Input
                type="email"
                value={formData.owner_email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("owner_email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Owner Phone
            </label>
            <Input
              type="tel"
              value={formData.owner_phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("owner_phone", e.target.value)}
              placeholder="+1-234-567-8900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Initial Plan *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "free", label: "Free" },
                { code: "starter", label: "Starter" },
                { code: "intermediate", label: "Intermediate" },
                { code: "growth", label: "Growth" },
                { code: "enterprise", label: "Enterprise" },
              ].map((plan) => (
                <button
                  key={plan.code}
                  type="button"
                  onClick={() => handleChange("plan_code", plan.code)}
                  className={
                    formData.plan_code === plan.code
                      ? "rounded-lg border border-accent bg-accent/10 px-3 py-2 text-xs font-bold text-accent"
                      : "rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  }
                >
                  {plan.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Module access by plan</p>
            <p className="text-xs text-slate-600 mt-1">
              Free and Starter get shop only, Intermediate gets shop + web, Growth gets shop + web + app, and Enterprise requires sales contact before self-serve provisioning.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              An onboarding email will be sent to the owner with setup instructions. Enterprise requests are routed to sales instead of instant provisioning.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="px-8" onClick={handleProvision} isPending={isSaving}>
              {isSaving ? "Provisioning..." : "Create Tenant"}
            </Button>
            <Link href="/dashboard/tenants">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

