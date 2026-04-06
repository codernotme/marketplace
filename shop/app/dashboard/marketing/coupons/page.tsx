"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCouponsStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  percentage: "% Off",
  fixed: "Fixed ₹",
  free_shipping: "Free Ship",
  bxgy: "Buy X Get Y",
};

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useCouponsStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "percentage" as "percentage" | "fixed" | "free_shipping" | "bxgy",
    value: "", minOrderValue: "", maxDiscount: "", usageLimit: "100", perUserLimit: "1",
    expiresAt: "", applicableTo: "all" as "all" | "category" | "product",
  });

  const resetForm = () => {
    setForm({ code: "", type: "percentage", value: "", minOrderValue: "", maxDiscount: "", usageLimit: "100", perUserLimit: "1", expiresAt: "", applicableTo: "all" });
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.code.trim()) return;
    addCoupon({
      id: `cpn_${Date.now()}`,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usedCount: 0,
      usageLimit: Number(form.usageLimit) || 100,
      perUserLimit: Number(form.perUserLimit) || 1,
      expiresAt: form.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
      isActive: true,
      applicableTo: form.applicableTo,
    });
    resetForm();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Discounts & Coupons"
        subtitle={`${coupons.filter(c => c.isActive).length} active coupons`}
        icon="solar:ticket-sale-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2" onPress={() => setShowForm(true)}>
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            New Coupon
          </Button>
        }
      />

      {/* Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-base mb-4">Create Coupon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Coupon Code *", key: "code", placeholder: "WELCOME20", upper: true },
              { label: "Discount Value *", key: "value", placeholder: "20", type: "number" },
              { label: "Min. Order Value", key: "minOrderValue", placeholder: "500", type: "number" },
              { label: "Max Discount (₹)", key: "maxDiscount", placeholder: "Optional", type: "number" },
              { label: "Usage Limit (total)", key: "usageLimit", placeholder: "100", type: "number" },
              { label: "Per User Limit", key: "perUserLimit", placeholder: "1", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{f.label}</label>
                <input
                  type={f.type ?? "text"}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as typeof form["type"] })}
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
                <option value="bxgy">Buy X Get Y</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Expires On</label>
              <input
                type="date"
                value={form.expiresAt.split("T")[0]}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onPress={handleSubmit}>Create Coupon</Button>
            <Button variant="secondary" size="sm" onPress={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Coupon cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const usagePct = Math.round((coupon.usedCount / coupon.usageLimit) * 100);
          const expired = new Date(coupon.expiresAt) < new Date();
          return (
            <div key={coupon.id} className={`bg-surface border rounded-2xl p-5 stat-card relative overflow-hidden ${coupon.isActive && !expired ? "border-border" : "border-border opacity-60"}`}>
              {/* decorative pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-accent/5 -translate-y-1/2 translate-x-1/2" />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-black text-lg font-mono tracking-widest text-accent">{coupon.code}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {TYPE_LABELS[coupon.type]} — {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? `₹${coupon.value}` : "Active"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${coupon.isActive && !expired ? "bg-success/15 text-success" : expired ? "bg-danger/15 text-danger" : "bg-default text-muted"}`}>
                    {expired ? "Expired" : coupon.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted mb-3">
                <p>Min order: {formatCurrency(coupon.minOrderValue)}</p>
                {coupon.maxDiscount && <p>Max discount: {formatCurrency(coupon.maxDiscount)}</p>}
                <p>Expires: {new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>

              {/* Usage bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Usage</span>
                  <span className="font-semibold">{coupon.usedCount}/{coupon.usageLimit}</span>
                </div>
                <div className="h-1.5 bg-default rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${usagePct > 80 ? "bg-danger" : usagePct > 50 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => toggleCoupon(coupon.id)}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${coupon.isActive ? "hover:bg-warning/10 text-muted hover:text-warning" : "hover:bg-success/10 text-muted hover:text-success"}`}
                >
                  {coupon.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => { if (window.confirm(`Delete "${coupon.code}"?`)) deleteCoupon(coupon.id); }}
                  className="flex-1 text-xs py-1.5 rounded-lg font-medium hover:bg-danger/10 text-muted hover:text-danger transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
