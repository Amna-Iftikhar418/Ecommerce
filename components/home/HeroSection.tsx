"use client";

import Link from "next/link";
import Image from "next/image";
import { ChefHat, ChevronDown, Clock, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import MagneticButton from "@/components/motion/MagneticButton";
import ParallaxElement from "@/components/motion/ParallaxElement";

type HeroItem = { name: string; image: string | null; rating: number } | null;

type HeroSectionProps = {
  featuredItem: HeroItem;
  secondaryItem: HeroItem;
};

const STATS = [
  { value: "10+", label: "Years of Tradition" },
  { value: "4.9★", label: "Average Rating" },
  { value: "25-35", label: "Min Delivery" },
];

export default function HeroSection({ featuredItem, secondaryItem }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary text-primary-foreground">
      <ParallaxElement
        speed={1.5}
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      >
        <></>
      </ParallaxElement>
      <ParallaxElement
        speed={-1}
        className="pointer-events-none absolute -bottom-10 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      >
        <></>
      </ParallaxElement>

      <div className="container relative mx-auto grid min-h-screen grid-cols-1 items-center gap-16 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-16">
        {/* Copy */}
        <div>
          <FadeUp>
            <p className="font-heading italic text-xl sm:text-2xl text-accent mb-4">
              Authentic Italian, made with love
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
              Bella <span className="text-accent">Cucina</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="max-w-md text-base sm:text-lg text-primary-foreground/80 mb-10 leading-relaxed">
              Handcrafted pasta, wood-fired pizza, and recipes passed down
              through generations — delivered fresh to your door.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link
                  href="/menu"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  Explore Menu
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/menu"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-8 text-base border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  Order Online
                </Link>
              </MagneticButton>
            </div>
          </FadeUp>

          {/* Stats strip */}
          <FadeUp delay={0.45}>
            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-primary-foreground/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-primary-foreground/60 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Visual */}
        <div className="relative mx-auto mt-12 w-full max-w-md lg:mt-0 lg:max-w-none">
          {/* Decorative dot grid */}
          <div
            aria-hidden
            className="absolute -top-10 -right-6 -z-10 hidden h-32 w-32 opacity-20 sm:block lg:-right-10"
            style={{
              backgroundImage:
                "radial-gradient(var(--primary-foreground) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Main image card */}
          <FadeUp delay={0.2}>
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] rotate-2 shadow-2xl ring-1 ring-primary-foreground/10">
              <Image
                src="/home.png"
                alt=""
                fill
                priority
                className="object-cover"
              />
              {featuredItem?.image && (
                <Image
                  src={featuredItem.image}
                  alt={featuredItem.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Icon accent badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-accent/90 px-3 py-2 text-primary shadow-lg backdrop-blur-sm">
                <UtensilsCrossed className="h-6 w-6" />
                <Sparkles className="h-5 w-5" />
              </div>

              {/* Centered food icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ChefHat className="h-24 w-24 fill-primary text-primary drop-shadow-lg sm:h-32 sm:w-32" />
              </div>
            </div>
          </FadeUp>

          {/* Secondary thumbnail */}
          {secondaryItem?.image && (
            <FadeUp
              delay={0.35}
              className="absolute -top-8 -left-4 hidden sm:block sm:-left-10"
            >
              <div className="relative h-24 w-24 -rotate-6 overflow-hidden rounded-2xl shadow-xl ring-4 ring-primary sm:h-32 sm:w-32">
                <Image
                  src={secondaryItem.image}
                  alt={secondaryItem.name}
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>
          )}

          {/* Delivery badge */}
          <FadeUp delay={0.6} className="absolute -top-5 -right-2 sm:-right-6">
            <div className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground shadow-xl px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm leading-none">
                  25-35 min
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg. Delivery
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Rating badge */}
          {featuredItem && (
            <FadeUp delay={0.5} className="absolute -bottom-6 -left-4 sm:-left-10">
              <div className="flex items-center gap-3 rounded-2xl bg-card text-card-foreground shadow-xl px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm leading-none">
                    {featuredItem.rating.toFixed(1)} Rating
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {featuredItem.name}
                  </p>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-primary-foreground/60">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  );
}
