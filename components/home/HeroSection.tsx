"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import MagneticButton from "@/components/motion/MagneticButton";
import ParallaxElement from "@/components/motion/ParallaxElement";

type HeroSectionProps = {
  featuredItem: { name: string; image: string | null; rating: number } | null;
};

export default function HeroSection({ featuredItem }: HeroSectionProps) {
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

      <div className="container relative mx-auto grid min-h-screen grid-cols-1 items-center gap-12 px-4 pt-28 pb-16 lg:grid-cols-2 lg:gap-16">
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
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <FadeUp delay={0.2}>
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl rotate-2 shadow-2xl">
              {featuredItem?.image ? (
                <Image
                  src={featuredItem.image}
                  alt={featuredItem.name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-accent/15 text-accent">
                  <UtensilsCrossed className="h-20 w-20" />
                  <Sparkles className="h-8 w-8" />
                </div>
              )}
            </div>
          </FadeUp>

          {featuredItem && (
            <FadeUp delay={0.5} className="absolute -bottom-6 -left-6 sm:-left-10">
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
