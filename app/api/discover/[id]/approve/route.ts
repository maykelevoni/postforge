import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await db.discoverItem.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      appIdea: true,
      affiliate: true,
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.status !== "pending") {
    return NextResponse.json({ error: "Item already processed" }, { status: 400 });
  }

  // Create promotion
  const promotion = await db.promotion.create({
    data: {
      userId: session.user.id,
      discoverItemId: item.id,
      name: item.appIdea?.title || item.affiliate?.name || "Untitled",
      type: item.type,
      description: item.appIdea?.problem || item.affiliate?.description || "",
      url: item.affiliate?.affiliateLink || "",
      priority: 5,
      status: "active",
    },
  });

  // Update discover item status
  await db.discoverItem.update({
    where: { id: params.id },
    data: { status: "approved" },
  });

  // Mark research topic as used if linked
  if (item.topicId) {
    await db.researchTopic.update({
      where: { id: item.topicId },
      data: { status: "used" },
    });
  }

  return NextResponse.json({ promotionId: promotion.id });
}
