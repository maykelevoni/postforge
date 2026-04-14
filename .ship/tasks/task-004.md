# Task 004: Quote Generation + Send API

## Description
Two API routes: one generates an AI quote and saves it to the ticket, the other sends it via Systeme.io email.

## Files
- `app/api/tickets/[id]/quote/route.ts` (create)
- `app/api/tickets/[id]/send-quote/route.ts` (create)

## Requirements

### POST /api/tickets/[id]/quote
- Auth + ownership check
- Load ticket (with service)
- Call `generateText()` from `lib/ai.ts` with prompt:
  ```
  System: You are a professional freelance services consultant writing proposals.
  User: Write a professional quote proposal for:
    Service: {service.name}
    Description: {service.description}
    Client: {ticket.clientName}
    Their niche/topic: {ticket.niche}
    Their message: {ticket.message}
    What you will deliver: {service.deliverablesTemplate}
    Investment range: ${service.priceMin}–${service.priceMax}
    Turnaround: {service.turnaroundDays} days

  Structure: personalized intro → scope of work (specific to their niche) → deliverables list → timeline → investment → next steps (reply to accept).
  ```
- Save result to `ticket.quote`
- Return `{ quote: string }`

### POST /api/tickets/[id]/send-quote
- Auth + ownership check
- Load ticket (with service)
- Require `ticket.quote` to exist (400 if missing)
- Call Systeme.io broadcast API to send quote email to `ticket.clientEmail`
  - Subject: `Your quote for {service.name} — {ticket.clientName}`
  - Body: ticket.quote
- Update ticket: `quoteSentAt = now()`, `status = "quoted"`
- Return `{ success: true }`

## Existing Code to Reference
- `lib/ai.ts` — generateText() usage
- `worker/posting/systeme.ts` — Systeme.io broadcast API pattern
- `lib/settings.ts` — getSetting() for API keys

## Acceptance Criteria
- [ ] POST /quote generates and saves AI quote
- [ ] POST /send-quote sends email and moves ticket to "quoted"
- [ ] Returns 400 if quote not yet generated before sending

## Dependencies
- Task 001, Task 003

## Commit Message
feat: add quote generation and send API routes
