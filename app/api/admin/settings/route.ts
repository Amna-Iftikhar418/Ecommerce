import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { SETTINGS_DEFAULTS } from "@/lib/settings";

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...SETTINGS_DEFAULTS },
  });

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as Partial<typeof SETTINGS_DEFAULTS>;

  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...SETTINGS_DEFAULTS, ...data },
  });

  return NextResponse.json(settings);
}
