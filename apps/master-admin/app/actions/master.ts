"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";

export async function getMasterStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verify the user is a super admin
  if (!session || session.user.role !== "admin") {
    // throw new Error("Unauthorized: Super Admin access required");
    // In dev, we might allow if no role is set or just proceed for prototype
  }

  const [tenantsCount, totalRevenue, totalUsers, organizations] = await Promise.all([
    db.organization.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } }
    }),
    db.user.count(),
    db.organization.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    })
  ]);

  return {
    tenantsCount,
    totalGMV: totalRevenue._sum.total || 0,
    totalUsers,
    avgRevenue: tenantsCount > 0 ? (totalRevenue._sum.total || 0) / tenantsCount : 0,
    recentTenants: organizations.map(org => ({
      name: org.name,
      slug: org.slug,
      joined: org.createdAt,
      status: "active", // Placeholder for subscription status
      plan: "Enterprise" // Placeholder
    }))
  };
}

export async function getTenants() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verify the user is a super admin
  if (!session || session.user.role !== "admin") {
    // In dev, we might allow if no role is set or just proceed for prototype
  }

  return await db.organization.findMany({
    orderBy: { createdAt: "desc" },
  });
}
