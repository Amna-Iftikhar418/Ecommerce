import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import AddToCartSection from "@/components/menu/AddToCartSection";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await db.menuItem.findUnique({ where: { slug } });
  if (!item) return {};
  return { title: `${item.name} | Bella Cucina`, description: item.description };
}

export default async function DishDetailPage({ params }: Props) {
  const { slug } = await params;

  const item = await db.menuItem.findUnique({
    where: { slug },
    include: { category: true, options: true },
  });

  if (!item) notFound();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="relative h-72 md:h-full min-h-72 rounded-2xl overflow-hidden bg-orange-50">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-8xl select-none">
              🍽️
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="outline" className="mb-2">
              {item.category.name}
            </Badge>
            <h1 className="text-3xl font-bold">{item.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {item.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">rating</span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="text-2xl font-bold text-orange-500">
            ${item.price.toFixed(2)}
          </div>

          <AddToCartSection
            item={{
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              isAvailable: item.isAvailable,
            }}
            options={item.options}
          />
        </div>
      </div>
    </div>
  );
}
