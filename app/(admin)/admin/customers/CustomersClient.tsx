"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string | null;
  hasActiveOrders: boolean;
};

export default function CustomersClient({
  customers,
}: {
  customers: Customer[];
}) {
  const [items, setItems] = useState(customers);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  async function handleDelete(customer: Customer) {
    setDeleting(customer.id);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed");
      }
      setItems((prev) => prev.filter((c) => c.id !== customer.id));
      toast.success("Customer removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove customer");
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-16 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Users className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">No customers yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Registered customers will appear here.
        </p>
      </div>
    );
  }

  const columns = [
    {
      header: "Customer",
      cell: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
            {(customer.name ?? customer.email)
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{customer.name ?? "—"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Orders",
      cell: (customer: Customer) => (
        <span>
          <span className="text-sm font-medium">{customer.orderCount}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            {customer.orderCount === 1 ? "order" : "orders"}
          </span>
        </span>
      ),
    },
    {
      header: "Total Spent",
      cell: (customer: Customer) => (
        <span className="font-heading text-sm font-semibold">
          ${customer.totalSpent.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Last Order",
      cell: (customer: Customer) => (
        <span className="text-sm text-muted-foreground">
          {customer.lastOrder
            ? new Date(customer.lastOrder).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      header: "",
      cell: (customer: Customer) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={deleting === customer.id || customer.hasActiveOrders}
            onClick={() => setDeleteTarget(customer)}
            title={
              customer.hasActiveOrders
                ? "Cannot delete: customer has an active order"
                : "Remove customer"
            }
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      className: "w-14",
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={items} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Remove ${deleteTarget?.name ?? deleteTarget?.email}?`}
        description={
          deleteTarget && deleteTarget.orderCount > 0
            ? `Their ${deleteTarget.orderCount} delivered/cancelled order${
                deleteTarget.orderCount !== 1 ? "s" : ""
              } will also be deleted. This cannot be undone.`
            : "This cannot be undone."
        }
        confirmLabel="Remove"
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
      />
    </>
  );
}
