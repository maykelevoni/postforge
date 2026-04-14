# Task 006: Systeme.io Webhook + Email Helpers

## Description
Receive Systeme.io form submissions and create ServiceTickets automatically. Add email helper functions to systeme.ts for confirmation, quote, and delivery emails.

## Files
- `app/api/webhooks/systeme/route.ts` (create)
- `worker/posting/systeme.ts` (modify — add email helpers)

## Requirements

### POST /api/webhooks/systeme
- NO auth session required
- Check `x-systeme-token` header against `systeme_webhook_token` setting (return 401 if mismatch or missing)
- Parse body — handle Systeme.io form webhook shape:
  ```json
  {
    "contact": { "first_name": "...", "email": "..." },
    "fields": { "niche": "...", "service_id": "...", "message": "..." },
    "funnel_url": "..."
  }
  ```
- Find the Service by `fields.service_id` (or match by funnelUrl if no service_id)
- If no service found, still create ticket with serviceId = null-safe fallback (use first active service for the user or skip)
- Create `ServiceTicket` with status "new"
- Call `sendConfirmationEmail()` from systeme.ts
- Return `{ received: true }` (always 200 to Systeme.io)

### worker/posting/systeme.ts additions
Add three functions:

```ts
sendConfirmationEmail(ticket: { clientName, clientEmail, service: { name, turnaroundDays } }): Promise<void>
// Subject: "Got your request — we'll be in touch soon"
// Body: Thank them, mention service name, set expectation (quote within turnaroundDays hours)

sendQuoteEmail(ticket: { clientName, clientEmail, quote, service: { name } }): Promise<void>
// Subject: "Your quote for {service.name}"
// Body: ticket.quote

sendDeliveryEmail(ticket: { clientName, clientEmail, deliverables, service: { name } }): Promise<void>
// Subject: "Your {service.name} deliverables are ready"
// Body: intro + parsed deliverables content
```

All use existing Systeme.io broadcast API pattern in the file.

## Existing Code to Reference
- `worker/posting/systeme.ts` — existing broadcast pattern
- `lib/settings.ts` — getSetting() for systeme_api_key, systeme_webhook_token

## Acceptance Criteria
- [ ] Webhook returns 401 if token missing/wrong
- [ ] Webhook creates ServiceTicket and sends confirmation email
- [ ] Three email helper functions added and exported from systeme.ts
- [ ] Always returns 200 to Systeme.io even on soft errors

## Dependencies
- Task 001

## Commit Message
feat: add Systeme.io webhook receiver and email helper functions
