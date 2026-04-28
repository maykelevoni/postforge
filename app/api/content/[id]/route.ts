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

  const body = await req.json();
  const { action, content, subject } = body;

  // mark_posted action: manually confirm a queued post
  if (action === "mark_posted") {
    const piece = await db.contentPiece.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!piece) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.contentPiece.update({
      where: { id: params.id },
      data: { status: "published", postedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  }

  // Content edit: update text for piece or newsletter
  const piece = await db.contentPiece.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (piece) {
    const updated = await db.contentPiece.update({
      where: { id: params.id },
      data: { content },
    });
    return NextResponse.json(updated);
  }

  const newsletter = await db.newsletter.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (newsletter) {
    const updated = await db.newsletter.update({
      where: { id: params.id },
      data: { subject, body: body.body },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Item not found" }, { status: 404 });
}
