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
    <main className="container mx-auto py-16 px-4 max-w-lg">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
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
        <div className="bg-white border rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Summary</h2>
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

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 text-sm text-orange-700 text-center">
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
            "flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          )}
        >
          Order Again
        </Link>
      </div>
    </main>
  );
}
