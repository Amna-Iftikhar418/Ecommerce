import Link from "next/link";
import Image from "next/image";
import { Star, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuickAddButton from "./QuickAddButton";

type MenuCardProps = {
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

export default function MenuCard({
  id,
  slug,
  name,
  description,
  price,
  image,
  rating,
  categoryName,
  isAvailable,
}: MenuCardProps) {
  return (
    <Link href={`/menu/${slug}`} className="block h-full">
      <Card className="group shield-reflection h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
              quality={65}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary">Unavailable</Badge>
            </div>
          )}
          <QuickAddButton
            id={id}
            name={name}
            price={price}
            image={image}
            isAvailable={isAvailable}
            className="absolute bottom-3 right-3 z-10 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
          />
        </div>

        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base font-semibold leading-snug">
              {name}
            </h3>
            <span className="whitespace-nowrap font-heading text-base font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>

          <p className="flex-1 line-clamp-2 text-xs text-muted-foreground">
            {description}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              {categoryName}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
