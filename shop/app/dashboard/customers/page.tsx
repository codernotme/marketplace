"use client";

import { useState } from "react";
import { Button, Input, InputGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCustomersStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const TAG_COLORS: Record<string, string> = {
  vip: "bg-violet-500/15 text-violet-400",
  premium: "bg-amber-500/15 text-amber-400",
  regular: "bg-blue-500/15 text-blue-400",
  new: "bg-success/15 text-success",
  budget: "bg-default text-muted",
  electronics: "bg-cyan-500/15 text-cyan-400",
  repeat: "bg-indigo-500/15 text-indigo-400",
};

export default function CustomersPage() {
  const { customers, toggleActive, addTag, removeTag } = useCustomersStore();
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const filtered = customers.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchActive = filterActive === "all" || (filterActive === "active" ? c.isActive : !c.isActive);
    return matchSearch && matchActive;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrder = customers.length ? customers.reduce((s, c) => s + c.avgOrderValue, 0) / customers.length : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
        icon="solar:users-group-two-rounded-bold-duotone"
        actions={
          <Button variant="secondary" size="sm" className="gap-2">
            <Icon icon="solar:download-bold-duotone" className="text-base" />
            Export CSV
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: String(customers.length), icon: "solar:users-group-two-rounded-bold-duotone", color: "text-accent" },
          { label: "Active Customers", value: String(customers.filter(c => c.isActive).length), icon: "solar:user-check-rounded-bold-duotone", color: "text-success" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: "solar:wallet-money-bold-duotone", color: "text-warning" },
          { label: "Avg Order Value", value: formatCurrency(avgOrder), icon: "solar:cart-large-bold-duotone", color: "text-violet-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-default/60 ${stat.color}`}>
              <Icon icon={stat.icon} className="text-xl" />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="max-w-xs w-full">
          <InputGroup className="bg-default/40 border border-border rounded-xl">
            <InputGroup.Prefix className="pl-3 text-muted">
              <Icon icon="solar:magnifer-bold-duotone" className="text-lg" />
            </InputGroup.Prefix>
            <Input
              placeholder="Search customers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2"
            />
          </InputGroup>
        </div>
        <div className="flex gap-1 p-1 bg-default/40 rounded-xl">
          {(["all", "active", "inactive"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterActive(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filterActive === opt ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Orders</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Spent</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden xl:table-cell">Tags</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted hidden md:table-cell">{c.city}, {c.state}</td>
                  <td className="px-5 py-3.5 text-right text-sm font-medium hidden lg:table-cell">{c.totalOrders}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-sm">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.map((tag) => (
                        <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${TAG_COLORS[tag] ?? "bg-default text-muted"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors"
                      onClick={() => toggleActive(c.id)}
                      title={c.isActive ? "Deactivate" : "Activate"}
                    >
                      <Icon icon={c.isActive ? "solar:user-block-rounded-bold-duotone" : "solar:user-check-rounded-bold-duotone"} className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-5xl mx-auto mb-3 opacity-20" />
                    <p className="text-muted text-sm">No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
