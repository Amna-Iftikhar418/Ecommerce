type OrderStatus = "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

const CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:    { label: "Order Received",  className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  PREPARING:  { label: "Preparing",       className: "bg-orange-100 text-orange-800 border-orange-200" },
  ON_THE_WAY: { label: "On the Way",      className: "bg-blue-100 text-blue-800 border-blue-200" },
  DELIVERED:  { label: "Delivered",       className: "bg-green-100 text-green-800 border-green-200" },
  CANCELLED:  { label: "Cancelled",       className: "bg-red-100 text-red-800 border-red-200" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = CONFIG[status] ?? CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
