# Task 004: Core Lib Utilities

## Description
Implement all shared utility modules used by both the app and worker.

## Files
- `lib/ai.ts` (create)
- `lib/falai.ts` (create)
- `lib/settings.ts` (create)
- `lib/utm.ts` (create)
- `lib/seeds.ts` (create)

## Requirements

### lib/ai.ts — OpenRouter only
- `generateText(prompt: string, system: string, userId: string): Promise<string>`
- Reads `openrouter_api_key` and `openrouter_model` from DB settings via getSetting
- POST to `https://openrouter.ai/api/v1/chat/completions`
- Default model fallback: `"deepseek/deepseek-r1"`
- Throws descriptive error if no API key configured

### lib/falai.ts — fal.ai image + video
- `generateImage(prompt: string, userId: string): Promise<string>` — returns image URL
  - Model: `fal-ai/flux/schnell`
- `generateVideo(imageUrl: string, prompt: string, userId: string): Promise<string>` — returns video URL
  - Model: `fal-ai/kling-video/v1/standard/image-to-video`
  - Duration: `"5"` seconds
- Reads `falai_api_key` from DB settings
- Uses `@fal-ai/client` SDK

### lib/settings.ts
- `getSetting(key: string, userId: string): Promise<string | null>`
- `setSetting(key: string, value: string, userId: string): Promise<void>`
- `getSettings(keys: string[], userId: string): Promise<Record<string, string>>`

### lib/utm.ts
- `buildUtmUrl(baseUrl: string, params: { source: string, medium?: string, campaign?: string, content?: string }): string`
- Appends UTM params to URL, preserves existing query params

### lib/seeds.ts
- `seedDefaults(userId: string): Promise<void>`
- Creates default ScheduleEntry rows if none exist for user:
  - twitter: 09:00, Mon-Fri
  - linkedin: 10:00, Mon-Fri
  - reddit: 12:00, Tue/Thu
  - instagram: 14:00, Mon-Fri
  - tiktok: 17:00, Mon-Fri
  - email: 08:00, Mon-Fri

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/lib/settings.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/lib/ai.ts` (pattern only — replace Gemini with OpenRouter-only)
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/lib/utm.ts`

## Acceptance Criteria
- [ ] `generateText` calls OpenRouter and returns string
- [ ] `generateImage` returns fal.ai image URL
- [ ] `generateVideo` returns fal.ai video URL
- [ ] `getSetting` / `setSetting` read and write DB correctly
- [ ] `buildUtmUrl` appends params correctly
- [ ] `seedDefaults` creates 6 schedule entries

## Dependencies
- Task 002

## Commit Message
feat: add core lib utilities (ai, falai, settings, utm, seeds)
