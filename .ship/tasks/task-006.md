# Task 006: Update Settings page — swap Systeme.io for Resend

## Description
Update the settings page and API to replace Systeme.io settings with Resend settings.

## Files
- `app/api/settings/route.ts` (modify)
- `app/(dashboard)/settings/page.tsx` (modify)
- `.env.example` (modify)

## Requirements
1. **API route:** Remove `systeme_api_key`, `systeme_domain`, `systeme_funnel_url`, `systeme_webhook_token` from allowed settings keys. Add `resend_api_key` and `resend_from_email`.
2. **Settings page:** Replace Systeme.io input fields with Resend fields:
   - `resend_api_key` — text input (sensitive)
   - `resend_from_email` — text input (e.g. "you@yourdomain.com")
   - Remove all Systeme.io related fields
3. **.env.example:** Remove `SYSTEME_API_KEY` line, add `RESEND_API_KEY` (as fallback/example only)
4. Keep the same settings save/load pattern — just change the keys.

## Existing Code to Reference
- `app/api/settings/route.ts` (current settings allowed keys)
- `app/(dashboard)/settings/page.tsx` (current settings UI fields)

## Acceptance Criteria
- [ ] Settings page shows Resend fields, no Systeme.io fields
- [ ] Settings save/load works correctly
- [ ] `.env.example` updated
- [ ] No TypeScript errors

## Dependencies
- None

## Commit Message
refactor: swap systeme.io settings for resend settings
