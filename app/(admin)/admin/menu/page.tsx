import { getAdminUser } from "@/lib/auth";

export default async function AdminMenuPage() {
  await getAdminUser();
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Menu Management</h1>
    </main>
  );
}
