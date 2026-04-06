"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTicketsStore } from "@/lib/store";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-danger/15 text-danger",
  medium: "bg-warning/15 text-warning",
  low: "bg-default text-muted",
};

export default function QueriesPage() {
  const { tickets, updateTicketStatus, addMessage } = useTicketsStore();
  const [selected, setSelected] = useState(tickets[0]?.id ?? "");
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");

  const filtered = tickets.filter((t) => statusFilter === "all" || t.status === statusFilter);
  const selectedTicket = tickets.find((t) => t.id === selected);

  const handleReply = () => {
    if (!replyText.trim() || !selected) return;
    addMessage(selected, replyText.trim(), "admin");
    setReplyText("");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer Queries"
        subtitle={`${tickets.filter(t => t.status === "open").length} open tickets`}
        icon="solar:chat-round-bold-duotone"
      />

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-default/40 rounded-xl w-fit">
        {(["all", "open", "in_progress", "resolved"] as const).map((opt) => {
          const count = opt === "all" ? tickets.length : tickets.filter(t => t.status === opt).length;
          return (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize whitespace-nowrap ${
                statusFilter === opt ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {opt === "in_progress" ? "In Progress" : opt}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === opt ? "bg-accent/10 text-accent" : "bg-default/80 text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Ticket list */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <Input
              placeholder="Search tickets…"
              size="sm"
              startContent={<Icon icon="solar:magnifer-bold-duotone" className="text-muted text-base" />}
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filtered.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelected(ticket.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selected === ticket.id ? "bg-accent/8 border-l-2 border-accent" : "hover:bg-default/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold leading-snug line-clamp-1">{ticket.subject}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-xs text-muted mb-2">{ticket.customer.name} · {ticket.category}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={ticket.status} />
                  <span className="text-xs text-muted">{new Date(ticket.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted text-sm">
                <Icon icon="solar:inbox-bold-duotone" className="text-4xl mx-auto mb-2 opacity-20" />
                No tickets
              </div>
            )}
          </div>
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base leading-snug mb-1">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={selectedTicket.status} />
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${PRIORITY_COLORS[selectedTicket.priority]}`}>
                        {selectedTicket.priority} priority
                      </span>
                      <span className="text-xs text-muted">{selectedTicket.customer.name} · #{selectedTicket.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {(["open", "in_progress", "resolved"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateTicketStatus(selectedTicket.id, s)}
                        className={`text-xs px-2 py-1 rounded-lg border font-medium transition-colors ${
                          selectedTicket.status === s
                            ? "bg-accent/10 border-accent text-accent"
                            : "border-border text-muted hover:border-accent/50"
                        }`}
                      >
                        {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedTicket.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.from === "admin" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.from === "admin" ? "bg-accent/20 text-accent" : "bg-default text-muted"
                    }`}>
                      {msg.from === "admin" ? "A" : selectedTicket.customer.name[0]}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                        msg.from === "admin"
                          ? "bg-accent/10 text-foreground rounded-tr-sm"
                          : "bg-default/60 text-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className="text-xs text-muted mt-1.5">
                        {new Date(msg.at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedTicket.status !== "resolved" && (
                <div className="p-4 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply()}
                    placeholder="Type your reply…"
                    className="flex-1 bg-default/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={handleReply}
                    isDisabled={!replyText.trim()}
                    className="gap-2 flex-shrink-0"
                  >
                    <Icon icon="solar:send-bold-duotone" className="text-base" />
                    Send
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-muted">
              <Icon icon="solar:chat-round-bold-duotone" className="text-5xl opacity-20" />
              <p className="text-sm">Select a ticket to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
