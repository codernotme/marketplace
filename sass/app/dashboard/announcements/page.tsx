"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { announcements } from "@/lib/data/announcements";
import { admins } from "@/lib/data/admins";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  maintenance: "bg-red-100 text-red-800",
  feature: "bg-green-100 text-green-800",
};

export default function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "info" as const,
    visible_to: "all" as const,
  });

  const getAdminName = (adminId: string) => {
    return admins.find((a) => a.id === adminId)?.name || "Unknown";
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating announcement:", formData);
    alert("Announcement published! (This is a demo)");
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Platform-wide announcements and notifications</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Announcement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                placeholder="Announcement message"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="feature">Feature</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Visible To *</label>
                <select
                  value={formData.visible_to}
                  onChange={(e) => setFormData({ ...formData, visible_to: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Tenants</option>
                  <option value="plan:pro">Pro & Enterprise</option>
                  <option value="plan:enterprise">Enterprise Only</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Publish Announcement</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className={`p-6 ${isExpired(ann.expires_at) ? "bg-gray-50 opacity-60" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ann.title}</h3>
                  <Badge className={typeColors[ann.type]}>
                    {ann.type.charAt(0).toUpperCase() + ann.type.slice(1)}
                  </Badge>
                  {isExpired(ann.expires_at) && (
                    <Badge variant="outline">Expired</Badge>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{ann.body}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <span>Published: {new Date(ann.published_at).toLocaleDateString()}</span>
                  {ann.expires_at && (
                    <span>Expires: {new Date(ann.expires_at).toLocaleDateString()}</span>
                  )}
                  <span>Visible to: {ann.visible_to === "all" ? "All Tenants" : ann.visible_to}</span>
                  <span>By: {getAdminName(ann.created_by)}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
