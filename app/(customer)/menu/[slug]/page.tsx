import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Star, ChevronLeft, UtensilsCrossed } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartSection from "@/components/menu/AddToCartSection";
import ReviewForm from "@/components/menu/ReviewForm";
import ReviewsList from "@/components/menu/ReviewsList";

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

  const { userId } = await auth();

  const [reviews, userReview] = await Promise.all([
    db.review.findMany({
      where: { menuItemId: item.id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    userId
      ? db.review.findUnique({
          where: { userId_menuItemId: { userId, menuItemId: item.id } },
        })
      : null,
  ]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        {/* Image */}
        <div className="relative aspect-square md:aspect-auto md:h-full min-h-72 overflow-hidden rounded-3xl bg-muted shadow-xl">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
              <UtensilsCrossed className="h-24 w-24" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="outline" className="mb-3">
              {item.category.name}
            </Badge>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              {item.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-semibold">
                {item.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {reviews.length === 0
                ? "No reviews yet"
                : `${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="font-heading text-3xl font-bold text-primary">
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

      <Separator className="my-10" />

      <div className="max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold mb-5">Reviews</h2>

        <div className="mb-6">
          {userId ? (
            <ReviewForm
              menuItemId={item.id}
              existingReview={
                userReview
                  ? { rating: userReview.rating, comment: userReview.comment }
                  : null
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <Link href="/sign-in" className="text-accent font-medium hover:underline">
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          )}
        </div>

        <ReviewsList reviews={reviews} />
      </div>
    </div>
  );
}
