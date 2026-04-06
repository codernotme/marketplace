"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateTenantPage() {
  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    plan: "free",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating tenant:", formData);
    alert("Tenant created successfully! (This is a demo)");
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div>
      <Link href="/dashboard/tenants">
        <Button variant="ghost" className="mb-4 gap-2">
          <ChevronLeft className="w-4 h-4" />
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
              onChange={(e) => handleChange("shop_name", e.target.value)}
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
                onChange={(e) => handleChange("owner_name", e.target.value)}
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
                onChange={(e) => handleChange("owner_email", e.target.value)}
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
              onChange={(e) => handleChange("owner_phone", e.target.value)}
              placeholder="+1-234-567-8900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Initial Plan *
            </label>
            <Select value={formData.plan} onValueChange={(value) => handleChange("plan", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter - $29/month</SelectItem>
                <SelectItem value="pro">Pro - $99/month</SelectItem>
                <SelectItem value="enterprise">Enterprise - $499/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              An onboarding email will be sent to the owner with setup instructions. The tenant will appear in "Pending" status until they complete onboarding.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="px-8">
              Create Tenant
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
