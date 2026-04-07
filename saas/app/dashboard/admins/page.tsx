"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { SaasAdmin, CreateAdminRequest } from "@/types";
import { Card, Button, Input, Chip, Modal, Spinner, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roleConfig: Record<string, { color: "success" | "accent" | "danger" | "warning" | "secondary" | "default", icon: string }> = {
  saas_admin: { color: "accent", icon: "solar:shield-star-bold-duotone" },
  support: { color: "primary" as any, icon: "solar:help-list-bold-duotone" },
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
    password: "",
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: SaasAdmin[] }>("/api/saas/admins");
      setAdmins(response.data);
    } catch (error) {
      toast.error("Failed to sync team database");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async () => {
    if (!formData.email || !formData.name || !formData.password) {
      toast.error("Please fill all mandatory fields");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.post("/api/saas/admins", formData as any);
      toast.success("Administrator access granted");
      handleCloseModal();
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to provision access");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/saas/admins/${id}`);
      toast.success("Access revoked");
      fetchAdmins();
    } catch (error) {
      toast.error("Revocation failed");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ email: "", name: "", role: "support", password: "" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:shield-user-bold-duotone" className="text-3xl text-primary" />
             Access & Admins
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Manage platform level administrators and support staff</p>
        </div>
        <Button
          variant="primary"
          className="font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          Add Admin
        </Button>
      </div>

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
                    <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Hydrating access stream...</p>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-default-100 flex items-center justify-center mx-auto mb-4 opacity-30">
                      <Icon icon="solar:user-bold-duotone" className="text-2xl" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground italic">No administrators found</p>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xs border border-accent/20 overflow-hidden shadow-sm">
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
                        color={admin.role === "saas_admin" ? "accent" : "default"}
                        className="font-black text-[9px] uppercase tracking-wider h-6 pr-2 shadow-sm"
                      >
                        <div className="flex items-center gap-1">
                          <Icon icon={roleConfig[admin.role]?.icon || "solar:user-bold-duotone"} className="text-xs" />
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
                        className="rounded-xl opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger mx-1 transition-all h-9 w-9 bg-background/50 border border-border shadow-sm"
                        onClick={() => handleDelete(admin._id)}
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
          onOpenChange={handleCloseModal}
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
                    <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Provision Access</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Assign platform level administrative access</p>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Role</Label>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className="w-full h-11 px-4 rounded-xl bg-default-100/50 border border-border/50 flex items-center justify-between text-xs font-bold transition-all hover:bg-default-100 outline-none">
                            <span className="capitalize">{formData.role}</span>
                            <Icon icon="solar:alt-arrow-down-bold-duotone" className="text-muted" />
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[160px] bg-background border border-border rounded-2xl shadow-xl p-1">
                          <Dropdown.Menu
                            onAction={(key) => setFormData({ ...formData, role: key as any })}
                          >
                            <Dropdown.Item key="saas_admin" id="saas_admin" textValue="saas_admin" className="rounded-lg p-2 hover:bg-muted">
                              <div className="flex items-center gap-2">
                                <Icon icon="solar:shield-star-bold-duotone" className="text-accent" />
                                <span className="text-xs font-bold">saas_admin</span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item key="support" id="support" textValue="Support" className="rounded-lg p-2 hover:bg-muted mt-1">
                              <div className="flex items-center gap-2">
                                <Icon icon="solar:help-list-bold-duotone" className="text-muted" />
                                <span className="text-xs font-bold">Support Staff</span>
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Master Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl h-11"
                    />
                    <p className="text-[9px] text-muted-foreground font-medium italic opacity-60 ml-1 leading-relaxed">Administrator will be required to update this on first login.</p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="p-6 bg-default-50/50 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 font-bold rounded-xl h-11" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 font-bold rounded-xl h-11 shadow-lg shadow-accent/20"
                  onClick={handleCreate}
                  isPending={isSaving}
                >
                  Provision Access
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

