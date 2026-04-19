# Task 013: Clean up — remove remaining Systeme.io references

## Description
Remove all remaining Systeme.io references: middleware, env, tests, README, and delete systeme.ts.

## Files
- `worker/posting/systeme.ts` (delete)
- `middleware.ts` (modify)
- `.env.example` (modify)
- `.env` (modify)
- `README.md` (modify)
- `tests/services.spec.ts` (modify)

## Requirements
1. **Delete** `worker/posting/systeme.ts` entirely (functionality replaced by `lib/email.ts`)
2. **middleware.ts:** If `/api/webhooks/systeme` is in public paths, remove it. Keep `/api/webhooks/lead` public.
3. **.env.example:** Remove `SYSTEME_API_KEY`, add `RESEND_API_KEY=` and `RESEND_FROM_EMAIL=`
4. **.env:** Update with new keys (don't touch actual values, just add the new lines)
5. **README.md:** Update documentation to reflect Resend instead of Systeme.io for email. Update landing page section.
6. **tests/services.spec.ts:** Update webhook test to point to new `/api/webhooks/lead` endpoint with new payload format.

## Existing Code to Reference
- All listed files

## Acceptance Criteria
- [ ] `worker/posting/systeme.ts` deleted
- [ ] No remaining references to `systeme` in any source files (except comments/docs)
- [ ] `.env.example` has correct Resend keys
- [ ] README updated
- [ ] Tests updated
- [ ] TypeScript compiles

## Dependencies
- Task 004, Task 005, Task 006

## Commit Message
chore: remove all remaining systeme.io references
