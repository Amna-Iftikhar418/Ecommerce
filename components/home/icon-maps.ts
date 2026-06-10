import {
  Salad,
  Pizza,
  ChefHat,
  IceCream,
  CupSoda,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  starters: Salad,
  pizzas: Pizza,
  pastas: ChefHat,
  desserts: IceCream,
  drinks: CupSoda,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? UtensilsCrossed;
}
