"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

type Choice = { label: string; priceModifier: number };

type ItemOption = {
  id: string;
  name: string;
  choices: unknown;
  priceModifier: number;
};

type Props = {
  item: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    isAvailable: boolean;
  };
  options: ItemOption[];
};

function parseChoices(raw: unknown): Choice[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (c): c is Choice =>
      typeof c === "object" &&
      c !== null &&
      typeof (c as Choice).label === "string" &&
      typeof (c as Choice).priceModifier === "number"
  );
}

export default function AddToCartSection({ item, options }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<string, Choice>
  >({});

  const extraCost = Object.values(selectedChoices).reduce(
    (sum, c) => sum + c.priceModifier,
    0
  );
  const totalPrice = (item.price + extraCost) * quantity;

  function handleAdd() {
    const cartOptions = Object.entries(selectedChoices).map(
      ([optName, choice]) => ({
        name: optName,
        choice: choice.label,
        priceModifier: choice.priceModifier,
      })
    );

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      options: cartOptions,
    });

    toast.success(`${item.name} added to cart`);
  }

  return (
    <div className="space-y-4">
      {options.map((opt) => {
        const choices = parseChoices(opt.choices);
        if (choices.length === 0) return null;
        return (
          <div key={opt.id}>
            <p className="text-sm font-semibold mb-2">{opt.name}</p>
            <div className="flex flex-wrap gap-2">
              {choices.map((choice) => {
                const isSelected =
                  selectedChoices[opt.name]?.label === choice.label;
                return (
                  <button
                    key={choice.label}
                    onClick={() =>
                      setSelectedChoices((prev) => ({
                        ...prev,
                        [opt.name]: choice,
                      }))
                    }
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isSelected
                        ? "border-accent bg-accent/10 text-foreground font-medium"
                        : "border-border hover:border-accent/50 text-foreground"
                    }`}
                  >
                    {choice.label}
                    {choice.priceModifier > 0 && (
                      <span className="ml-1 text-muted-foreground text-xs">
                        +${choice.priceModifier.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-3 py-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold text-base">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        onClick={handleAdd}
        disabled={!item.isAvailable}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {item.isAvailable
          ? `Add to Cart · $${totalPrice.toFixed(2)}`
          : "Currently Unavailable"}
      </Button>
    </div>
  );
}
