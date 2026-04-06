"use client";

import { Button, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";

const alertEvents = [
  { key: "new_order", label: "New Order Placed", desc: "Alert when a new order is received" },
  { key: "payment_failed", label: "Order Payment Failed", desc: "Alert when a payment fails" },
  { key: "low_stock", label: "Low Stock Alert", desc: "Alert when stock falls below threshold" },
  { key: "new_query", label: "New Customer Query", desc: "Alert when a ticket is opened" },
  { key: "daily_summary", label: "Daily Sales Summary", desc: "Scheduled at 9 PM every day" },
  { key: "new_review", label: "New Review Posted", desc: "Alert when a product review is added" },
];

export default function TelegramPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Telegram Bot"
        subtitle="Configure alerts and notifications via Telegram"
        icon="solar:chat-round-dots-bold-duotone"
      />

      {/* Config */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/40">
          <Icon icon="solar:settings-bold-duotone" className="text-accent text-xl" />
          <h2 className="font-semibold font-[family-name:var(--font-outfit)]">Bot Configuration</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-success/5 border border-success/20 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Icon icon="solar:chat-round-dots-bold-duotone" className="text-white text-base" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Bot Status</p>
              <p className="text-xs text-success">● Connected and active</p>
            </div>
            <Button variant="secondary" size="sm">Test Connection</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Bot Token</label>
              <input
                type="password"
                defaultValue="7312456789:AAH••••••••••••••••••••••••••••••••"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Chat ID</label>
              <input
                type="text"
                defaultValue="-1001234567890"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono"
              />
            </div>
          </div>
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:diskette-bold-duotone" className="text-base" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/40">
          <Icon icon="solar:bell-bold-duotone" className="text-accent text-xl" />
          <h2 className="font-semibold font-[family-name:var(--font-outfit)]">Alert Settings</h2>
        </div>
        <div className="p-5 space-y-3">
          {alertEvents.map((event) => (
            <div key={event.key} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
              <div>
                <p className="font-medium text-sm">{event.label}</p>
                <p className="text-xs text-muted mt-0.5">{event.desc}</p>
              </div>
              <Switch defaultSelected />
            </div>
          ))}
        </div>
      </div>

      {/* Test Alerts */}
      <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/40">
          <Icon icon="solar:radar-bold-duotone" className="text-accent text-xl" />
          <h2 className="font-semibold font-[family-name:var(--font-outfit)]">Test Alerts</h2>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {alertEvents.map((event) => (
            <Button key={event.key} variant="secondary" size="sm" className="gap-2 text-xs">
              <Icon icon="solar:play-circle-bold-duotone" className="text-base" />
              Test: {event.label.split(" ").slice(0, 2).join(" ")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
