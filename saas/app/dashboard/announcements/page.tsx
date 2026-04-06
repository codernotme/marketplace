"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Announcement } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Plus, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
};

const severityColors: Record<string, string> = {
  low: "bg-blue-500/20 text-blue-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-red-500/20 text-red-400",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await apiClient.get<{ data: Announcement[] }>("/api/saas/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        // Mock data
        setAnnouncements([
          {
            _id: "ann_001",
            title: "Maintenance Window",
            content: "Scheduled maintenance on Friday 2:00 AM UTC",
            type: "warning",
            severity: "high",
            target_roles: ["superadmin", "support"],
            is_active: true,
            published_at: "2024-04-01T00:00:00Z",
            created_at: "2024-04-01T00:00:00Z",
            updated_at: "2024-04-01T00:00:00Z",
          },
          {
            _id: "ann_002",
            title: "New Features Released",
            content: "Check out our new advanced analytics dashboard",
            type: "success",
            severity: "low",
            target_roles: ["superadmin"],
            is_active: true,
            published_at: "2024-03-28T00:00:00Z",
            created_at: "2024-03-28T00:00:00Z",
            updated_at: "2024-03-28T00:00:00Z",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          <p className="text-slate-400 mt-1">Send platform-wide notifications to admins</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
          <Plus className="mr-2 w-4 h-4" />
          Create Announcement
        </Button>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : announcements.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-white">No announcements yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="border-slate-800 bg-slate-900 hover:border-slate-700 transition">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {typeIcons[announcement.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`capitalize ${severityColors[announcement.severity]}`}>
                          {announcement.severity}
                        </Badge>
                        {!announcement.is_active && (
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 mb-3">{announcement.content}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Target: {announcement.target_roles.join(", ")}</span>
                      <span>•</span>
                      <span>
                        Published:
                        {announcement.published_at
                          ? new Date(announcement.published_at).toLocaleDateString()
                          : "Not published"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-orange-400 focus:bg-slate-700">
                        {announcement.is_active ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-slate-700">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

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
