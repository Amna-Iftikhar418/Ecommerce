import Link from "next/link";
import { getCategoryIcon } from "./icon-maps";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerReveal";

type Category = { id: string; name: string; slug: string };

type MenuCategoriesSectionProps = {
  categories: Category[];
};

export default function MenuCategoriesSection({
  categories,
}: MenuCategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="font-heading italic text-lg text-accent mb-2">
            From the kitchen
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">
            Explore Our Menu
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/menu?category=${cat.slug}`}
                  className="group shield-reflection flex flex-col items-center gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-8 text-center transition-colors hover:bg-accent hover:text-primary"
                >
                  <Icon className="h-12 w-12 transition-transform group-hover:scale-110" />
                  <span className="font-heading text-lg font-semibold">
                    {cat.name}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
