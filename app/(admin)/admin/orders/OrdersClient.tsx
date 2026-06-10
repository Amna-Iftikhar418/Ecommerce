"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import DataTable from "@/components/admin/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

type AdminOrder = {
  id: string;
  status: OrderStatus;
  total: number;
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
      header: "Status",
      cell: (order: AdminOrder) => <OrderStatusBadge status={order.status} />,
    },
    {
      header: "Update Status",
      cell: (order: AdminOrder) => (
        <Select
          value={order.status}
          onValueChange={(v) => { if (v) updateStatus(order.id, v as OrderStatus); }}
          disabled={updating === order.id}
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["ALL", ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              filter === s
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
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

      <DataTable
        columns={columns}
        data={displayed}
        emptyMessage="No orders found."
      />
    </div>
  );
}
