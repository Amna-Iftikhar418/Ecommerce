"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Truck, Clock4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Settings = {
  restaurantName: string;
  restaurantPhone: string;
  restaurantEmail: string;
  deliveryRadius: number;
  minimumOrder: number;
  deliveryFee: number;
  estimatedDelivery: number;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
};

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: Settings;
}) {
  const [form, setForm] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-4 w-4" />
          </span>
          Restaurant Info
        </h2>
        <div className="space-y-4">
          <div>
            <Label>Restaurant Name</Label>
            <Input
              value={form.restaurantName}
              onChange={(e) => set("restaurantName", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={form.restaurantPhone}
                onChange={(e) => set("restaurantPhone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.restaurantEmail}
                onChange={(e) => set("restaurantEmail", e.target.value)}
                placeholder="hello@bellacucina.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </span>
          Delivery Settings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Delivery Radius (miles)</Label>
            <Input
              type="number"
              min="0"
              step="0.5"
              value={form.deliveryRadius}
              onChange={(e) => set("deliveryRadius", parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Minimum Order ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.minimumOrder}
              onChange={(e) => set("minimumOrder", parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Delivery Fee ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.deliveryFee}
              onChange={(e) => set("deliveryFee", parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Est. Delivery Time (min)</Label>
            <Input
              type="number"
              min="1"
              value={form.estimatedDelivery}
              onChange={(e) =>
                set("estimatedDelivery", parseInt(e.target.value, 10))
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock4 className="h-4 w-4" />
          </span>
          Hours &amp; Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Opening Time</Label>
            <Input
              type="time"
              value={form.openingTime}
              onChange={(e) => set("openingTime", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Closing Time</Label>
            <Input
              type="time"
              value={form.closingTime}
              onChange={(e) => set("closingTime", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Restaurant Status</Label>
            <Select
              value={form.isOpen ? "open" : "closed"}
              onValueChange={(v) => set("isOpen", (v ?? "") === "open")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open — accepting orders</SelectItem>
                <SelectItem value="closed">Closed — not accepting orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={() => void handleSave()}
        disabled={saving}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
