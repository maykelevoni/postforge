# Task 029: Rate limit /api/webhooks/lead

## Description
Add simple in-memory IP-based rate limiting to the lead webhook to prevent spam and list poisoning.

## Files
- `app/api/webhooks/lead/route.ts` (modify)

## Requirements
1. Read the current file before editing.
2. Add a module-scope `Map<string, { count: number; resetAt: number }>` named `rateMap`
3. At the start of the POST handler, extract the client IP:
   - First try `req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()`
   - Then try `req.headers.get("x-real-ip")`
   - Fallback to `"unknown"`
4. Look up the IP in `rateMap`. If the entry exists and `resetAt > Date.now()`:
   - Increment count
   - If count > 5: return `NextResponse.json({ error: "Too many requests" }, { status: 429 })`
5. If no entry or `resetAt <= Date.now()`: create/reset entry with `count: 1, resetAt: Date.now() + 60_000`
6. Delete stale entries (where `resetAt < Date.now()`) at the start of each request to prevent unbounded growth — just delete the current IP's entry if stale before re-creating it (no full iteration needed)

## Existing Code to Reference
- `app/api/webhooks/lead/route.ts` (read it first)

## Acceptance Criteria
- [ ] 6th POST from same IP within 60s returns HTTP 429
- [ ] 5th POST from same IP within 60s returns 200 (not blocked)
- [ ] After 60s window, counter resets (new entry)
- [ ] No new npm packages added

## Dependencies
None — independent

## Commit Message
feat: rate limit /api/webhooks/lead to 5 requests per IP per minute
