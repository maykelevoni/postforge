import { getSetting } from "@/lib/settings";

export interface RawTopic {
  title: string;
  url: string;
  summary: string;
  source: "youtube" | "reddit" | "newsapi";
  score: number;
}

export async function fetchYouTube(userId: string): Promise<RawTopic[]> {
  const apiKey = await getSetting("youtube_api_key", userId);

  if (!apiKey) {
    console.log("YouTube API key not configured, skipping");
    return [];
  }

  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const publishedAfter = yesterday.toISOString();

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&publishedAfter=${publishedAfter}&maxResults=10&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("YouTube API error:", await response.text());
      return [];
    }

    const data = await response.json();
    const topics: RawTopic[] = [];

    for (const item of data.items || []) {
      const title = item.snippet?.title;
      const videoId = item.id?.videoId;
      const description = item.snippet?.description;

      if (title && videoId) {
        // Score based on view count (if available) or default to 5
        let score = 5;
        if (item.statistics?.viewCount) {
          const views = parseInt(item.statistics.viewCount, 10);
          score = Math.min(10, Math.max(1, Math.log10(views + 1) / 4));
        }

        topics.push({
          title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          summary: description?.substring(0, 500) || "",
          source: "youtube",
          score: Math.round(score * 10) / 10,
        });
      }
    }

    return topics;
  } catch (error) {
    console.error("Error fetching YouTube topics:", error);
    return [];
  }
}
