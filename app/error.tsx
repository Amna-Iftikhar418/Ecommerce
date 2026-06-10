"use client";

import { useEffect } from "react";
import Link from "next/link";
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
      <span className="text-5xl mb-4">⚠️</span>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
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
            "bg-orange-500 hover:bg-orange-600 text-white"
          )}
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
