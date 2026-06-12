import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    menuItemId?: string;
    rating?: number;
    comment?: string;
  };
  const { menuItemId, rating, comment } = body;

  if (
    !menuItemId ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const menuItem = await db.menuItem.findUnique({
    where: { id: menuItemId },
    select: { id: true },
  });
  if (!menuItem) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  await db.user.upsert({
    where: { id: userId },
    update: { email, name: clerkUser?.fullName },
    create: { id: userId, email, name: clerkUser?.fullName },
  });

  const comment_ = comment?.trim() || null;

  await db.review.upsert({
    where: { userId_menuItemId: { userId, menuItemId } },
    update: { rating, comment: comment_ },
    create: { userId, menuItemId, rating, comment: comment_ },
  });

  const agg = await db.review.aggregate({
    where: { menuItemId },
    _avg: { rating: true },
  });

  await db.menuItem.update({
    where: { id: menuItemId },
    data: { rating: agg._avg.rating ?? 0 },
  });

  return NextResponse.json({ success: true });
}
