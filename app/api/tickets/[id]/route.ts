import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.serviceTicket.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          deliverables: true,
          priceMin: true,
          priceMax: true,
          turnaroundDays: true,
        },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, notes, quote } = body;

  // Validate status if provided
  if (status && !["new", "quoted", "awaiting_payment", "paid", "in_progress", "delivered", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Check ownership
  const ticket = await db.serviceTicket.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Build update object with only provided fields
  const updateData: any = {};
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (quote !== undefined) updateData.quote = quote;

  const updated = await db.serviceTicket.update({
    where: { id: params.id },
    data: updateData,
    include: {
      service: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  return NextResponse.json(updated);
}
