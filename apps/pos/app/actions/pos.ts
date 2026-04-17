"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getPosProducts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.product.findMany({
    where: {
      status: "active",
    },
    include: {
      category: true,
      variants: {
        where: {
          isActive: true
        }
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createPosOrder(data: {
  items: any[];
  total: number;
  subtotal: number;
  customerId?: string;
  email: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const order = await db.order.create({
    data: {
      orderNumber: `POS-${Date.now().toString().slice(-8)}`,
      email: data.email,
      total: data.total,
      subtotal: data.subtotal,
      status: "delivered", // POS orders are usually delivered immediately
      paymentStatus: "paid",
      fulfillmentStatus: "fulfilled",
      items: {
        create: data.items.map((item: any) => ({
          productId: item.id,
          variantId: item.variantId,
          sku: item.sku,
          title: item.name,
          variantTitle: item.variantName,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity,
        })),
      },
    },
  });

  revalidatePath("/dashboard/orders");
  return order;
}
