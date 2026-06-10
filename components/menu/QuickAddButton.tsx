"use client";

import type { MouseEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuickAddButtonProps = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
  className?: string;
};

export default function QuickAddButton({
  id,
  name,
  price,
  image,
  isAvailable,
  className,
}: QuickAddButtonProps) {
  if (!isAvailable) return null;

  function handleAdd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    useCartStore.getState().addItem({
      menuItemId: id,
      name,
      price,
      image,
      quantity: 1,
      options: [],
    });
    toast.success(`${name} added to cart`);
  }

  return (
    <Button
      size="icon"
      onClick={handleAdd}
      aria-label={`Add ${name} to cart`}
      className={cn(
        "rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90",
        className
      )}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
