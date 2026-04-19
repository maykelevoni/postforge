# Task 016: Add vercel.json with cron config for worker

## Description
Add vercel.json to the repo so the worker scheduler runs automatically in production via Vercel Crons.

## Files
- `vercel.json` (create)
- `.env.example` (modify — swap systeme keys for resend keys)

## Requirements
1. Create `vercel.json` with a cron that calls `POST /api/engine/run` every 15 minutes:
   ```json
   {
     "crons": [
       {
         "path": "/api/engine/run",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```
2. Update `.env.example`:
   - Remove any `systeme_*` references in comments
   - Add a comment that `resend_api_key` and `resend_from_email` are stored in the DB Setting table (not env vars)
   - Keep only: DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

## Existing Code to Reference
- `app/api/engine/run/route.ts` (the route being triggered)
- `.env.example` (current content)

## Acceptance Criteria
- [ ] `vercel.json` exists at repo root with valid JSON and cron config
- [ ] `.env.example` reflects resend-based setup (no systeme references)

## Dependencies
- None

## Commit Message
chore: add vercel.json cron config and update env example
