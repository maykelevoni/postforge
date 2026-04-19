# Task 005: Replace systeme webhook with native lead webhook

## Description
Replace the Systeme.io webhook handler with one that handles submissions from our own landing pages.

## Files
- `app/api/webhooks/lead/route.ts` (modify — replace existing content)
- `app/api/webhooks/systeme/route.ts` (delete)

## Requirements
1. Delete `app/api/webhooks/systeme/route.ts` entirely
2. Rewrite `app/api/webhooks/lead/route.ts`:
   - Accept POST with body: `{ name, email, landingPageId }`
   - Validate name and email are present
   - Look up LandingPage by ID, verify it exists and is published
   - Get userId and serviceId from the landing page
   - Check for duplicate submission (same email on same landing page)
   - If duplicate: create submission with status "duplicate", return 200 with `{ duplicate: true }`
   - Create ServiceTicket with status "new", source from landing page slug
   - Create LandingPageSubmission record
   - Create Subscriber record (upsert on @@unique([email, userId]) — if already subscribed, skip silently)
   - Send confirmation email via `sendConfirmationEmail` from `lib/email.ts`
   - Always return 200 (don't fail on email errors)
3. Remove any `x-systeme-token` auth — landing page submissions come from our own forms

## Existing Code to Reference
- `app/api/webhooks/systeme/route.ts` (current webhook logic to replace)
- `lib/email.ts` (sendConfirmationEmail)
- `prisma/schema.prisma` (ServiceTicket and LandingPage models)

## Acceptance Criteria
- [ ] `app/api/webhooks/systeme/route.ts` deleted
- [ ] New lead webhook creates tickets and submissions correctly
- [ ] Duplicate submissions handled gracefully
- [ ] Confirmation email sent on new submission
- [ ] Compiles without TypeScript errors

## Dependencies
- Task 002, Task 003

## Commit Message
refactor: replace systeme webhook with native landing page lead handler
