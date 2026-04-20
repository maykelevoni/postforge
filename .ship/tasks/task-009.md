# Task 009: Frontend — Ticket UI (Request Payment button + checkout URL + status badges)

## Type
ui

## Description
Update the ticket components to show the "Request Payment" button, display the checkout URL after creation, and add `awaiting_payment` / `paid` status badges.

## Files
- `components/dashboard/services/ticket-card.tsx` (modify)
- `components/dashboard/services/ticket-drawer.tsx` (modify)
- `components/dashboard/services/types.ts` (modify — add new fields to type)

## Requirements

### 1. Update types.ts
Add to `ServiceTicket` (or whichever type is used):
```ts
polarCheckoutId?: string | null;
polarOrderId?: string | null;
paidAt?: string | null;
amountPaid?: number | null;
```

### 2. Status badges (ticket-card.tsx or wherever status badge is rendered)
Add colors for new statuses:
- `awaiting_payment` → background `#f59e0b` (amber), label "Awaiting Payment"
- `paid` → background `#22c55e` (green), label "Paid"

### 3. ticket-drawer.tsx — Request Payment section
Inside the drawer (when `ticket.status === "quoted"`):
- Show a "Request Payment" button (indigo/`#6366f1` background, white text)
- On click: call `POST /api/tickets/${ticket.id}/checkout`
  - Show loading state on button
  - On success: save `checkoutUrl` + `checkoutId` to local state; update ticket status to `awaiting_payment`
  - On error `"Polar API key not configured"`: show inline message with link to `/settings`
  - On other error: show inline error message

When `ticket.polarCheckoutId` is set (or after successful checkout call):
- Show a read-only `<input>` with the checkout URL
- Show a copy-to-clipboard button next to it (use `navigator.clipboard.writeText`)
- Show a small "Copied!" confirmation that fades after 2 seconds

### 4. Send Delivery button gating (ticket-drawer.tsx)
Find the "Send Delivery" button and:
- Disable it when `ticket.status` is NOT `paid` or `in_progress`
- When disabled, show a tooltip or subtitle: "Client must complete payment first"
- Keep existing click handler — just add the disabled logic

### 5. State management
- `"use client"` component — local state for `checkoutUrl`, `isLoading`, `copied`, `error`
- On ticket prop update, re-derive checkout URL from `ticket.polarCheckoutId` if already exists (but we don't have a stored URL — just show the copy field if `polarCheckoutId` is set; the URL itself only comes from the API response in the current session)

## Existing Code to Reference
- `components/dashboard/services/ticket-drawer.tsx` — read fully before modifying
- `components/dashboard/services/ticket-card.tsx` — read fully; find status badge logic
- `components/dashboard/services/types.ts` — read to see current type definitions

## Acceptance Criteria
- [ ] `awaiting_payment` and `paid` status badges render with correct colors
- [ ] "Request Payment" button visible when `ticket.status === "quoted"`
- [ ] Clicking it calls the checkout API and shows loading state
- [ ] On success: checkout URL appears in read-only input with copy button
- [ ] On missing API key: inline link to settings
- [ ] "Send Delivery" button disabled unless status is `paid` or `in_progress`
- [ ] Inline styles only (no Tailwind)

## Dependencies
- Task 001 (new ticket fields)
- Task 003 (checkout API)

## Commit Message
feat(ui): add Request Payment button, checkout URL display, and payment status badges
