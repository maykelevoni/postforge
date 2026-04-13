import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "all";
  const status = searchParams.get("status") || "pending";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = {
    userId: session.user.id,
  };

  if (type !== "all") {
    where.type = type;
  }

  if (status !== "all") {
    where.status = status;
  }

  const [items, total] = await Promise.all([
    db.discoverItem.findMany({
      where,
      include: {
        appIdea: true,
        affiliate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    db.discoverItem.count({ where }),
  ]);

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
