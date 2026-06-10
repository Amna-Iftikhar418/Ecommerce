import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = (await req.json()) as Partial<{
    name: string;
    description: string;
    price: number;
    categoryId: string;
    slug: string;
    isAvailable: boolean;
    image: string | null;
  }>;

  try {
    const item = await db.menuItem.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Item not found or slug conflict" },
      { status: 422 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Item not found or has existing order references" },
      { status: 422 }
    );
  }
}
