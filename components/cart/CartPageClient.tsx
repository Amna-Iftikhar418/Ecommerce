"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import CartItem from "./CartItem";

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const { isSignedIn } = useAuth();

  if (items.length === 0) {
    return (
      <main className="container mx-auto py-20 px-4 flex flex-col items-center text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some delicious items from our menu
        </p>
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ size: "default" }),
            "bg-orange-500 hover:bg-orange-600 text-white"
          )}
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  const subtotal = total();
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-2xl px-4">
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
          <div className="bg-white border rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

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
                  "w-full bg-orange-500 hover:bg-orange-600 text-white"
                )}
              >
                Proceed to Checkout
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
  );
}
