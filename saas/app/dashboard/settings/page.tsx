"use client";

import { useState } from "react";
import { Card, Button, Input, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    platform_name: "theMrktPlace",
    platform_email: "no-reply@themrktplace.com",
    support_email: "support@themrktplace.com",
    webhook_secret: "whk_test_1234567890",
    enable_new_signups: true,
    max_free_products: 5,
    enable_email_notifications: true,
    enable_sms_notifications: false,
  });

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "solar:globus-bold-duotone" },
    { id: "email", label: "Notifications", icon: "solar:letter-bold-duotone" },
    { id: "security", label: "Security", icon: "solar:shield-keyhole-bold-duotone" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
             <Icon icon="solar:settings-bold-duotone" className="text-3xl text-primary" />
             Platform Settings
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 ml-10">Global architecture controls and system-wide configurations</p>
        </div>
        <Button variant="primary" className="font-bold gap-2 shadow-lg shadow-accent/20" onClick={handleSave}>
          <Icon icon="solar:diskette-bold-duotone" className="text-lg" />
          Save Changes
        </Button>
      </div>

      <div className="w-full">
        <div className="flex gap-6 relative rounded-none p-0 border-b border-border/50 h-12 mb-6 bg-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-0 h-full font-black tracking-widest uppercase text-[10px] flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent outline-none",
                activeTab === tab.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon icon={tab.icon} className="text-sm" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="border border-border bg-surface shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-default-50/50">
                <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>General Architecture</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">Identity and platform defaults</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Name</label>
                    <Input
                      value={settings.platform_name}
                      onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Free Tier Product Limit</label>
                    <Input
                      type="number"
                      value={settings.max_free_products.toString()}
                      onChange={(e) => setSettings({ ...settings, max_free_products: Number(e.target.value) })}
                      className="bg-default-100/50 border border-border/50 rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-default-100/30 border border-border/50 flex items-center justify-between transition-all hover:bg-default-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon icon="solar:user-plus-bold-duotone" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">New Registrations</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Allow public tenant signup stream</p>
                    </div>
                  </div>
                  <Switch
                    isSelected={settings.enable_new_signups}
                    onChange={(checked) => setSettings({ ...settings, enable_new_signups: checked as unknown as boolean })}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "email" && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="border border-border bg-surface shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-default-50/50">
                <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Communications Engine</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">Outbound email and SMS configuration</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Outbound Email</label>
                    <Input
                      type="email"
                      value={settings.platform_email}
                      onChange={(e) => setSettings({ ...settings, platform_email: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Support Escalation Email</label>
                    <Input
                      type="email"
                      value={settings.support_email}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                      className="bg-default-100/50 border border-border/50 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-default-100/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:letter-opened-bold-duotone" className="text-lg text-muted-foreground" />
                      <span className="text-sm font-bold">Email Alerts</span>
                    </div>
                    <Switch
                      isSelected={settings.enable_email_notifications}
                      onChange={(checked) => setSettings({ ...settings, enable_email_notifications: checked as unknown as boolean })}
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-default-100/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:iphone-bold-duotone" className="text-lg text-muted-foreground" />
                      <span className="text-sm font-bold">SMS Gateways</span>
                    </div>
                    <Switch
                      isSelected={settings.enable_sms_notifications}
                      onChange={(checked) => setSettings({ ...settings, enable_sms_notifications: checked as unknown as boolean })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "security" && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="border border-border bg-surface shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-default-50/50">
                <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Security Perimeters</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">API encryption and webhook signatures</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Global Webhook Secret</label>
                  <div className="flex gap-3">
                    <Input
                      value={settings.webhook_secret}
                      readOnly
                      className="flex-1 bg-default-100/50 border border-border/50 rounded-xl font-mono text-xs"
                    />
                    <Button variant="outline" className="font-bold border-border rounded-xl px-6">
                      Rotate Key
                    </Button>
                  </div>
                  <p className="px-1 text-[10px] text-muted-foreground font-medium italic">
                    Note: This secret is required to verify the authenticity of webhook events arriving from the platform engine.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-danger/5 border border-danger/20 flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                    <Icon icon="solar:danger-triangle-bold-duotone" className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-danger tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Hardened Protocol Notice</p>
                    <p className="text-xs text-danger/70 mt-1 font-medium leading-relaxed">
                      Exposing your webhook secret allows unauthorized entities to spoof platform events.
                      Always store secrets in high-security environment variables.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

