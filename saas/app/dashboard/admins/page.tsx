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
      await apiClient.post("/api/saas/admins", formData);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Access & Admins</h1>
          <p className="text-slate-400 mt-1">Manage platform administrators</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Admin
        </Button>
      </div>

      {/* Add Admin Form */}
      {showForm && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
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
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-200">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(role: any) => setFormData({ ...formData, role })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
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
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admins Table */}
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
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Role</TableHead>
                    <TableHead className="text-slate-300">Last Login</TableHead>
                    <TableHead className="text-right text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id} className="border-slate-800 hover:bg-slate-800/50 transition">
                      <TableCell className="text-white font-medium">{admin.name}</TableCell>
                      <TableCell className="text-slate-300">{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={admin.role === "superadmin" ? "bg-purple-600" : "bg-slate-600"}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Access & Admins</h1>
          <p className="text-gray-600 mt-2">Manage SaaS platform administrators and access control</p>
        </div>
        <Button className="gap-2" onClick={() => setShowInviteForm(!showInviteForm)}>
          <Plus className="w-4 h-4" />
          Invite Admin
        </Button>
      </div>

      {showInviteForm && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="support">Support Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              An invitation email will be sent to the user with setup instructions.
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Send Invitation</Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Admins</h2>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last login: {new Date(admin.last_login).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={roleColors[admin.role]}>
                  {admin.role === "superadmin" ? "Super Admin" : "Support Admin"}
                </Badge>
                {admin.role !== "superadmin" && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Super Admin</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Full platform access
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Manage all tenants
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Modify plans & billing
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Manage admins
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Platform settings
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Support Admin</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> View all tenants
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> Suspend/activate tenants
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span> View audit logs
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">✗</span> Modify plans
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">✗</span> Manage admins
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
