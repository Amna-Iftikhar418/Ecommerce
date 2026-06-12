import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const customer = await db.user.findUnique({
    where: { id },
    select: {
      role: true,
      orders: { select: { id: true, status: true } },
    },
  });

  if (!customer || customer.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const hasActiveOrders = customer.orders.some(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  );

  if (hasActiveOrders) {
    return NextResponse.json(
      { error: "Cannot delete a customer with active orders" },
      { status: 422 }
    );
  }

  const orderIds = customer.orders.map((o) => o.id);

  await db.$transaction([
    db.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
    db.order.deleteMany({ where: { id: { in: orderIds } } }),
    db.address.deleteMany({ where: { userId: id } }),
    db.review.deleteMany({ where: { userId: id } }),
    db.user.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
