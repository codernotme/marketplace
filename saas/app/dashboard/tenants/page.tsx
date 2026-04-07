"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Tenant, TenantListResponse } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Search, MoreVertical } from "lucide-react";
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
  deleted: "bg-slate-500/20 text-muted-foreground border-slate-500/30",
};

const planColors: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-muted text-foreground",
  pro: "bg-foreground text-background",
  enterprise: "bg-muted text-foreground",
};

export default function TenantsPage() {
  const router = useRouter();
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground mt-1">Manage marketplace shops and vendors</p>
        </div>
        <Link href="/dashboard/tenants/create">
          <Button className="w-full sm:w-auto bg-linear-to-r from-foreground to-muted-foreground hover:from-foreground/90 hover:to-muted-foreground/90 text-background">
            <Plus className="mr-2 w-4 h-4" />
            Create Tenant
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by shop name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-muted border-border text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value ?? "all");
              setPage(1);
            }}>
              <SelectTrigger className="w-40 bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-muted border-border">
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
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Shop Name</TableHead>
                    <TableHead className="text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-muted-foreground">Plan</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Orders</TableHead>
                    <TableHead className="text-muted-foreground">Revenue</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow
                      key={tenant._id}
                      className="border-border hover:bg-muted/50 transition"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{tenant.shop_name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.shop_slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-foreground">{tenant.owner_name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.owner_email}</p>
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
                      <TableCell className="text-foreground">{tenant.order_count ?? 0}</TableCell>
                      <TableCell className="text-foreground font-medium">
                        ${(tenant.revenue ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-muted border-border">
                            <DropdownMenuItem className="text-muted-foreground focus:bg-accent" onClick={() => router.push(`/dashboard/tenants/${tenant._id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-muted-foreground focus:bg-accent">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-orange-400 focus:bg-accent focus:text-orange-300">
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

