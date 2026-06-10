"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AddressData = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type Props = {
  onSubmit: (address: AddressData) => void;
  loading: boolean;
  error: string | null;
};

export default function AddressForm({ onSubmit, loading, error }: Props) {
  const [form, setForm] = useState<AddressData>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
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
        {loading ? "Loading…" : "Continue to Payment"}
      </Button>
    </form>
  );
}
