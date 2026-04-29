import { getSetting } from "@/lib/settings";

export interface RawTopic {
  title: string;
  url: string;
  summary: string;
  source: "youtube" | "reddit" | "newsapi";
  score: number;
  views?: number;
  likes?: number;
  comments?: number;
  upvotes?: number;
  upvoteRatio?: number;
}

export async function fetchYouTube(userId: string, keyword?: string): Promise<RawTopic[]> {
  const apiKey = await getSetting("youtube_api_key", userId);

  if (!apiKey) {
    console.log("YouTube API key not configured, skipping");
    return [];
  }

  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const publishedAfter = yesterday.toISOString();
    const fallback = await getSetting("research_keywords", userId);
    const term = keyword || fallback;
    const q = term ? `&q=${encodeURIComponent(term)}` : "";

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&publishedAfter=${publishedAfter}&maxResults=10${q}&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("YouTube API error:", await response.text());
      return [];
    }

    const data = await response.json();
    const topics: RawTopic[] = [];
    const videoIds: string[] = [];

    for (const item of data.items || []) {
      const title = item.snippet?.title;
      const videoId = item.id?.videoId;
      const description = item.snippet?.description;

      if (title && videoId) {
        videoIds.push(videoId);

        topics.push({
          title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          summary: description?.substring(0, 500) || "",
          source: "youtube",
          score: 5,
        });
      }
    }

    // Fetch engagement statistics for all collected video IDs
    if (videoIds.length > 0) {
      try {
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}&key=${apiKey}`
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();

          // Build a map of videoId → statistics
          const statsMap: Record<string, { viewCount?: string; likeCount?: string; commentCount?: string }> = {};
          for (const statsItem of statsData.items || []) {
            if (statsItem.id) {
              statsMap[statsItem.id] = statsItem.statistics || {};
            }
          }

          // Attach stats to each topic and recalculate score
          for (const topic of topics) {
            const videoId = new URL(topic.url).searchParams.get("v");
            if (videoId && statsMap[videoId]) {
              const stats = statsMap[videoId];

              const views = stats.viewCount !== undefined ? parseInt(stats.viewCount, 10) : undefined;
              const likes = stats.likeCount !== undefined ? parseInt(stats.likeCount, 10) : undefined;
              const comments = stats.commentCount !== undefined ? parseInt(stats.commentCount, 10) : undefined;

              if (views !== undefined) {
                topic.views = views;
                topic.score = Math.round(Math.min(10, Math.max(1, Math.log10(views + 1) / 4)) * 10) / 10;
              }
              if (likes !== undefined) topic.likes = likes;
              if (comments !== undefined) topic.comments = comments;
            }
          }
        }
      } catch (statsError) {
        console.error("Error fetching YouTube video statistics (non-fatal):", statsError);
        // Topics are returned without stats — graceful degradation
      }
    }

    return topics;
  } catch (error) {
    console.error("Error fetching YouTube topics:", error);
    return [];
  }
}
