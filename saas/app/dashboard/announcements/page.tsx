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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Send platform-wide notifications to admins</p>
        </div>
        <Button className="w-full sm:w-auto bg-linear-to-r from-foreground to-muted-foreground hover:from-foreground/90 hover:to-muted-foreground/90 text-background">
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
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground">No announcements yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="border-border bg-card hover:border-border transition">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 mt-1">
                    {typeIcons[announcement.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`capitalize ${severityColors[announcement.severity]}`}>
                          {announcement.severity}
                        </Badge>
                        {!announcement.is_active && (
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">{announcement.content}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                    <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-muted border-border">
                      <DropdownMenuItem className="text-muted-foreground focus:bg-accent">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-orange-400 focus:bg-accent">
                        {announcement.is_active ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-accent">
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

