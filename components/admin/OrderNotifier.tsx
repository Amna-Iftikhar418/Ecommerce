"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const POLL_INTERVAL_MS = 8000;
const STORAGE_KEY = "admin_last_order_check";
// On a fresh tab/device there's no cursor yet — look back a couple minutes
// instead of starting at "now", so an order placed just before the admin
// dashboard was opened still triggers a notification.
const INITIAL_LOOKBACK_MS = 2 * 60 * 1000;

type NewOrder = {
  id: string;
  total: number;
  createdAt: string;
  customerName: string;
  itemCount: number;
};

export default function OrderNotifier() {
  const router = useRouter();
  const cursorRef = useRef<string | null>(null);

  useEffect(() => {
    cursorRef.current = localStorage.getItem(STORAGE_KEY);
    if (!cursorRef.current) {
      cursorRef.current = new Date(Date.now() - INITIAL_LOOKBACK_MS).toISOString();
      localStorage.setItem(STORAGE_KEY, cursorRef.current);
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    async function poll() {
      try {
        const res = await fetch(
          `/api/admin/orders/notify?since=${encodeURIComponent(cursorRef.current!)}`,
          { cache: "no-store" }
        );
        if (cancelled) return;
        if (res.status === 401) {
          // Not signed in as ADMIN on this page — no point polling further.
          clearInterval(interval);
          return;
        }
        if (!res.ok) {
          console.error(
            `[OrderNotifier] notify request failed: ${res.status} ${res.statusText}`
          );
          return;
        }

        const data: { orders: NewOrder[]; serverTime: string } = await res.json();

        // One toast per order — counts orders placed, never the items inside them.
        for (const order of data.orders) {
          toast.success(`New order from ${order.customerName}`, {
            description: `${order.itemCount} item${order.itemCount === 1 ? "" : "s"} · $${order.total.toFixed(2)}`,
            action: {
              label: "View",
              onClick: () => router.push("/admin/orders"),
            },
          });
        }

        if (data.orders.length > 0) {
          router.refresh();
        }

        cursorRef.current = data.serverTime;
        localStorage.setItem(STORAGE_KEY, data.serverTime);
      } catch (err) {
        console.error("[OrderNotifier] poll failed:", err);
      }
    }

    interval = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
