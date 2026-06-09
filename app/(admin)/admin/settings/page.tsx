import { getAdminUser } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await getAdminUser();
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
    </main>
  );
}
