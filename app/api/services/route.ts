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
      ownedLandingPage: {
        select: {
          id: true,
          slug: true,
          template: true,
          variables: true,
          sections: true,
          status: true,
        },
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

  // Create promotion if funnelUrl is provided
  let promotionId = null;
  if (funnelUrl) {
    const promotion = await db.promotion.create({
      data: {
        userId: session.user.id,
        name,
        type: "service",
        description,
        url: funnelUrl,
        priority: 5,
        status: "active",
      },
    });
    promotionId = promotion.id;
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
      promotionId,
    },
  });

  return NextResponse.json(service);
}
