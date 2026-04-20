# Feature Spec: Payment Integration (Polar API) + Use-Case Hardening

## Feature Summary

Two tightly related improvements:

1. **Payment integration via Polar API** — close the gap in the service delivery loop. After a quote is accepted, the seller generates a Polar checkout link and sends it to the client. When the client pays, Polar fires a webhook that marks the ticket as `paid` and unlocks the delivery workflow.

2. **Use-case hardening** — two bugs surfaced during end-to-end customer journey tests that need to be fixed as part of this feature.

---

## Problem Statement

The current service flow breaks at the payment step:

```
Lead → Ticket → Quote (AI) → ??? → Deliver
```

There is no way for a client to pay. The ticket sits in "quoted" status indefinitely until the seller manually changes it. This means:
- Revenue can't be collected inside the product
- There's no clear CTA for the client after receiving a quote
- The delivery step is blocked in practice because there's no payment gate

Additionally, two bugs were found during the use-case test run:

**Bug 1 — Service form lacks semantic labels**
The `ServiceForm` component renders `<label>Name</label>` with inline styles but no `htmlFor`, and the input has no `id`. This breaks screen readers and makes the form harder to target in tests.

**Bug 2 — Landing page sections double-encoding**
`POST /api/landing-pages` calls `JSON.stringify(sections)` on the received value. If a caller passes sections already stringified (a natural mistake), the DB stores a double-encoded JSON string. When the template later calls `JSON.parse(page.sections).cta`, it gets a string instead of an object, so `sections.cta` is `undefined` and the LeadForm (CTA section) silently disappears from the published page — losing all lead capture.

---

## User Stories

### Story 1 — Seller generates a payment link for a ticket
**As** a PostForge user (service seller),  
**I want** to generate a Polar checkout link from a ticket's quoted price,  
**So that** I can send the client a direct payment link without leaving the app.

**Acceptance Criteria:**
- [ ] Settings page has a "Polar API Key" field (stored in DB Setting table, key = `polar_api_key`)
- [ ] Ticket detail view has a "Request Payment" button (visible when status is `quoted`)
- [ ] Clicking it calls `/api/tickets/[id]/checkout` → creates a Polar checkout → returns `{ checkoutUrl, checkoutId }`
- [ ] `checkoutId` is saved to the ticket; status moves to `awaiting_payment`
- [ ] The checkout URL is displayed in the ticket with a copy button
- [ ] If no Polar API key is configured, the button shows "Add Polar API Key in Settings"

### Story 2 — Client pays via Polar and ticket auto-updates
**As** a client who received a quote,  
**I want** to click a payment link and complete payment via Polar,  
**So that** the seller is notified and can start working immediately.

**Acceptance Criteria:**
- [ ] Polar webhook at `POST /api/webhooks/polar` handles `checkout.updated` event with `status: "succeeded"`
- [ ] Webhook verifies the Polar-Webhook-Secret header
- [ ] Ticket with matching `polarCheckoutId` is updated: `status → "paid"`, `paidAt` is set, `amountPaid` recorded
- [ ] If ticket not found, returns 404 (does not crash)
- [ ] Returns 200 for all recognized events (Polar retries on non-2xx)

### Story 3 — Seller views payment status and proceeds to delivery
**As** a PostForge user,  
**I want** to see payment status on a ticket and be able to send the delivery once paid,  
**So that** I have a clear workflow: quoted → paid → delivered.

**Acceptance Criteria:**
- [ ] Ticket status badge shows `awaiting_payment` and `paid` as distinct states with appropriate colors
- [ ] "Send Delivery" button is only active when status is `paid` or `in_progress`
- [ ] Ticket list/filter supports the new statuses

### Story 4 (Bug Fix) — Service form accessibility
**As** a user filling in the Add Service form,  
**I want** the name field to have a proper label association,  
**So that** clicking "Name" focuses the input and screen readers announce it correctly.

**Acceptance Criteria:**
- [ ] `<label htmlFor="service-name">Name</label>` + `<input id="service-name" ...>`
- [ ] Same fix applied to all other fields in ServiceForm (description, type, deliverables, price, turnaround, funnelUrl)

### Story 5 (Bug Fix) — Landing page sections encoding
**As** a developer or API caller,  
**I want** `POST /api/landing-pages` to accept sections/variables as either a plain object or a JSON string without double-encoding,  
**So that** the published landing page always renders the CTA section and lead form.

**Acceptance Criteria:**
- [ ] If `sections` is a string, the API stores it as-is (no double `JSON.stringify`)
- [ ] If `sections` is an object, the API stringifies it once
- [ ] Existing published pages with double-encoded data are not affected (migration not required — new writes are clean)
- [ ] Test: creating a landing page with `sections: { cta: true }` always renders `#lead-name` on the published page

---

## Technical Requirements

### Polar API Integration
- **API base:** `https://api.polar.sh`
- **Auth:** `Authorization: Bearer <polar_api_key>` (key stored in DB Setting table, key = `polar_api_key`)
- **Checkout creation:** `POST /v1/checkouts/custom` with `{ product_price_id, customer_email?, metadata: { ticketId } }`
  - OR use Polar's "custom amount" checkout if the service price is variable
- **Webhook verification:** `Polar-Webhook-Secret` header — verify using HMAC-SHA256 against a `polar_webhook_secret` stored in Settings
- **Key events to handle:** `checkout.updated` (when `status === "succeeded"`)
- **Amount:** use the ticket's agreed price (from the quote, stored separately) or use `service.priceMin` as the floor

### Database Changes
Add to `ServiceTicket`:
```prisma
polarCheckoutId  String?   // Polar checkout session ID
polarOrderId     String?   // Polar order ID (set on payment)
paidAt           DateTime? // When payment was received
amountPaid       Int?      // Amount in cents
```

Status enum additions (string field, not enum — follows existing pattern):
- `"awaiting_payment"` — checkout link generated, waiting for client
- `"paid"` — Polar webhook confirmed payment

---

## UI/UX Requirements

### Settings page
- New section "Payment" under the existing API Keys section
- Two fields: `Polar API Key` (password input) + `Polar Webhook Secret` (password input)
- Saved via the existing `Save Changes` button (no separate save)

### Ticket card / detail
- Status badge: add `awaiting_payment` (yellow/amber) and `paid` (green) to existing badge styles
- When status = `quoted`: show "Request Payment" button (indigo)
- When `polarCheckoutId` exists: show checkout URL in a read-only input with copy button
- "Send Delivery" button: disabled unless status is `paid` or `in_progress`

### Ticket status flow
```
new → quoted → awaiting_payment → paid → in_progress → delivered → closed
```
(can still skip awaiting_payment / paid and go quoted → in_progress for offline payments)

---

## Integration Points

- **Polar API:** `POST /v1/checkouts/custom` to create checkout sessions
- **Polar Webhooks:** `POST /api/webhooks/polar` to receive payment events
- **Resend (existing):** delivery email already wired — no changes needed
- **DB Setting table:** stores `polar_api_key` and `polar_webhook_secret` — follows existing pattern for all API keys

---

## Out of Scope

- Stripe / other payment processors
- Subscription billing
- Refund handling
- Polar product catalog sync (we create checkouts on-demand, not syncing a product library)
- In-app invoice PDF generation (future)
- Client-facing checkout status page inside PostForge

---

## Success Criteria

1. A seller can generate a Polar checkout link from a ticket in under 10 seconds
2. When a Polar test webhook fires, the ticket status updates to `paid` automatically
3. The "Send Delivery" button is gated behind `paid` status
4. Service form fields are all semantically labelled
5. A landing page created with `sections: { cta: true }` always renders `#lead-name`
6. All 40 use-case tests pass + new payment tests pass

---

## Bugs Found in Use-Case Test Run (2026-04-20)

| # | Bug | Severity | Fix |
|---|-----|----------|-----|
| 1 | `ServiceForm` labels have no `htmlFor`; inputs have no `id` | Medium | Add `id`/`htmlFor` to all fields in `service-form.tsx` |
| 2 | `POST /api/landing-pages` double-encodes `sections`/`variables` if caller passes them as a JSON string | High | Guard with `typeof value === 'string'` before calling `JSON.stringify` |
