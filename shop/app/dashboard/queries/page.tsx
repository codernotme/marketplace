"use client";

import { useState } from "react";
import { Button, Chip, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { tickets, type TicketStatus } from "@/lib/mock-data";

const STATUS_COLORS: Record<TicketStatus, string> = {
  open: "text-danger bg-danger/10",
  in_progress: "text-warning bg-warning/10",
  resolved: "text-success bg-success/10",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-muted",
};

export default function QueriesPage() {
  const [activeTab, setActiveTab] = useState<TicketStatus | "all">("all");
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [reply, setReply] = useState("");

  const filtered = tickets.filter((t) => activeTab === "all" || t.status === activeTab);

  const TABS: { key: TicketStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Queries"
        subtitle={`${tickets.filter((t) => t.status === "open").length} open tickets`}
        icon="solar:chat-round-bold-duotone"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)] min-h-0">
        {/* Ticket List */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border/50 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-border/40">
            {TABS.map((tab) => {
              const count = tab.key === "all" ? tickets.length : tickets.filter((t) => t.status === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.key ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {filtered.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left px-4 py-3.5 hover:bg-default/40 transition-colors ${
                  selectedTicket.id === ticket.id ? "bg-accent/5 border-l-2 border-l-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium leading-snug">{ticket.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status === "in_progress" ? "In Progress" : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{ticket.customer.name}</span>
                  <span>·</span>
                  <span className={PRIORITY_COLORS[ticket.priority]}>
                    {ticket.priority === "high" ? "🔴" : ticket.priority === "medium" ? "🟡" : "🟢"} {ticket.priority}
                  </span>
                  <span>·</span>
                  <span>{ticket.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-3 bg-surface rounded-2xl border border-border/50 overflow-hidden flex flex-col">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold font-[family-name:var(--font-outfit)]">{selectedTicket.subject}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {selectedTicket.customer.name} · {selectedTicket.customer.email}
                      {selectedTicket.orderId && <span> · Order: <span className="text-accent">{selectedTicket.orderId}</span></span>}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Select label="" placeholder="Change Status" className="w-36 text-xs" />
                    <button className="p-1.5 rounded-lg bg-default text-muted hover:text-foreground transition-colors">
                      <Icon icon="solar:close-bold-duotone" className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.from === "admin" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      msg.from === "admin" ? "bg-accent text-white" : "bg-default text-muted"
                    }`}>
                      {msg.from === "admin" ? "A" : selectedTicket.customer.name.charAt(0)}
                    </div>
                    <div className={`max-w-[80%] ${msg.from === "admin" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "admin"
                          ? "bg-accent text-white rounded-tr-sm"
                          : "bg-default text-foreground rounded-tl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(msg.at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-border/40">
                <Textarea
                  placeholder="Type your reply…"
                  value={reply}
                  onValueChange={setReply}
                  minRows={2}
                  maxRows={5}
                />
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Internal note (not sent to customer)
                  </label>
                  <Button variant="primary" size="sm" className="gap-2" isDisabled={!reply.trim()}>
                    <Icon icon="solar:send-bold-duotone" className="text-base" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <Icon icon="solar:chat-round-bold-duotone" className="text-5xl mb-3 opacity-30" />
                <p>Select a ticket to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ label, placeholder, className }: { label: string; placeholder: string; className?: string }) {
  return (
    <select className={`bg-default border border-border/50 text-sm rounded-lg px-3 py-1.5 text-muted ${className}`}>
      <option value="">{placeholder}</option>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="resolved">Resolved</option>
    </select>
  );
}
