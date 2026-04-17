import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const landingPageId = searchParams.get("landingPageId");
  const serviceId = searchParams.get("serviceId");

  const where: any = {
    userId: session.user.id,
  };

  if (landingPageId && landingPageId !== "all") {
    where.landingPageId = landingPageId;
  }

  if (serviceId && serviceId !== "all") {
    where.serviceId = serviceId;
  }

  const subscribers = await db.subscriber.findMany({
    where,
    include: {
      landingPage: {
        select: {
          id: true,
          slug: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(subscribers);
}
