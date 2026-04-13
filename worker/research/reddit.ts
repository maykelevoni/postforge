import { getSetting } from "@/lib/settings";
import { RawTopic } from "./youtube";

export async function fetchReddit(userId: string): Promise<RawTopic[]> {
  const subredditsStr = await getSetting("research_subreddits", userId);
  const subreddits = subredditsStr
    ? subredditsStr.split(",").map((s) => s.trim())
    : ["entrepreneur", "SaaS", "marketing"];

  const topics: RawTopic[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
      );

      if (!response.ok) {
        console.error(`Reddit API error for r/${subreddit}:`, await response.text());
        continue;
      }

      const data = await response.json();
      const posts = data.data?.children || [];

      for (const post of posts) {
        const postData = post.data;
        const title = postData.title;
        const url = postData.url;
        const selftext = postData.selftext;
        const ups = postData.ups || 0;

        if (title && url && !url.includes("/comments/")) {
          // Score based on upvotes, normalized to 1-10
          const score = Math.min(10, Math.max(1, Math.log10(ups + 1) / 1.5));

          topics.push({
            title,
            url,
            summary: selftext?.substring(0, 500) || title,
            source: "reddit",
            score: Math.round(score * 10) / 10,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching Reddit topics from r/${subreddit}:`, error);
    }
  }

  return topics;
}
