"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = "bg-accent/10",
  iconColor = "text-accent",
  suffix,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="stat-card bg-surface rounded-2xl p-5 border border-border/50 hover:border-accent/30 cursor-default transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon icon={icon} className={cn("text-2xl", iconColor)} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            )}
          >
            <Icon
              icon={isPositive ? "solar:arrow-up-bold-duotone" : "solar:arrow-down-bold-duotone"}
              className="text-sm"
            />
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
          {value}
          {suffix && <span className="text-base font-medium text-muted ml-1">{suffix}</span>}
        </p>
        <p className="text-sm text-muted mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-muted/70 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
