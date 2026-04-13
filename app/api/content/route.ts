import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "posts";
  const platform = searchParams.get("platform");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  if (type === "newsletters") {
    const where: any = { userId: session.user.id };
    if (status && status !== "all") where.status = status;

    const [items, total] = await Promise.all([
      db.newsletter.findMany({
        where,
        include: { promotion: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.newsletter.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } else {
    const where: any = { userId: session.user.id };
    if (platform && platform !== "all") where.platform = platform;
    if (status && status !== "all") where.status = status;

    const [items, total] = await Promise.all([
      db.contentPiece.findMany({
        where,
        include: { promotion: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.contentPiece.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }
}
