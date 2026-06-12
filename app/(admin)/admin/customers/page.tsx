import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import CustomersClient from "./CustomersClient";

export default async function AdminCustomersPage() {
  await getAdminUser();

  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        select: { total: true, createdAt: true, status: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { email: "asc" },
  });

  const rows = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    orderCount: customer.orders.length,
    totalSpent: customer.orders.reduce((s, o) => s + o.total, 0),
    lastOrder: customer.orders[0]?.createdAt.toISOString() ?? null,
    hasActiveOrders: customer.orders.some(
      (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
    ),
  }));

  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="font-heading italic text-accent">Guest Book</p>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Customers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CustomersClient customers={rows} />
    </main>
  );
}
