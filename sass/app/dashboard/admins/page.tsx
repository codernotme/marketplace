"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { admins } from "@/lib/data/admins";
import { Plus, Trash2, Shield } from "lucide-react";

const roleColors = {
  superadmin: "bg-purple-100 text-purple-800",
  support: "bg-blue-100 text-blue-800",
};

export default function AdminsPage() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "support" as "superadmin" | "support",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inviting admin:", formData);
    alert("Invitation sent! (This is a demo)");
    setShowInviteForm(false);
  };

  return (
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
