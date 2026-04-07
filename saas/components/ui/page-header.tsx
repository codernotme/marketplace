"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8", className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <Icon icon={icon} className="text-2xl text-primary" />
          </div>
        )}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
