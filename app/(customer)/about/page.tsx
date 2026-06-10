import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Leaf, ChefHat, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Bella Cucina",
  description:
    "Learn the story behind Bella Cucina — our ingredients, our kitchen, and the people who make it happen.",
};

const HOURS = [
  { day: "Monday – Thursday", hours: "11:00 AM – 9:30 PM" },
  { day: "Friday – Saturday", hours: "11:00 AM – 10:30 PM" },
  { day: "Sunday", hours: "12:00 PM – 9:00 PM" },
];

const VALUES = [
  {
    Icon: Leaf,
    title: "Fresh Ingredients",
    body: "Seasonal produce sourced locally and from trusted Italian importers — no shortcuts.",
  },
  {
    Icon: ChefHat,
    title: "Made From Scratch",
    body: "Pasta, sauces, and doughs made fresh in-house every single day.",
  },
  {
    Icon: Truck,
    title: "Fast Delivery",
    body: "Average delivery time under 35 minutes within our zone — hot food at your door.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary px-4 py-24 text-primary-foreground sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="container relative mx-auto max-w-2xl text-center">
          <p className="font-heading italic text-lg text-accent mb-2">Since 2012</p>
          <h1 className="font-heading text-5xl font-bold tracking-tight mb-6 sm:text-6xl">
            Our Story
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Bella Cucina was founded in 2012 with one simple belief — great
            Italian food should be accessible every day, not just on special
            occasions.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <p className="font-heading italic text-lg text-accent mb-2">
          From Naples, with love
        </p>
        <h2 className="font-heading text-3xl font-bold mb-6 sm:text-4xl">
          A Family Recipe, Reimagined
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Chef Marco Ricci grew up in a small town outside of Naples, where
            his grandmother&apos;s kitchen was the heart of the neighbourhood.
            Every Sunday the family gathered around a long wooden table, and the
            food — simple, seasonal, made from scratch — was the excuse to be
            together.
          </p>
          <p>
            When Marco moved to New York in 2008 he noticed a gap: the Italian
            food available for delivery was either too expensive or too far
            removed from the traditions he grew up with. So in 2012 he opened
            Bella Cucina in a narrow storefront on Olive Street, with four
            tables, a wood-fired oven, and a commitment to sourcing the best
            ingredients he could find.
          </p>
          <p>
            Today we still make our pasta by hand every morning, import our
            San Marzano tomatoes directly from Campania, and finish every dish
            with Sicilian extra-virgin olive oil. The restaurant has grown, but
            the kitchen philosophy hasn&apos;t changed one bit.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="font-heading italic text-lg text-accent mb-2">
              Our Promise
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VALUES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="container mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Hours */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-xl font-bold">Opening Hours</h2>
            </div>
            <div className="space-y-3">
              {HOURS.map(({ day, hours }) => (
                <div
                  key={day}
                  className="flex justify-between border-b border-border pb-3 text-sm last:border-0"
                >
                  <span className="text-muted-foreground">{day}</span>
                  <span className="font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-xl font-bold">Find Us</h2>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  123 Olive Street, Suite 4
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a
                  href="tel:+12125550100"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  (212) 555-0100
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a
                  href="mailto:hello@bellacucina.com"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  hello@bellacucina.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
