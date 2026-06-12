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

  const order = await db.order.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "DELIVERED" && order.status !== "CANCELLED") {
    return NextResponse.json(
      { error: "Only delivered or cancelled orders can be deleted" },
      { status: 422 }
    );
  }

  await db.$transaction([
    db.orderItem.deleteMany({ where: { orderId: id } }),
    db.order.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
