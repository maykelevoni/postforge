# Technical Plan: Payment Integration (Polar API) + Use-Case Hardening

## Section 1: Architecture Integration

### How this fits the existing structure

PostForge follows a consistent pattern:
- API keys live in the `Setting` table (`userId + key` unique)
- Retrieved via `getSetting(key, userId)` from `lib/settings.ts`
- External API calls go in `lib/` helpers (e.g., `lib/email.ts`, `lib/ai.ts`)
- Webhooks live at `app/api/webhooks/[provider]/route.ts`
- Ticket actions live at `app/api/tickets/[id]/[action]/route.ts`

The Polar integration follows the exact same pattern:

```
lib/polar.ts                      ← Polar API client helper
app/api/tickets/[id]/checkout/route.ts  ← create checkout session
app/api/webhooks/polar/route.ts   ← receive payment events
```

### Status flow addition

Current: `new → quoted → in_progress → delivered → closed`
New:     `new → quoted → awaiting_payment → paid → in_progress → delivered → closed`

The status is a `String` field (not an enum) so no migration enum change needed. New string values are additive.

---

## Section 2: Database Changes

### ServiceTicket — 4 new columns

```prisma
// add to model ServiceTicket
polarCheckoutId  String?    // Polar checkout session ID (used to match webhook)
polarOrderId     String?    // Polar order ID (set when checkout.updated fires)
paidAt           DateTime?  // Timestamp of confirmed payment
amountPaid       Int?       // Amount in cents (e.g. 9900 = $99.00)
```

Migration strategy (follows learnings.md pattern):
1. `pnpm dlx "prisma@5.20.0" migrate diff --from-schema-datasource --to-schema-datamodel --script > migration.sql`
2. Create `prisma/migrations/<timestamp>_add_polar_payment_fields/migration.sql`
3. Apply with `pnpm dlx "prisma@5.20.0" migrate deploy`

---

## Section 3: API Design

### New route: `POST /api/tickets/[id]/checkout`

**Auth:** required (session)

**Request:** no body needed (price derived from service.priceMin)

**Process:**
1. Load ticket (verify ownership)
2. Ticket must have status `quoted` — else 400
3. Load `polar_api_key` from Setting table — else 400 with friendly message
4. Call `lib/polar.ts → createCheckout(ticketId, amount, clientEmail)`
5. Save `polarCheckoutId` + update status to `awaiting_payment`
6. Return `{ checkoutUrl, checkoutId }`

**Response (200):**
```json
{ "checkoutUrl": "https://checkout.polar.sh/...", "checkoutId": "ch_..." }
```

**Errors:**
- 400: ticket not in `quoted` state
- 400: Polar API key not configured
- 404: ticket not found or not owned by user
- 502: Polar API call failed (forward error message)

---

### New route: `POST /api/webhooks/polar`

**Auth:** none (public) — verified via HMAC header

**Headers:** `webhook-id`, `webhook-timestamp`, `webhook-signature` (Polar standard webhook headers)

**Process:**
1. Read raw body as string (needed for HMAC verification)
2. Load `polar_webhook_secret` from Setting for the matching ticket's userId
3. Verify HMAC-SHA256 signature (skip in dev if secret not configured)
4. Parse event body
5. Handle `checkout.updated` where `data.status === "succeeded"`:
   - Find ticket by `polarCheckoutId = data.id`
   - Update: `status → "paid"`, `paidAt → now`, `amountPaid → data.amount`, `polarOrderId → data.metadata.orderId`
6. Return 200 for all handled events, 400 for unknown events

**Note:** Polar uses `webhook-id + webhook-timestamp + body` as the signed payload. Secret is stored per-user in Settings.

---

### Modified route: `POST /api/tickets/[id]/send-delivery`

Add guard: reject with 403 if `ticket.status` is not `paid` or `in_progress`:
```ts
if (!["paid", "in_progress"].includes(ticket.status)) {
  return NextResponse.json(
    { error: "Payment required before delivery" },
    { status: 403 }
  );
}
```

---

### Modified route: `GET /api/settings` + `POST /api/settings`

No route changes needed — the settings API already handles arbitrary key/value pairs. The two new keys (`polar_api_key`, `polar_webhook_secret`) are just added to the frontend component.

---

## Section 4: Frontend Components

### `lib/polar.ts` (new file)

```ts
// Thin wrapper around Polar API
export async function createPolarCheckout(params: {
  polarApiKey: string;
  amount: number;      // cents
  clientEmail?: string;
  ticketId: string;
  serviceName: string;
}): Promise<{ checkoutUrl: string; checkoutId: string }>
```

- Calls `POST https://api.polar.sh/v1/checkouts/custom`
- Throws with a descriptive message on non-200

### `components/dashboard/settings/api-keys-section.tsx` (modify)

Add two new password inputs in the existing 2-column grid:
- **Polar API Key** → `key: "polar_api_key"`
- **Polar Webhook Secret** → `key: "polar_webhook_secret"`

These plug into the existing `onSave(key, value)` pattern — no other changes.

### `components/dashboard/services/service-form.tsx` (modify — Bug 1 fix)

Add `id` + `htmlFor` to every field:

| Field | `id` | label text |
|---|---|---|
| name | `service-name` | Name |
| type | `service-type` | Type |
| description | `service-description` | Description |
| deliverables | `service-deliverables` | Deliverables |
| priceMin | `service-price-min` | Min Price ($) |
| priceMax | `service-price-max` | Max Price ($) |
| turnaroundDays | `service-turnaround` | Turnaround (days) |
| funnelUrl | `service-funnel-url` | Funnel URL (optional) |

### `app/api/landing-pages/route.ts` (modify — Bug 2 fix)

In the POST handler, before calling `JSON.stringify`:

```ts
// Normalize: accept either a plain object or a pre-stringified JSON string
const normalizeJson = (value: unknown): string => {
  if (typeof value === 'string') return value;       // already a string — use as-is
  return value ? JSON.stringify(value) : '{}';       // object — stringify once
};
```

Apply to both `variables` and `sections`.

### Ticket UI (modify existing ticket card/detail)

**Status badge additions** (in whatever component renders the status badge):
- `awaiting_payment` → amber/yellow pill: "Awaiting Payment"
- `paid` → green pill: "Paid"

**"Request Payment" button** (shown when status = `quoted`):
- Calls `POST /api/tickets/[id]/checkout`
- On success: shows checkout URL in a read-only field with copy icon
- On error "Polar API key not configured": shows inline link to Settings

**Checkout URL display** (shown when `polarCheckoutId` is set):
- Read-only input with the full checkout URL
- Copy-to-clipboard button

**"Send Delivery" button gating:**
- Disable (grey out) when status is not `paid` or `in_progress`
- Show tooltip: "Client must complete payment first"

---

## Section 5: Service Integration — Polar API

### Polar checkout creation

```
POST https://api.polar.sh/v1/checkouts/custom
Authorization: Bearer <polar_api_key>
Content-Type: application/json

{
  "product_price_id": null,   // not used for custom amount
  "amount": 9900,              // in cents
  "currency": "usd",
  "metadata": {
    "ticketId": "cxxx...",
    "serviceName": "Video Content Package"
  },
  "customer_email": "client@example.com"  // optional, pre-fills checkout
}
```

Response contains `url` (the hosted checkout page) and `id` (the checkout ID).

### Polar webhook verification

```ts
import { createHmac } from "crypto";

function verifyPolarWebhook(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): boolean {
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expectedSig = createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64");
  const signatures = webhookSignature.split(" ");
  return signatures.some((sig) => sig === `v1,${expectedSig}`);
}
```

### Polar test mode

Polar supports test mode via the same API key (sandbox vs. live depends on which key is used in the Polar dashboard). No separate env flag needed.

---

## Section 6: File Map

### New files

| File | Purpose |
|---|---|
| `lib/polar.ts` | Polar API client (createCheckout function) |
| `app/api/tickets/[id]/checkout/route.ts` | Generate checkout session |
| `app/api/webhooks/polar/route.ts` | Handle payment webhook |
| `prisma/migrations/<ts>_add_polar_payment_fields/migration.sql` | DB migration |

### Modified files

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add 4 columns to `ServiceTicket` |
| `lib/polar.ts` | (new) |
| `components/dashboard/settings/api-keys-section.tsx` | Add Polar API Key + Webhook Secret fields |
| `components/dashboard/services/service-form.tsx` | Bug 1 fix: add `id`/`htmlFor` to all inputs |
| `app/api/landing-pages/route.ts` | Bug 2 fix: normalize sections/variables encoding |
| `app/api/tickets/[id]/send-delivery/route.ts` | Guard: require `paid` or `in_progress` status |
| `app/(dashboard)/services/page.tsx` or ticket component | Add "Request Payment" button + checkout URL display + status badges |
| `tests/use-cases.spec.ts` | Update existing tests to cover paid status + add payment tests |

---

## Implementation Order

```
Task 001 — DB: add polar columns to ServiceTicket + migration
Task 002 — Backend: lib/polar.ts (Polar API helper)
Task 003 — Backend: POST /api/tickets/[id]/checkout (create checkout session)
Task 004 — Backend: POST /api/webhooks/polar (payment webhook handler)
Task 005 — Backend: guard send-delivery behind paid/in_progress status
Task 006 — Bug fix: service-form.tsx semantic labels
Task 007 — Bug fix: landing-pages POST double-encoding guard
Task 008 — Frontend: add Polar fields to api-keys-section.tsx
Task 009 — Frontend: ticket UI — Request Payment button + checkout URL + status badges
Task 010 — Tests: update use-cases.spec.ts + add payment E2E tests
```
