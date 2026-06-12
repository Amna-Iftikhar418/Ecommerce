"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { calculatePricing, type PricingSettings } from "@/lib/pricing";
import CartItem from "./CartItem";

export default function CartSidebar({ pricing }: { pricing: PricingSettings }) {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const { isSignedIn } = useAuth();

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = total();
  const { deliveryFee, tax, total: grandTotal } = calculatePricing(subtotal, pricing);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-current hover:bg-accent/10 hover:text-accent transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium leading-none pointer-events-none">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">
            Your Cart{itemCount > 0 && ` (${itemCount})`}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add something delicious from our menu
            </p>
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ size: "sm" }),
                "mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
              )}
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <button
                onClick={clearCart}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear cart
              </button>
            </div>

            <SheetFooter className="border-t px-6 pt-4 pb-6 gap-0">
              <div className="space-y-1.5 text-sm w-full mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Est. tax ({pricing.taxRate}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {isSignedIn ? (
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  Checkout
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Sign in to Checkout
                  </Button>
                </SignInButton>
              )}

              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full mt-1"
                )}
              >
                View full cart
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
