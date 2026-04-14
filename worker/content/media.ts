import { db } from "@/lib/db";
import { generateImage, generateVideo } from "@/lib/falai";
import { generateText } from "@/lib/ai";
import { getTemplateById, fillTemplateVariables, trackTemplateUsage } from "@/lib/templates";

export async function generateMediaForPiece(
  pieceId: string,
  userId: string,
  imageTemplateId?: string,
  videoTemplateId?: string
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

    // Use template for image prompt if provided
    if (imageTemplateId) {
      const template = await getTemplateById(imageTemplateId, userId);
      if (template && template.category === "image_prompt") {
        // Get product info from promotion
        const promotion = await db.promotion.findFirst({
          where: { id: piece.promotionId ?? undefined },
        });

        if (promotion) {
          // Fill variables with AI
          const variables = await fillTemplateVariables(
            template,
            { name: promotion.name, description: promotion.description, url: promotion.url },
            userId
          );

          // Generate image prompt from template
          imagePrompt = await generateText({
            prompt: `Generate an image prompt following this template: ${template.template}

Variables: ${JSON.stringify(variables)}

Product: ${promotion.name} - ${promotion.description}

Generate a detailed image generation prompt. Be specific about style, composition, colors, and mood.`,
            system: "You are an expert at creating AI image generation prompts.",
            userId,
          });

          // Track template usage
          await trackTemplateUsage(imageTemplateId);
        }
      }
    } else if (piece.platform === "instagram") {
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
    let videoPrompt = "Smooth camera movement, cinematic quality";

    // Use template for video prompt if provided
    if (videoTemplateId) {
      const template = await getTemplateById(videoTemplateId, userId);
      if (template && template.category === "video_prompt") {
        const promotion = await db.promotion.findFirst({
          where: { id: piece.promotionId ?? undefined },
        });

        if (promotion) {
          // Fill variables with AI
          const variables = await fillTemplateVariables(
            template,
            { name: promotion.name, description: promotion.description, url: promotion.url },
            userId
          );

          // Generate video prompt from template
          videoPrompt = await generateText({
            prompt: `Generate a video prompt following this template: ${template.template}

Variables: ${JSON.stringify(variables)}

Generate a detailed video generation prompt for animating the image. Be specific about camera movement, style, and mood.`,
            system: "You are an expert at creating AI video generation prompts.",
            userId,
          });

          // Track template usage
          await trackTemplateUsage(videoTemplateId);
        }
      }
    }

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
