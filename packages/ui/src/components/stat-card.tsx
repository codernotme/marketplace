import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

// ─── StatCard ────────────────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  isLoading,
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = change && change.value >= 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden hover:shadow-md transition-shadow duration-200",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>

          {icon && (
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
              {icon}
            </div>
          )}
        </div>

        {change && (
          <div className="flex items-center gap-1 mt-4">
            <span
              className={cn(
                "text-sm font-semibold",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {isPositive ? "+" : ""}
              {change.value.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs {change.period}</span>
          </div>
        )}
      </CardContent>

      {/* Subtle bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />
    </Card>
  );
}

// ─── StatGrid ────────────────────────────────────────────────────────────────

interface StatGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, cols = 4, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
