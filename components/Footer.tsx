import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-primary-foreground"
            >
              <UtensilsCrossed className="h-5 w-5 text-accent" />
              Bella Cucina
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Handcrafted Italian dishes made with love, delivered straight to your door.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/menu" className="transition-colors hover:text-accent">Menu</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-accent">About Us</Link></li>
              <li><Link href="/orders" className="transition-colors hover:text-accent">My Orders</Link></li>
              <li><Link href="/account" className="transition-colors hover:text-accent">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>123 Olive Street, Suite 4</li>
              <li>New York, NY 10001</li>
              <li>
                <a href="tel:+12125550100" className="transition-colors hover:text-accent">
                  (212) 555-0100
                </a>
              </li>
              <li>
                <a href="mailto:hello@bellacucina.com" className="transition-colors hover:text-accent">
                  hello@bellacucina.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Bella Cucina. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
