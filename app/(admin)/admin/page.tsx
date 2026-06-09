import { getAdminUser } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await getAdminUser();
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </main>
  );
}
