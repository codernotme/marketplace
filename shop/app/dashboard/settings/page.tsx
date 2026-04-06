"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/lib/mock-data";
import { teamMembers, emailTemplates } from "@/lib/mock-data";

const TABS = [
  { key: "general", label: "General", icon: "solar:info-circle-bold-duotone" },
  { key: "team", label: "Team", icon: "solar:users-group-rounded-bold-duotone" },
  { key: "emails", label: "Emails", icon: "solar:letter-bold-duotone" },
  { key: "payments", label: "Payments", icon: "solar:card-bold-duotone" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [config, setConfig] = useState(siteConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Manage your store configuration"
        icon="solar:settings-minimalistic-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2" onPress={handleSave}>
            <Icon icon={saved ? "solar:check-circle-bold-duotone" : "solar:floppy-disk-bold-duotone"} className="text-base" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="flex md:flex-col gap-1 p-1 bg-surface border border-border rounded-2xl md:w-48 h-fit md:flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 md:flex-none ${
                activeTab === tab.key ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-default/60"
              }`}
            >
              <Icon icon={tab.icon} className="text-base flex-shrink-0" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-5">
              <div>
                <h3 className="font-bold text-base mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Store Name", key: "name" },
                    { label: "Tagline", key: "tagline" },
                    { label: "Contact Email", key: "contactEmail" },
                    { label: "Phone", key: "phone" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{f.label}</label>
                      <input
                        type="text"
                        value={config[f.key as keyof typeof config] as string}
                        onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                        className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Address</label>
                    <input
                      type="text"
                      value={config.address}
                      onChange={(e) => setConfig({ ...config, address: e.target.value })}
                      className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-sm mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(config.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{platform}</label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setConfig({ ...config, socialLinks: { ...config.socialLinks, [platform]: e.target.value } })}
                        className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Team Members</h3>
                  <p className="text-xs text-muted">{teamMembers.length} members</p>
                </div>
                <Button variant="primary" size="sm" className="gap-2">
                  <Icon icon="solar:user-plus-bold-duotone" className="text-base" />
                  Invite Member
                </Button>
              </div>
              <div className="divide-y divide-border">
                {teamMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-muted">{m.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                      m.role === "admin" ? "bg-accent/10 text-accent" :
                      m.role === "manager" ? "bg-violet-400/10 text-violet-400" :
                      m.role === "support" ? "bg-blue-400/10 text-blue-400" :
                      "bg-default text-muted"
                    }`}>{m.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "emails" && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-bold text-base">Email Templates</h3>
                <p className="text-xs text-muted">Customize transactional email templates</p>
              </div>
              <div className="divide-y divide-border">
                {emailTemplates.map((t) => (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:letter-bold-duotone" className="text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted truncate">{t.subject}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                      {t.isActive ? "Active" : "Draft"}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                      <Icon icon="solar:pen-bold-duotone" className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-5">
              <h3 className="font-bold text-base">Payment Gateways</h3>
              {[
                { name: "Razorpay", icon: "solar:card-bold-duotone", desc: "Accept payments via cards, UPI, netbanking", enabled: true },
                { name: "UPI Direct", icon: "solar:qr-code-bold-duotone", desc: "Accept UPI transfers directly", enabled: true },
                { name: "Cash on Delivery", icon: "solar:money-bag-bold-duotone", desc: "Collect payment on order delivery", enabled: true },
                { name: "Stripe", icon: "solar:card-2-bold-duotone", desc: "International card payments", enabled: false },
              ].map((gw) => (
                <div key={gw.name} className="flex items-center gap-4 p-4 bg-default/40 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gw.enabled ? "bg-accent/10 text-accent" : "bg-default text-muted"}`}>
                    <Icon icon={gw.icon} className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{gw.name}</p>
                    <p className="text-xs text-muted">{gw.desc}</p>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${gw.enabled ? "bg-accent" : "bg-default"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${gw.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
