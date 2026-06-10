import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import MenuCard from "@/components/menu/MenuCard";
import CategoryFilter from "@/components/menu/CategoryFilter";
import SearchBar from "@/components/menu/SearchBar";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse our full menu of handcrafted Italian dishes — pizzas, pastas, starters, desserts, and drinks.",
};

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function MenuPage({ searchParams }: Props) {
  const { category, q } = await searchParams;

  const [categories, items] = await Promise.all([
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? { name: { contains: q, mode: "insensitive" as const } }
          : {}),
      },
      include: { category: true },
      orderBy: { rating: "desc" },
    }),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <span className="text-5xl mb-4">🍽️</span>
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                slug={item.slug}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                rating={item.rating}
                categoryName={item.category.name}
                isAvailable={item.isAvailable}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
