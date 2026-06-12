"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Circle, Package, ChefHat, Truck, MapPin, Banknote, CreditCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderStatus = "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
type PaymentMethod = "CARD" | "COD";
type PaymentStatus = "PENDING" | "PAID";

type TrackedOrder = {
  id: string;
  status: OrderStatus;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  address: { line1: string; line2?: string; city: string; state: string; zip: string; country: string };
  items: {
    id: string;
    quantity: number;
    price: number;
    menuItem: { name: string; image: string | null };
  }[];
};

const STEPS: { status: OrderStatus; label: string; sublabel: string; Icon: React.ElementType }[] = [
  { status: "PENDING",    label: "Order Received",  sublabel: "We got your order",          Icon: Package },
  { status: "PREPARING",  label: "Preparing",       sublabel: "Kitchen is on it",           Icon: ChefHat },
  { status: "ON_THE_WAY", label: "On the Way",      sublabel: "Driver heading your way",    Icon: Truck },
  { status: "DELIVERED",  label: "Delivered",       sublabel: "Enjoy your meal!",            Icon: CheckCircle },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  PENDING: 0, PREPARING: 1, ON_THE_WAY: 2, DELIVERED: 3, CANCELLED: -1,
};

export default function OrderTrackingClient({ initialOrder }: { initialOrder: TrackedOrder }) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (order.status === "DELIVERED" || order.status === "CANCELLED") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const updated = await res.json() as TrackedOrder;
          setOrder(updated);
        }
      } catch {
        // silently ignore network errors between polls
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [order.status, order.id]);

  const currentStep = STATUS_INDEX[order.status];
  const isCancelled = order.status === "CANCELLED";
  const orderRef = `#${order.id.slice(-8).toUpperCase()}`;
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const createdAt = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <div>
      <PageHeader
        backHref="/orders"
        backLabel="Back to Orders"
        title={`Order ${orderRef}`}
        description={createdAt}
        action={<OrderStatusBadge status={order.status} />}
      />

      <main className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Status Timeline */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-4 shadow-sm">
          {isCancelled ? (
            <div className="flex items-center gap-3 text-red-600">
              <Circle className="h-8 w-8 fill-red-100 stroke-red-400" />
              <div>
                <p className="font-semibold">Order Cancelled</p>
                <p className="text-sm text-red-500">This order was cancelled.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* connector line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" aria-hidden />
              <div
                className="absolute top-5 left-5 h-0.5 bg-accent transition-all duration-700"
                style={{ width: currentStep === 0 ? 0 : `${(currentStep / 3) * (100 - (10 / STEPS.length))}%` }}
                aria-hidden
              />

              <ol className="relative flex justify-between">
                {STEPS.map((step, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep;
                  const { Icon } = step;

                  return (
                    <li key={step.status} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                          done  && "border-accent bg-accent text-accent-foreground",
                          active && "border-accent bg-card text-accent",
                          !done && !active && "border-border bg-card text-muted-foreground/40"
                        )}
                      >
                        {done ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className={cn("text-xs font-medium leading-tight", active ? "text-accent" : done ? "text-foreground" : "text-muted-foreground")}>
                          {step.label}
                        </p>
                        {active && (
                          <p className="text-xs text-muted-foreground mt-0.5">{step.sublabel}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* mobile active step label */}
              <p className="sm:hidden text-sm font-medium text-accent text-center mt-4">
                {STEPS[currentStep]?.label} — {STEPS[currentStep]?.sublabel}
              </p>
            </div>
          )}

          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Status updates automatically every 10 seconds
            </p>
          )}
        </div>

        {/* Delivery Address */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-accent" />
            <h2 className="font-heading font-semibold">Delivery Address</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {order.address.line1}
            {order.address.line2 && `, ${order.address.line2}`}
            <br />
            {order.address.city}, {order.address.state} {order.address.zip}
            <br />
            {order.address.country}
          </p>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span>
                  <span className="font-medium">{item.quantity}×</span>{" "}
                  {item.menuItem.name}
                </span>
                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm mb-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              {order.deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span>${order.deliveryFee.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5">
              {order.paymentMethod === "COD" ? (
                <Banknote className="h-3.5 w-3.5" />
              ) : (
                <CreditCard className="h-3.5 w-3.5" />
              )}
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card"}
            </span>
            <span className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-medium",
              order.paymentStatus === "PAID"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            )}>
              {order.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
            </span>
          </div>

          {order.paymentMethod === "COD" && order.paymentStatus === "PENDING" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              <Banknote className="h-4 w-4 shrink-0" />
              <p>Please have <span className="font-semibold">${order.total.toFixed(2)}</span> ready for the driver.</p>
            </div>
          )}

          <Link
            href="/menu"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "w-full mt-4"
            )}
          >
            Order Again
          </Link>
        </div>
      </main>
    </div>
  );
}
