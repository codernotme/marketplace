"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Announcement } from "@/types";
import { Card, Button, Chip, Dropdown, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { color: "primary" | "warning" | "success" | "danger" | "default", icon: string, bg: string }> = {
  info: { color: "primary", icon: "solar:info-circle-bold-duotone", bg: "bg-primary/10" },
  warning: { color: "warning", icon: "solar:danger-triangle-bold-duotone", bg: "bg-warning/10" },
  success: { color: "success", icon: "solar:check-circle-bold-duotone", bg: "bg-success/10" },
};

const severityConfig: Record<string, { color: "default" | "warning" | "danger" }> = {
  low: { color: "default" },
  medium: { color: "warning" },
  high: { color: "danger" },
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
            content: "Scheduled maintenance on Friday 2:00 AM UTC. We expect approximately 15 minutes of downtime.",
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
            content: "Check out our new advanced analytics dashboard with real-time reporting.",
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Announcements"
        subtitle="Broadcast platform-wide notifications and system alerts"
        icon="solar:megaphone-bold-duotone"
        actions={
          <Button variant="primary" className="font-bold gap-2">
            <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
            Create Announcement
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner color="accent" size="lg" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Streaming notifications...</p>
        </div>
      ) : announcements.length === 0 ? (
        <Card className="border border-border bg-surface p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-default-100 flex items-center justify-center mx-auto mb-4 opacity-50">
             <Icon icon="solar:letter-opened-bold-duotone" className="text-3xl text-muted-foreground" />
          </div>
          <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Silence is Golden</h3>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic">No active announcements at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((ann) => (
            <Card key={ann._id} className="border border-border bg-surface hover:border-accent/40 transition-all duration-300 shadow-sm group">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50", typeConfig[ann.type]?.bg)}>
                    <Icon icon={typeConfig[ann.type]?.icon} className={cn("text-2xl", `text-${typeConfig[ann.type]?.color}`)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                         <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{ann.title}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <Chip 
                              variant="soft" 
                              size="sm" 
                              color={severityConfig[ann.severity]?.color as any}
                              className="font-black text-[9px] uppercase tracking-wider h-5"
                            >
                              {ann.severity} Priority
                            </Chip>
                            {!ann.is_active && (
                              <Chip variant="soft" size="sm" className="font-black text-[9px] uppercase tracking-wider h-5">Draft</Chip>
                            )}
                         </div>
                      </div>

                      <Dropdown>
                        <Dropdown.Trigger>
                           <Button isIconOnly variant="ghost" className="rounded-full h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon icon="solar:menu-dots-bold-duotone" className="text-lg opacity-60" />
                           </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[160px]">
                          <Dropdown.Menu>
                            <Dropdown.Item key="edit" id="edit" textValue="Edit">
                               <div className="flex items-center gap-2">
                                  <Icon icon="solar:pen-new-square-bold-duotone" className="text-muted" />
                                  <span className="font-bold">Edit</span>
                               </div>
                            </Dropdown.Item>
                            <Dropdown.Item 
                              key="status" 
                              id="status" 
                              textValue={ann.is_active ? "Unpublish" : "Publish"}
                              className={ann.is_active ? "text-warning" : "text-success"}
                            >
                               <div className="flex items-center gap-2">
                                  <Icon icon={ann.is_active ? "solar:shield-warning-bold-duotone" : "solar:check-circle-bold-duotone"} />
                                  <span className="font-bold">{ann.is_active ? "Unpublish" : "Publish"}</span>
                               </div>
                            </Dropdown.Item>
                            <Dropdown.Item key="delete" id="delete" textValue="Delete" className="text-danger">
                               <div className="flex items-center gap-2">
                                  <Icon icon="solar:trash-bin-trash-bold-duotone" />
                                  <span className="font-bold">Delete</span>
                               </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">{ann.content}</p>

                    <div className="flex flex-wrap items-center gap-4 border-t border-border/50 pt-4 mt-2">
                       <div className="flex items-center gap-1.5 min-w-[120px]">
                          <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-xs text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 truncate">Target: {ann.target_roles.join(", ")}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Icon icon="solar:clock-circle-bold-duotone" className="text-xs text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                             {ann.published_at ? `Published ${new Date(ann.published_at).toLocaleDateString()}` : "Unpublished Draft"}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

