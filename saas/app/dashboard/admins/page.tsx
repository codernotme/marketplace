"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { SaasAdmin, CreateAdminRequest } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Trash2 } from "lucide-react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<SaasAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateAdminRequest>({
    email: "",
    name: "",
    role: "support",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await apiClient.get<{ data: SaasAdmin[] }>("/api/saas/admins");
        setAdmins(response.data);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        // Mock data
        setAdmins([
          {
            _id: "admin_001",
            email: "superadmin@themrktplace.com",
            name: "Super Admin",
            role: "superadmin",
            last_login: new Date(Date.now() - 3600000).toISOString(),
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            _id: "admin_002",
            email: "support@themrktplace.com",
            name: "Support Team",
            role: "support",
            last_login: new Date(Date.now() - 7200000).toISOString(),
            created_at: "2024-01-15T00:00:00Z",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/saas/admins", { ...formData });
      // Refetch admins
      const response = await apiClient.get<{ data: SaasAdmin[] }>("/api/saas/admins");
      setAdmins(response.data);
      setFormData({ email: "", name: "", role: "support" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create admin:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Access & Admins</h1>
          <p className="text-muted-foreground mt-1">Manage platform administrators</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-linear-to-r from-foreground to-muted-foreground hover:from-foreground/90 hover:to-muted-foreground/90 text-background"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Admin
        </Button>
      </div>

      {/* Add Admin Form */}
      {showForm && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(role: any) => setFormData({ ...formData, role })}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Create Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admins Table */}
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
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Last Login</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id} className="border-border hover:bg-muted/50 transition">
                      <TableCell className="text-foreground font-medium">{admin.name}</TableCell>
                      <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={admin.role === "superadmin" ? "bg-foreground text-background" : "bg-muted text-foreground"}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {admin.last_login
                          ? new Date(admin.last_login).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

