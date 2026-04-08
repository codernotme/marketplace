"use client";

import { useState } from "react";
import { Button, Input, Card, Badge, Tooltip, Dropdown, Label, Separator, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useTicketsStore } from "@/lib/store";

const PRIORITY_COLORS = {
  low: "bg-default/60 text-muted",
  medium: "bg-warning/15 text-warning border-warning/10",
  high: "bg-danger/15 text-danger border-danger/10 shadow-[0_0_8px_rgba(239,68,68,0.1)]",
};

const STATUS_COLORS = {
  open: "bg-success/15 text-success",
  in_progress: "bg-accent/15 text-accent",
  resolved: "bg-default/60 text-muted",
};

export default function QueriesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { tickets } = useTicketsStore();

  const filtered = tickets.filter(t => 
    (activeFilter === "all" || t.status === activeFilter) &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Support"
        subtitle={`${tickets.filter(t => t.status === "open").length} open inquiries require attention`}
        icon="solar:chat-round-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="font-bold border border-border">
              <Icon icon="solar:settings-bold-duotone" className="text-lg mr-2" />
              Settings
            </Button>
            <Button variant="primary" size="sm" className="font-bold shadow-lg shadow-accent/20">
              <Icon icon="solar:add-circle-bold-duotone" className="text-lg mr-2" />
              New Ticket
            </Button>
          </div>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-1 p-1 bg-default/40 rounded-2xl w-full md:w-fit overflow-x-auto">
          {["all", "open", "in_progress", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === status ? "bg-surface text-accent shadow-md border border-border" : "text-muted hover:text-foreground"
              }`}
            >
              {status.replace("_", " ")}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === status ? "bg-accent text-white" : "bg-default/80 text-muted"}`}>
                {status === "all" ? tickets.length : tickets.filter(t => t.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <div className="flex items-center gap-2 bg-default/40 border border-border rounded-2xl px-4 py-2.5 text-sm hover:border-accent/40 transition-all group focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-accent/10">
            <Icon icon="solar:magnifer-bold-duotone" className="text-lg text-muted group-focus-within:text-accent" />
            <input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* Grid of Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="p-6 bg-surface border border-border shadow-xl rounded-[2.5rem] hover:border-accent/40 transition-all group cursor-pointer relative overflow-hidden"
            onClick={() => {}}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-6">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${PRIORITY_COLORS[ticket.priority]}`}>
                {ticket.priority} Priority
              </span>
              <span className="text-[10px] text-muted font-bold tracking-tighter opacity-70 uppercase">{ticket.id}</span>
            </div>

            <h3 className="text-lg font-black tracking-tight mb-4 group-hover:text-accent transition-colors leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
              {ticket.subject}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-default/40 rounded-2xl border border-border/50">
                <div className="w-8 h-8 rounded-xl bg-default/40 border border-border/50 overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${ticket.customer.name}`}
                    alt={ticket.customer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black tracking-tight truncate">{ticket.customer.name}</p>
                  <p className="text-[10px] text-muted font-medium truncate">{ticket.customer.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-muted font-bold">
                  <Icon icon="solar:clock-circle-bold-duotone" className="text-sm" />
                  <span suppressHydrationWarning>{new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-wider text-[10px] ${STATUS_COLORS[ticket.status]}`}>
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Separator className="opacity-30" />
              <div className="flex items-center justify-between text-[10px] font-black text-muted uppercase tracking-widest pl-1">
                <span>Category</span>
                <span className="text-foreground tracking-tight">{ticket.category}</span>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center bg-surface/50 border-2 border-dashed border-border/60 rounded-[3rem]">
            <div className="w-20 h-20 bg-default/20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted/40">
              <Icon icon="solar:inbox-line-bold-duotone" className="text-5xl" />
            </div>
            <h4 className="text-xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-outfit)" }}>No tickets found</h4>
            <p className="text-sm text-muted font-medium">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
