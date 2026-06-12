"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {
  menuItemId: string;
  existingReview: { rating: number; comment: string | null } | null;
};

export default function ReviewForm({ menuItemId, existingReview }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId, rating, comment }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to submit review");
      }
      toast.success(existingReview ? "Review updated" : "Review submitted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3"
    >
      <p className="text-sm font-semibold">
        {existingReview ? "Update your review" : "Write a review"}
      </p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                (hoverRating || rating) >= star
                  ? "fill-accent text-accent"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this dish (optional)"
        maxLength={500}
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading
          ? "Saving..."
          : existingReview
            ? "Update Review"
            : "Submit Review"}
      </Button>
    </form>
  );
}
