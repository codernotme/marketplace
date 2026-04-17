"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getInventory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Fetch all variants (inventory units)
  return await db.productVariant.findMany({
    include: {
      product: {
        include: {
          category: true,
        }
      }
    },
    orderBy: {
      product: {
        name: "asc"
      }
    }
  });
}

export async function adjustStock(variantId: string, adjustment: number, reason: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const variant = await db.productVariant.update({
    where: { id: variantId },
    data: {
      stock: {
        increment: adjustment
      }
    }
  });

  // In a real app, we would log this to an StockAdjustment table
  // For now, we'll just revalidate
  revalidatePath("/dashboard/products/inventory");
  return variant;
}
