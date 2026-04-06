"use client";

import { useState } from "react";
import { Button, Card, Separator, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { kpiData, orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function FinanceSalesReport() {
  const totalTax = orders.reduce((s, o) => s + o.tax, 0);
  const totalDiscount = orders.reduce((s, o) => s + o.discount, 0);
  const netRevenue = kpiData.totalRevenue - totalTax - totalDiscount;

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <PageHeader
        title="Financial Reports"
        subtitle="Detailed breakdown of revenue, taxes, and settlement history"
        icon="solar:wallet-money-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="font-bold border border-border">
              <Icon icon="solar:calendar-bold-duotone" className="text-lg mr-2" />
              FY 2025-26
            </Button>
            <Button variant="primary" size="sm" className="font-bold shadow-lg shadow-accent/20">
              <Icon icon="solar:printer-minimalistic-bold-duotone" className="text-lg mr-2" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-surface border border-border shadow-xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
          <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">Gross Revenue</p>
          <p className="text-3xl font-black text-foreground tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{formatCurrency(kpiData.totalRevenue)}</p>
          <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-success">
            <Icon icon="solar:arrow-up-bold-duotone" />
            +18.4% since last month
          </div>
        </Card>

        <Card className="p-8 bg-surface border border-border shadow-xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 blur-3xl rounded-full" />
          <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">Estimated Taxes (GST)</p>
          <p className="text-3xl font-black text-danger tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>-{formatCurrency(totalTax)}</p>
          <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-muted uppercase tracking-widest">
            Average tax rate 18%
          </div>
        </Card>

        <Card className="p-8 bg-surface border border-accent/20 shadow-2xl rounded-[2.5rem] relative overflow-hidden group ring-4 ring-accent/5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
          <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-2">Net Earnings</p>
          <p className="text-3xl font-black text-accent tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>{formatCurrency(netRevenue)}</p>
          <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-accent uppercase tracking-widest">
            Settled to bank account
          </div>
        </Card>
      </div>

      {/* Transaction History (Mocked) */}
      <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Settlement History</h3>
          <div className="flex gap-2 p-1 bg-default/40 rounded-xl">
            {["All", "Settled", "Pending"].map(f => (
              <button key={f} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Settled' ? 'bg-surface text-accent shadow-sm' : 'text-muted'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-black text-muted uppercase tracking-widest">
                <th className="text-left py-4 px-4">Period</th>
                <th className="text-left py-4 px-4">Transactions</th>
                <th className="text-right py-4 px-4">Gross Amt.</th>
                <th className="text-right py-4 px-4">Fees/Taxes</th>
                <th className="text-right py-4 px-4">Settled Amt.</th>
                <th className="text-center py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { period: "Apr 01 - Apr 06", count: 142, gross: 482500, fees: 86850, net: 395650, status: "settled" },
                { period: "Mar 24 - Mar 31", count: 210, gross: 714000, fees: 128520, net: 585480, status: "settled" },
                { period: "Mar 16 - Mar 23", count: 185, gross: 629000, fees: 113220, net: 515780, status: "settled" },
                { period: "Mar 08 - Mar 15", count: 168, gross: 571200, fees: 102816, net: 468384, status: "pending" },
              ].map((s, i) => (
                <tr key={i} className="group hover:bg-default/20 transition-colors">
                  <td className="py-5 px-4 font-black tracking-tight">{s.period}</td>
                  <td className="py-5 px-4 font-bold text-muted">{s.count} orders</td>
                  <td className="py-5 px-4 text-right font-bold">{formatCurrency(s.gross)}</td>
                  <td className="py-5 px-4 text-right font-bold text-danger/60">{formatCurrency(s.fees)}</td>
                  <td className="py-5 px-4 text-right font-black text-foreground">{formatCurrency(s.net)}</td>
                  <td className="py-5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      s.status === 'settled' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
