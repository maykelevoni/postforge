# Task 019: Playwright Tests

## Type
ui

## Description
Write Playwright E2E tests covering the core user flows from the spec acceptance criteria.

## Files
- `tests/auth.spec.ts` (create)
- `tests/research.spec.ts` (create)
- `tests/discover.spec.ts` (create)
- `tests/content.spec.ts` (create)
- `tests/settings.spec.ts` (create)
- `playwright.config.ts` (create)
- `scripts/create-test-user.ts` (create)

## Requirements
1. Tests ALWAYS go in `tests/` folder — never in project root
2. `playwright.config.ts`: baseURL `http://localhost:3000`, browser chromium, screenshot on failure
3. `scripts/create-test-user.ts`: creates test user `test@postforge.dev` / `testpassword123` via Prisma direct

### auth.spec.ts
- Register new user flow
- Sign in with credentials
- Redirect to sign-in when unauthenticated

### settings.spec.ts
- Navigate to settings page
- Save OpenRouter API key
- Toggle gate mode
- Save schedule entry time

### research.spec.ts
- Research page loads and shows topics (seed 2-3 test topics in beforeEach)
- Filter by source works
- Mark topic as used

### discover.spec.ts
- Discover page loads with tabs
- App Ideas tab shows items
- Approve an app idea → creates promotion

### content.spec.ts
- Content page loads posts tab
- Filter by status works
- Edit a draft content piece

## Acceptance Criteria
- [ ] All test files discovered by `npx playwright test`
- [ ] Auth tests pass
- [ ] Settings tests pass
- [ ] At minimum auth + settings tests pass (others may need running app + DB)

## Dependencies
- Task 018

## Commit Message
test: add Playwright E2E tests for core flows
