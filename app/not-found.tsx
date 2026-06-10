import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <UtensilsCrossed className="h-12 w-12 text-orange-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-lg font-medium mb-1">Page not found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/menu"
        className={cn(
          buttonVariants({ size: "default" }),
          "bg-orange-500 hover:bg-orange-600 text-white"
        )}
      >
        Browse Our Menu
      </Link>
    </div>
  );
}
