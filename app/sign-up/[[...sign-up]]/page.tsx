import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-heading text-2xl font-bold text-foreground"
        >
          <UtensilsCrossed className="h-6 w-6 text-accent" />
          Bella Cucina
        </Link>
        <p className="mb-6 font-heading italic text-accent">
          Join the table
        </p>
        <SignUp />
      </div>
    </div>
  );
}
