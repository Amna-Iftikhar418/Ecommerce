import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

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
    const metadata = session.metadata as {
      userId: string;
      address: string;
      items: string;
    };

    await db.order.create({
      data: {
        userId: metadata.userId,
        status: "PENDING",
        total: (session.amount_total ?? 0) / 100,
        address: JSON.parse(metadata.address),
        paymentId: session.payment_intent as string,
        items: {
          create: JSON.parse(metadata.items),
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}
