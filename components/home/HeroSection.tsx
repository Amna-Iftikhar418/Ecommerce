"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChefHat, ChevronDown, Clock, Sparkles, Star } from "lucide-react";
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
    <>
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
        </div>

        {/* Visual */}
        <div className="relative mx-auto mt-12 w-full max-w-sm lg:mt-0 lg:max-w-md">
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
          <motion.div
            initial={{
              opacity: 0,
              x: -100,
              y: -90,
              rotateX: 40,
              rotateY: -40,
              rotateZ: -12,
              scale: 0.85,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 2,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
            style={{ transformPerspective: 1200 }}
            className="relative aspect-4/5 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-primary-foreground/10"
          >
            <Image
              src="/card.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

            {/* Chef's special badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-card/85 px-3 py-1.5 text-card-foreground shadow-lg backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-accent" />
              {/* <span className="font-heading text-xs font-semibold tracking-wide">
                Chef&apos;s Special
              </span> */}
            </div>

            {/* Centered food icon */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat className="h-24 w-24 fill-primary text-primary drop-shadow-lg sm:h-32 sm:w-32" />
            </div> */}
          </motion.div>

          {/* Secondary thumbnail */}
          {secondaryItem?.image && (
            <FadeUp
              delay={0.35}
              className="absolute -top-6 -left-3 hidden sm:block sm:-left-8"
            >
              <div className="relative h-20 w-20 -rotate-6 overflow-hidden rounded-2xl shadow-xl ring-4 ring-primary sm:h-28 sm:w-28">
                <Image
                  src={secondaryItem.image}
                  alt={secondaryItem.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            </FadeUp>
          )}

          {/* Delivery badge */}
          <FadeUp delay={0.6} className="absolute -top-4 -right-2 z-10 sm:-right-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/85 px-3.5 py-2.5 text-card-foreground shadow-2xl shadow-primary/15 backdrop-blur-xl sm:px-4 sm:py-3"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-md shadow-accent/40">
                <Clock className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm leading-none">
                  25-35 min
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Avg. Delivery
                </p>
              </div>
            </motion.div>
          </FadeUp>

          {/* Rating badge */}
          {featuredItem && (
            <FadeUp delay={0.5} className="absolute -bottom-4 -left-3 z-10 sm:-left-8">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/85 px-4 py-3 text-card-foreground shadow-2xl shadow-primary/15 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-md shadow-accent/40">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-heading font-bold text-sm leading-none">
                      {featuredItem.rating.toFixed(1)}
                    </p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < Math.round(featuredItem.rating)
                              ? "fill-accent text-accent"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 max-w-[140px] truncate text-xs text-muted-foreground">
                    {featuredItem.name}
                  </p>
                </div>
              </motion.div>
            </FadeUp>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-primary-foreground/60">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>

    {/* Stats strip - revealed on scroll */}
    <section className="relative bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:justify-evenly">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
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
    </section>
    </>
  );
}
