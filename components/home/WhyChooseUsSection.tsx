import { Sprout, ChefHat, Zap, Gem, ShieldCheck, type LucideIcon } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerReveal";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Sprout,
    title: "Fresh Ingredients",
    description: "Sourced daily from trusted local farms and Italian importers.",
  },
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description: "Recipes perfected over generations by passionate Italian chefs.",
  },
  {
    icon: Zap,
    title: "Fast Service",
    description: "Hot food at your door in under 35 minutes, every time.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Only the finest cuts, cheeses, and produce make it to your plate.",
  },
  {
    icon: ShieldCheck,
    title: "Hygienic Kitchen",
    description: "Spotless kitchens and rigorous food-safety standards, always.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-heading italic text-lg text-accent mb-2">
            Why Bella Cucina
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">
            Why Choose Us
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((feature, i) => (
            <StaggerItem
              key={feature.title}
              className={cn(i % 2 === 1 && "lg:translate-y-8")}
            >
              <div className="shield-reflection h-full rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
