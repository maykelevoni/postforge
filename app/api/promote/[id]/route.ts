import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status, priority, funnelUrl } = await req.json();

  const promotion = await db.promotion.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!promotion) {
    return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
  }

  const updated = await db.promotion.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(priority !== undefined && { priority }),
      ...(funnelUrl !== undefined && { funnelUrl }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const promotion = await db.promotion.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!promotion) {
    return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
  }

  const updated = await db.promotion.update({
    where: { id: params.id },
    data: { status: "archived" },
  });

  return NextResponse.json(updated);
}
