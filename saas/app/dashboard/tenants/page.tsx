"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Tenant, TenantListResponse } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  suspended: "bg-red-500/20 text-red-400 border-red-500/30",
  deleted: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const planColors: Record<string, string> = {
  free: "bg-slate-600",
  starter: "bg-blue-600",
  pro: "bg-orange-600",
  enterprise: "bg-purple-600",
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        });
        const data = await apiClient.get<TenantListResponse>(
          `/api/saas/tenants?${params.toString()}`
        );
        setTenants(data.data);
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        // Use mock data
        setTenants([
          {
            _id: "tenant_001",
            shop_name: "TechHub Store",
            shop_slug: "techhub-store",
            owner_name: "John Doe",
            owner_email: "john@techhub.com",
            owner_phone: "+1-234-567-8900",
            status: "active",
            plan: "pro",
            onboarding_step: 5,
            onboarding_complete: true,
            created_at: "2024-01-10T08:00:00Z",
            order_count: 1240,
            revenue: 45680,
          },
          {
            _id: "tenant_002",
            shop_name: "Fashion Boutique",
            shop_slug: "fashion-boutique",
            owner_name: "Sarah Williams",
            owner_email: "sarah@fashionboutique.com",
            owner_phone: "+1-234-567-8901",
            status: "active",
            plan: "starter",
            onboarding_step: 5,
            onboarding_complete: true,
            created_at: "2024-02-15T10:00:00Z",
            order_count: 580,
            revenue: 18920,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [search, statusFilter, page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tenants</h1>
          <p className="text-slate-400 mt-1">Manage marketplace shops and vendors</p>
        </div>
        <Link href="/dashboard/tenants/create">
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            <Plus className="mr-2 w-4 h-4" />
            Create Tenant
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by shop name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Shop Name</TableHead>
                    <TableHead className="text-slate-300">Owner</TableHead>
                    <TableHead className="text-slate-300">Plan</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Orders</TableHead>
                    <TableHead className="text-slate-300">Revenue</TableHead>
                    <TableHead className="text-right text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow
                      key={tenant._id}
                      className="border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{tenant.shop_name}</p>
                          <p className="text-xs text-slate-400">{tenant.shop_slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{tenant.owner_name}</p>
                          <p className="text-xs text-slate-400">{tenant.owner_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${planColors[tenant.plan]}`}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize border ${statusColors[tenant.status]}`}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{tenant.order_count}</TableCell>
                      <TableCell className="text-white font-medium">
                        ${tenant.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-700">
                              <Link href={`/dashboard/tenants/${tenant._id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-orange-400 focus:bg-slate-700 focus:text-orange-300">
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

      <TenantList />
    </div>
  );
}
