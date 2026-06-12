import Link from "next/link";
import { Package, Banknote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import PageHeader from "@/components/PageHeader";

export default async function OrdersPage() {
  const userId = await getAuthUser();

  const orders = await db.order.findMany({
    where: { userId },
    include: { items: { include: { menuItem: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">
          Once you place your first order, it&apos;ll appear here.
        </p>
        <Link
          href="/menu"
          className={cn(buttonVariants({ size: "lg" }), "bg-accent text-accent-foreground hover:bg-accent/90")}
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Order history" title="Your Orders" />

      <main className="container mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
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
              <div key={order.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-mono font-semibold text-sm">{orderRef}</span>
                    <OrderStatusBadge status={order.status} />
                    {order.paymentMethod === "COD" && (
                      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 border-amber-200">
                        <Banknote className="h-3 w-3" />
                        Cash on Delivery
                      </span>
                    )}
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
    </div>
  );
}
