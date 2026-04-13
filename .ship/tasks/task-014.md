# Task 014: Worker Entry + Cron Registration

## Description
Wire up all worker modules into the main worker entry point with cron schedules.

## Files
- `worker/index.ts` (create)

## Requirements
1. Import and register all cron jobs using `node-cron`
2. Cron schedule:
   - `0 6 * * *` UTC → `runResearch(userId)`
   - `0 7 * * *` UTC → `runDiscover(userId)`
   - `0 {daily_run_hour} * * *` UTC → `runContent(userId)` (reads `daily_run_hour` setting, default 9)
   - `*/5 * * * *` → `postScheduledPieces(userId)` + `postScheduledNewsletters(userId)`
3. On startup: run `seedDefaults(userId)` for all users
4. `runForAllUsers(fn, jobName)` helper — fetches all users, runs fn for each, catches per-user errors
5. Dynamic content cron: reads `daily_run_hour` from DB at each tick (not cached at startup)
6. Manual trigger support: exports `triggerFullRun(userId)` for use by the API engine/run route
7. Graceful shutdown on SIGINT/SIGTERM

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/worker/index.ts`

## Acceptance Criteria
- [ ] Worker starts without errors
- [ ] All 4 cron jobs registered
- [ ] Startup seeds default schedule for all users
- [ ] SIGINT shuts down cleanly
- [ ] `triggerFullRun` exported and callable

## Dependencies
- Task 008
- Task 009
- Task 012
- Task 013

## Commit Message
feat: add worker entry with all cron registrations
