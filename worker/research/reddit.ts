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
        const isSelf = postData.is_self;
        const url = isSelf
          ? `https://www.reddit.com${postData.permalink}`
          : postData.url;
        const selftext = postData.selftext;
        const ups = postData.ups || 0;
        const upvotes = postData.score as number;
        const comments = postData.num_comments as number;
        const upvoteRatio = postData.upvote_ratio as number;

        if (title && url) {
          const score = Math.round(Math.min(10, Math.log10(ups + 1) / Math.log10(100000) * 9 + 1) * 10) / 10;

          topics.push({
            title,
            url,
            summary: selftext?.substring(0, 500) || title,
            source: "reddit",
            score,
            upvotes,
            comments,
            upvoteRatio,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching Reddit topics from r/${subreddit}:`, error);
    }
  }

  return topics;
}
