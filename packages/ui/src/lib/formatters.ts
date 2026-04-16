/**
 * Shared formatters for currency, dates, numbers, and more.
 * Used across all apps in the themrktplace monorepo.
 */

// ─── Currency Formatters ────────────────────────────────────────────────────

export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  compact?: boolean;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {},
): string {
  const { currency = "INR", locale = "en-IN", compact = false } = options;

  if (compact && Math.abs(amount) >= 1_000_000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number, compact = false): string {
  return formatCurrency(amount, { currency: "USD", locale: "en-US", compact });
}

export function formatINR(amount: number, compact = false): string {
  return formatCurrency(amount, { currency: "INR", locale: "en-IN", compact });
}

// ─── Number Formatters ──────────────────────────────────────────────────────

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions & { locale?: string } = {},
): string {
  const { locale = "en-IN", ...rest } = options;
  return new Intl.NumberFormat(locale, rest).format(value);
}

export function formatCompact(value: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(
  value: number,
  fractionDigits = 1,
  locale = "en-IN",
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
}

// ─── Date Formatters ────────────────────────────────────────────────────────

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions & { locale?: string } = {},
): string {
  const { locale = "en-IN", ...rest } = options;
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...rest,
  }).format(d);
}

export function formatDateTime(date: Date | string | number, locale = "en-IN"): string {
  return formatDate(date, {
    locale,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string | number, locale = "en-IN"): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
  return formatDate(d, { locale });
}

// ─── String Formatters ──────────────────────────────────────────────────────

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncate(str: string, maxLength: number, ellipsis = "…"): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Order / Status Formatters ──────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending:    "Pending",
    confirmed:  "Confirmed",
    processing: "Processing",
    shipped:    "Shipped",
    delivered:  "Delivered",
    cancelled:  "Cancelled",
    refunded:   "Refunded",
  };
  return map[status] ?? titleCase(status);
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:    "text-warning bg-warning/10",
    confirmed:  "text-info bg-info/10",
    processing: "text-primary bg-primary/10",
    shipped:    "text-info bg-info/10",
    delivered:  "text-success bg-success/10",
    cancelled:  "text-destructive bg-destructive/10",
    refunded:   "text-muted-foreground bg-muted",
  };
  return map[status] ?? "text-muted-foreground bg-muted";
}

// ─── File Size ──────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
