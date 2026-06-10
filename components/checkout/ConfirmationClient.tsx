"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  customerEmail: string | null;
  orderId: string | null;
  orderTotal: number;
  orderItems: { name: string; quantity: number; price: number }[];
};

export default function ConfirmationClient({
  customerEmail,
  orderId,
  orderTotal,
  orderItems,
}: Props) {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderRef = orderId ? `#${orderId.slice(-8).toUpperCase()}` : "";

  return (
    <main className="container mx-auto max-w-lg px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold mb-2">Order Confirmed!</h1>
        {orderRef && (
          <p className="text-muted-foreground">
            Order{" "}
            <span className="font-mono font-semibold text-foreground">
              {orderRef}
            </span>
          </p>
        )}
        {customerEmail && (
          <p className="text-muted-foreground text-sm mt-1">
            Confirmation sent to <strong>{customerEmail}</strong>
          </p>
        )}
      </div>

      {orderItems.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6 shadow-sm">
          <h2 className="font-heading font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 mb-6 text-center text-sm text-foreground">
        We&apos;re preparing your order now. Estimated delivery: 30–45 minutes.
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Track Order
          </Link>
        )}
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          Order Again
        </Link>
      </div>
    </main>
  );
}
