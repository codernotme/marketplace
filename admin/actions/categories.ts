"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: { products: true, children: true }
      }
    },
    orderBy: { sortOrder: "asc" }
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
}) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        isActive: data.isActive
      }
    });

    revalidatePath("/dashboard/categories");
    return { success: true, data: newCategory };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A category with this slug already exists." };
    }
    console.error("Failed to create category:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateCategory(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
}>) {
  try {
    const updated = await prisma.category.update({
      where: { id },
      data
    });

    revalidatePath("/dashboard/categories");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id }
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Cannot delete category. It may have products attached." };
  }
}
