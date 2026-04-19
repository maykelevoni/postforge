# Task 003: Install Resend and create lib/email.ts

## Description
Replace Systeme.io email service with Resend. Create a new email service module with the same function signatures.

## Files
- `lib/email.ts` (create)
- `package.json` (modify — add resend dependency)

## Requirements
1. Install `resend` package
2. Create `lib/email.ts` with these functions (matching systeme.ts interface):
   - `sendConfirmationEmail(ticket)` — sends welcome email via Resend
   - `sendQuoteEmail(ticket)` — sends quote via Resend
   - `sendDeliveryEmail(ticket)` — sends deliverables via Resend
   - `sendNewsletter(newsletter)` — sends newsletter via Resend, updates DB status
3. Each function reads `resend_api_key` and `resend_from_email` from user's DB settings
4. Uses `new Resend(apiKey)` client, calls `resend.emails.send({ from, to, subject, html })`
5. HTML email body (not plain text) for better formatting
6. Error handling: catch Resend errors, log, and throw with descriptive message
7. Newsletter function updates DB status to "sent" or "failed"

## Existing Code to Reference
- `worker/posting/systeme.ts` (function signatures, email body templates to reuse)
- `lib/settings.ts` (getSetting pattern)

## Acceptance Criteria
- [ ] `lib/email.ts` exports all 4 email functions
- [ ] Functions read Resend settings from DB
- [ ] Newsletter status updates correctly on success/failure
- [ ] Code compiles without TypeScript errors

## Dependencies
- None

## Commit Message
feat: add resend email service replacing systeme.io
