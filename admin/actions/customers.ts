"use server";

import { prisma } from "@/lib/db";

export async function getCustomers(search?: string, status?: string) {
  return await prisma.customer.findMany({
    where: {
      ...(search && { 
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      }),
      ...(status && { status: status as any }),
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateCustomerStatus(id: string, status: any) {
  try {
    const updated = await prisma.customer.update({
      where: { id },
      data: { status }
    });
    return { success: true, data: updated };
  } catch(error) {
    return { success: false, error: "Failed to update status." };
  }
}
