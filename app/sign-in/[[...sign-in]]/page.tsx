import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import FadeUp from "@/components/motion/FadeUp";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <FadeUp className="relative flex w-full max-w-md flex-col items-center">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-heading text-2xl font-bold text-foreground"
        >
          <UtensilsCrossed className="h-6 w-6 text-accent" />
          Bella Cucina
        </Link>
        <p className="mb-6 font-heading italic text-accent">Welcome back</p>
        <SignIn
          appearance={{
            ...clerkAppearance,
            elements: {
              ...clerkAppearance.elements,
              formFieldAction__forgotPassword: "!hidden",
            },
          }}
        />
        <Link
          href="/forgot-password"
          className="mt-4 text-sm font-medium text-accent hover:text-accent/80"
        >
          Forgot password?
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-accent hover:text-accent/80">
            Sign up
          </Link>
        </p>
      </FadeUp>
    </div>
  );
}
