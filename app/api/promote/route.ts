import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "active";

  const promotions = await db.promotion.findMany({
    where: {
      userId: session.user.id,
      status,
    },
    include: {
      discoverItem: {
        include: {
          appIdea: true,
          affiliate: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(promotions);
}
