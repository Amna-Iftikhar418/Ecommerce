import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MenuCard from "@/components/menu/MenuCard";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerReveal";

type FeaturedItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  rating: number;
  categoryName: string;
  isAvailable: boolean;
};

type FeaturedDishesSectionProps = {
  items: FeaturedItem[];
};

export default function FeaturedDishesSection({ items }: FeaturedDishesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-heading italic text-lg text-accent mb-2">
              Handpicked for you
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold">
              Featured Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            View Full Menu <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <MenuCard
                id={item.id}
                slug={item.slug}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                rating={item.rating}
                categoryName={item.categoryName}
                isAvailable={item.isAvailable}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
