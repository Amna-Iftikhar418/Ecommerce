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
    <main className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="font-heading italic text-accent">Kitchen Inventory</p>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Menu Management
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
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
