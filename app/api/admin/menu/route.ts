import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db.menuItem.findMany({
    include: { category: { select: { id: true, name: true } } },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    slug: string;
    isAvailable: boolean;
    image: string | null;
  };

  try {
    const item = await db.menuItem.create({
      data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Slug already exists or invalid data" },
      { status: 422 }
    );
  }
}
