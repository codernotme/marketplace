"use client";

import { useState } from "react";
import { Button, Card, Separator, Tooltip, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";

type BotStatus = "active" | "inactive";

export default function TelegramBotPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<BotStatus>("active");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        title="Telegram Automation"
        subtitle="Real-time order alerts and customer interactions via Telegram"
        icon="solar:chat-round-dots-bold-duotone"
        actions={
          <Button
            variant={status === "active" ? "danger" : "primary"}
            className="font-bold gap-2 px-6 shadow-lg shadow-accent/20 h-10 rounded-xl"
            onPress={() => setStatus((prev) => (prev === "active" ? "inactive" : "active"))}
          >
            <Icon icon={status === "active" ? "solar:power-bold-duotone" : "solar:play-bold-duotone"} className="text-xl" />
            {status === "active" ? "Stop Bot" : "Start Bot"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 bg-surface border border-border shadow-xl rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-1000 ${status === 'active' ? 'bg-success shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-danger'}`} />
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[2rem] bg-default/40 flex items-center justify-center text-accent shadow-sm border border-border group-hover:scale-110 transition-transform duration-500">
                <Icon icon="logos:telegram" className="text-5xl" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-surface shadow-md ${status === 'active' ? 'bg-success' : 'bg-danger'}`} />
              <div className={`absolute -inset-4 blur-3xl rounded-full opacity-20 transition-all ${status === 'active' ? 'bg-success' : 'bg-danger'}`} />
            </div>

            <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Bot status</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status === 'active' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                {status === 'active' ? 'CONNECTED & RUNNING' : 'OFFLINE'}
              </span>
            </div>

            <Separator className="my-8 opacity-30" />

            <div className="w-full space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-black uppercase tracking-widest">Active Alerts</span>
                <span className="text-foreground font-black text-xs">Real-time</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-black uppercase tracking-widest">Bot Version</span>
                <span className="text-foreground font-black text-xs">v3.4.1</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-black uppercase tracking-widest">Response Time</span>
                <span className="text-foreground font-black text-xs text-success">~0.4s</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface border border-border shadow-lg rounded-[2rem]">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 tracking-tight">
              <Icon icon="solar:programming-bold-duotone" className="text-accent text-lg" />
              Webhooks
            </h3>
            <div className="space-y-3">
              <div className="text-[9px] font-mono leading-relaxed p-3 rounded-xl bg-default/40 border border-border/50 block w-full truncate">
                https://bot.themrktplace.com/api/v3/webhooks/telegram/active
              </div>
              <Button size="sm" variant="secondary" className="w-full font-bold h-9 rounded-xl border border-border">Copy Endpoint</Button>
            </div>
          </Card>
        </div>

        {/* Configuration & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Bot Token</label>
                <div className="relative group/input">
                  <input
                    type="password"
                    value="7241042104:AAGz8Gz8Gz8Gz8Gz8Gz8Gz8Gz8Gz8Gz8"
                    className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-xs font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40"
                  />
                  <Icon icon="solar:eye-closed-bold-duotone" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted cursor-pointer hover:text-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-1">Admin Group ID</label>
                <input
                  defaultValue="-10045214521"
                  className="w-full bg-default/40 border border-border rounded-2xl py-3.5 px-4 text-xs font-bold outline-none ring-accent/20 focus:ring-4 focus:border-accent/40"
                />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Command Whitelist</h4>
              <div className="flex flex-wrap gap-2">
                {["/start", "/status", "/orders", "/lowstock", "/revenue", "/help"].map(cmd => (
                  <span key={cmd} className="px-3 py-1.5 rounded-xl bg-accent text-white text-[11px] font-black font-mono shadow-sm shadow-accent/20">{cmd}</span>
                ))}
                <button className="px-3 py-1.5 rounded-xl bg-default/40 border border-dashed border-border text-muted text-[11px] font-black hover:border-accent/40 hover:text-accent transition-all">+ Add New</button>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-surface border border-border shadow-2xl rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Live activity log</h3>
              <Button 
                size="sm" 
                variant="secondary" 
                className="font-bold h-9 rounded-xl border border-border"
                onPress={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 800);
                }}
              >
                {isRefreshing ? <Icon icon="solar:refresh-bold-duotone" className="text-lg mr-2 animate-spin" /> : <Icon icon="solar:refresh-bold-duotone" className="text-lg mr-2" />}
                {isRefreshing ? "Refreshing..." : "Refresh Logs"}
              </Button>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              {[
                { time: "10:14:22", type: "INFO", msg: "Bot started successfully in background mode." },
                { time: "10:14:23", type: "OK", msg: "Polling for updates... (Long Polling 30s enabled)" },
                { time: "10:25:01", type: "ALERT", msg: "Outbound: New order #ORD-2026-4521 notified to Admin." },
                { time: "11:32:45", type: "CMD", msg: "Inbound: Received /revenue command from Aryan." },
                { time: "11:32:46", type: "OK", msg: "Response sent for /revenue in 124ms." },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-2xl bg-default/20 border border-border/30 hover:bg-default/40 transition-colors group">
                  <span className="text-muted opacity-40 shrink-0">{log.time}</span>
                  <span className={`font-black shrink-0 ${
                    log.type === 'OK' ? 'text-success' : log.type === 'ALERT' ? 'text-accent' : log.type === 'CMD' ? 'text-warning' : 'text-blue-400'
                  }`}>{log.type}</span>
                  <span className="text-foreground font-medium truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
