import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    where: { userId },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId, status } = await req.json() as { orderId: string; status: string };

  const order = await db.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  return NextResponse.json(order);
}
