"use server";

import { db } from "@workspace/db";
import { startOfMonth, subMonths, format, endOfMonth } from "date-fns";

/**
 * Fetches platform-wide revenue and tenant growth trends for the last 6 months.
 */
export async function getPlatformTrends() {
  const months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, "MMM"),
    };
  });

  const trends = await Promise.all(
    months.map(async (month) => {
      const revenue = await db.order.aggregate({
        where: {
          status: { not: "cancelled" },
          createdAt: {
            gte: month.start,
            lte: month.end,
          },
        },
        _sum: { total: true },
      });

      const tenantCount = await db.organization.count({
        where: {
          createdAt: {
            lte: month.end,
          },
        },
      });

      return {
        month: month.label,
        revenue: revenue._sum.total || 0,
        tenants: tenantCount,
      };
    })
  );

  return trends;
}

/**
 * Basic Weekly Retention Cohorts based on first order activity.
 */
export async function getRetentionCohorts() {
  // Mock data for prototype - in real scenario this involves complex group-by queries
  return [
    { cohort: "Oct 2025", total: 45, week1: 88, week2: 76, week3: 65, week4: 45 },
    { cohort: "Nov 2025", total: 52, week1: 92, week2: 81, week3: 72, week4: 58 },
    { cohort: "Dec 2025", total: 68, week1: 85, week2: 74, week3: 60, week4: 32 },
    { cohort: "Jan 2026", total: 34, week1: 95, week2: 89, week3: 78, week4: 0 },
  ];
}

/**
 * Generates a platform audit report as CSV string.
 */
export async function exportPlatformAudit() {
  const logs = await db.auditLog.findMany({
    take: 1000,
    orderBy: { createdAt: "desc" },
    include: { actor: true },
  });

  const headers = ["Timestamp", "Actor", "Action", "OrgID", "Metadata"];
  const rows = logs.map(log => [
    log.createdAt.toISOString(),
    log.actor.email,
    log.action,
    log.organizationId || "System",
    log.metadata || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  return csvContent;
}
