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

  const service = await db.service.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
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
    status,
  } = body;

  // Handle status changes - sync with promotion
  if (status !== undefined && status !== service.status && service.promotionId) {
    await db.promotion.update({
      where: { id: service.promotionId },
      data: { status },
    });
  }

  // Handle funnelUrl changes - update promotion URL
  if (funnelUrl !== undefined && funnelUrl !== service.funnelUrl && service.promotionId) {
    await db.promotion.update({
      where: { id: service.promotionId },
      data: { url: funnelUrl },
    });
  }

  const updated = await db.service.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(deliverables !== undefined && { deliverables }),
      ...(priceMin !== undefined && { priceMin }),
      ...(priceMax !== undefined && { priceMax }),
      ...(turnaroundDays !== undefined && { turnaroundDays }),
      ...(funnelUrl !== undefined && { funnelUrl }),
      ...(status !== undefined && { status }),
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

  const service = await db.service.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  await db.service.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
