import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <UtensilsCrossed className="h-8 w-8" />
      </div>
      <h1 className="font-heading text-4xl font-bold mb-2">404</h1>
      <p className="text-lg font-medium mb-1">Page not found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/menu"
        className={cn(
          buttonVariants({ size: "default" }),
          "bg-accent text-accent-foreground hover:bg-accent/90"
        )}
      >
        Browse Our Menu
      </Link>
    </div>
  );
}
