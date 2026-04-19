"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDashboardMetrics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const [totalOrders, totalRevenueData, activeCustomers, totalProducts] = await Promise.all([
      // Count total orders (not failed or cancelled)
      prisma.order.count({
        where: {
          paymentStatus: {
            notIn: ["FAILED", "CANCELLED"]
          }
        }
      }),
      
      // Sum the total revenue for paid orders
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          paymentStatus: "PAID"
        }
      }),

      // Count active customers
      prisma.customer.count({
        where: {
          status: "ACTIVE"
        }
      }),

      // Count active products
      prisma.product.count({
        where: {
          status: "ACTIVE"
        }
      })
    ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenueData._sum.total || 0),
      activeCustomers,
      totalProducts
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    throw new Error("Failed to fetch metrics");
  }
}
