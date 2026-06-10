"use client";

import { useState, useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AddressForm, { type AddressData } from "./AddressForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutClient() {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  const fetchClientSecret = useCallback(async (addr: AddressData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address: addr }),
      });
      const data = await res.json() as { clientSecret?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to create checkout session");
      if (!data.clientSecret) throw new Error("No client secret returned");
      setAddress(addr);
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
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
          <p className="text-sm text-muted-foreground mb-6">
            Delivering to: {address.line1}, {address.city}, {address.state}{" "}
            {address.zip}
          </p>
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
      <h2 className="font-heading text-xl font-semibold mb-6">Delivery Address</h2>
      <AddressForm
        onSubmit={fetchClientSecret}
        loading={loading}
        error={error}
      />
    </div>
  );
}
