"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { UtensilsCrossed, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FadeUp from "@/components/motion/FadeUp";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: createError } = await signIn.create({ identifier: email });
    if (createError) {
      setError(createError.longMessage ?? createError.message);
      setLoading(false);
      return;
    }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    setLoading(false);
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }

    setStep("reset");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message);
      setLoading(false);
      return;
    }

    const { error: submitError } = await signIn.resetPasswordEmailCode.submitPassword({ password });
    if (submitError) {
      setError(submitError.longMessage ?? submitError.message);
      setLoading(false);
      return;
    }

    const { error: finalizeError } = await signIn.finalize({
      navigate: () => router.push("/"),
    });
    setLoading(false);
    if (finalizeError) {
      setError(finalizeError.longMessage ?? finalizeError.message);
    }
  }

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

        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
          {step === "email" ? (
            <>
              <h1 className="font-heading text-xl font-semibold text-foreground">
                Forgot your password?
              </h1>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a code to reset it.
              </p>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {loading ? (
                    "Sending…"
                  ) : (
                    <>
                      Send Reset Code <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-heading text-xl font-semibold text-foreground">
                Check your email
              </h1>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                Enter the code we sent to {email} and choose a new password.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="code">Reset Code</Label>
                  <Input
                    id="code"
                    inputMode="numeric"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="mt-1"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Use a different email
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/sign-in" className="font-medium text-accent hover:text-accent/80">
            Sign in
          </Link>
        </p>
      </FadeUp>
    </div>
  );
}
