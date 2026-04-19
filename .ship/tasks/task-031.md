# Task 031: Update Playwright tests for rate limiting

## Description
Add a Playwright test for the new rate limiting behavior on `/api/webhooks/lead`. The other new sections (How It Works, FAQ) are template-only and render only when a published page with that data exists — testing them via API/Playwright would require seed data, so they are covered by the acceptance criteria review instead.

## Files
- `tests/landing-pages.spec.ts` (modify)

## Requirements
1. Read the current test file before editing.
2. Add a new describe block `"Lead webhook rate limiting"` with one test:
   - Fire 6 POST requests to `/api/webhooks/lead` from the same request context (same IP as seen by the server) with a non-existent `landingPageId` (so it returns 404 normally, not spam-filtered early)
   - Actually: fire 6 requests with valid structure but a fake landingPageId. The first 5 should get 404 (page not found). The 6th should get either 404 or 429 depending on order — BUT since the rate limit check comes BEFORE the DB lookup, the 6th request should return 429.
   - Actually re-think: the rate limit fires first. Requests 1-5 pass rate limit → hit DB → 404. Request 6 → 429 before hitting DB.
   - Assert: the 6th response status is 429.
   - Assert: the response body contains `{ error: "Too many requests" }` or at least `error` key.
3. Use `request` fixture (not `page`) so all requests share the same test-runner IP.

## Existing Code to Reference
- `tests/landing-pages.spec.ts` (read before editing, append the new describe block)

## Acceptance Criteria
- [ ] New test fires 6 requests in a loop
- [ ] Asserts the 6th returns 429
- [ ] Test does not fail for unrelated reasons (no auth needed for the webhook)

## Dependencies
- Task 029 (rate limiting implemented)

## Commit Message
test: add rate limit test for lead webhook
