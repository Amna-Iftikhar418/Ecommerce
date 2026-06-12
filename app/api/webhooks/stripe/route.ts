import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderId } = session.metadata as { orderId: string; userId: string };

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    // Update order with payment ID
    const order = await db.order.update({
      where: { id: orderId },
      data: { paymentId: paymentIntentId, paymentStatus: "PAID" },
      include: { items: { include: { menuItem: true } }, user: true },
    });

    // Send confirmation email
    const customerEmail =
      session.customer_details?.email ?? order.user.email;
    const customerName =
      session.customer_details?.name ?? order.user.name ?? "Customer";
    const address = order.address as {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
    };

    await sendOrderConfirmationEmail({
      to: customerEmail,
      customerName,
      orderId: order.id,
      items: order.items.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      address,
      paymentMethod: "CARD",
    }).catch(console.error); // don't fail the webhook if email fails
  }

  return NextResponse.json({ received: true });
}
