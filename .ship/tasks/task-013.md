# Task 013: Posting Worker (post-bridge + Systeme.io)

## Description
Build the posting scheduler that fires due social posts via post-bridge and newsletters via Systeme.io broadcast API.

## Files
- `worker/posting/post-bridge.ts` (create)
- `worker/posting/systeme.ts` (create)
- `worker/posting/scheduler.ts` (create)

## Requirements

### worker/posting/post-bridge.ts
- Full client copied and adapted from launch/ reference
- `postToPlatform(params, userId)` — posts content + optional media to platform
- `listSocialAccounts(userId)` — returns connected accounts
- Handles 429 rate limit with one retry after 5s
- Reads `postbridge_api_key` from settings
- Media upload: accepts video URL (download to temp file, upload, delete temp)

### worker/posting/systeme.ts
- `sendNewsletter(newsletter: Newsletter, userId: string): Promise<void>`
- Reads `systeme_api_key` from settings
- Creates email campaign via Systeme.io API:
  - `POST https://api.systeme.io/api/email_campaigns`
  - Headers: `X-API-Key: {systeme_api_key}`
  - Body: `{ subject, body (HTML), sender_name, send_now: true }`
- Updates Newsletter status to 'sent' + sentAt on success
- Updates status to 'failed' + error on failure
- `publishLandingPage(html: string, title: string, userId: string): Promise<string>` — creates funnel, returns URL

### worker/posting/scheduler.ts
- `postScheduledPieces(userId: string): Promise<void>`
  - Finds ContentPieces where status='scheduled' AND scheduledAt <= now AND approved=true (or gate_mode=false)
  - For each piece: call `postToPlatform`, update status to 'published'/'failed'
  - On failure: set error, increment retry count, retry once after 30 min (set scheduledAt = now + 30min, status stays 'scheduled')
- `postScheduledNewsletters(userId: string): Promise<void>`
  - Same logic for Newsletter records via `sendNewsletter`
- `scheduleContent(userId: string): Promise<void>`
  - Assigns scheduledAt to 'draft'/'generated' ContentPieces based on ScheduleEntry times
  - Reads ScheduleEntry for each platform, picks next occurrence
- Reads gate_mode from settings — if true, only posts approved=true pieces

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/posting/post-bridge.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/posting/scheduler.ts`

## Acceptance Criteria
- [ ] Due posts fire via post-bridge and status updated to 'published'
- [ ] Failed posts retry once after 30 min
- [ ] Gate mode=true blocks unapproved posts
- [ ] Newsletters send via Systeme.io and status updated to 'sent'
- [ ] Videos downloaded from URL and uploaded to post-bridge

## Dependencies
- Task 004
- Task 012

## Commit Message
feat: add posting scheduler with post-bridge and Systeme.io
