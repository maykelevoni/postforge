import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const serviceId = searchParams.get("serviceId");

  const where: any = {
    userId: session.user.id,
  };

  if (status && status !== "all") {
    where.status = status;
  }

  if (serviceId && serviceId !== "all") {
    where.serviceId = serviceId;
  }

  const tickets = await db.serviceTicket.findMany({
    where,
    include: {
      service: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ tickets });
}
