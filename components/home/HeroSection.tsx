"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import MagneticButton from "@/components/motion/MagneticButton";
import ParallaxElement from "@/components/motion/ParallaxElement";

type HeroItem = { name: string; image: string | null; rating: number } | null;
type SecondaryImage = { name: string; image: string; rating: number };

type HeroSectionProps = {
  secondaryItems: HeroItem[];
};

const SECONDARY_ROTATION_INTERVAL = 4000;

const STATS = [
  { value: "10+", label: "Years of Tradition" },
  { value: "4.9★", label: "Average Rating" },
  { value: "25-35", label: "Min Delivery" },
];

export default function HeroSection({ secondaryItems }: HeroSectionProps) {
  const secondaryImages: SecondaryImage[] = secondaryItems.filter(
    (item): item is SecondaryImage => !!item?.image
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (secondaryImages.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % secondaryImages.length);
    }, SECONDARY_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [secondaryImages.length]);

  const activeSecondary = secondaryImages[activeIndex];

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
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
            Bella <span className="text-accent">Cucina</span>
          </h1>
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
          <m.div
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
            className="relative aspect-4/5 overflow-hidden rounded-[2rem]"
          >
            <Image
              src="/card.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 384px, 448px"
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

            {/* Scalloped wave edges */}
            <svg
              aria-hidden
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full fill-primary"
            >
              <path d="M0,10 A10,10 0 0 1 20,10 A10,10 0 0 1 40,10 A10,10 0 0 1 60,10 A10,10 0 0 1 80,10 A10,10 0 0 1 100,10 A10,10 0 0 1 120,10 A10,10 0 0 1 140,10 A10,10 0 0 1 160,10 A10,10 0 0 1 180,10 A10,10 0 0 1 200,10 L200,0 L0,0 Z" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full fill-primary"
            >
              <path d="M0,10 A10,10 0 0 0 20,10 A10,10 0 0 0 40,10 A10,10 0 0 0 60,10 A10,10 0 0 0 80,10 A10,10 0 0 0 100,10 A10,10 0 0 0 120,10 A10,10 0 0 0 140,10 A10,10 0 0 0 160,10 A10,10 0 0 0 180,10 A10,10 0 0 0 200,10 L200,20 L0,20 Z" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 20 200"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-10 fill-primary"
            >
              <path d="M10,0 A10,10 0 0 0 10,20 A10,10 0 0 0 10,40 A10,10 0 0 0 10,60 A10,10 0 0 0 10,80 A10,10 0 0 0 10,100 A10,10 0 0 0 10,120 A10,10 0 0 0 10,140 A10,10 0 0 0 10,160 A10,10 0 0 0 10,180 A10,10 0 0 0 10,200 L0,200 L0,0 Z" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 20 200"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-y-0 right-0 h-full w-10 fill-primary"
            >
              <path d="M10,0 A10,10 0 0 1 10,20 A10,10 0 0 1 10,40 A10,10 0 0 1 10,60 A10,10 0 0 1 10,80 A10,10 0 0 1 10,100 A10,10 0 0 1 10,120 A10,10 0 0 1 10,140 A10,10 0 0 1 10,160 A10,10 0 0 1 10,180 A10,10 0 0 1 10,200 L20,200 L20,0 Z" />
            </svg>
          </m.div>

          {/* Secondary thumbnail - rotates through featured dishes */}
          {activeSecondary && (
            <FadeUp
              delay={0.35}
              className="absolute -top-6 -left-3 hidden sm:block sm:-left-8"
            >
              <div className="relative h-20 w-20 -rotate-6 overflow-hidden rounded-2xl shadow-xl ring-4 ring-primary sm:h-28 sm:w-28">
                <AnimatePresence mode="wait">
                  <m.div
                    key={activeSecondary.image}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSecondary.image}
                      alt={activeSecondary.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </m.div>
                </AnimatePresence>
              </div>
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
