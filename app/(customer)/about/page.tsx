import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bella Cucina was founded in 2012 with one simple belief — great
            Italian food should be accessible every day, not just on special
            occasions.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto py-16 px-4 max-w-3xl">
        <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-5 text-base">
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
      <section className="bg-orange-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                emoji: "🌿",
                title: "Fresh Ingredients",
                body: "Seasonal produce sourced locally and from trusted Italian importers — no shortcuts.",
              },
              {
                emoji: "👨‍🍳",
                title: "Made From Scratch",
                body: "Pasta, sauces, and doughs made fresh in-house every single day.",
              },
              {
                emoji: "🚀",
                title: "Fast Delivery",
                body: "Average delivery time under 35 minutes within our zone — hot food at your door.",
              },
            ].map((v) => (
              <div key={v.title} className="flex flex-col items-center gap-3">
                <span className="text-5xl">{v.emoji}</span>
                <h3 className="font-semibold text-base">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Hours */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold">Opening Hours</h2>
            </div>
            <div className="space-y-3">
              {HOURS.map(({ day, hours }) => (
                <div
                  key={day}
                  className="flex justify-between text-sm border-b pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{day}</span>
                  <span className="font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold mb-5">Find Us</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  123 Olive Street, Suite 4
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <a
                  href="tel:+12125550100"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  (212) 555-0100
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <a
                  href="mailto:hello@bellacucina.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
