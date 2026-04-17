"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [totalRevenue, ordersCount, customersCount, productsCount] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } }
    }),
    db.order.count(),
    db.user.count({ where: { role: "user" } }),
    db.product.count(),
  ]);

  // Mocking simple chart data based on real orders
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const salesData = await Promise.all(
    last7Days.map(async (date) => {
      const stats = await db.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 86400000),
          },
          status: { not: "cancelled" }
        }
      });
      return {
        date,
        revenue: stats._sum.total || 0
      };
    })
  );

  return {
    revenue: totalRevenue._sum.total || 0,
    orders: ordersCount,
    customers: customersCount,
    products: productsCount,
    salesData,
    recentOrders: await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true
      }
    })
  };
}
