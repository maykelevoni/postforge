import { getSetting } from "@/lib/settings";
import { RawTopic } from "./youtube";

const HIGH_RANK_SOURCES = [
  "TechCrunch",
  "Wired",
  "The Verge",
  "Ars Technica",
  "Reuters",
  "Bloomberg",
  "Business Insider",
];

export async function fetchNews(userId: string): Promise<RawTopic[]> {
  const apiKey = await getSetting("newsapi_key", userId);

  if (!apiKey) {
    console.log("NewsAPI key not configured, skipping");
    return [];
  }

  const topics: RawTopic[] = [];

  for (const category of ["technology", "business"]) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?language=en&category=${category}&pageSize=10&apiKey=${apiKey}`
      );

      if (!response.ok) {
        console.error(`NewsAPI error for ${category}:`, await response.text());
        continue;
      }

      const data = await response.json();
      const articles = data.articles || [];

      for (const article of articles) {
        const title = article.title;
        const url = article.url;
        const description = article.description;
        const source = article.source?.name;

        if (title && url && description) {
          // Score based on source rank
          let score = 5;
          if (source && HIGH_RANK_SOURCES.includes(source)) {
            score = 8;
          }

          topics.push({
            title,
            url,
            summary: description,
            source: "newsapi",
            score,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching NewsAPI topics for ${category}:`, error);
    }
  }

  return topics;
}
