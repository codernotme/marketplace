"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Tenant } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";

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
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-foreground">Tenant not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{tenant.shop_name}</h1>
          <p className="text-muted-foreground mt-1">Tenant ID: {tenant._id}</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            Edit
          </Button>
          <Button variant="destructive">
            Suspend
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <Badge className={`capitalize ${planColors[tenant.plan]}`}>
                  {tenant.plan}
                </Badge>
              </div>
              <Badge className={`capitalize ${statusColors[tenant.status]}`}>
                {tenant.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{tenant.order_count}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-2xl font-bold text-foreground">${tenant.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="border-b border-border bg-transparent">
          <TabsTrigger
            value="info"
            className="border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
          >
            Information
          </TabsTrigger>
          <TabsTrigger
            value="config"
            className="border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Shop Details</h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Name</p>
                    <p className="text-foreground">{tenant.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Slug</p>
                    <p className="text-foreground">{tenant.shop_slug}</p>
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
                      {tenant.owner_name.charAt(0)}
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
                    <p className="text-foreground">{tenant.owner_phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Tenant Configuration</CardTitle>
              <CardDescription>Payment methods, integrations & settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded border border-border">
                  Configuration details will be loaded from the backend. Enable Razorpay keys, email templates, Telegram bot settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded border border-border">
                  Recent actions and audit logs will be displayed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
