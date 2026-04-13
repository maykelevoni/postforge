# Task 012: Content Generation Worker

## Description
Build the content generation worker that creates social posts and newsletters for each active promotion using OpenRouter and fal.ai.

## Files
- `worker/content/generate.ts` (create)
- `worker/content/media.ts` (create)
- `worker/content/index.ts` (create)

## Requirements

### worker/content/generate.ts
- `generatePostsForPromotion(promotionId: string, userId: string): Promise<void>`
- Fetches promotion details
- Fetches today's top ResearchTopic (highest score, status='new' or 'used')
- Calls `generateText()` for each platform with tailored system prompts:
  - **twitter**: max 280 chars, punchy hook, trending topic angle, ends with CTA + UTM link
  - **linkedin**: professional tone, 150-300 words, insight + value + soft sell
  - **reddit**: community tone, no hard sell, value-first, fits subreddit style
  - **instagram**: caption 150 chars + hashtags, visual description for image prompt
  - **tiktok**: script format, hook (3 sec) + value (15 sec) + CTA (5 sec)
- Generates newsletter with structure: subject line, hook paragraph, value section, bridge to product, single CTA
- All links use `buildUtmUrl()` with source = platform name
- Saves `ContentPiece` records (status: 'draft' if gate_mode=true, else 'scheduled')
- Saves `Newsletter` record (same gate_mode logic)
- Uses `Promise.allSettled` for parallel platform generation

### worker/content/media.ts
- `generateMediaForPiece(pieceId: string, userId: string): Promise<void>`
- Only runs for instagram and tiktok pieces
- Extracts image prompt from the piece content (or generates one via AI)
- Calls `generateImage()` → stores imageUrl on ContentPiece
- Calls `generateVideo(imageUrl, prompt)` → stores videoUrl on ContentPiece
- Updates piece status from 'draft'/'scheduled' after media is attached

### worker/content/index.ts — orchestrator
- `runContent(userId: string): Promise<void>`
- Gets all active promotions (status='active'), weighted by priority
- Picks one promotion to run today (round-robin by priority weight)
- Calls `generatePostsForPromotion`
- Then calls `generateMediaForPiece` for instagram + tiktok pieces
- Logs results

## Acceptance Criteria
- [ ] 5 ContentPiece records + 1 Newsletter created per run
- [ ] Instagram + TikTok pieces have imageUrl and videoUrl set
- [ ] Gate mode=true → status='draft', gate mode=false → status='scheduled'
- [ ] UTM links present in all post content
- [ ] One promotion selected per day by priority weight

## Dependencies
- Task 004
- Task 009

## Commit Message
feat: add content generation worker with OpenRouter + fal.ai media
