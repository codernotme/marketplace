"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card, Button, Input, Chip, Modal, Dropdown, Spinner, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GlobalUser {
  _id: string;
  tenant_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

const roleConfig: Record<string, { label: string, color: "accent" | "default" | "success" | "warning" | "danger" }> = {
  customer: { label: "Customer", color: "default" },
  vendor: { label: "Vendor", color: "accent" },
  shop_admin: { label: "Shop Admin", color: "accent" },
  saas_admin: { label: "Platform Admin", color: "warning" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ 
        role: roleFilter !== 'all' ? roleFilter : '' 
      });
      const response = await apiClient.get<{ data: GlobalUser[] }>(`/api/saas/users?${params.toString()}`);
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load platform users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const target = users.find((u) => u._id === userId);
      await apiClient.patch(`/api/saas/users/${userId}/status`, {
        is_active: !currentStatus,
        tenant_id: target?.tenant_id,
      });
      setUsers(users.map((u) => (u._id === userId ? { ...u, is_active: !currentStatus } : u)));
      toast.success(currentStatus ? "User suspended securely" : "User restored successfully");
    } catch (error) {
      toast.error("Failed to modify user state");
    }
  };

  const handleInspect = (user: GlobalUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const totalSpentAll = users.reduce((sum, u) => sum + (u.total_spent || 0), 0);
  const activeAdmins = users.filter(u => u.role.includes("admin")).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:users-group-rounded-bold-duotone" className="text-3xl text-primary" />
             Global Users
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Cross-tenant planetary consumer index</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="font-bold gap-2">
             <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
             Export Index
           </Button>
           <Button variant="primary" className="font-bold gap-2 shadow-lg shadow-primary/20">
             <Icon icon="solar:user-plus-bold-duotone" className="text-lg" />
             Invite User
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Platform Users", value: users.length, icon: "solar:users-group-two-rounded-bold-duotone", color: "text-primary", bg: "bg-primary/10" },
          { label: "Active Admins", value: activeAdmins, icon: "solar:shield-keyhole-bold-duotone", color: "text-warning", bg: "bg-warning/10" },
          { label: "Consumer LTV", value: `$${totalSpentAll.toLocaleString()}`, icon: "solar:wad-of-money-bold-duotone", color: "text-success", bg: "bg-success/10" },
          { label: "Suspended Accounts", value: users.filter(u => !u.is_active).length, icon: "solar:shield-warning-bold-duotone", color: "text-danger", bg: "bg-danger/10" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border bg-surface shadow-sm">
            <div className="p-4 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110", stat.bg, stat.color)}>
                <Icon icon={stat.icon} className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-surface border border-border p-3 rounded-2xl shadow-sm">
         <div className="max-w-md w-full bg-default-100/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center px-3 h-11 border border-border/50">
           <Icon icon="solar:magnifer-linear" className="text-default-400" width={18} />
           <Input
             placeholder="Search consumers by name or email..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="flex-1 bg-transparent border-none shadow-none focus:ring-0 text-sm ml-2 h-full"
           />
         </div>
         <div className="flex bg-default-100/50 border border-border/50 rounded-xl p-1 gap-1 h-11 w-full sm:w-auto">
           {["all", "customer", "shop_admin", "saas_admin"].map((r) => (
             <button
               key={r}
               onClick={() => setRoleFilter(r)}
               className={cn(
                 "px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 roleFilter === r ? "bg-background text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:bg-default-200/50"
               )}
             >
               {r === "all" ? "All Roles" : roleConfig[r]?.label || r}
             </button>
           ))}
         </div>
      </div>

      {/* Table */}
      <Card className="border border-border bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm relative">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Consumer Identity</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tenant Scope</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Access Privilege</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Platform History</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <Spinner color="accent" />
                      <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Querying Global Matrix...</p>
                   </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-muted-foreground italic text-sm">
                      No identities correlate with the current filters.
                   </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-default-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border shadow-sm",
                           u.is_active ? "bg-primary/10 text-primary border-primary/20" : "bg-default-100 text-muted-foreground border-border"
                         )}>
                            {u.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                           <span className={cn("font-bold text-sm", !u.is_active && "text-muted-foreground line-through opacity-70")}>{u.name}</span>
                           <span className="text-[10px] text-muted-foreground font-mono">{u.email}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-80">
                         {u.tenant_id === "sys_global" ? (
                           <Chip variant="soft" color="warning" size="sm" className="font-black text-[9px] uppercase tracking-wider h-5">GLOBAL NODE</Chip>
                         ) : (
                           <code className="text-xs font-mono text-muted-foreground">{u.tenant_id.substring(0, 8)}...</code>
                         )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Chip 
                        variant="soft" 
                        color={roleConfig[u.role]?.color || "default"}
                        className="font-black text-[10px] uppercase tracking-wider h-6 border uppercase"
                      >
                         {roleConfig[u.role]?.label || u.role}
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground">
                          {u.total_orders} Orders
                        </span>
                        <span className="text-[10px] text-accent font-black tracking-widest">${u.total_spent.toLocaleString()} LTV</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-1.5">
                          <div className={cn("w-2 h-2 rounded-full", u.is_active ? "bg-success" : "bg-danger")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", u.is_active ? "text-success" : "text-danger")}>
                            {u.is_active ? 'Active' : 'Suspended'}
                          </span>
                       </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Dropdown>
                          <Dropdown.Trigger>
                             <Button variant="ghost" isIconOnly className="h-8 w-8 rounded-lg opacity-40 group-hover:opacity-100">
                               <Icon icon="solar:menu-dots-bold-duotone" className="text-lg" />
                             </Button>
                          </Dropdown.Trigger>
                          <Dropdown.Popover className="min-w-[180px] bg-background border border-border shadow-xl rounded-2xl p-1">
                            <Dropdown.Menu onAction={(key) => {
                              if (key === "inspect") handleInspect(u);
                              if (key === "suspend") toggleUserStatus(u._id, u.is_active);
                            }}>
                               <Dropdown.Item key="inspect" textValue="Inspect Identity" className="p-2 gap-2 flex items-center hover:bg-muted rounded-lg">
                                 <Icon icon="solar:user-id-bold-duotone" className="text-lg opacity-60" />
                                 <span className="text-xs font-bold">Inspect Identity</span>
                               </Dropdown.Item>
                               <Dropdown.Item key="password" textValue="Reset Password" className="p-2 gap-2 flex items-center hover:bg-muted rounded-lg">
                                 <Icon icon="solar:key-minimalistic-square-bold-duotone" className="text-lg opacity-60" />
                                 <span className="text-xs font-bold">Trigger Reset</span>
                               </Dropdown.Item>
                               <Dropdown.Item 
                                 key="suspend" 
                                 textValue={u.is_active ? "Suspend Consumer" : "Restore Consumer"}
                                 className={cn(
                                   "p-2 gap-2 flex items-center rounded-lg mt-1",
                                   u.is_active ? "hover:bg-danger/10 text-danger" : "hover:bg-success/10 text-success"
                                 )}
                               >
                                 <Icon icon={u.is_active ? "solar:shield-cross-bold-duotone" : "solar:shield-check-bold-duotone"} className="text-lg" />
                                 <span className="text-xs font-bold">{u.is_active ? "Suspend Consumer" : "Restore Consumer"}</span>
                               </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                       </Dropdown>
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
            <Modal.Dialog className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-xl w-full flex flex-col">
              {selectedUser && (
                <>
                  <div className="p-8 border-b border-border bg-default-50/50 flex flex-col items-center justify-center text-center">
                     <div className={cn(
                       "w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl mb-4 shadow-xl",
                       selectedUser.is_active ? "bg-primary text-primary-foreground" : "bg-danger text-danger-foreground mx-auto"
                     )}>
                        {selectedUser.name.substring(0, 2).toUpperCase()}
                     </div>
                     <h3 className="text-2xl font-black tracking-tight mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{selectedUser.name}</h3>
                     <p className="text-sm font-mono text-muted-foreground opacity-80">{selectedUser.email}</p>
                     
                     <div className="flex items-center gap-2 mt-4">
                       <Chip variant="soft" color={roleConfig[selectedUser.role]?.color || "default"} className="font-black text-[10px] uppercase tracking-widest px-3 border border-border/50">
                          {roleConfig[selectedUser.role]?.label || selectedUser.role}
                       </Chip>
                       {!selectedUser.is_active && (
                         <Chip color="danger" className="font-black text-[10px] uppercase tracking-widest px-3">SUSPENDED</Chip>
                       )}
                     </div>
                  </div>
                  <div className="p-6 bg-background space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-border bg-surface">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Lifetime Value</p>
                           <p className="text-xl font-bold text-accent">${selectedUser.total_spent.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-border bg-surface">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order Volume</p>
                           <p className="text-xl font-bold">{selectedUser.total_orders}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-default-100/50">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Initialization Date</span>
                           <span className="text-sm font-bold text-foreground">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-default-100/50">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Origin Node (Tenant)</span>
                           <code className="text-xs text-muted-foreground">{selectedUser.tenant_id}</code>
                        </div>
                     </div>
                  </div>
                  <div className="p-6 border-t border-border bg-default-50/50 flex gap-3">
                    <Button variant="outline" className="flex-1 font-bold rounded-xl h-12" onClick={() => setIsModalOpen(false)}>
                      Dismiss Analysis
                    </Button>
                    <Button 
                      variant={selectedUser.is_active ? "danger" : "outline"}
                      className={cn("flex-1 font-bold rounded-xl h-12 shadow-lg", selectedUser.is_active ? "shadow-danger/20 text-white" : "bg-success text-white")}
                      onClick={() => {
                        toggleUserStatus(selectedUser._id, selectedUser.is_active);
                        setIsModalOpen(false);
                      }}
                    >
                      {selectedUser.is_active ? "Suspend Entity" : "Restore Access"}
                    </Button>
                  </div>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
