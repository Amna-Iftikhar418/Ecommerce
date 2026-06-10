import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {customers.length} registered customers
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No customers yet</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const orderCount = customer.orders.length;
                const totalSpent = customer.orders.reduce(
                  (s, o) => s + o.total,
                  0
                );
                const lastOrder = customer.orders[0]?.createdAt;

                return (
                  <TableRow key={customer.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                          {(customer.name ?? customer.email)
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {customer.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{orderCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {orderCount === 1 ? "order" : "orders"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">
                        ${totalSpent.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {lastOrder
                          ? new Date(lastOrder).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
