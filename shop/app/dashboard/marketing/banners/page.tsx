"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBannersStore, useUIStore } from "@/lib/store";

export default function BannersPage() {
  const { banners, deleteBanner, toggleBanner } = useBannersStore();
  const { openModal } = useUIStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners & Ads"
        subtitle={`${banners.length} marketing campaign assets currently configured`}
        icon="solar:gallery-wide-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2 font-bold"
            onPress={() => openModal("banner", "add")}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Create Banner
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((b) => {
          const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : "0.00";
          
          return (
            <div 
              key={b.id} 
              className={`group bg-surface border rounded-[2rem] p-6 transition-all duration-300 relative overflow-hidden flex flex-col ${
                b.isActive ? "border-border shadow-sm hover:shadow-xl hover:shadow-accent/5" : "border-border/40 opacity-70 grayscale-[0.3]"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-violet-500/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Icon icon="solar:gallery-wide-bold-duotone" className="text-2xl text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-base truncate tracking-tight">{b.title}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${b.isActive ? "bg-success/10 text-success" : "bg-default text-muted"}`}>
                      {b.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">
                    {b.placement} — {b.link || "Internal Link"}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-default/40 border border-border/50">
                  <p className="text-[9px] font-black text-muted uppercase tracking-tighter mb-1">Views</p>
                  <p className="text-sm font-black">{b.impressions.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-2xl bg-default/40 border border-border/50">
                  <p className="text-[9px] font-black text-muted uppercase tracking-tighter mb-1">Clicks</p>
                  <p className="text-sm font-black">{b.clicks.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-2xl bg-accent/5 border border-accent/10">
                  <p className="text-[9px] font-black text-accent uppercase tracking-tighter mb-1">CTR</p>
                  <p className="text-sm font-black text-accent">{ctr}%</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                <button
                  onClick={() => openModal("banner", "edit", b)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-default/60 text-muted hover:text-foreground transition-all duration-200"
                >
                  <Icon icon="solar:pen-new-square-bold-duotone" className="text-sm" />
                  Edit Asset
                </button>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button 
                    onClick={() => toggleBanner(b.id)} 
                    className={`p-2.5 rounded-xl transition-all duration-200 ${b.isActive ? "hover:bg-warning/10 text-muted hover:text-warning" : "hover:bg-success/10 text-muted hover:text-success"}`}
                  >
                    <Icon icon={b.isActive ? "solar:pause-bold-duotone" : "solar:play-bold-duotone"} className="text-lg" />
                  </button>
                  <button 
                    onClick={() => { if (window.confirm("Permanently remove this banner?")) deleteBanner(b.id); }} 
                    className="p-2.5 rounded-xl hover:bg-danger/10 text-muted hover:text-danger transition-all duration-200"
                  >
                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
