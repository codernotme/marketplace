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
  deleted: "bg-slate-500/20 text-slate-400",
};

const planColors: Record<string, string> = {
  free: "bg-slate-600",
  starter: "bg-blue-600",
  pro: "bg-orange-600",
  enterprise: "bg-purple-600",
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
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white">Tenant not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{tenant.shop_name}</h1>
          <p className="text-slate-400 mt-1">Tenant ID: {tenant._id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            Edit
          </Button>
          <Button variant="destructive">
            Suspend
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Plan</p>
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

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-white">{tenant.order_count}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-white">${tenant.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="border-b border-slate-800 bg-transparent">
          <TabsTrigger
            value="info"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            Information
          </TabsTrigger>
          <TabsTrigger
            value="config"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-4">Shop Details</h3>
                  <div>
                    <p className="text-sm text-slate-400">Shop Name</p>
                    <p className="text-white">{tenant.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Shop Slug</p>
                    <p className="text-white">{tenant.shop_slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Created At</p>
                    <p className="text-white">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-4">Owner Information</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {tenant.owner_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Name</p>
                      <p className="text-white">{tenant.owner_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="text-white">{tenant.owner_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="text-white">{tenant.owner_phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Tenant Configuration</CardTitle>
              <CardDescription>Payment methods, integrations & settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-400 p-4 bg-slate-800 rounded border border-slate-700">
                  Configuration details will be loaded from the backend. Enable Razorpay keys, email templates, Telegram bot settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-400 p-4 bg-slate-800 rounded border border-slate-700">
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
