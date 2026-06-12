"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Truck, Clock4, Banknote, Save, Loader2 } from "lucide-react";
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
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerReveal";
import { cn } from "@/lib/utils";

type Settings = {
  restaurantName: string;
  restaurantPhone: string;
  restaurantEmail: string;
  deliveryRadius: number;
  minimumOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxRate: number;
  estimatedDelivery: number;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  codEnabled: boolean;
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
    <StaggerContainer className="space-y-6 max-w-2xl">
      <StaggerItem>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-4 w-4" />
          </span>
          Restaurant Info
        </h2>
        <p className="mb-4 ml-11 text-sm text-muted-foreground">
          Shown to customers on the About page and order receipts
        </p>
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
      </StaggerItem>

      <StaggerItem>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </span>
          Delivery &amp; Pricing
        </h2>
        <p className="mb-4 ml-11 text-sm text-muted-foreground">
          Fees, thresholds, and tax applied at checkout for every order
        </p>
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
            <Label>Free Delivery Threshold ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.freeDeliveryThreshold}
              onChange={(e) =>
                set("freeDeliveryThreshold", parseFloat(e.target.value))
              }
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
          <div>
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.taxRate}
              onChange={(e) => set("taxRate", parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Orders at or above the free delivery threshold skip the delivery fee.
          Set it to 0 to never offer free delivery. Tax rate is applied as a
          percentage of the order subtotal.
        </p>
      </div>
      </StaggerItem>

      <StaggerItem>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock4 className="h-4 w-4" />
            </span>
            Hours &amp; Status
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              form.isOpen
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                form.isOpen ? "bg-green-500" : "bg-muted-foreground"
              )}
            />
            {form.isOpen ? "Open" : "Closed"}
          </span>
        </div>
        <p className="mb-4 ml-11 text-sm text-muted-foreground">
          Set service hours and toggle order acceptance
        </p>
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
              <SelectTrigger className="mt-1 w-full">
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
      </StaggerItem>

      <StaggerItem>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Banknote className="h-4 w-4" />
          </span>
          Payment Options
        </h2>
        <p className="mb-4 ml-11 text-sm text-muted-foreground">
          Choose which payment methods customers can use at checkout
        </p>
        <div>
          <Label>Cash on Delivery</Label>
          <Select
            value={form.codEnabled ? "enabled" : "disabled"}
            onValueChange={(v) => set("codEnabled", (v ?? "") === "enabled")}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enabled">Enabled — customers can pay cash on delivery</SelectItem>
              <SelectItem value="disabled">Disabled — card payment only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      </StaggerItem>

      <StaggerItem>
      <div className="flex justify-end">
        <Button
          onClick={() => void handleSave()}
          disabled={saving}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
