# Task 004: Backend — POST /api/webhooks/polar

## Description
Create the Polar webhook handler. Polar POSTs to this route when a checkout completes. Verifies the HMAC signature, finds the matching ticket, and marks it `paid`.

## Files
- `app/api/webhooks/polar/route.ts` (create)

## Requirements
1. Route is **public** — no auth() check
2. Read raw body: `const rawBody = await req.text()`
3. Read headers: `webhook-id`, `webhook-timestamp`, `webhook-signature`
4. Parse body as JSON: `const event = JSON.parse(rawBody)`
5. Find the ticket by `polarCheckoutId = event.data?.id`:
   - `db.serviceTicket.findFirst({ where: { polarCheckoutId: event.data?.id } })`
   - If not found → return 404
6. Load `polar_webhook_secret` from the ticket's user Settings:
   - `getSetting("polar_webhook_secret", ticket.userId)`
7. If secret is configured, verify HMAC:
   ```ts
   import { createHmac } from "crypto";
   const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
   const expectedSig = createHmac("sha256", secret).update(signedContent).digest("base64");
   const sigs = webhookSignature.split(" ");
   const valid = sigs.some(s => s === `v1,${expectedSig}`);
   if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
   ```
   - If secret not configured: skip verification (dev/test mode)
8. Handle `checkout.updated` event where `event.data?.status === "succeeded"`:
   - `db.serviceTicket.update({ where: { id: ticket.id }, data: { status: "paid", paidAt: new Date(), amountPaid: event.data?.amount ?? null, polarOrderId: event.data?.metadata?.orderId ?? null } })`
9. Return `NextResponse.json({ received: true }, { status: 200 })` for all recognized events
10. For unrecognized event types: return 200 anyway (Polar retries on non-2xx)

## Existing Code to Reference
- `app/api/webhooks/lead/route.ts` — existing webhook pattern
- `lib/settings.ts` — `getSetting(key, userId)` helper

## Acceptance Criteria
- [ ] Route exports `POST`
- [ ] Reads raw body with `req.text()`
- [ ] Verifies HMAC when secret is configured
- [ ] Updates ticket to `paid` on `checkout.updated` + `status: succeeded`
- [ ] Sets `paidAt`, `amountPaid`, `polarOrderId`
- [ ] Returns 200 in all non-error cases
- [ ] Returns 404 if ticket not found

## Dependencies
- Task 001 (new DB columns)

## Commit Message
feat(api): add Polar webhook handler
