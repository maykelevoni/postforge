import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await db.service.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: { tickets: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    description,
    type,
    deliverables,
    priceMin,
    priceMax,
    turnaroundDays,
    funnelUrl,
  } = body;

  if (!name || !description || !type || !deliverables || !priceMin || !priceMax) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const service = await db.service.create({
    data: {
      userId: session.user.id,
      name,
      description,
      type,
      deliverables,
      priceMin,
      priceMax,
      turnaroundDays: turnaroundDays || 3,
      funnelUrl: funnelUrl || null,
      status: "active",
    },
  });

  return NextResponse.json(service);
}
