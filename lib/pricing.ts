export type PricingSettings = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxRate: number;
};

export type OrderPricing = {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  /** Amount the customer must add to subtotal to qualify for free delivery, or null if already free/unavailable. */
  amountToFreeDelivery: number | null;
};

/** Computes delivery fee, tax, and grand total for a given subtotal using restaurant settings. */
export function calculatePricing(
  subtotal: number,
  settings: PricingSettings
): OrderPricing {
  const freeDeliveryEligible =
    settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;

  const deliveryFee = freeDeliveryEligible ? 0 : settings.deliveryFee;
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax + deliveryFee;

  const amountToFreeDelivery =
    settings.freeDeliveryThreshold > 0 && !freeDeliveryEligible
      ? settings.freeDeliveryThreshold - subtotal
      : null;

  return { subtotal, deliveryFee, tax, total, amountToFreeDelivery };
}
