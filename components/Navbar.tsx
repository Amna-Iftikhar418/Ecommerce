"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, Menu } from "lucide-react";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CartSidebar from "@/components/cart/CartSidebar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/orders", label: "My Orders" },
];

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        transparent
          ? "bg-transparent text-primary-foreground"
          : "border-b border-border bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/80"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile hamburger */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-current transition-colors hover:bg-accent/10 hover:text-accent sm:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold text-current"
        >
          <UtensilsCrossed className="h-5 w-5 text-accent" />
          <span className="hidden xs:inline sm:inline">Bella Cucina</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                transparent ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-current">
          <CartSidebar />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  transparent &&
                    "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-card p-0">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="flex items-center gap-2 font-heading text-lg">
              <UtensilsCrossed className="h-5 w-5 text-accent" />
              Bella Cucina
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-6 left-6 right-6">
            {isSignedIn ? (
              <div className="flex items-center gap-3 px-3 py-2">
                <UserButton />
                <span className="text-sm text-muted-foreground">Account</span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  size="sm"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
