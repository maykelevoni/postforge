import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = {
    userId: session.user.id,
  };

  if (source && source !== "all") {
    where.source = source;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }

  const [topics, total] = await Promise.all([
    db.researchTopic.findMany({
      where,
      orderBy: {
        score: "desc",
      },
      skip,
      take: limit,
    }),
    db.researchTopic.count({ where }),
  ]);

  return NextResponse.json({
    topics,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
