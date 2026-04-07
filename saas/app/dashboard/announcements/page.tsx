"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Announcement, CreateAnnouncementRequest } from "@/types";
import { Card, Button, Input, TextArea, Chip, Modal, Spinner, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: "",
    body: "",
    type: "info",
    severity: "low",
    target_roles: ["tenant_admin"],
  });

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: Announcement[] }>("/api/saas/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      toast.error("Failed to fetch announcement stream");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async () => {
    if (!formData.title || !formData.body) {
      toast.error("Announcement requires title and content");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/announcements", formData as any);
      toast.success("Broadcast deployed successfully");
      setIsModalOpen(false);
      setFormData({ title: "", body: "", type: "info", severity: "low", target_roles: ["tenant_admin"] });
      fetchAnnouncements();
    } catch (error) {
      toast.error("Deployment failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/saas/announcements/${id}`);
      toast.success("Announcement archived");
      fetchAnnouncements();
    } catch (error) {
      toast.error("Archive failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:megaphone-bold-duotone" className="text-3xl text-primary" />
             Announcements
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Broadcast platform-wide notifications and system alerts</p>
        </div>
        <Button 
          variant="primary" 
          className="font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          Create Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner color="accent" size="lg" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Streaming notifications...</p>
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
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50 shadow-sm", typeConfig[ann.type]?.bg)}>
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
                              <Chip variant="soft" size="sm" className="font-black text-[9px] uppercase tracking-wider h-5">Archived</Chip>
                            )}
                         </div>
                      </div>

                      <Dropdown>
                        <Dropdown.Trigger>
                           <Button isIconOnly variant="ghost" className="rounded-full h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon icon="solar:menu-dots-bold-duotone" className="text-lg opacity-60" />
                           </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[160px] bg-background border border-border shadow-xl rounded-2xl p-1">
                          <Dropdown.Menu onAction={(key) => {
                            if (key === "delete") handleDelete(ann._id);
                          }}>
                            <Dropdown.Item key="edit" id="edit" textValue="Edit" className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                               <Icon icon="solar:pen-new-square-bold-duotone" className="text-lg opacity-60" />
                               <span className="text-xs font-bold">Edit Content</span>
                            </Dropdown.Item>
                            <Dropdown.Item key="delete" id="delete" textValue="Archive" className="flex items-center gap-2 p-2 hover:bg-danger/10 text-danger rounded-lg mt-1">
                               <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                               <span className="text-xs font-bold">Archive Notice</span>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">{ann.body}</p>

                    <div className="flex flex-wrap items-center gap-4 border-t border-border/50 pt-4 mt-2">
                       <div className="flex items-center gap-1.5 min-w-[120px]">
                          <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-xs text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 truncate">Target: {ann.target_roles.join(", ")}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Icon icon="solar:clock-circle-bold-duotone" className="text-xs text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                             {ann.published_at ? `Published ${new Date(ann.published_at).toLocaleDateString()}` : `Created ${new Date(ann.created_at).toLocaleDateString()}`}
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

      <Modal>
        <Modal.Backdrop 
          isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)}
          variant="blur"
          className="bg-black/60"
        >
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-xl w-full flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 bg-default-50/50 border-b border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:megaphone-bold-duotone" className="text-2xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Broadcast Announcement</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Deploy a platform-wide notification</p>
                   </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Announcement Title</Label>
                      <Input
                        placeholder="System Maintenance, New Features, etc."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notice Body</Label>
                       <TextArea
                         placeholder="Detail the announcement here..."
                         value={formData.body}
                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, body: e.target.value })}
                         className="bg-default-100/50 border border-border/50 rounded-xl min-h-[100px]"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notice Type</Label>
                          <div className="flex p-1 bg-default-100/50 border border-border/50 rounded-xl gap-1">
                             {["info", "warning", "success"].map((type) => (
                               <button
                                 key={type}
                                 onClick={() => setFormData({ ...formData, type: type as any })}
                                 className={cn(
                                   "flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                   formData.type === type ? "bg-background text-accent shadow-sm" : "text-muted-foreground"
                                 )}
                               >
                                 {type}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Severity</Label>
                          <div className="flex p-1 bg-default-100/50 border border-border/50 rounded-xl gap-1">
                             {["low", "medium", "high"].map((sev) => (
                               <button
                                 key={sev}
                                 onClick={() => setFormData({ ...formData, severity: sev as any })}
                                 className={cn(
                                   "flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                   formData.severity === sev ? "bg-background text-accent shadow-sm" : "text-muted-foreground"
                                 )}
                               >
                                 {sev}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </Modal.Body>
              <Modal.Footer className="p-6 bg-default-50/50 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 font-bold rounded-xl h-11" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 font-bold rounded-xl h-11 shadow-lg shadow-accent/20" 
                  onClick={handleCreate}
                  isPending={isSaving}
                >
                  Deploy Notice
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

