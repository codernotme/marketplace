"use client";

import { useState } from "react";
import { Button, Input, Card, Separator, Tooltip, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBannersStore } from "@/lib/store";

export default function MarketingBanners() {
  const [search, setSearch] = useState("");
  const { banners } = useBannersStore();

  const filtered = banners.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners & Ads"
        subtitle="Manage storefront promotional campaigns and eye-catching announcements"
        icon="solar:gallery-wide-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="font-bold px-6 shadow-lg shadow-accent/20">
            <Icon icon="solar:add-circle-bold-duotone" className="text-xl mr-2" />
            Create Campaign
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: String(banners.filter(b => b.isActive).length), icon: "solar:check-read-bold-duotone", color: "text-success" },
          { label: "Total Impressions", value: "78.2K", icon: "solar:eye-bold-duotone", color: "text-accent" },
          { label: "Total Clicks", value: "2,119", icon: "solar:cursor-square-bold-duotone", color: "text-warning" },
          { label: "Avg. CTR", value: "2.7%", icon: "solar:graph-up-bold-duotone", color: "text-violet-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 group hover:border-accent/40 transition-all cursor-default">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-default/40 ${stat.color} group-hover:scale-110 transition-transform`}>
              <Icon icon={stat.icon} className="text-xl" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((banner) => (
          <Card key={banner.id} className="bg-surface border border-border shadow-2xl rounded-[2.5rem] overflow-hidden group">
            <div className={`h-40 relative ${banner.isActive ? "bg-accent/5" : "bg-default/20 grayscale"}`}>
              <div className="absolute inset-0 flex items-center justify-center text-accent/20 border-b border-border/50">
                <Icon icon="solar:gallery-bold-duotone" className="text-7xl group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                  banner.isActive ? "bg-success/15 text-success border-success/10" : "bg-default text-muted border-border"
                }`}>
                  {banner.isActive ? "Active" : "Paused"}
                </span>
                <Dropdown>
                  <Dropdown.Trigger>
                    <div 
                      className="p-1.5 rounded-xl bg-surface/80 backdrop-blur-md hover:bg-surface text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer border border-border/50"
                      role="button"
                      tabIndex={0}
                    >
                      <Icon icon="solar:menu-dots-bold-duotone" className="text-lg" />
                    </div>
                  </Dropdown.Trigger>
                  <Dropdown.Popover className="min-w-[160px]">
                    <Dropdown.Menu>
                      <Dropdown.Item id="edit" textValue="Edit Campaign">
                        <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                        <Label className="font-bold">Edit Campaign</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="analytics" textValue="Detailed Stats">
                        <Icon icon="solar:chart-square-bold-duotone" className="text-lg text-muted" />
                        <Label className="font-bold">Analytics</Label>
                      </Dropdown.Item>
                      <Separator className="my-1 border-border/50" />
                      <Dropdown.Item id="delete" textValue="Delete Campaign" variant="danger">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                        <Label className="font-bold text-danger">Delete</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{banner.title}</h3>
                  <p className="text-[10px] text-muted font-bold mt-0.5 uppercase tracking-widest">{banner.placement}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-tight">Schedule</p>
                  <p className="text-[11px] font-bold tracking-tight" suppressHydrationWarning>
                    Ends {new Date(banner.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-default/40 border border-border/50 text-center">
                  <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Impressions</p>
                  <p className="text-xl font-black text-foreground tracking-tight">{banner.impressions.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-3xl bg-accent/5 border border-accent/10 text-center">
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Clicks</p>
                  <p className="text-xl font-black text-accent tracking-tight">{banner.clicks.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[10px] text-muted font-bold font-mono tracking-tighter uppercase">{banner.link}</span>
                </div>
                <Button size="sm" variant="secondary" className="font-bold h-9 rounded-xl border border-border">Preview Live</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
