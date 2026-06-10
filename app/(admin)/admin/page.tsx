import Link from "next/link";
import {
  Package,
  DollarSign,
  Clock,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default async function AdminDashboardPage() {
  await getAdminUser();

  const [
    totalOrders,
    revenueAgg,
    activeCount,
    menuItemCount,
    customerCount,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.order.count({ where: { status: { in: ["PENDING", "PREPARING"] } } }),
    db.menuItem.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
    }),
  ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      Icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      Icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Active Orders",
      value: activeCount,
      Icon: Clock,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Menu Items",
      value: menuItemCount,
      Icon: UtensilsCrossed,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Customers",
      value: customerCount,
      Icon: Users,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white border rounded-xl p-4">
            <div
              className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-orange-500 hover:underline"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center text-muted-foreground text-sm">
            No orders yet
          </p>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-6 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-sm font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.user.name ?? order.user.email} ·{" "}
                    {order.items.map((i) => i.menuItem.name).join(", ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
