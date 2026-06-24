import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = req.nextUrl.searchParams.get("since");
  const sinceDate = since ? new Date(since) : new Date(0);
  const serverTime = new Date();

  const orders = await db.order.findMany({
    where: { createdAt: { gt: sinceDate } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      total: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      total: o.total,
      createdAt: o.createdAt,
      customerName: o.user.name ?? o.user.email,
      itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    })),
    serverTime: serverTime.toISOString(),
  });
}
