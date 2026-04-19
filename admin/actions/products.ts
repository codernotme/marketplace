"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts(search?: string, categoryId?: string, status?: string) {
  return await prisma.product.findMany({
    where: {
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(categoryId && { categoryId }),
      ...(status && { status: status as any }),
    },
    include: {
      category: true,
      variants: true,
      _count: {
        select: { orderItems: true }
      }
    },
    orderBy: { id: "desc" }
  });
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        basePrice: data.basePrice,
        status: data.status,
        categoryId: data.categoryId || null,
        description: data.description || "",
        variants: {
          create: {
            sku: data.sku,
            price: data.basePrice,
            quantity: data.quantity || 0,
            optionValues: {},
          }
        }
      }
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A product with this slug or SKU already exists." };
    }
    console.error("Failed to create product:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
