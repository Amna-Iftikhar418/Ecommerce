import CartPageClient from "@/components/cart/CartPageClient";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Your Cart | Bella Cucina" };

export default async function CartPage() {
  const settings = await getSettings();
  const pricing = {
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    taxRate: settings.taxRate,
  };

  return <CartPageClient pricing={pricing} />;
}
