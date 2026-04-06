import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol = "₹") {
  if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): "success" | "warning" | "danger" | "default" {
  const map: Record<string, "success" | "warning" | "danger" | "default"> = {
    active: "success",
    delivered: "success",
    paid: "success",
    resolved: "success",
    processing: "warning",
    shipped: "warning",
    pending: "warning",
    in_progress: "warning",
    packed: "warning",
    cancelled: "danger",
    failed: "danger",
    returned: "danger",
    archived: "default",
    draft: "default",
    inactive: "default",
    open: "danger",
  };
  return map[status] ?? "default";
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 100;
  return +((((current - previous) / previous) * 100).toFixed(1));
}
