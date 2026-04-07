"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Tenant } from "@/types";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  active: "bg-green-500/20 text-green-400",
  suspended: "bg-red-500/20 text-red-400",
  deleted: "bg-muted text-muted-foreground",
};

const planColors: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-muted text-foreground",
  pro: "bg-foreground text-background",
  enterprise: "bg-muted text-foreground",
};

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params.id as string;
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await apiClient.get<Tenant>(`/api/saas/tenants/${tenantId}`);
        setTenant(data);
      } catch (error) {
        console.error("Failed to fetch tenant:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!tenant) {
    return (
      <Card className="border-border bg-card">
        <div className="p-8 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-foreground">Tenant not found</p>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: "info", label: "Information" },
    { id: "config", label: "Configuration" },
    { id: "activity", label: "Activity" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{tenant.name}</h1>
          <p className="text-muted-foreground mt-1">Tenant ID: {tenant._id}</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            Edit
          </Button>
          <Button variant="danger">
            Suspend
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <Chip className={`capitalize border-none ${planColors[tenant.plan]}`}>
                  {tenant.plan}
                </Chip>
              </div>
              <Chip className={`capitalize border-none ${statusColors[tenant.status]}`}>
                {tenant.status}
              </Chip>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{tenant.order_count || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-2xl font-bold text-foreground">${(tenant.revenue || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-6 border-b border-border bg-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === "info" && (
          <Card className="border-border bg-card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Tenant Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Shop Details</h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Name</p>
                    <p className="text-foreground">{tenant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Slug</p>
                    <p className="text-foreground">{tenant.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="text-foreground">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Owner Information</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-foreground to-muted-foreground flex items-center justify-center text-background font-bold">
                      {tenant.owner_name?.charAt(0) || "O"}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground">{tenant.owner_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="text-foreground">{tenant.owner_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="text-foreground">{tenant.owner_phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <Card className="border-border bg-card">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-foreground">Tenant Configuration</h3>
                <p className="text-sm text-muted-foreground">Payment methods, integrations & settings</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded border border-border">
                  Configuration details will be loaded from the backend. Enable Razorpay keys, email templates, Telegram bot settings.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <Card className="border-border bg-card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Activity Log</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded border border-border">
                  Recent actions and audit logs will be displayed here.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
