import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, CreditCard01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { formatINR, formatDateTime } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments — themrktplace",
  description: "Payment gateways, transactions, and payout history.",
};

const transactions = [
  { id: "txn_001", orderId: "#1042", amount: 2499, method: "UPI", status: "success", date: new Date(Date.now() - 3600000) },
  { id: "txn_002", orderId: "#1041", amount: 5999, method: "Card", status: "success", date: new Date(Date.now() - 7200000) },
  { id: "txn_003", orderId: "#1040", amount: 1249, method: "Net Banking", status: "pending", date: new Date(Date.now() - 10800000) },
  { id: "txn_004", orderId: "#1039", amount: 799, method: "Wallet", status: "failed", date: new Date(Date.now() - 18000000) },
];

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payments"
        description="Configure payment gateways and review transaction history."
      >
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Add gateway
        </Button>
      </PageHeader>

      {/* Active gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Razorpay", mode: "Live", connected: true, desc: "UPI, Cards, Net Banking, Wallets, EMI" },
          { name: "Stripe", mode: "Test", connected: false, desc: "Cards, Apple Pay, Google Pay (International)" },
        ].map((gw) => (
          <Card key={gw.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                  <HugeiconsIcon icon={CreditCard01Icon} size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{gw.name}</CardTitle>
                  <CardDescription className="text-xs">{gw.desc}</CardDescription>
                </div>
              </div>
              <Badge variant={gw.connected ? "default" : "secondary"}>
                {gw.connected ? gw.mode : "Not connected"}
              </Badge>
            </CardHeader>
            <CardContent>
              <Button
                variant={gw.connected ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {gw.connected ? "Configure" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>Your latest payment activity</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Transaction</span>
              <span>Order</span>
              <span>Method</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 items-center hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-mono text-muted-foreground">{txn.id}</span>
                <span className="text-sm font-medium">{txn.orderId}</span>
                <span className="text-sm text-muted-foreground">{txn.method}</span>
                <span className="text-sm font-semibold tabular-nums">{formatINR(txn.amount)}</span>
                <Badge
                  variant={txn.status === "success" ? "default" : txn.status === "pending" ? "secondary" : "destructive"}
                >
                  {txn.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
