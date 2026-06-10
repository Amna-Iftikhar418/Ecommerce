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
  total,
  address,
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderEmailItem[];
  total: number;
  address: DeliveryAddress;
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
            <tr style="border-top:1px solid #e5e7eb">
              <td style="padding:12px 0 0;font-weight:700">Total</td>
              <td style="padding:12px 0 0;font-weight:700;text-align:right">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <p style="margin:0 0 4px;font-weight:600;color:#374151">Delivering to:</p>
          <p style="margin:0 0 24px;color:#6b7280">${addressLine}</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Track Your Order</a>
        </div>
      </div>
    `,
  });
}
