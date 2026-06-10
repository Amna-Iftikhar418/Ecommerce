import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  action,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-secondary/40">
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="font-heading italic text-lg text-accent mb-2">
                {eyebrow}
              </p>
            )}
            <h1 className="font-heading text-4xl font-bold sm:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
