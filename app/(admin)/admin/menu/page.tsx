import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/db";
import MenuClient from "./MenuClient";

export default async function AdminMenuPage() {
  await getAdminUser();

  const [items, categories] = await Promise.all([
    db.menuItem.findMany({
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
    }),
    db.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add, edit, and manage your menu items
        </p>
      </div>
      <MenuClient
        initialItems={items.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          price: i.price,
          image: i.image,
          slug: i.slug,
          categoryId: i.categoryId,
          category: i.category,
          isAvailable: i.isAvailable,
        }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </main>
  );
}
