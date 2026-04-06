"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCouponsStore, useUIStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  percentage: "% OFF",
  fixed: "FLAT DISCOUNT",
  free_shipping: "FREE DELIVERY",
  bxgy: "BOGO OFFER",
};

export default function CouponsPage() {
  const { coupons, deleteCoupon, toggleCoupon } = useCouponsStore();
  const { openModal } = useUIStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions & Discounts"
        subtitle={`${coupons.filter(c => c.isActive).length} currently active marketing campaigns`}
        icon="solar:ticket-sale-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2 font-bold"
            onPress={() => openModal("coupon", "add")}
          >
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Create Coupon
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon) => {
          const usagePct = Math.round((coupon.usedCount / coupon.usageLimit) * 100);
          const expired = new Date(coupon.expiresAt) < new Date();
          const isActive = coupon.isActive && !expired;

          return (
            <div 
              key={coupon.id} 
              className={`group bg-surface border rounded-3xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col ${
                isActive ? "border-border shadow-sm hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1" : "border-border/40 opacity-70 grayscale-[0.2]"
              }`}
            >
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-125" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-xl font-mono tracking-[0.15em] text-accent leading-none">{coupon.code}</p>
                    {!isActive && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-default text-muted">
                        {expired ? "Expired" : "Disabled"}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-none opacity-80">
                    {TYPE_LABELS[coupon.type]} — {coupon.type === "percentage" ? `${coupon.value}% OFF` : coupon.type === "fixed" ? `₹${coupon.value} OFF` : "ACTIVE"}
                  </p>
                </div>
                {isActive && (
                  <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center shadow-inner">
                    <Icon icon="solar:check-circle-bold-duotone" className="text-lg" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                  <Icon icon="solar:cart-large-4-bold-duotone" className="text-muted" />
                  <span>Min Order: <span className="text-foreground">{formatCurrency(coupon.minOrderValue)}</span></span>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                    <Icon icon="solar:tag-bold-duotone" className="text-muted" />
                    <span>Max Savings: <span className="text-success">{formatCurrency(coupon.maxDiscount)}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                  <Icon icon="solar:calendar-bold-duotone" className="text-muted" />
                  <span>Ends: <span className="text-danger/80">{new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></span>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mt-auto space-y-2 relative z-10">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-muted uppercase tracking-wider">Campaign Velocity</p>
                  <p className="text-xs font-black">{coupon.usedCount} <span className="text-[10px] text-muted">/ {coupon.usageLimit}</span></p>
                </div>
                <div className="h-2 bg-default rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                      usagePct > 85 ? "bg-gradient-to-r from-danger to-orange-500" : 
                      usagePct > 50 ? "bg-gradient-to-r from-warning to-accent" : 
                      "bg-gradient-to-r from-accent to-violet-500"
                    }`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-5 border-t border-border/50 relative z-10">
                <button
                  onClick={() => openModal("coupon", "edit", coupon)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-default/60 text-muted hover:text-foreground transition-all duration-200"
                >
                  <Icon icon="solar:pen-new-square-bold-duotone" className="text-sm" />
                  Edit
                </button>
                <button
                  onClick={() => toggleCoupon(coupon.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                    isActive ? "hover:bg-warning/10 text-muted hover:text-warning" : "hover:bg-success/10 text-muted hover:text-success"
                  }`}
                >
                  <Icon icon={coupon.isActive ? "solar:pause-bold-duotone" : "solar:play-bold-duotone"} className="text-sm" />
                  {coupon.isActive ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => { if (window.confirm(`Permanently delete "${coupon.code}"?`)) deleteCoupon(coupon.id); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-danger/10 text-muted hover:text-danger transition-all duration-200"
                >
                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
