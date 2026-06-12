import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type OrderEmailItem = {
  name: string;
  quantity: number;
  price: number;
};

type DeliveryAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
};

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  address,
  paymentMethod = "CARD",
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderEmailItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  address: DeliveryAddress;
  paymentMethod?: "CARD" | "COD";
}) {
  const orderRef = orderId.slice(-8).toUpperCase();
  const addressLine = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.zip}`,
  ]
    .filter(Boolean)
    .join(", ");

  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 0;color:#374151">${i.quantity}× ${i.name}</td>
          <td style="padding:6px 0;color:#374151;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const summaryRows = [
    { label: "Subtotal", value: subtotal },
    { label: "Delivery", value: deliveryFee },
    { label: "Tax", value: tax },
  ]
    .map(
      (row) =>
        `<tr>
          <td style="padding:4px 0;color:#6b7280">${row.label}</td>
          <td style="padding:4px 0;color:#6b7280;text-align:right">${
            row.label === "Delivery" && row.value === 0
              ? "Free"
              : `$${row.value.toFixed(2)}`
          }</td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: "Bella Cucina <onboarding@resend.dev>",
    to,
    subject: `Order Confirmed — #${orderRef}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827">
        <div style="background:#f97316;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fff;font-size:24px">🍽️ Bella Cucina</h1>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 8px">Order Confirmed!</h2>
          <p style="margin:0 0 24px;color:#6b7280">Hi ${customerName}, your order is confirmed and we&apos;re preparing it now.</p>

          <p style="margin:0 0 8px;font-weight:600">Order #${orderRef}</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            ${itemRows}
          </table>
          <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;margin-bottom:16px">
            ${summaryRows}
            <tr style="border-top:1px solid #e5e7eb">
              <td style="padding:12px 0 0;font-weight:700">Total</td>
              <td style="padding:12px 0 0;font-weight:700;text-align:right">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <p style="margin:0 0 4px;font-weight:600;color:#374151">Delivering to:</p>
          <p style="margin:0 0 24px;color:#6b7280">${addressLine}</p>

          ${
            paymentMethod === "COD"
              ? `<div style="margin:0 0 24px;padding:12px 16px;border-radius:8px;background:#fef3c7;color:#92400e;font-weight:600">
                  💵 Cash on Delivery — please have $${total.toFixed(2)} ready for the driver.
                </div>`
              : ""
          }

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Track Your Order</a>
        </div>
      </div>
    `,
  });
}

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_EMAIL_CONTENT: Record<
  OrderStatus,
  { subject: string; emoji: string; heading: string; message: string }
> = {
  PENDING: {
    subject: "Order Received",
    emoji: "🧾",
    heading: "Order Received",
    message: "We&apos;ve got your order and it&apos;s in the queue.",
  },
  PREPARING: {
    subject: "Your order is being prepared",
    emoji: "👨‍🍳",
    heading: "We&apos;re Cooking!",
    message: "Our kitchen has started preparing your order.",
  },
  ON_THE_WAY: {
    subject: "Your order is on the way",
    emoji: "🚗",
    heading: "On the Way!",
    message: "Your order has left the kitchen and is heading your way.",
  },
  DELIVERED: {
    subject: "Your order has been delivered",
    emoji: "✅",
    heading: "Delivered!",
    message: "Your order has arrived. Enjoy your meal!",
  },
  CANCELLED: {
    subject: "Your order has been cancelled",
    emoji: "❌",
    heading: "Order Cancelled",
    message:
      "Your order has been cancelled. If this wasn&apos;t expected, please contact us.",
  },
};

export async function sendOrderStatusUpdateEmail({
  to,
  customerName,
  orderId,
  status,
}: {
  to: string;
  customerName: string;
  orderId: string;
  status: OrderStatus;
}) {
  const orderRef = orderId.slice(-8).toUpperCase();
  const { subject, emoji, heading, message } = STATUS_EMAIL_CONTENT[status];

  await resend.emails.send({
    from: "Bella Cucina <onboarding@resend.dev>",
    to,
    subject: `${subject} — Order #${orderRef}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827">
        <div style="background:#f97316;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fff;font-size:24px">🍽️ Bella Cucina</h1>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center">
          <p style="font-size:48px;margin:0 0 8px">${emoji}</p>
          <h2 style="margin:0 0 8px">${heading}</h2>
          <p style="margin:0 0 24px;color:#6b7280">Hi ${customerName}, ${message}</p>
          <p style="margin:0 0 24px;font-weight:600;color:#374151">Order #${orderRef}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Track Your Order</a>
        </div>
      </div>
    `,
  });
}
