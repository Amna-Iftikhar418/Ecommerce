"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <TriangleAlert className="h-8 w-8" />
      </div>
      <h2 className="font-heading text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        An unexpected error occurred. Please try again or return to the menu.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Try Again
        </button>
        <Link
          href="/menu"
          className={cn(
            buttonVariants(),
            "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
