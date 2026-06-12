import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

const VALID_STATUSES = [
  "PENDING",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

const VALID_PAYMENT_STATUSES = ["PENDING", "PAID"] as const;
type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { menuItem: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status, paymentStatus } = (await req.json()) as {
    orderId: string;
    status?: string;
    paymentStatus?: string;
  };

  if (status === undefined && paymentStatus === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (paymentStatus !== undefined && !VALID_PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const existing = await db.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  const order = await db.order.update({
    where: { id: orderId },
    data: {
      ...(status !== undefined && { status: status as OrderStatus }),
      ...(paymentStatus !== undefined && { paymentStatus: paymentStatus as PaymentStatus }),
    },
    include: { user: { select: { email: true, name: true } } },
  });

  if (status !== undefined && existing && existing.status !== order.status) {
    sendOrderStatusUpdateEmail({
      to: order.user.email,
      customerName: order.user.name ?? "there",
      orderId: order.id,
      status: order.status,
    }).catch(console.error);
  }

  return NextResponse.json(order);
}

export async function DELETE() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toDelete = await db.order.findMany({
    where: { status: { in: ["DELIVERED", "CANCELLED"] } },
    select: { id: true },
  });
  const ids = toDelete.map((o) => o.id);

  if (ids.length > 0) {
    await db.$transaction([
      db.orderItem.deleteMany({ where: { orderId: { in: ids } } }),
      db.order.deleteMany({ where: { id: { in: ids } } }),
    ]);
  }

  return NextResponse.json({ success: true, count: ids.length });
}
