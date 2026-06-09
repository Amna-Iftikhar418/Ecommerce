import { getAdminUser } from "@/lib/auth";

export default async function AdminOrdersPage() {
  await getAdminUser();
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Order Management</h1>
    </main>
  );
}
