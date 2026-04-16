import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Download01Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { formatINR, formatDate } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers — themrktplace",
  description: "Manage your customer profiles, segments, and purchase history.",
};

const mockCustomers = [
  { id: "1", name: "Priya Sharma", email: "priya@example.com", orders: 12, spent: 28490, joined: new Date("2024-01-15"), tag: "VIP" },
  { id: "2", name: "Rahul Verma", email: "rahul@example.com", orders: 3, spent: 5999, joined: new Date("2024-06-20"), tag: null },
  { id: "3", name: "Ananya Singh", email: "ananya@example.com", orders: 7, spent: 14230, joined: new Date("2024-03-10"), tag: "Wholesale" },
  { id: "4", name: "Rohan Mehta", email: "rohan@example.com", orders: 1, spent: 799, joined: new Date("2025-01-05"), tag: null },
  { id: "5", name: "Kavita Nair", email: "kavita@example.com", orders: 18, spent: 41200, joined: new Date("2023-11-22"), tag: "VIP" },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        description="View and manage your customer base, segments, and loyalty data."
      >
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Add customer
        </Button>
      </PageHeader>

      {/* Customers table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm font-medium">{mockCustomers.length} customers</p>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" />
            Filter
          </Button>
        </div>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Customer</span>
            <span>Email</span>
            <span>Orders</span>
            <span>Total spent</span>
            <span>Joined</span>
            <span>Tag</span>
          </div>
          {mockCustomers.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
              <span className="text-sm text-muted-foreground truncate">{c.email}</span>
              <span className="text-sm tabular-nums">{c.orders}</span>
              <span className="text-sm font-semibold tabular-nums">{formatINR(c.spent)}</span>
              <span className="text-xs text-muted-foreground">{formatDate(c.joined)}</span>
              {c.tag ? (
                <Badge variant="secondary">{c.tag}</Badge>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
