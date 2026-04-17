"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Fetches all products for the current tenant.
 * Note: High-level abstraction. In Phase 2+, we will implement
 * schema-per-tenant switching logic.
 */
export async function getProducts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // TODO: Resolve tenant schema and set search_path
  // For now, fetching all products (filtered by createdBy if needed)
  return await db.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategories() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createProduct(data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const product = await db.product.create({
    data: {
      ...data,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard/products");
  return product;
}

export async function getProduct(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
    },
  });
}

export async function updateProduct(id: string, data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const product = await db.product.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  return product;
}

export async function createCategory(data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const category = await db.category.create({
    data: {
      ...data,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/products/new");
  return category;
}
