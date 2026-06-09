import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const items = await db.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const data = await req.json() as {
    name: string;
    description: string;
    price: number;
    image?: string;
    slug: string;
    categoryId: string;
  };

  const item = await db.menuItem.create({ data });
  return NextResponse.json(item, { status: 201 });
}
