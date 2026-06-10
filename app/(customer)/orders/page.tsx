import Link from "next/link";
import { Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default async function OrdersPage() {
  const userId = await getAuthUser();

  const orders = await db.order.findMany({
    where: { userId },
    include: { items: { include: { menuItem: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <main className="container mx-auto py-20 px-4 flex flex-col items-center text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">
          Once you place your first order, it&apos;ll appear here.
        </p>
        <Link
          href="/menu"
          className={cn(buttonVariants(), "bg-orange-500 hover:bg-orange-600 text-white")}
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const orderRef = `#${order.id.slice(-8).toUpperCase()}`;
          const date = new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          });
          const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
          const preview = order.items
            .slice(0, 2)
            .map((i) => i.menuItem.name)
            .join(", ");
          const hasMore = order.items.length > 2;

          return (
            <div key={order.id} className="bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="font-mono font-semibold text-sm">{orderRef}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{date}</p>
                <p className="text-sm truncate">
                  {preview}{hasMore && ` +${order.items.length - 2} more`}
                </p>
                <p className="text-sm font-medium mt-1">
                  {itemCount} {itemCount === 1 ? "item" : "items"} · ${order.total.toFixed(2)}
                </p>
              </div>

              <Link
                href={`/orders/${order.id}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
