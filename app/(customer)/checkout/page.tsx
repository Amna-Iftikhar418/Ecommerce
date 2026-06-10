import { getAuthUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout | Bella Cucina" };

export default async function CheckoutPage() {
  await getAuthUser();

  return (
    <div>
      <PageHeader
        eyebrow="One last step"
        title="Checkout"
        backHref="/cart"
        backLabel="Back to Cart"
      />

      <main className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CheckoutClient />
      </main>
    </div>
  );
}
