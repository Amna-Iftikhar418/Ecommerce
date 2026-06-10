import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: Date | null;
};

export default async function AdminCustomersPage() {
  await getAdminUser();

  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { email: "asc" },
  });

  const rows: Customer[] = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    orderCount: customer.orders.length,
    totalSpent: customer.orders.reduce((s, o) => s + o.total, 0),
    lastOrder: customer.orders[0]?.createdAt ?? null,
  }));

  const columns = [
    {
      header: "Customer",
      cell: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
            {(customer.name ?? customer.email)
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{customer.name ?? "—"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Orders",
      cell: (customer: Customer) => (
        <span>
          <span className="text-sm font-medium">{customer.orderCount}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            {customer.orderCount === 1 ? "order" : "orders"}
          </span>
        </span>
      ),
    },
    {
      header: "Total Spent",
      cell: (customer: Customer) => (
        <span className="font-heading text-sm font-semibold">
          ${customer.totalSpent.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Last Order",
      cell: (customer: Customer) => (
        <span className="text-sm text-muted-foreground">
          {customer.lastOrder
            ? new Date(customer.lastOrder).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
  ];

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

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-16 text-center shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">No customers yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Registered customers will appear here.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}
    </main>
  );
}
