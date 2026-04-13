import { db } from "@/lib/db";
import { generateImage, generateVideo } from "@/lib/falai";
import { generateText } from "@/lib/ai";

export async function generateMediaForPiece(
  pieceId: string,
  userId: string
): Promise<void> {
  console.log(`Generating media for content piece ${pieceId}...`);

  const piece = await db.contentPiece.findFirst({
    where: {
      id: pieceId,
      userId,
    },
  });

  if (!piece) {
    console.error(`Content piece ${pieceId} not found`);
    return;
  }

  // Only generate media for Instagram and TikTok
  if (piece.platform !== "instagram" && piece.platform !== "tiktok") {
    console.log(`Skipping media generation for ${piece.platform}`);
    return;
  }

  try {
    // Extract or generate image prompt
    let imagePrompt = piece.content.substring(0, 200);

    if (piece.platform === "instagram") {
      // Generate a more descriptive image prompt from the content
      imagePrompt = await generateText({
        prompt: `Generate a detailed image generation prompt for an Instagram post about this content: ${piece.content}

Describe the image style, composition, colors, mood, and any text overlays. Be specific and visual. Max 100 words.`,
        system: "You are an expert at creating AI image generation prompts. Describe visuals in detail.",
        userId,
      });
    }

    // Generate image
    console.log(`Generating image for ${piece.platform}...`);
    const imageUrl = await generateImage(imagePrompt, userId);
    console.log(`Image generated: ${imageUrl}`);

    // Generate video from image
    console.log(`Generating video for ${piece.platform}...`);
    const videoPrompt = "Smooth camera movement, cinematic quality";
    const videoUrl = await generateVideo(imageUrl, videoPrompt, userId);
    console.log(`Video generated: ${videoUrl}`);

    // Update content piece with media URLs
    await db.contentPiece.update({
      where: { id: pieceId },
      data: {
        imageUrl,
        videoUrl,
      },
    });

    console.log(`Media generation complete for piece ${pieceId}`);
  } catch (error) {
    console.error(`Failed to generate media for piece ${pieceId}:`, error);

    // Update with error so we know it failed
    await db.contentPiece.update({
      where: { id: pieceId },
      data: {
        error: `Media generation failed: ${error}`,
      },
    });
  }
}
