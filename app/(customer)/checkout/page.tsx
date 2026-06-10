import { getAuthUser } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout | Bella Cucina" };

export default async function CheckoutPage() {
  await getAuthUser();

  return (
    <main className="container mx-auto py-8 px-4 max-w-2xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <CheckoutClient />
    </main>
  );
}
