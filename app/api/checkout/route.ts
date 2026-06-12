import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { calculatePricing } from "@/lib/pricing";
import { sendOrderConfirmationEmail } from "@/lib/email";

type CartItemPayload = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options: { name: string; choice: string; priceModifier: number }[];
};

type PaymentMethod = "CARD" | "COD";

export async function POST(req: NextRequest) {
  try {
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
      paymentMethod?: PaymentMethod;
    };
    const { items, address, paymentMethod = "CARD" } = body;

    if (!items?.length || !address) {
      return NextResponse.json(
        { error: "Missing items or address" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "CARD" && paymentMethod !== "COD") {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Guard against stale cart items (e.g. menu was re-seeded since item was added)
    const menuItemIds = [...new Set(items.map((item) => item.menuItemId))];
    const existingMenuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true },
    });
    if (existingMenuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        {
          error:
            "Some items in your cart are no longer available. Please clear your cart and add them again.",
        },
        { status: 409 }
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

    const subtotal = enriched.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const settings = await getSettings();

    if (paymentMethod === "COD" && !settings.codEnabled) {
      return NextResponse.json(
        { error: "Cash on delivery is currently unavailable. Please pay by card." },
        { status: 400 }
      );
    }

    const { deliveryFee, tax, total } = calculatePricing(subtotal, {
      deliveryFee: settings.deliveryFee,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      taxRate: settings.taxRate,
    });

    // Pre-create order in DB so metadata only needs the ID
    const order = await db.order.create({
      data: {
        userId,
        status: "PENDING",
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
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
      include: { items: { include: { menuItem: true } } },
    });

    if (paymentMethod === "COD") {
      const addr = address as {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
      };

      await sendOrderConfirmationEmail({
        to: email,
        customerName: clerkUser.fullName ?? "Customer",
        orderId: order.id,
        items: order.items.map((i) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        address: addr,
        paymentMethod: "COD",
      }).catch(console.error);

      return NextResponse.json({ orderId: order.id });
    }

    const lineItems = enriched.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Tax (${settings.taxRate}%)` },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page" as Stripe.Checkout.SessionCreateParams.UiMode,
        line_items: lineItems,
        mode: "payment",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: email,
        metadata: { orderId: order.id, userId },
      });

      return NextResponse.json({ clientSecret: session.client_secret });
    } catch (stripeErr) {
      // Roll back the pre-created order so it doesn't show up as a phantom PENDING order
      await db.$transaction([
        db.orderItem.deleteMany({ where: { orderId: order.id } }),
        db.order.delete({ where: { id: order.id } }),
      ]);
      throw stripeErr;
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Something went wrong while starting checkout. Please try again." },
      { status: 500 }
    );
  }
}
