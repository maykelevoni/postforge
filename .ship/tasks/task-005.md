# Task 005: Deliverables Generation + Send API

## Description
Two API routes: one generates AI deliverables for the client's niche using the service template, the other sends them via email.

## Files
- `app/api/tickets/[id]/deliver/route.ts` (create)
- `app/api/tickets/[id]/send-delivery/route.ts` (create)

## Requirements

### POST /api/tickets/[id]/deliver
- Auth + ownership check
- Load ticket (with service)
- Replace `[niche]` in `service.deliverablesTemplate` with `ticket.niche`
- Call `generateText()` with the resolved template as the user prompt
  - System: "You are an expert content creator. Follow the instructions exactly and produce high-quality output."
- Save result as JSON string to `ticket.deliverables`: `JSON.stringify({ generated: result, generatedAt: new Date() })`
- Return `{ deliverables: string }`

### POST /api/tickets/[id]/send-delivery
- Auth + ownership check
- Load ticket (with service)
- Require `ticket.deliverables` to exist (400 if missing)
- Parse deliverables JSON, extract `generated` text
- Send via Systeme.io broadcast API:
  - To: ticket.clientEmail
  - Subject: `Your {service.name} deliverables are ready — {ticket.clientName}`
  - Body: intro paragraph + generated content
- Update ticket: `deliveredAt = now()`, `status = "delivered"`
- Return `{ success: true }`

## Existing Code to Reference
- `lib/ai.ts` — generateText()
- `worker/posting/systeme.ts` — broadcast API
- `app/api/tickets/[id]/quote/route.ts` — same pattern as Task 004

## Acceptance Criteria
- [ ] POST /deliver generates deliverables using service template with niche substitution
- [ ] POST /send-delivery sends email and moves ticket to "delivered"
- [ ] [niche] placeholder correctly replaced in template

## Dependencies
- Task 001, Task 003, Task 004

## Commit Message
feat: add deliverables generation and send API routes
