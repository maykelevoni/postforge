import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { postToPlatform } from "@/worker/posting/post-bridge";
import { sendNewsletter } from "@/worker/posting/systeme";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const piece = await db.contentPiece.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (piece) {
    try {
      const postId = await postToPlatform({
        platform: piece.platform,
        content: piece.content,
        mediaUrl: piece.videoUrl || piece.imageUrl || undefined,
        userId: piece.userId,
      });

      const updated = await db.contentPiece.update({
        where: { id: params.id },
        data: {
          status: "published",
          postBridgeId: postId,
          postedAt: new Date(),
        },
      });

      return NextResponse.json(updated);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to publish" },
        { status: 500 }
      );
    }
  }

  const newsletter = await db.newsletter.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (newsletter) {
    try {
      await sendNewsletter(newsletter);
      const updated = await db.newsletter.findFirst({
        where: { id: params.id },
      });
      return NextResponse.json(updated);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to send" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Item not found" }, { status: 404 });
}
