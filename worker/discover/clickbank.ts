import { db } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { generateText } from "@/lib/ai";

interface ClickBankProduct {
  id: string;
  name: string;
  vendor: string;
  affiliateLink: string;
  description: string;
  commissionRate: number;
  avgPayout: number;
  gravityScore: number;
  imageUrl: string;
}

export async function findClickBankProducts(userId: string): Promise<void> {
  console.log(`Finding ClickBank products for user ${userId}...`);

  const apiKey = await getSetting("clickbank_api_key", userId);
  const account = await getSetting("clickbank_account", userId);

  if (!apiKey || !account) {
    console.log("ClickBank API key or account not configured, skipping");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get today's top research topic for keywords
  const topTopic = await db.researchTopic.findFirst({
    where: {
      userId,
      date: {
        gte: today,
      },
    },
    orderBy: {
      score: "desc",
    },
  });

  if (!topTopic) {
    console.log("No research topics found for today");
    return;
  }

  // Extract keywords from title
  const keywords = topTopic.title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 3)
    .join(",");

  console.log(`Searching ClickBank with keywords: ${keywords}`);

  try {
    const response = await fetch(
      `https://api.clickbank.com/rest/1.3/products/list?site=${account}&keywords=${encodeURIComponent(keywords)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("ClickBank API error:", await response.text());
      return;
    }

    const data = await response.json();
    const products: ClickBankProduct[] = data.products || [];

    console.log(`Found ${products.length} products from ClickBank`);

    let productsCreated = 0;

    for (const product of products.slice(0, 3)) {
      // Check if already created today
      const existing = await db.discoverItem.findFirst({
        where: {
          userId,
          type: "affiliate",
          affiliate: {
            name: product.name,
          },
          createdAt: {
            gte: today,
          },
        },
      });

      if (existing) {
        console.log(`Product "${product.name}" already exists, skipping`);
        continue;
      }

      try {
        // Generate content angles and promo rules using AI
        const prompt = `For this affiliate product:
Name: ${product.name}
Description: ${product.description}
Commission: ${product.commissionRate}%

Recent trending topic: "${topTopic.title}"

Generate:
1. 3-5 unique content angles for promoting this product on social media
2. A summary of promotional rules (dos and don'ts)

Return as JSON:
{
  "contentAngles": ["...", "...", "..."],
  "promoRules": "..."
}`;

        const aiResponse = await generateText({
          prompt,
          system: "You are an expert affiliate marketer. You respond with valid JSON only.",
          userId,
        });

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
          contentAngles: [
            "Problem-solution approach",
            "Case study approach",
            "Comparison approach",
          ],
          promoRules: "Be transparent about affiliate relationship. Focus on value first.",
        };

        // Create DiscoverItem and AffiliateProduct
        const discoverItem = await db.discoverItem.create({
          data: {
            userId,
            type: "affiliate",
            status: "pending",
          },
        });

        await db.affiliateProduct.create({
          data: {
            discoverItemId: discoverItem.id,
            name: product.name,
            vendor: product.vendor,
            affiliateLink: product.affiliateLink,
            description: product.description,
            commissionRate: product.commissionRate,
            avgPayout: product.avgPayout,
            gravityScore: product.gravityScore,
            imageUrl: product.imageUrl,
            promoRules: aiData.promoRules,
            contentAngles: JSON.stringify(aiData.contentAngles),
          },
        });

        productsCreated++;
        console.log(`Created affiliate product: ${product.name}`);
      } catch (error) {
        console.error(`Error creating affiliate product "${product.name}":`, error);
      }
    }

    console.log(`Created ${productsCreated} affiliate products`);
  } catch (error) {
    console.error("Error finding ClickBank products:", error);
  }
}
