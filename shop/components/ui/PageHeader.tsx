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
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon icon={icon} className="text-xl text-accent" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
