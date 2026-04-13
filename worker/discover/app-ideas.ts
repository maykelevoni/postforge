import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";

interface AppIdeaData {
  title: string;
  problem: string;
  targetAudience: string;
  coreFeatures: string[];
  monetization: string;
  competition: string;
  whyNow: string;
  landingPageHtml: string;
}

export async function generateAppIdeas(userId: string): Promise<void> {
  console.log(`Generating app ideas for user ${userId}...`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get top 3 new research topics by score
  const topics = await db.researchTopic.findMany({
    where: {
      userId,
      status: "new",
      date: {
        gte: today,
      },
    },
    orderBy: [
      { score: "desc" },
      { createdAt: "asc" },
    ],
    take: 3,
  });

  console.log(`Found ${topics.length} topics for app idea generation`);

  let ideasCreated = 0;

  for (const topic of topics) {
    // Check if DiscoverItem already exists for this topic
    const existing = await db.discoverItem.findFirst({
      where: {
        userId,
        topicId: topic.id,
        type: "app_idea",
        createdAt: {
          gte: today,
        },
      },
    });

    if (existing) {
      console.log(`App idea already exists for topic "${topic.title}", skipping`);
      continue;
    }

    try {
      const prompt = `Based on this trending topic: "${topic.title}"

Summary: ${topic.summary || "No summary available"}

Generate a complete startup idea including:
1. A catchy app/product title
2. The problem it solves
3. Target audience
4. Core features (as JSON array)
5. Monetization strategy
6. Competitive landscape
7. Why this is the right time (market timing)
8. A complete landing page in HTML with:
   - Hero section with headline and subheadline
   - Features section (3-4 key features)
   - Email capture form
   - Call-to-action button

Return your response as valid JSON with this exact structure:
{
  "title": "...",
  "problem": "...",
  "targetAudience": "...",
  "coreFeatures": ["...", "...", "..."],
  "monetization": "...",
  "competition": "...",
  "whyNow": "...",
  "landingPageHtml": "<!DOCTYPE html><html>...</html>"
}`;

      const response = await generateText({
        prompt,
        system: "You are an expert product strategist and startup advisor. You respond with valid JSON only.",
        userId,
      });

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("Failed to parse JSON from AI response");
        continue;
      }

      const ideaData: AppIdeaData = JSON.parse(jsonMatch[0]);

      // Create DiscoverItem and AppIdea
      const discoverItem = await db.discoverItem.create({
        data: {
          userId,
          type: "app_idea",
          status: "pending",
          topicId: topic.id,
        },
      });

      await db.appIdea.create({
        data: {
          discoverItemId: discoverItem.id,
          title: ideaData.title,
          problem: ideaData.problem,
          targetAudience: ideaData.targetAudience,
          coreFeatures: JSON.stringify(ideaData.coreFeatures),
          monetization: ideaData.monetization,
          competition: ideaData.competition,
          whyNow: ideaData.whyNow,
          landingPageHtml: ideaData.landingPageHtml,
        },
      });

      ideasCreated++;
      console.log(`Created app idea: ${ideaData.title}`);
    } catch (error) {
      console.error(`Error generating app idea for topic "${topic.title}":`, error);
    }
  }

  console.log(`Created ${ideasCreated} app ideas`);
}
