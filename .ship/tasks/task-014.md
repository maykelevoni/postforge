# Task 014: Verify middleware and imports are consistent

## Description
Final pass to ensure all imports, middleware, and cross-file references are consistent after all the changes.

## Files
- `middleware.ts` (modify if needed)
- `worker/posting/scheduler.ts` (verify import)
- `app/api/content/[id]/publish/route.ts` (verify import)
- Any other file with stale import references

## Requirements
1. Verify no file imports from `@/worker/posting/systeme`
2. Verify `middleware.ts` has correct public path patterns for `/api/webhooks/lead`
3. Verify all email-related imports point to `@/lib/email`
4. Verify `tsconfig` paths are correct
5. Run `pnpm build` to confirm no build errors
6. Run `pnpm dev` and verify dashboard loads without errors

## Acceptance Criteria
- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm dev` starts without console errors
- [ ] Dashboard pages load correctly
- [ ] No import errors anywhere

## Dependencies
- All previous tasks

## Commit Message
chore: verify imports and middleware consistency
