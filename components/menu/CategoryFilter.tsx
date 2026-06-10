"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export default function CategoryFilter({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "all";

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const pills = [{ id: "all", name: "All Items", slug: "all" }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {pills.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
            current === cat.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground hover:bg-accent/10"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
