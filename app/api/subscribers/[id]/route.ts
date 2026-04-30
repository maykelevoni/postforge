import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriber = await db.subscriber.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!subscriber) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.subscriber.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
