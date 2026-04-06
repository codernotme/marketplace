"use client";

import { useState } from "react";
import { Button, Switch, Chip, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { coupons, banners } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function MarketingCouponsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts & Coupons"
        subtitle="Manage promotional codes and discount rules"
        icon="solar:ticket-sale-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Create Coupon
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Value</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Used / Limit</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Expiry</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="table-row-hover">
                  <td className="px-5 py-4">
                    <code className="font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg text-sm">
                      {coupon.code}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-muted capitalize">{coupon.type.replace("_", " ")}</td>
                  <td className="px-5 py-4 text-right font-bold">
                    {coupon.type === "percentage" ? `${coupon.value}%` :
                     coupon.type === "fixed" ? `₹${coupon.value}` :
                     coupon.type === "free_shipping" ? "Free" : "BXGY"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-bold">{coupon.usedCount}</span>
                    <span className="text-muted"> / {coupon.usageLimit}</span>
                  </td>
                  <td className="px-5 py-4 text-muted text-xs">
                    {new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <Chip size="sm" variant={coupon.isActive ? "success" : "default"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                        <Icon icon="solar:pen-bold-duotone" className="text-base" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
