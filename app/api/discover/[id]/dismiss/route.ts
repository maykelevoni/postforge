import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await db.discoverItem.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await db.discoverItem.update({
    where: { id: params.id },
    data: { status: "dismissed" },
  });

  return NextResponse.json({ ok: true });
}
