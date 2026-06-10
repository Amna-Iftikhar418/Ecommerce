import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import MagneticButton from "@/components/motion/MagneticButton";

export default function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16 sm:py-24">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative">
              <h2 className="font-heading text-4xl sm:text-6xl font-bold mb-6">
                Hungry? We&apos;ve Got You Covered.
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
                Order online and have our handcrafted Italian dishes delivered
                fresh to your door in under 35 minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MagneticButton>
                  <Link
                    href="/menu"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90"
                    )}
                  >
                    Explore Full Menu
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/about"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 px-8 text-base border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    )}
                  >
                    About Us
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
