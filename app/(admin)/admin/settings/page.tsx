import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import SettingsClient from "./SettingsClient";

const DEFAULTS = {
  restaurantName: "Bella Cucina",
  restaurantPhone: "",
  restaurantEmail: "",
  deliveryRadius: 10,
  minimumOrder: 15,
  deliveryFee: 3.99,
  estimatedDelivery: 30,
  openingTime: "11:00",
  closingTime: "22:00",
  isOpen: true,
};

export default async function AdminSettingsPage() {
  await getAdminUser();

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...DEFAULTS },
  });

  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="font-heading italic text-accent">Behind the Scenes</p>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage restaurant info, delivery options, and hours
        </p>
      </div>
      <SettingsClient
        initialSettings={{
          restaurantName: settings.restaurantName,
          restaurantPhone: settings.restaurantPhone,
          restaurantEmail: settings.restaurantEmail,
          deliveryRadius: settings.deliveryRadius,
          minimumOrder: settings.minimumOrder,
          deliveryFee: settings.deliveryFee,
          estimatedDelivery: settings.estimatedDelivery,
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          isOpen: settings.isOpen,
        }}
      />
    </main>
  );
}
