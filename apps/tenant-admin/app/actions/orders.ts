"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    include: {
      items: true,
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrder(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
    },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const order = await db.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  return order;
}
