"use client";

import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FadeUp from "@/components/motion/FadeUp";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sofia Marin",
    role: "Regular Customer",
    quote:
      "The pasta tastes like it was made by my own nonna. Bella Cucina has become our Friday night tradition.",
    rating: 5,
  },
  {
    name: "James Carter",
    role: "Food Blogger",
    quote:
      "Hands down the best wood-fired pizza delivery in the city. Crisp crust, generous toppings, every time.",
    rating: 5,
  },
  {
    name: "Aisha Khan",
    role: "Verified Order",
    quote:
      "From the packaging to the first bite, everything feels premium. The tiramisu is unbelievable.",
    rating: 5,
  },
  {
    name: "Daniel Rossi",
    role: "Verified Order",
    quote:
      "Consistent quality, fast delivery, and a menu that keeps surprising me. Highly recommend the lasagna.",
    rating: 5,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-24 px-4 bg-secondary/40">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <FadeUp>
            <div>
              <p className="font-heading italic text-lg text-accent-strong mb-2">
                Loved by our guests
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold">
                What People Say
              </h2>
            </div>
          </FadeUp>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="shield-reflection min-w-[320px] sm:min-w-[400px] snap-center rounded-2xl border border-border bg-card p-8 shadow-md"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-heading text-lg italic leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary font-heading font-semibold text-primary-foreground">
                    {getInitials(t.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
