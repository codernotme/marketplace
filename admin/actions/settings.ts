"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStoreConfig() {
  let config = await prisma.storeConfig.findFirst();
  
  if (!config) {
    config = await prisma.storeConfig.create({
      data: {
        name: "My eCommerce Store",
        currency: "INR",
        timezone: "Asia/Kolkata",
      }
    });
  }
  
  return config;
}

export async function updateStoreConfig(id: string, data: any) {
  try {
    const updated = await prisma.storeConfig.update({
      where: { id },
      data
    });
    
    revalidatePath("/dashboard/settings");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update store configuration." };
  }
}
