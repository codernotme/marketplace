"use client";

import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  // Order statuses
  pending: "bg-warning/15 text-warning",
  processing: "bg-blue-500/15 text-blue-400",
  packed: "bg-indigo-500/15 text-indigo-400",
  shipped: "bg-violet-500/15 text-violet-400",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-danger/15 text-danger",
  returned: "bg-danger/15 text-danger",
  // Payment
  paid: "bg-success/15 text-success",
  failed: "bg-danger/15 text-danger",
  refunded: "bg-muted/20 text-muted",
  // Product
  active: "bg-success/15 text-success",
  draft: "bg-default text-muted",
  archived: "bg-warning/15 text-warning",
  // Ticket
  open: "bg-danger/15 text-danger",
  in_progress: "bg-warning/15 text-warning",
  resolved: "bg-success/15 text-success",
  // General
  inactive: "bg-default text-muted",
};

const labelMap: Record<string, string> = {
  in_progress: "In Progress",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = colorMap[status] ?? "bg-default text-muted";
  const label = labelMap[status] ?? (status.charAt(0).toUpperCase() + status.slice(1));

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        colors,
        className
      )}
    >
      {label}
    </span>
  );
}
