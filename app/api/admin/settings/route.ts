import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

const DEFAULTS = {
  restaurantName: "Bella Cucina",
  restaurantPhone: "",
  restaurantEmail: "",
  deliveryRadius: 10,
  minimumOrder: 15,
  deliveryFee: 3.99,
  estimatedDelivery: 30,
  openingTime: "11:00",
  closingTime: "22:00",
  isOpen: true,
};

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...DEFAULTS },
  });

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as Partial<typeof DEFAULTS>;

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...DEFAULTS, ...data },
  });

  return NextResponse.json(settings);
}
