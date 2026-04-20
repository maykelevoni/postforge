# Task 010: Tests — Update use-cases.spec.ts + add payment E2E tests

## Description
Update/write Playwright tests covering: Bug 1 fix (service form labels), Bug 2 fix (landing page encoding), and the new payment flow (checkout API, webhook, delivery gate).

## Files
- `tests/use-cases.spec.ts` (create/update)

## Requirements
1. Read `tests/use-cases.spec.ts` if it exists — it may already have scaffolding from a prior run
2. Read `.ship/spec.md` for acceptance criteria
3. Cover these test cases:

**Bug 1 — Service form labels:**
```
test: ServiceForm fields have semantic htmlFor/id associations
- navigate to /services
- check label[for="service-name"] exists
- check input#service-name exists
- repeat for description, type, deliverables, price-min, price-max, turnaround, funnel-url
```

**Bug 2 — Landing page encoding:**
```
test: POST /api/landing-pages with object sections stores without double-encoding
- POST /api/landing-pages with { sections: { cta: true } }
- GET the page, confirm sections parses to an object (not string)
- Confirms the cta field is present
```

**Payment flow — checkout API:**
```
test: POST /api/tickets/:id/checkout requires quoted status
- Create a ticket in "new" status → expect 400
- Move ticket to "quoted" → call checkout → expect either 200 (if Polar key set) or 400 with "Polar API key not configured"
```

**Payment flow — delivery gate:**
```
test: Send Delivery is blocked unless ticket is paid or in_progress
- Create ticket, move to quoted → POST /api/tickets/:id/send-delivery → expect 403
```

**Payment flow — webhook:**
```
test: POST /api/webhooks/polar updates ticket to paid on checkout.updated/succeeded
- Create ticket with polarCheckoutId set
- POST /api/webhooks/polar with event { type: "checkout.updated", data: { id: <checkoutId>, status: "succeeded", amount: 9900 } }
- Verify ticket status is now "paid" and paidAt is set
```

4. Follow test patterns from `tests/auth.spec.ts` and `tests/content.spec.ts` (especially auth setup)
5. Use `baseURL` from playwright config
6. All tests should be independent (create their own fixtures)

## Existing Code to Reference
- `tests/auth.spec.ts` — auth login pattern
- `tests/content.spec.ts` — API-level test pattern
- `tests/settings.spec.ts` — settings page pattern
- `playwright.config.ts` — config, baseURL

## Acceptance Criteria
- [ ] Tests for Bug 1 (label associations) pass
- [ ] Tests for Bug 2 (encoding guard) pass  
- [ ] Delivery gate test (403 unless paid/in_progress) passes
- [ ] Webhook test (marks ticket paid) passes
- [ ] `npx playwright test tests/use-cases.spec.ts` runs without import errors

## Dependencies
- Tasks 001–009 (all implementation complete)

## Commit Message
test: add use-case tests for payment flow, service form labels, landing page encoding
