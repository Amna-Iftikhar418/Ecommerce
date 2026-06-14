import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const pricing = {
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    taxRate: settings.taxRate,
  };

  return (
    <>
      <Navbar pricing={pricing} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
