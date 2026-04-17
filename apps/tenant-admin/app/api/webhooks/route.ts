import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Global Webhook Receiver for the Tenant Admin.
 * Handles events from:
 * - Stripe/Razorpay (Payments)
 * - Better Auth (User/Org events)
 * - Custom platform events
 */
export async function POST(req: Request) {
  const headerList = await headers();
  const signature = headerList.get("x-signature");
  
  if (!signature && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { event, data } = body;

    console.log(`[Webhook] Received event: ${event}`);

    switch (event) {
      case "checkout.completed":
        // Handle payment success
        await handlePaymentSuccess(data);
        break;
      case "inventory.threshold_reached":
        // Handle low stock
        await handleLowStock(data);
        break;
      default:
        console.warn(`[Webhook] Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing webhook:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function handlePaymentSuccess(data: any) {
  // Logic to update order status to 'PAID' or 'SHIPPED'
  console.log("Processing payment success for order:", data.orderId);
}

async function handleLowStock(data: any) {
  // Logic to trigger internal alerts or emails
  console.log("Processing low stock alert for product:", data.productId);
}
