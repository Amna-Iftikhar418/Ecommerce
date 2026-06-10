import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderTrackingClient from "@/components/orders/OrderTrackingClient";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userId, { id }] = await Promise.all([getAuthUser(), params]);

  const order = await db.order.findUnique({
    where: { id, userId },
    include: {
      items: {
        include: { menuItem: { select: { name: true, image: true } } },
      },
    },
  });

  if (!order) notFound();

  const serialized = {
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    address: order.address as {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    },
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      menuItem: { name: item.menuItem.name, image: item.menuItem.image },
    })),
  };

  return <OrderTrackingClient initialOrder={serialized} />;
}
