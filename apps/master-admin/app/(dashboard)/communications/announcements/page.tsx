"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, SentIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { sendAnnouncement } from "@/app/actions/master";
import { db } from "@workspace/db"; // Note: In a real app we'd fetch via action
import { toast } from "sonner";
import { formatDateTime } from "@workspace/ui/lib/formatters";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetRoles: ["TENANT_OWNER", "TENANT_ADMIN"]
  });

  const handleSend = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await sendAnnouncement(formData);
      toast.success("Announcement broadcasted successfully!");
      setFormData({ title: "", content: "", targetRoles: ["TENANT_OWNER", "TENANT_ADMIN"] });
      // Reload logic would go here
    } catch (error) {
      toast.error("Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <PageHeader
        title="Platform Broadcasts"
        description="Send system-wide announcements to merchants and staff."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md rounded-[40px] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Compose Announcement</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest ml-1">Title</Label>
              <Input 
                placeholder="e.g. Scheduled Maintenance" 
                className="rounded-2xl border-none bg-muted/50 h-12"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest ml-1">Message Content</Label>
              <Textarea 
                placeholder="Describe the update or alert..." 
                className="rounded-3xl border-none bg-muted/50 min-h-[150px] p-4"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest ml-1">Target Audiences</Label>
              <div className="flex flex-wrap gap-4">
                {["TENANT_OWNER", "TENANT_ADMIN", "STAFF"].map(role => (
                  <div key={role} className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                    <Checkbox 
                      id={role} 
                      checked={formData.targetRoles.includes(role)}
                      onCheckedChange={(checked) => {
                        if (checked) setFormData({ ...formData, targetRoles: [...formData.targetRoles, role] });
                        else setFormData({ ...formData, targetRoles: formData.targetRoles.filter(r => r !== role) });
                      }}
                    />
                    <Label htmlFor={role} className="text-[10px] font-black uppercase tracking-tight cursor-pointer">{role.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSend} disabled={loading} className="w-full h-14 rounded-3xl font-black text-lg gap-3 mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
               <HugeiconsIcon icon={SentIcon} size={20} />
               {loading ? "Broadcasting..." : "Send Announcement"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-lg rounded-[40px] flex flex-col">
           <CardHeader className="p-8">
             <CardTitle className="text-xl font-black">Past Broadcasts</CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1">
             <div className="divide-y divide-border/40">
                {announcements.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                     <HugeiconsIcon icon={Notification01Icon} size={48} className="opacity-10" />
                     <p className="font-bold text-sm">No announcements sent yet</p>
                  </div>
                ) : (
                  announcements.map((ann, idx) => (
                    <div key={idx} className="p-8 hover:bg-muted/30 transition-all flex justify-between items-start group">
                      <div className="flex flex-col gap-2">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{ann.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{ann.content}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                          {formatDateTime(ann.createdAt)} • {ann.targetRole.length} Targets
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <HugeiconsIcon icon={Delete01Icon} size={16} />
                      </Button>
                    </div>
                  ))
                )}
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
