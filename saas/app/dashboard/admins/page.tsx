"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { SaasAdmin, CreateAdminRequest } from "@/types";
import { Card, Button, Input, InputGroup, Chip, Modal, Spinner, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const roleConfig: Record<string, { color: "success" | "accent" | "danger" | "warning" | "secondary" | "default", icon: string }> = {
  superadmin: { color: "accent", icon: "solar:shield-star-bold-duotone" },
  support: { color: "primary" as any, icon: "solar:help-list-bold-duotone" }, // Fallback for primary/accent
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<SaasAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleAddAdmin = async () => {
    if (!formData.email || !formData.name) return;
    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/admins", { ...formData });
      const response = await apiClient.get<{ data: SaasAdmin[] }>("/api/saas/admins");
      setAdmins(response.data);
      setFormData({ email: "", name: "", role: "support" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create admin:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this administrator?")) return;
    try {
      await apiClient.delete(`/api/saas/admins/${id}`);
      setAdmins(admins.filter(a => a._id !== id));
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Access & Admins"
        subtitle="Manage platform level administrators and support staff"
        icon="solar:shield-user-bold-duotone"
        actions={
          <Button 
            variant="primary" 
            className="font-bold gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
            Add Admin
          </Button>
        }
      />

      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Administrator</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Contact</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Permission Role</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Last Active</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <Spinner color="accent" />
                      <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Hydrating access stream...</p>
                   </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-muted-foreground italic text-sm">
                      No administrators found. Create one to get started.
                   </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xs border border-accent/20 overflow-hidden">
                            <span className="font-black">{admin.name.substring(0, 2).toUpperCase()}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-xs">{admin.name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium opacity-60">ID: {admin._id}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-80">
                         <Icon icon="solar:letter-bold-duotone" className="text-xs text-muted-foreground" />
                         <span className="text-xs font-medium">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={admin.role === "superadmin" ? "accent" : "default"}
                        className="font-black text-[10px] uppercase tracking-wider h-6 pr-2"
                      >
                        <div className="flex items-center gap-1">
                          <Icon icon={roleConfig[admin.role]?.icon || "solar:user-bold-duotone"} />
                          {admin.role}
                        </div>
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">
                          {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : "Never"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium opacity-60">
                          {admin.last_login ? new Date(admin.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No activity"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Button 
                        variant="ghost" 
                        isIconOnly 
                        className="rounded-full opacity-60 hover:opacity-100 hover:bg-danger/10 hover:text-danger transition-all h-8 w-8"
                        onClick={() => deleteAdmin(admin._id)}
                       >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal>
        <Modal.Backdrop 
          isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)}
          variant="blur"
          className="bg-black/60"
        >
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-lg w-full flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 bg-default-50/50 border-b border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:user-plus-bold-duotone" className="text-2xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Add Administrator</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Assign platform level access</p>
                   </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <Input
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="name@themrktplace.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Role</Label>
                    <Dropdown>
                      <Dropdown.Trigger>
                        <button className="w-full h-11 px-4 rounded-xl bg-default-100/50 border border-border/50 flex items-center justify-between text-sm font-bold transition-all hover:bg-default-100 outline-none">
                          <span className="capitalize">{formData.role}</span>
                          <Icon icon="solar:alt-arrow-down-bold-duotone" className="text-muted" />
                        </button>
                      </Dropdown.Trigger>
                      <Dropdown.Popover className="min-w-[200px]">
                        <Dropdown.Menu 
                          onSelectionChange={(keys: any) => setFormData({ ...formData, role: Array.from(keys)[0] as any })} 
                          selectionMode="single" 
                          selectedKeys={new Set([formData.role])}
                        >
                           <Dropdown.Item key="superadmin" id="superadmin" textValue="Superadmin">
                              <div className="flex items-center gap-2">
                                 <Icon icon="solar:shield-star-bold-duotone" className="text-accent" />
                                 <span className="font-bold">Superadmin</span>
                              </div>
                           </Dropdown.Item>
                           <Dropdown.Item key="support" id="support" textValue="Support">
                              <div className="flex items-center gap-2">
                                 <Icon icon="solar:help-list-bold-duotone" className="text-muted" />
                                 <span className="font-bold">Support</span>
                              </div>
                           </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
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
                  onClick={handleAddAdmin}
                  isPending={isSaving}
                >
                  Create Admin
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

