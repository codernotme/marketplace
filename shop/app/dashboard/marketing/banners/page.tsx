"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBannersStore } from "@/lib/store";

export default function BannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useBannersStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", placement: "Hero Slider", link: "" });

  const placements = ["Hero Slider", "Mid-Banner", "Popup", "Category Banner", "Product Banner"];

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    addBanner({
      id: `ban_${Date.now()}`, title: form.title, placement: form.placement, link: form.link,
      isActive: true, startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 30 * 86400000).toISOString(), clicks: 0, impressions: 0,
    });
    setForm({ title: "", placement: "Hero Slider", link: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Banners & Ads"
        subtitle={`${banners.length} banner${banners.length !== 1 ? "s" : ""}`}
        icon="solar:gallery-wide-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2" onPress={() => setShowForm(true)}>
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Banner
          </Button>
        }
      />

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold mb-2">New Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Summer Sale Banner" className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Placement</label>
              <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors">
                {placements.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Link URL</label>
              <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products/sale" className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onPress={handleSubmit}>Create Banner</Button>
            <Button variant="secondary" size="sm" onPress={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {banners.map((b) => {
          const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : "0.00";
          return (
            <div key={b.id} className={`bg-surface border rounded-2xl p-5 flex items-center gap-5 stat-card ${b.isActive ? "border-border" : "border-border opacity-60"}`}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Icon icon="solar:gallery-wide-bold-duotone" className="text-2xl text-accent/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">{b.title}</p>
                    <p className="text-xs text-muted">{b.placement} · Link: {b.link || "—"}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${b.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                    {b.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted">
                  <span><Icon icon="solar:eye-bold-duotone" className="inline mr-1" />{b.impressions.toLocaleString()} impressions</span>
                  <span><Icon icon="solar:cursor-bold-duotone" className="inline mr-1" />{b.clicks.toLocaleString()} clicks</span>
                  <span className="text-accent font-medium">CTR: {ctr}%</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => toggleBanner(b.id)} className={`p-1.5 rounded-lg transition-colors ${b.isActive ? "hover:bg-warning/10 text-muted hover:text-warning" : "hover:bg-success/10 text-muted hover:text-success"}`}>
                  <Icon icon={b.isActive ? "solar:pause-bold-duotone" : "solar:play-bold-duotone"} className="text-base" />
                </button>
                <button onClick={() => { if (window.confirm("Delete this banner?")) deleteBanner(b.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
