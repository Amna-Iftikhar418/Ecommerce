import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import ConfirmationClient from "@/components/checkout/ConfirmationClient";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ session_id?: string; orderId?: string }>;
};

export const metadata = { title: "Order Confirmed | Bella Cucina" };

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id, orderId: codOrderId } = await searchParams;

  // Cash on Delivery flow — order was created directly, no Stripe session
  if (codOrderId) {
    const userId = await getAuthUser();

    const order = await db.order.findUnique({
      where: { id: codOrderId, userId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!order) {
      return (
        <main className="container mx-auto py-16 px-4 text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Order not found</h1>
          <Link href="/" className="text-accent hover:underline">
            Go home
          </Link>
        </main>
      );
    }

    return (
      <ConfirmationClient
        customerEmail={null}
        orderId={order.id}
        orderTotal={order.total}
        deliveryFee={order.deliveryFee}
        tax={order.tax}
        orderItems={order.items.map((i) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.price,
        }))}
        paymentMethod="COD"
      />
    );
  }

  if (!session_id) {
    return (
      <main className="container mx-auto py-16 px-4 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2">Invalid confirmation link</h1>
        <Link href="/" className="text-accent hover:underline">
          Go home
        </Link>
      </main>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return (
      <main className="container mx-auto py-16 px-4 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2">Session not found</h1>
        <Link href="/" className="text-accent hover:underline">
          Go home
        </Link>
      </main>
    );
  }

  if (session.status !== "complete") {
    return (
      <main className="container mx-auto py-16 px-4 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2">Payment not completed</h1>
        <Link href="/checkout" className="text-accent hover:underline">
          Return to checkout
        </Link>
      </main>
    );
  }

  const orderId = session.metadata?.orderId ?? null;

  const order = orderId
    ? await db.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { menuItem: true } } },
      })
    : null;

  return (
    <ConfirmationClient
      customerEmail={session.customer_details?.email ?? null}
      orderId={orderId}
      orderTotal={order?.total ?? (session.amount_total ?? 0) / 100}
      deliveryFee={order?.deliveryFee ?? 0}
      tax={order?.tax ?? 0}
      orderItems={
        order?.items.map((i) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.price,
        })) ?? []
      }
      paymentMethod="CARD"
    />
  );
}
