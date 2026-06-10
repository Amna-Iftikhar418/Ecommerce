import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

type CartItemPayload = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options: { name: string; choice: string; priceModifier: number }[];
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    items: CartItemPayload[];
    address: Record<string, string>;
  };
  const { items, address } = body;

  if (!items?.length || !address) {
    return NextResponse.json(
      { error: "Missing items or address" },
      { status: 400 }
    );
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  // Ensure user exists in DB
  await db.user.upsert({
    where: { id: userId },
    update: { email, name: clerkUser.fullName },
    create: { id: userId, email, name: clerkUser.fullName },
  });

  // Compute per-item unit price (base + options)
  const enriched = items.map((item) => ({
    ...item,
    unitPrice:
      item.price +
      item.options.reduce((s, o) => s + o.priceModifier, 0),
  }));

  const total = enriched.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Pre-create order in DB so metadata only needs the ID
  const order = await db.order.create({
    data: {
      userId,
      status: "PENDING",
      total,
      address,
      items: {
        create: enriched.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.unitPrice,
          options: item.options.length > 0 ? item.options : undefined,
        })),
      },
    },
  });

  const lineItems = enriched.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.unitPrice * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded" as Stripe.Checkout.SessionCreateParams.UiMode,
    line_items: lineItems,
    mode: "payment",
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: email,
    metadata: { orderId: order.id, userId },
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
