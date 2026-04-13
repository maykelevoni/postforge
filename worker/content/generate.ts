import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { buildUtmUrl } from "@/lib/utm";
import { getSetting } from "@/lib/settings";

const PLATFORMS = ["twitter", "linkedin", "reddit", "instagram", "tiktok"] as const;

interface GenerationContext {
  promotion: {
    id: string;
    name: string;
    description: string;
    url: string;
  };
  topic: {
    title: string;
    summary: string;
  } | null;
}

async function generateContentForPlatform(
  platform: typeof PLATFORMS[number],
  context: GenerationContext,
  userId: string
): Promise<{ content: string }> {
  const utmUrl = buildUtmUrl(context.promotion.url, {
    source: platform,
    medium: "social",
    campaign: "daily-post",
  });

  const systemPrompts = {
    twitter: "You are a social media expert specializing in viral Twitter content. Write punchy, engaging tweets that drive action. Include 2-3 relevant hashtags. Max 280 characters.",
    linkedin: "You are a LinkedIn thought leader. Write professional, insightful posts that provide value before selling. Use a conversational but authoritative tone. 150-300 words.",
    reddit: "You are a helpful community member. Write valuable, non-promotional content that fits naturally in relevant subreddits. Focus on being helpful and authentic. No hard selling.",
    instagram: "You are an Instagram content creator. Write engaging captions that complement visual content. Include relevant hashtags. Max 150 characters.",
    tiktok: "You are a TikTok scriptwriter. Write scripts in the format: HOOK (3 seconds) + VALUE (15 seconds) + CTA (5 seconds). Make it engaging and authentic.",
  };

  const userPrompts = {
    twitter: `Write a viral tweet about: ${context.promotion.name}

Description: ${context.promotion.description}

Trending topic to reference: ${context.topic?.title || "Current industry trends"}

Include this link naturally: ${utmUrl}

Make it punchy and engaging.`,
    linkedin: `Write a LinkedIn post about: ${context.promotion.name}

Description: ${context.promotion.description}

Trending topic: ${context.topic?.title || "Industry insights"}

Include this link in your CTA: ${utmUrl}

Provide genuine value and insights.`,
    reddit: `Write a helpful Reddit post about: ${context.promotion.name}

Description: ${context.promotion.description}

Make it valuable and community-focused. No hard selling. You can subtly mention: ${utmUrl} if it fits naturally.`,
    instagram: `Write an Instagram caption for: ${context.promotion.name}

${context.promotion.description}

Include 3-5 relevant hashtags and this link in bio mention: ${utmUrl}`,
    tiktok: `Write a TikTok script for: ${context.promotion.name}

${context.promotion.description}

Format: HOOK (3 sec) → VALUE (15 sec) → CTA with ${utmUrl} (5 sec)`,
  };

  const content = await generateText({
    prompt: userPrompts[platform],
    system: systemPrompts[platform],
    userId,
  });

  return { content };
}

export async function generatePostsForPromotion(
  promotionId: string,
  userId: string
): Promise<void> {
  console.log(`Generating content for promotion ${promotionId}...`);

  const promotion = await db.promotion.findFirst({
    where: {
      id: promotionId,
      userId,
    },
  });

  if (!promotion) {
    console.error(`Promotion ${promotionId} not found`);
    return;
  }

  // Get today's top research topic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const topic = await db.researchTopic.findFirst({
    where: {
      userId,
      date: {
        gte: today,
      },
      status: {
        in: ["new", "used"],
      },
    },
    orderBy: {
      score: "desc",
    },
  });

  const context: GenerationContext = {
    promotion: {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      url: promotion.url,
    },
    topic: topic ? {
      title: topic.title,
      summary: topic.summary || "",
    } : null,
  };

  // Check gate mode
  const gateModeSetting = await getSetting("gate_mode", userId);
  const gateMode = gateModeSetting === "true";
  const baseStatus = gateMode ? "draft" : "scheduled";

  // Generate content for each platform
  const results = await Promise.allSettled(
    PLATFORMS.map(async (platform) => {
      try {
        const { content } = await generateContentForPlatform(platform, context, userId);

        const piece = await db.contentPiece.create({
          data: {
            userId,
            promotionId: promotion.id,
            date: new Date(),
            platform,
            content,
            status: baseStatus,
            approved: !gateMode,
          },
        });

        console.log(`Created ${platform} post: ${piece.id}`);
        return piece;
      } catch (error) {
        console.error(`Failed to generate ${platform} content:`, error);
        return null;
      }
    })
  );

  // Generate newsletter
  try {
    const utmUrl = buildUtmUrl(context.promotion.url, {
      source: "email",
      medium: "newsletter",
      campaign: "daily-newsletter",
    });

    const newsletterPrompt = `Write an engaging email newsletter about: ${context.promotion.name}

Description: ${context.promotion.description}

Trending topic: ${context.topic?.title || "Industry insights"}

Include this link in your CTA: ${utmUrl}

Structure: Hook paragraph → Value section → Bridge to product → Single clear CTA`;

    const body = await generateText({
      prompt: newsletterPrompt,
      system: "You are an email marketing expert. Write newsletters that provide value and drive conversions. Keep it under 500 words.",
      userId,
    });

    const subject = await generateText({
      prompt: `Generate a catchy email subject line for: ${context.promotion.name}. Make it compelling but not spammy. Under 50 characters.`,
      system: "You are an email marketing expert. Write subject lines that get opened.",
      userId,
    });

    await db.newsletter.create({
      data: {
        userId,
        promotionId: promotion.id,
        date: new Date(),
        subject: subject.substring(0, 100) || "Today's Pick",
        body,
        status: baseStatus,
        approved: !gateMode,
      },
    });

    console.log("Created newsletter");
  } catch (error) {
    console.error("Failed to generate newsletter:", error);
  }

  console.log(`Content generation complete for promotion ${promotionId}`);
}
