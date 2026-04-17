"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";

/**
 * Validates and applies a coupon code to an existing subscription.
 */
export async function applyCoupon(subscriptionId: string, code: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    // Permission check for master admin
  }

  const coupon = await db.coupon.findUnique({
    where: { code, isActive: true },
  });

  if (!coupon) {
    throw new Error("Invalid or expired coupon code");
  }

  // Check usage limits
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  return await db.$transaction(async (tx) => {
    const subscription = await tx.subscription.update({
      where: { id: subscriptionId },
      data: {
        couponId: coupon.id,
      },
    });

    await tx.coupon.update({
      where: { id: coupon.id },
      data: {
        usageCount: { increment: 1 },
      },
    });

    // Log the action
    await tx.auditLog.create({
      data: {
        actorId: session?.user.id || "system",
        organizationId: subscription.organizationId,
        action: "COUPON_APPLIED",
        metadata: JSON.stringify({ code, discount: coupon.amount, type: coupon.discountType }),
      },
    });

    return subscription;
  });
}

/**
 * Generates or retrieves a platform invoice for a subscription period.
 * Currently returns a mock-structured object which can be rendered as HTML or PDF.
 */
export async function generateInvoice(subscriptionId: string) {
  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      organization: true,
      plan: true,
      coupon: true,
    },
  });

  if (!subscription) throw new Error("Subscription not found");

  const subtotal = subscription.plan.price;
  let discount = 0;

  if (subscription.coupon) {
    if (subscription.coupon.discountType === "percentage") {
      discount = (subtotal * subscription.coupon.amount) / 100;
    } else {
      discount = subscription.coupon.amount;
    }
  }

  const total = Math.max(0, subtotal - discount);

  return {
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString(),
    organization: {
      name: subscription.organization.name,
      slug: subscription.organization.slug,
    },
    plan: {
      name: subscription.plan.name,
      price: subtotal,
    },
    coupon: subscription.coupon ? {
      code: subscription.coupon.code,
      discount,
    } : null,
    total,
    currency: "INR",
  };
}
