import { db } from "@/lib/db";
import { fetchYouTube } from "./youtube";
import { fetchReddit } from "./reddit";
import { fetchNews } from "./newsapi";
import { RawTopic } from "./youtube";

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function areTitlesSimilar(title1: string, title2: string): boolean {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);

  const words1 = normalized1.split(" ");
  const words2 = normalized2.split(" ");

  if (words1.length === 0 || words2.length === 0) return false;

  const commonWords = words1.filter((word) => words2.includes(word));
  const overlapRatio =
    commonWords.length / Math.max(words1.length, words2.length);

  return overlapRatio >= 0.8;
}

async function deduplicateTopics(
  topics: RawTopic[]
): Promise<RawTopic[]> {
  const unique: RawTopic[] = [];

  for (const topic of topics) {
    const isDuplicate = unique.some((existing) =>
      areTitlesSimilar(existing.title, topic.title)
    );

    if (!isDuplicate) {
      unique.push(topic);
    }
  }

  return unique;
}

export async function runResearch(userId: string, keyword?: string): Promise<void> {
  console.log(`Starting research for user ${userId}${keyword ? ` [keyword: ${keyword}]` : ""}...`);

  const results = await Promise.allSettled([
    fetchYouTube(userId, keyword),
    fetchReddit(userId, keyword),
    fetchNews(userId, keyword),
  ]);

  let allTopics: RawTopic[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allTopics = allTopics.concat(result.value);
    }
  }

  console.log(`Fetched ${allTopics.length} topics from all sources`);

  const uniqueTopics = await deduplicateTopics(allTopics);
  console.log(`After deduplication: ${uniqueTopics.length} unique topics`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let savedCount = 0;

  for (const topic of uniqueTopics) {
    // Check if topic already exists today
    const existing = await db.researchTopic.findFirst({
      where: {
        userId,
        title: topic.title,
        date: {
          gte: today,
        },
      },
    });

    if (existing) {
      console.log(`Topic "${topic.title}" already saved today, skipping`);
      continue;
    }

    await db.researchTopic.create({
      data: {
        userId,
        date: new Date(),
        source: topic.source,
        title: topic.title,
        url: topic.url,
        summary: topic.summary,
        score: topic.score,
        status: "new",
        views:       topic.views       ?? null,
        likes:       topic.likes       ?? null,
        comments:    topic.comments    ?? null,
        upvotes:     topic.upvotes     ?? null,
        upvoteRatio: topic.upvoteRatio ?? null,
      },
    });

    savedCount++;
  }

  console.log(`Saved ${savedCount} new research topics`);
}
