"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Banknote, ChevronDown, Loader2, Trash2, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

type PaymentMethod = "CARD" | "COD";
type PaymentStatus = "PENDING" | "PAID";

type AdminOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  user: { name: string | null; email: string };
  items: { menuItem: { name: string }; quantity: number }[];
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
];

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: AdminOrder[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [updating, setUpdating] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);
  const [cleanConfirmOpen, setCleanConfirmOpen] = useState(false);

  const removableCount = orders.filter(
    (o) => o.status === "DELIVERED" || o.status === "CANCELLED"
  ).length;

  const displayed =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteOrder(order: AdminOrder) {
    setUpdating(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to delete order");
      }
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success("Order deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete order");
    } finally {
      setUpdating(null);
    }
  }

  async function cleanOrders() {
    if (removableCount === 0) {
      toast.info("No delivered or cancelled orders to remove");
      return;
    }
    setCleaning(true);
    try {
      const res = await fetch("/api/admin/orders", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED")
      );
      toast.success(
        `Removed ${removableCount} order${removableCount !== 1 ? "s" : ""}`
      );
    } catch {
      toast.error("Failed to clean up orders");
    } finally {
      setCleaning(false);
    }
  }

  async function markPaid(orderId: string) {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus: "PAID" }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "PAID" } : o))
      );
      toast.success("Marked as paid");
    } catch {
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(null);
    }
  }

  const columns = [
    {
      header: "Order",
      cell: (order: AdminOrder) => (
        <div>
          <p className="font-mono text-sm font-semibold">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: (order: AdminOrder) => (
        <div>
          <p className="text-sm font-medium">{order.user.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{order.user.email}</p>
        </div>
      ),
    },
    {
      header: "Items",
      cell: (order: AdminOrder) => (
        <p className="text-sm text-muted-foreground max-w-xs truncate">
          {order.items
            .map((i) => `${i.menuItem.name} ×${i.quantity}`)
            .join(", ")}
        </p>
      ),
    },
    {
      header: "Total",
      cell: (order: AdminOrder) => (
        <span className="font-semibold">${order.total.toFixed(2)}</span>
      ),
    },
    {
      header: "Payment",
      cell: (order: AdminOrder) => (
        <div className="flex flex-col gap-1.5 items-start">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              order.paymentMethod === "COD"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-slate-100 text-slate-800 border-slate-200"
            )}
          >
            {order.paymentMethod === "COD" ? (
              <Banknote className="h-3 w-3" />
            ) : (
              <CreditCard className="h-3 w-3" />
            )}
            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card"}
          </span>
          {order.paymentStatus === "PAID" ? (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-200">
              Paid
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border-yellow-200">
              Unpaid
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (order: AdminOrder) => <OrderStatusBadge status={order.status} />,
    },
    {
      header: "Actions",
      cell: (order: AdminOrder) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={updating === order.id}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            {updating === order.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            Actions
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={order.status}
              onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}
            >
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              {ALL_STATUSES.map((s) => (
                <DropdownMenuRadioItem key={s} value={s} closeOnClick>
                  {s.replace(/_/g, " ")}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {order.paymentMethod === "COD" && order.paymentStatus !== "PAID" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => markPaid(order.id)}>
                  Mark as Paid
                </DropdownMenuItem>
              </>
            )}
            {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteTarget(order)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Order
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(["ALL", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === s
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
              )}
            >
              {s === "ALL" ? "All" : s.replace(/_/g, " ")}
              <span className="ml-1.5 text-[10px] opacity-70">
                (
                {s === "ALL"
                  ? orders.length
                  : orders.filter((o) => o.status === s).length}
                )
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (removableCount === 0) {
              toast.info("No delivered or cancelled orders to remove");
              return;
            }
            setCleanConfirmOpen(true);
          }}
          disabled={cleaning || removableCount === 0}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 text-destructive hover:text-destructive disabled:opacity-50"
          )}
        >
          {cleaning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Eraser className="h-3.5 w-3.5" />
          )}
          Clean Up
          {removableCount > 0 && (
            <span className="ml-0.5 text-[10px] opacity-70">
              ({removableCount})
            </span>
          )}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={displayed}
        emptyMessage="No orders found."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete order #${deleteTarget?.id.slice(-8).toUpperCase()}?`}
        description="This cannot be undone."
        onConfirm={() => {
          if (deleteTarget) deleteOrder(deleteTarget);
        }}
      />

      <ConfirmDialog
        open={cleanConfirmOpen}
        onOpenChange={setCleanConfirmOpen}
        title={`Remove ${removableCount} delivered/cancelled order${
          removableCount !== 1 ? "s" : ""
        }?`}
        description="This cannot be undone."
        confirmLabel="Remove"
        onConfirm={cleanOrders}
      />
    </div>
  );
}
