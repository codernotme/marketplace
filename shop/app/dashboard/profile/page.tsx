"use client";

import { useState } from "react";
import { Button, Input, Card, Separator, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminUser } from "@/lib/mock-data";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
        icon="solar:user-circle-bold-duotone"
        actions={
          <Button
            variant={isEditing ? "primary" : "secondary"}
            onPress={() => setIsEditing(!isEditing)}
            className="font-bold gap-2"
          >
            <Icon icon={isEditing ? "solar:check-read-bold-duotone" : "solar:pen-bold-duotone"} className="text-xl" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 bg-surface border border-border shadow-xl rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-surface shadow-2xl relative z-10">
                <img src={adminUser.avatar} alt={adminUser.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
              </div>
              <div className="absolute -inset-2 bg-accent/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-accent text-white rounded-xl shadow-lg flex items-center justify-center z-20 hover:scale-110 active:scale-95 transition-all">
                  <Icon icon="solar:camera-bold-duotone" className="text-xl" />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{adminUser.name}</h2>
            <p className="text-accent font-bold text-sm uppercase tracking-widest mt-1">{adminUser.role}</p>
            <p className="text-muted text-xs mt-4">Member since June 2025</p>

            <Separator className="my-6 opacity-50" />

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted font-medium">Account Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted font-medium">Last Login</span>
                <span className="text-foreground font-bold" suppressHydrationWarning>
                  {new Date(adminUser.lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Icon icon="solar:shield-check-bold-duotone" className="text-accent text-lg" />
              Security Strength
            </h3>
            <div className="space-y-4">
              <div className="h-2 bg-default/40 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-accent to-violet-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              </div>
              <p className="text-[11px] text-muted leading-relaxed font-medium">
                Your account is highly secure. Consider enabling 2FA for maximum protection.
              </p>
              <Button size="sm" variant="secondary" className="w-full font-bold h-10 rounded-xl">Enable 2FA</Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Details & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
              <Icon icon="solar:settings-minimalistic-bold-duotone" className="text-accent text-2xl" />
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <Icon icon="solar:user-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-default/40 border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Icon icon="solar:letter-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-default/40 border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative group">
                  <Icon icon="solar:lock-password-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    disabled={!isEditing}
                    value="••••••••••••"
                    className="w-full bg-default/40 border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 disabled:opacity-60 transition-all"
                  />
                  {isEditing && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Change</button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Display Role</label>
                <div className="relative group">
                  <Icon icon="solar:tag-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    disabled
                    value={formData.role.toUpperCase()}
                    className="w-full bg-default/20 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-black text-muted outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
              <Icon icon="solar:notification-lines-remove-bold-duotone" className="text-accent text-2xl" />
              Notifications
            </h3>

            <div className="space-y-6">
              {[
                { label: "New Order Alerts", desc: "Get notified when a customer places a new order", active: true },
                { label: "Low Stock Warnings", desc: "Alerts when products fall below threshold", active: true },
                { label: "Weekly Sales Report", desc: "Detailed summary of your store's performance", active: false },
                { label: "Customer Support Tickets", desc: "Notifications for new support inquiries", active: true },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between group">
                  <div className="pr-10">
                    <p className="font-bold text-sm tracking-tight group-hover:text-accent transition-colors">{pref.label}</p>
                    <p className="text-xs text-muted mt-0.5">{pref.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full relative transition-colors ${pref.active ? "bg-accent" : "bg-default"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.active ? "left-7 shadow-sm" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="danger" className="font-bold px-8 rounded-2xl py-6 h-auto bg-danger/5 hover:bg-danger/10 border border-danger/20 text-danger">
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
