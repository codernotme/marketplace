"use client";

import { useState } from "react";
import { Button, Input, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { customers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} total customers`}
        icon="solar:users-group-two-rounded-bold-duotone"
        actions={
          <Button variant="secondary" size="sm" className="gap-2">
            <Icon icon="solar:export-bold-duotone" className="text-base" />
            Export
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: customers.length.toString(), icon: "solar:users-group-two-rounded-bold-duotone", color: "text-accent" },
          { label: "Active", value: customers.filter((c) => c.isActive).toString(), icon: "solar:user-check-bold-duotone", color: "text-success" },
          { label: "VIP", value: customers.filter((c) => c.tags.includes("vip")).length.toString(), icon: "solar:crown-bold-duotone", color: "text-amber-400" },
          { label: "New This Month", value: "3", icon: "solar:user-plus-bold-duotone", color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl p-4 border border-border/50 flex items-center gap-3">
            <Icon icon={s.icon} className={`text-2xl ${s.color}`} />
            <div>
              <p className="text-xl font-bold font-[family-name:var(--font-outfit)]">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, email or phone…"
        value={search}
        onValueChange={setSearch}
        startContent={<Icon icon="solar:magnifer-bold-duotone" className="text-muted text-lg" />}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-background/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Location</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Orders</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Total Spent</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">AOV</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Tags</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((customer) => (
                <tr key={customer.id} className="table-row-hover">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-9 h-9 rounded-xl bg-default"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{customer.name}</p>
                          {!customer.isActive && (
                            <span className="text-xs bg-default text-muted px-1.5 py-0.5 rounded-md">Inactive</span>
                          )}
                        </div>
                        <p className="text-xs text-muted">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted text-sm">
                    {customer.city}, {customer.state}
                  </td>
                  <td className="px-5 py-4 text-right font-bold">{customer.totalOrders}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-5 py-4 text-right text-muted">{formatCurrency(customer.avgOrderValue)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            tag === "vip" ? "bg-amber-500/10 text-amber-400" :
                            tag === "premium" ? "bg-violet-500/10 text-violet-400" :
                            tag === "regular" ? "bg-blue-500/10 text-blue-400" :
                            tag === "new" ? "bg-green-500/10 text-green-400" :
                            "bg-default text-muted"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted text-xs">
                    {new Date(customer.joinedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                      <Icon icon="solar:eye-bold-duotone" className="text-base" />
                    </button>
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
