import type { Metadata } from "next";
import { Suspense } from "react";
import { UtensilsCrossed } from "lucide-react";
import { db } from "@/lib/db";
import MenuCard from "@/components/menu/MenuCard";
import CategoryFilter from "@/components/menu/CategoryFilter";
import SearchBar from "@/components/menu/SearchBar";
import PageHeader from "@/components/PageHeader";

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
    <div>
      <PageHeader
        eyebrow="From the kitchen"
        title="Our Menu"
        description="Browse our full menu of handcrafted Italian dishes — pizzas, pastas, starters, desserts, and drinks, all made fresh to order."
      />

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <Suspense>
            <SearchBar />
          </Suspense>
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <p className="font-heading text-lg font-semibold">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search or category
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
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
    </div>
  );
}
