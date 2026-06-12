"use client";

import { useState, useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { calculatePricing, type PricingSettings } from "@/lib/pricing";
import AddressForm, { type AddressData, type PaymentMethod } from "./AddressForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutClient({
  pricing,
  codEnabled,
}: {
  pricing: PricingSettings;
  codEnabled: boolean;
}) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  const subtotal = total();
  const { deliveryFee, tax, total: grandTotal } = calculatePricing(subtotal, pricing);

  const handleAddressSubmit = useCallback(async (addr: AddressData, paymentMethod: PaymentMethod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address: addr, paymentMethod }),
      });
      const data = await res.json() as {
        clientSecret?: string;
        orderId?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");

      if (paymentMethod === "COD") {
        if (!data.orderId) throw new Error("No order ID returned");
        router.push(`/orders/confirmation?orderId=${data.orderId}`);
        return;
      }

      if (!data.clientSecret) throw new Error("No client secret returned");
      setAddress(addr);
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [items, router]);

  useEffect(() => {
    if (hasHydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hasHydrated, items, router]);

  if (!hasHydrated || items.length === 0) {
    return null;
  }

  if (clientSecret) {
    return (
      <div>
        <button
          onClick={() => setClientSecret(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Change address
        </button>
        {address && (
          <div className="mb-6 flex items-start gap-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
            <p className="text-muted-foreground">
              Delivering to{" "}
              <span className="text-foreground">
                {address.line1}, {address.city}, {address.state} {address.zip}
              </span>
            </p>
          </div>
        )}
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-6">
        <h2 className="font-heading font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span>${deliveryFee.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({pricing.taxRate}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-4 w-4 text-accent" />
        <h2 className="font-heading text-xl font-semibold">Delivery Address</h2>
      </div>
      <AddressForm
        onSubmit={handleAddressSubmit}
        loading={loading}
        error={error}
        codEnabled={codEnabled}
      />
    </div>
  );
}
