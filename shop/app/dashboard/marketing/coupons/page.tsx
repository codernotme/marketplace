"use client";

import { useState } from "react";
import { Button, Input, Card, Separator, Tooltip, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCouponsStore } from "@/lib/store";

const TYPE_COLORS = {
  percentage: "bg-accent/15 text-accent",
  fixed: "bg-success/15 text-success",
  free_shipping: "bg-violet-500/15 text-violet-400",
  bxgy: "bg-blue-500/15 text-blue-400",
};

export default function MarketingCoupons() {
  const [search, setSearch] = useState("");
  const { coupons } = useCouponsStore();

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts & Coupons"
        subtitle="Create and manage promotional discount codes for your customers"
        icon="solar:ticket-sale-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="font-bold px-6 shadow-lg shadow-accent/20">
            <Icon icon="solar:ticket-plus-bold-duotone" className="text-xl mr-2" />
            Create Coupon
          </Button>
        }
      />

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((coupon) => (
          <Card key={coupon.id} className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -translate-y-16 translate-x-16 group-hover:bg-accent/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-8">
              <div className="px-4 py-2 bg-accent/5 border border-accent/20 rounded-2xl">
                <span className="text-xl font-black text-accent tracking-widest font-mono">{coupon.code}</span>
              </div>
              <Dropdown>
                <Dropdown.Trigger>
                  <div 
                    className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    <Icon icon="solar:menu-dots-bold-duotone" className="text-xl" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[160px]">
                  <Dropdown.Menu>
                    <Dropdown.Item id="edit" textValue="Edit Coupon">
                      <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                      <Label className="font-bold">Edit Coupon</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="toggle" textValue={coupon.isActive ? "Deactivate" : "Activate"}>
                      <Icon icon={coupon.isActive ? "solar:close-circle-bold-duotone" : "solar:check-circle-bold-duotone"} className="text-lg text-muted" />
                      <Label className="font-bold">{coupon.isActive ? "Deactivate" : "Activate"}</Label>
                    </Dropdown.Item>
                    <Separator className="my-1 border-border/50" />
                    <Dropdown.Item id="delete" textValue="Delete Coupon" variant="danger">
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                      <Label className="font-bold text-danger">Delete</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${TYPE_COLORS[coupon.type]}`}>
                  {coupon.type.replace("_", " ")}
                </span>
                <span className="text-xl font-black text-foreground" style={{ fontFamily: "var(--font-outfit)" }}>
                  {coupon.type === "percentage" ? `${coupon.value}% OFF` : coupon.type === "fixed" ? `₹${coupon.value} OFF` : "FREE SHIPPING"}
                </span>
              </div>

              <p className="text-xs text-muted font-medium pr-10 leading-relaxed font-mono tracking-tighter">
                Applicable to {coupon.applicableTo} orders above ₹{coupon.minOrderValue}
              </p>
            </div>

            <Separator className="my-6 opacity-30" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-muted">
                <span>Usage status</span>
                <span className="text-foreground tracking-tight">{coupon.usedCount} / {coupon.usageLimit} utilized</span>
              </div>
              <div className="h-2 bg-default/40 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-violet-500 transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${(coupon.usedCount/coupon.usageLimit)*100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted font-bold uppercase tracking-widest pt-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:clock-circle-bold-duotone" className="text-sm" />
                  <span suppressHydrationWarning>Expires {new Date(coupon.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${coupon.isActive ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-default shadow-none"}`} />
                  {coupon.isActive ? "Active" : "Disabled"}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
