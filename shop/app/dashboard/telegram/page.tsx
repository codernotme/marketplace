"use client";

import { useState } from "react";
import { Button, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { kpiData } from "@/lib/mock-data";

const alertEvents = [
  { key: "new_order", label: "New Order Placed", desc: "Alert when a new order is received" },
  { key: "payment_failed", label: "Order Payment Failed", desc: "Alert when a payment fails" },
  { key: "low_stock", label: "Low Stock Alert", desc: "Alert when stock falls below threshold" },
  { key: "new_query", label: "New Customer Query", desc: "Alert when a ticket is opened" },
  { key: "daily_summary", label: "Daily Sales Summary", desc: "Scheduled at 9 PM every day" },
  { key: "new_review", label: "New Review Posted", desc: "Alert when a product review is added" },
];

export default function TelegramPage() {
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState("7312456789:AAH••••••••••••••••••••••••••••••••");
  const [chatId, setChatId] = useState("-1001234567890");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Telegram Bot"
        subtitle="Configure real-time alerts and shop notifications"
        icon="solar:chat-round-dots-bold-duotone"
        actions={
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onPress={handleSave}
          >
            <Icon icon={saved ? "solar:check-circle-bold-duotone" : "solar:diskette-bold-duotone"} className="text-base" />
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
        }
      />

      {/* Connection Status */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Icon icon="solar:chat-round-dots-bold-duotone" className="text-2xl text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Bot Status: {kpiData.telegramBotStatus === "active" ? "Active" : "Inactive"}</p>
            <p className={`text-xs ${kpiData.telegramBotStatus === "active" ? "text-success font-medium" : "text-danger"}`}>
              {kpiData.telegramBotStatus === "active" ? "● Connected and listening for events" : "● Disconnected — check token"}
            </p>
          </div>
          <Button variant="secondary" size="sm">Test Connection</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* API Credentials */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border bg-background/30">
            <h3 className="font-bold text-sm">Bot Credentials</h3>
          </div>
          <div className="p-5 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Bot API Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-default/60 border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter bot token..."
              />
              <p className="text-[10px] text-muted mt-1.5">Get this from @BotFather on Telegram</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Target Chat ID</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-default/60 border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. -1001234..."
              />
              <p className="text-[10px] text-muted mt-1.5">Channel, group, or your personal ID</p>
            </div>
          </div>
        </div>

        {/* Test Tools */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border bg-background/30">
            <h3 className="font-bold text-sm">Test Notifications</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-2 flex-1">
            {alertEvents.slice(0, 4).map((event) => (
              <button
                key={event.key}
                className="flex items-center gap-2 p-3 rounded-xl bg-default/40 hover:bg-default/70 border border-border/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                  <Icon icon="solar:play-bold-duotone" className="text-sm" />
                </div>
                <span className="text-xs font-medium truncate">{event.label.split(" ").slice(0, 2).join(" ")}</span>
              </button>
            ))}
            <div className="col-span-2 mt-2 p-3 bg-accent/5 rounded-xl border border-accent/10">
              <p className="text-[10px] text-accent font-medium text-center uppercase tracking-widest">More tests in settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Subscriptions */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-background/30 flex items-center justify-between">
          <h3 className="font-bold text-sm">Event Subscriptions</h3>
          <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase">6 Events Available</span>
        </div>
        <div className="divide-y divide-border">
          {alertEvents.map((event) => (
            <div key={event.key} className="flex items-center justify-between p-5 hover:bg-default/20 transition-colors">
              <div>
                <p className="font-semibold text-sm">{event.label}</p>
                <p className="text-xs text-muted mt-0.5">{event.desc}</p>
              </div>
              <Switch defaultSelected size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
