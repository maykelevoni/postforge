# Task 004: Replace Systeme.io calls with Resend in existing routes

## Description
Update all existing API routes that call Systeme.io to use the new lib/email.ts functions instead.

## Files
- `app/api/tickets/[id]/send-quote/route.ts` (modify)
- `app/api/tickets/[id]/send-delivery/route.ts` (modify)
- `app/api/content/[id]/publish/route.ts` (modify)
- `worker/posting/scheduler.ts` (modify)

## Requirements
1. **send-quote route:** Replace Systeme.io fetch call with `sendQuoteEmail` from `lib/email.ts`. Remove `getSetting("systeme_api_key")`. Keep same ticket status update logic.
2. **send-delivery route:** Same pattern — replace with `sendDeliveryEmail` from `lib/email.ts`.
3. **publish route:** Change import from `@/worker/posting/systeme` to `@/lib/email` for `sendNewsletter`.
4. **scheduler.ts:** Change import from `./systeme` to `../../lib/email` for `sendNewsletter`.
5. All routes should compile and function identically (just with Resend instead of Systeme.io).

## Existing Code to Reference
- `lib/email.ts` (from Task 003)
- Current files listed above

## Acceptance Criteria
- [ ] No remaining imports of `systeme.ts` in these 4 files
- [ ] TypeScript compiles without errors
- [ ] Routes return same responses as before

## Dependencies
- Task 003

## Commit Message
refactor: replace systeme.io calls with resend in existing routes
