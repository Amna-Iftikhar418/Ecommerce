"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { calculatePricing, type PricingSettings } from "@/lib/pricing";
import PageHeader from "@/components/PageHeader";
import CartItem from "./CartItem";

export default function CartPageClient({ pricing }: { pricing: PricingSettings }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const { isSignedIn } = useAuth();

  if (items.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some delicious items from our menu
        </p>
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  const subtotal = total();
  const { deliveryFee, tax, total: grandTotal, amountToFreeDelivery } = calculatePricing(
    subtotal,
    pricing
  );

  return (
    <div>
      <PageHeader eyebrow="Almost there" title="Your Cart" />

      <main className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card px-4 shadow-sm">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <button
              onClick={clearCart}
              className="mt-3 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. tax ({pricing.taxRate}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {amountToFreeDelivery !== null && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add ${amountToFreeDelivery.toFixed(2)} more to qualify for free delivery
                </p>
              )}

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-base mb-6">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              {isSignedIn ? (
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                  >
                    Sign in to Checkout
                  </Button>
                </SignInButton>
              )}

              <Link
                href="/menu"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full mt-2"
                )}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
