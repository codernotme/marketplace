"use server"

import { ProductVariant } from "./mock-data";

export type CartItemType = {
  id: string; // unique ID for cart item
  variant: ProductVariant;
  quantity: number;
}

// Since we are mocking the DB, we will rely on the client to store the cart state
// (e.g. in local storage) instead of building a full in-memory cache here.
// These actions are placeholders for when Prisma is connected.

export async function addToCart(variantId: string, quantity: number) {
  // Mock DB addition
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
}

export async function checkout(items: CartItemType[]) {
  // Mock checkout processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, orderId: "ORD-" + Math.floor(Math.random() * 1000000) };
}
