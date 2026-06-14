import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import ParallaxElement from "@/components/motion/ParallaxElement";
import FallingWords from "@/components/home/FallingWords";

export default function StorySection() {
  return (
    <section className="py-24 px-4 bg-secondary/40">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <FadeUp>
          <div>
            <p className="font-heading italic text-lg text-accent-strong mb-2">
              Since 2012
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
              Our Story
            </h2>
            <div className="max-w-lg space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Chef Marco Ricci grew up in a small town outside of Naples,
                where his grandmother&apos;s kitchen was the heart of the
                neighbourhood. In 2012 he brought that tradition to a narrow
                storefront on Olive Street.
              </p>
              <p>
                Today we still make our pasta by hand every morning, import
                our San Marzano tomatoes from Campania, and finish every dish
                with Sicilian extra-virgin olive oil.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-heading font-semibold text-primary transition-colors hover:text-accent"
            >
              Read Our Full Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <ParallaxElement speed={0.6}>
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/green.webp"
                alt="Inside the Bella Cucina kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 552px"
                quality={70}
                className="object-cover"
              />
              <FallingWords />
              <div className="green-border-beam pointer-events-none" />
            </div>
          </ParallaxElement>
        </FadeUp>
      </div>
    </section>
  );
}
