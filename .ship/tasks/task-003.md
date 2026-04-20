# Task 003: Backend — POST /api/tickets/[id]/checkout

## Description
Create the checkout API route. Authenticated seller calls this to generate a Polar checkout session for a quoted ticket.

## Files
- `app/api/tickets/[id]/checkout/route.ts` (create)

## Requirements
1. Auth guard: `const session = await auth(); if (!session?.user?.id) return 401`
2. Load ticket via `db.serviceTicket.findFirst({ where: { id: params.id, userId: session.user.id }, include: { service: true } })`
3. If not found → 404
4. If `ticket.status !== "quoted"` → 400 `{ error: "Ticket must be in quoted status" }`
5. Load `polar_api_key` from Setting: `getSetting("polar_api_key", userId)` — if missing/empty → 400 `{ error: "Polar API key not configured" }`
6. Call `createPolarCheckout({ polarApiKey, amount: Math.round(ticket.service.priceMin * 100), clientEmail: ticket.clientEmail, ticketId: ticket.id, serviceName: ticket.service.name })`
7. Save to DB: `db.serviceTicket.update({ where: { id }, data: { polarCheckoutId: checkoutId, status: "awaiting_payment" } })`
8. Return `{ checkoutUrl, checkoutId }`
9. On Polar error → 502 with the error message

## Existing Code to Reference
- `app/api/tickets/[id]/route.ts` — auth + db pattern
- `app/api/tickets/[id]/send-delivery/route.ts` — same structure
- `lib/settings.ts` — `getSetting(key, userId)` helper

## Acceptance Criteria
- [ ] Route exports `POST` function
- [ ] Returns 401 if unauthenticated
- [ ] Returns 404 if ticket not found
- [ ] Returns 400 if status !== "quoted"
- [ ] Returns 400 with friendly message if Polar key missing
- [ ] Updates ticket `polarCheckoutId` + status to `awaiting_payment`
- [ ] Returns `{ checkoutUrl, checkoutId }`

## Dependencies
- Task 001 (new DB columns)
- Task 002 (polar.ts helper)

## Commit Message
feat(api): add POST /api/tickets/[id]/checkout
