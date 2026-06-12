import { db } from "@/lib/db";

export const SETTINGS_DEFAULTS = {
  restaurantName: "Bella Cucina",
  restaurantPhone: "",
  restaurantEmail: "",
  deliveryRadius: 10,
  minimumOrder: 15,
  deliveryFee: 3.99,
  freeDeliveryThreshold: 50,
  taxRate: 8,
  estimatedDelivery: 30,
  openingTime: "11:00",
  closingTime: "22:00",
  isOpen: true,
  codEnabled: true,
};

export type Settings = typeof SETTINGS_DEFAULTS & { id: string };

/** Fetches the singleton settings row, falling back to defaults if it doesn't exist yet. */
export async function getSettings(): Promise<Settings> {
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  return settings ?? { id: "singleton", ...SETTINGS_DEFAULTS };
}
