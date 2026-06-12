import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null; email: string };
};

export default function ReviewsList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const displayName = review.user.name ?? review.user.email.split("@")[0];
        return (
          <div
            key={review.id}
            className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <Avatar size="sm">
              <AvatarFallback>
                {displayName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {review.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
