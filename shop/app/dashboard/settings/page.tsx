"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, Separator, Tooltip, Select } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import api from "@/lib/api";

const TABS = [
  { id: "general", label: "General", icon: "solar:settings-bold-duotone" },
  { id: "payments", label: "Payments", icon: "solar:card-2-bold-duotone" },
  { id: "shipping", label: "Shipping", icon: "solar:delivery-bold-duotone" },
  { id: "tax", label: "Tax", icon: "solar:bill-list-bold-duotone" },
  { id: "api", label: "API & Webhooks", icon: "solar:code-bold-duotone" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [siteConfig, setSiteConfig] = useState({
    name: "theMrktPlace",
    contactEmail: "support@themrktplace.com",
    address: "",
  });

  useEffect(() => {
    const loadStorefront = async () => {
      try {
        const response = await api.get("/data/storefront-content");
        const payload = response.data || {};
        setSiteConfig((prev) => ({
          ...prev,
          name: payload?.brand?.siteName || prev.name,
          contactEmail: payload?.footer?.contactEmail || prev.contactEmail,
          address: payload?.brand?.address || prev.address,
        }));
      } catch {
        // Keep default values if storefront content is unavailable.
      }
    };
    loadStorefront();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <PageHeader
        title="Store Settings"
        subtitle="Manage your marketplace configuration and policies"
        icon="solar:settings-minimalistic-bold-duotone"
        actions={
          <Button
            variant="primary"
            onPress={() => {
              setIsSaving(true);
              setTimeout(() => setIsSaving(false), 2000);
            }}
            className="font-bold gap-2 px-8 shadow-lg shadow-accent/20"
          >
            {isSaving ? <Icon icon="solar:refresh-bold-duotone" className="text-xl animate-spin" /> : <Icon icon="solar:check-read-bold-duotone" className="text-xl" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm group ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-lg shadow-accent/20 translate-x-2"
                  : "text-muted hover:text-foreground hover:bg-default/40"
              }`}
            >
              <Icon 
                icon={tab.icon} 
                className={`text-xl transition-transform group-hover:scale-110 ${activeTab === tab.id ? "text-white" : "text-muted group-hover:text-accent"}`} 
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
            {activeTab === "general" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Store Information</h3>
                    <p className="text-xs text-muted mt-1">Basic details about your online store</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Store Name</label>
                    <input
                      defaultValue={siteConfig.name}
                      className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Support Email</label>
                    <input
                      defaultValue={siteConfig.contactEmail}
                      className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Currency</label>
                    <div className="relative">
                      <select className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 transition-all appearance-none cursor-pointer">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Timezone</label>
                    <div className="relative">
                      <select className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 transition-all appearance-none cursor-pointer">
                        <option value="Asia/Kolkata">(GMT+05:30) India Standard Time</option>
                        <option value="UTC">(GMT+00:00) Universal Coordinated Time</option>
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Store Address</label>
                  <textarea
                    rows={3}
                    defaultValue={siteConfig.address}
                    className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Payment Methods</h3>
                    <p className="text-xs text-muted mt-1">Configure how your customers pay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "razorpay", name: "Razorpay", icon: "solar:card-send-bold-duotone", active: true, desc: "Accept Credit/Debit Cards, NetBanking, and Wallets" },
                    { id: "upi", name: "UPI Direct", icon: "solar:link-circle-bold-duotone", active: true, desc: "Instant payments via Google Pay, PhonePe, etc." },
                    { id: "cod", name: "Cash on Delivery", icon: "solar:wallet-money-bold-duotone", active: false, desc: "Allow customers to pay at the time of delivery" },
                  ].map((gateway) => (
                    <div key={gateway.id} className="flex items-center gap-6 p-5 rounded-3xl bg-default/40 border border-border hover:border-accent/40 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-accent shadow-sm border border-border">
                        <Icon icon={gateway.icon} className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm">{gateway.name}</p>
                        <p className="text-xs text-muted mt-0.5">{gateway.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative transition-colors ${gateway.active ? "bg-accent" : "bg-default"}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${gateway.active ? "left-7 shadow-sm" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Shipping Configuration</h3>
                    <p className="text-xs text-muted mt-1">Manage delivery areas and courier settings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Flat Rate Shipping</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-xs">₹</span>
                      <input
                        type="number"
                        defaultValue="99"
                        className="w-full bg-default/40 border border-border rounded-2xl py-3.5 pl-8 pr-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Free Shipping Above</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-xs">₹</span>
                      <input
                        type="number"
                        defaultValue="999"
                        className="w-full bg-default/40 border border-border rounded-2xl py-3.5 pl-8 pr-4 text-sm font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon icon="solar:info-circle-bold-duotone" className="text-accent text-xl" />
                    <p className="text-sm font-black text-accent tracking-tight">Pro-tip</p>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                    Automated shipping calculation via Shiprocket or Delhivery requires an active API key in the Integrations tab. Currently using manual rates.
                  </p>
                </div>
              </div>
            )}

            {/* Other tabs follow same premium pattern... */}
            {activeTab === "api" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Developer Options</h3>
                    <p className="text-xs text-muted mt-1">API keys and webhook endpoints for integration</p>
                  </div>
                  <Button size="sm" variant="secondary" className="font-bold rounded-xl h-10 px-4">Generate Key</Button>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-default/20 border border-border/50 font-mono text-[11px] relative overflow-hidden group">
                    <p className="text-muted mb-2 uppercase tracking-widest font-black">Private API Key</p>
                    <p className="text-foreground font-bold tracking-tight">mk_live_51P2c9fSwGz8Gz8Gz8Gz8Gz8Gz8Gz8Gz8</p>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-surface border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Icon icon="solar:copy-bold-duotone" className="text-accent" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Webhook Endpoint</label>
                    <input
                      placeholder="https://api.yourdomain.com/webhooks"
                      className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-sm font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
