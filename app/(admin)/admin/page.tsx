import Link from "next/link";
import {
  Package,
  DollarSign,
  Clock,
  UtensilsCrossed,
  Users,
  ArrowRight,
  ReceiptText,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import FadeUp from "@/components/motion/FadeUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerReveal";

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
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      Icon: Package,
      color: "bg-primary/10 text-primary",
      href: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      Icon: DollarSign,
      color: "bg-accent/15 text-accent",
      href: "/admin/orders",
    },
    {
      label: "Active Orders",
      value: activeCount,
      Icon: Clock,
      color: "bg-accent/15 text-accent",
      live: activeCount > 0,
      href: "/admin/orders",
    },
    {
      label: "Menu Items",
      value: menuItemCount,
      Icon: UtensilsCrossed,
      color: "bg-primary/10 text-primary",
      href: "/admin/menu",
    },
    {
      label: "Customers",
      value: customerCount,
      Icon: Users,
      color: "bg-primary/10 text-primary",
      href: "/admin/customers",
    },
  ];

  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <FadeUp>
        <div className="mb-8">
          <p className="font-heading italic text-accent">{today}</p>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s how the kitchen is doing today.
          </p>
        </div>
      </FadeUp>

      <StaggerContainer className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, Icon, color, live, href }) => (
          <StaggerItem key={label}>
            <Link
              href={href}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {live && (
                <span className="absolute right-5 top-5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
              )}
              <p className="font-heading text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeUp delay={0.15}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-heading text-lg font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <ReceiptText className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                New orders will show up here as they come in.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-secondary/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.user.name ?? order.user.email} ·{" "}
                      {order.items.map((i) => i.menuItem.name).join(", ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-heading text-sm font-semibold">
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
      </FadeUp>
    </main>
  );
}
