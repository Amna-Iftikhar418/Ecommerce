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
    createdAt: o.createdAt.toISOString(),
    user: o.user,
    items: o.items.map((i) => ({
      menuItem: { name: i.menuItem.name },
      quantity: i.quantity,
    })),
  }));

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} total orders
          </p>
        </div>
      </div>
      <OrdersClient initialOrders={serialized} />
    </main>
  );
}
