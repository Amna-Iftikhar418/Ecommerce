"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type AddressData = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type PaymentMethod = "CARD" | "COD";

type Props = {
  onSubmit: (address: AddressData, paymentMethod: PaymentMethod) => void;
  loading: boolean;
  error: string | null;
  codEnabled: boolean;
};

export default function AddressForm({ onSubmit, loading, error, codEnabled }: Props) {
  const [form, setForm] = useState<AddressData>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form, paymentMethod);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="line1">Address Line 1</Label>
          <Input
            id="line1"
            name="line1"
            placeholder="123 Main St"
            value={form.line1}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="line2">
            Address Line 2{" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            id="line2"
            name="line2"
            placeholder="Apt, suite, floor…"
            value={form.line2}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="New York"
              value={form.city}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="NY"
              value={form.state}
              onChange={handleChange}
              required
              maxLength={2}
              className="mt-1 uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              placeholder="10001"
              value={form.zip}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label className="mb-2 block">Payment Method</Label>
          <div className={cn("grid gap-3", codEnabled ? "grid-cols-2" : "grid-cols-1")}>
            <button
              type="button"
              onClick={() => setPaymentMethod("CARD")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                paymentMethod === "CARD"
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50"
              )}
            >
              <CreditCard className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium">Card</p>
                <p className="text-xs text-muted-foreground">Pay securely online</p>
              </div>
            </button>

            {codEnabled && (
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  paymentMethod === "COD"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                )}
              >
                <Banknote className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when it arrives</p>
                </div>
              </button>
            )}
          </div>
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
            "Loading…"
          ) : paymentMethod === "COD" ? (
            <>
              Place Order <ArrowRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Continue to Payment <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
