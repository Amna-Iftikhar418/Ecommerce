"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem as CartItemType } from "@/store/cartStore";

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const unitPrice =
    item.price + item.options.reduce((s, o) => s + o.priceModifier, 0);
  const itemTotal = unitPrice * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{item.name}</p>
        {item.options.length > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {item.options.map((o) => `${o.name}: ${o.choice}`).join(", ")}
          </p>
        )}
        <p className="text-sm text-primary font-medium mt-0.5">
          ${unitPrice.toFixed(2)} each
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">${itemTotal.toFixed(2)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
