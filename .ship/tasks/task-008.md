# Task 008: Research Worker (YouTube + Reddit + NewsAPI)

## Description
Build the research cron worker that fetches trending topics daily from three sources, scores and deduplicates them, and saves to DB.

## Files
- `worker/research/youtube.ts` (create)
- `worker/research/reddit.ts` (create)
- `worker/research/newsapi.ts` (create)
- `worker/research/index.ts` (create)

## Requirements

### worker/research/youtube.ts
- `fetchYouTube(userId: string): Promise<RawTopic[]>`
- Uses YouTube Data API v3: `GET https://www.googleapis.com/youtube/v3/search`
- Params: `part=snippet`, `type=video`, `order=viewCount`, `publishedAfter=24h ago`, `maxResults=10`
- API key from `getSetting('youtube_api_key', userId)`
- Returns: `{ title, url, summary: description, source: 'youtube', score: views-based 1-10 }`

### worker/research/reddit.ts
- `fetchReddit(userId: string): Promise<RawTopic[]>`
- Reads subreddits from `getSetting('research_subreddits', userId)` (comma-separated, default: `entrepreneur,SaaS,marketing`)
- `GET https://www.reddit.com/r/{sub}/hot.json?limit=10`
- No auth required
- Scores by upvote count normalized to 1-10

### worker/research/newsapi.ts
- `fetchNews(userId: string): Promise<RawTopic[]>`
- `GET https://newsapi.org/v2/top-headlines?language=en&pageSize=10`
- API key from `getSetting('newsapi_key', userId)`
- Categories: technology, business
- Scores by source rank

### worker/research/index.ts — orchestrator
- `runResearch(userId: string): Promise<void>`
- Calls all three fetchers with `Promise.allSettled`
- Deduplicates by title similarity (simple: lowercase + remove punctuation, check for 80% word overlap)
- Saves unique topics to `ResearchTopic` table with today's date
- Skips topics already saved today (check by title + userId + date)
- Logs to console with count of new topics saved

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/research/youtube.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/research/reddit.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/research/newsapi.ts`

## Acceptance Criteria
- [ ] `runResearch` fetches from all 3 sources
- [ ] New topics saved to DB with correct source + score
- [ ] Duplicate topics not saved twice
- [ ] Missing API key for a source skips that source gracefully (no crash)

## Dependencies
- Task 004

## Commit Message
feat: add research worker (YouTube, Reddit, NewsAPI)
