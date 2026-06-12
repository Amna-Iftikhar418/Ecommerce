import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import OrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
  await getAdminUser();

  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { menuItem: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    user: o.user,
    items: o.items.map((i) => ({
      menuItem: { name: i.menuItem.name },
      quantity: i.quantity,
    })),
  }));

  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="font-heading italic text-accent">Order Management</p>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>
      <OrdersClient initialOrders={serialized} />
    </main>
  );
}
