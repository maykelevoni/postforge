import { db } from "@/lib/db";
import { generatePostsForPromotion } from "./generate";
import { generateMediaForPiece } from "./media";

export async function runContent(userId: string): Promise<void> {
  console.log(`Starting content generation for user ${userId}...`);

  try {
    // Get all active promotions, weighted by priority
    const promotions = await db.promotion.findMany({
      where: {
        userId,
        status: "active",
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "asc" },
      ],
    });

    if (promotions.length === 0) {
      console.log("No active promotions found");
      return;
    }

    // Select one promotion based on priority weights
    // Higher priority = higher chance of selection
    const totalWeight = promotions.reduce((sum, p) => sum + p.priority, 0);
    let random = Math.random() * totalWeight;
    let selectedPromotion = promotions[0];

    for (const promotion of promotions) {
      random -= promotion.priority;
      if (random <= 0) {
        selectedPromotion = promotion;
        break;
      }
    }

    console.log(`Selected promotion: ${selectedPromotion.name} (priority: ${selectedPromotion.priority})`);

    // Generate content pieces
    await generatePostsForPromotion(selectedPromotion.id, userId);

    // Get the pieces that were just created for this promotion
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pieces = await db.contentPiece.findMany({
      where: {
        userId,
        promotionId: selectedPromotion.id,
        date: {
          gte: today,
        },
      },
    });

    // Generate media for Instagram, TikTok, and YouTube pieces
    const mediaPieces = pieces.filter(p => p.platform === "instagram" || p.platform === "tiktok" || p.platform === "youtube");

    for (const piece of mediaPieces) {
      await generateMediaForPiece(piece.id, userId);
    }

    console.log(`Content generation complete for user ${userId}`);
  } catch (error) {
    console.error(`Error in content generation for user ${userId}:`, error);
  }
}
