"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getOrders(status?: string) {
  return await prisma.order.findMany({
    where: {
      ...(status && { paymentStatus: status as any }),
    },
    include: {
      customer: true,
      items: true,
      _count: {
        select: { items: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true
        }
      },
      fulfillments: true,
      shippingAddress: true,
      billingAddress: true,
      timeline: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function updateOrderStatus(id: string, fulfillmentStatus: any) {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { fulfillmentStatus },
    });
    
    // Add timeline event
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        eventType: "STATUS_CHANGE",
        message: `Order fulfillment status changed to ${fulfillmentStatus}`
      }
    });

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: "Failed to update order" };
  }
}
