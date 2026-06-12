import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SETTINGS_DEFAULTS } from "@/lib/settings";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  await getAdminUser();

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...SETTINGS_DEFAULTS },
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
          freeDeliveryThreshold: settings.freeDeliveryThreshold,
          taxRate: settings.taxRate,
          estimatedDelivery: settings.estimatedDelivery,
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          isOpen: settings.isOpen,
          codEnabled: settings.codEnabled,
        }}
      />
    </main>
  );
}
