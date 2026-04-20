# Task 002: Backend — lib/polar.ts (Polar API helper)

## Description
Create `lib/polar.ts` — a thin helper that wraps the Polar API checkout creation endpoint.

## Files
- `lib/polar.ts` (create)

## Requirements
1. Export `createPolarCheckout(params)`:
   ```ts
   interface CreatePolarCheckoutParams {
     polarApiKey: string;
     amount: number;       // in cents (e.g. 9900 = $99)
     clientEmail?: string;
     ticketId: string;
     serviceName: string;
   }
   interface PolarCheckoutResult {
     checkoutUrl: string;
     checkoutId: string;
   }
   export async function createPolarCheckout(params: CreatePolarCheckoutParams): Promise<PolarCheckoutResult>
   ```
2. Call `POST https://api.polar.sh/v1/checkouts/custom` with:
   ```json
   {
     "amount": <cents>,
     "currency": "usd",
     "metadata": { "ticketId": "<id>", "serviceName": "<name>" },
     "customer_email": "<email or omit if undefined>"
   }
   ```
3. Auth header: `Authorization: Bearer <polarApiKey>`
4. On non-2xx, throw an Error with the response body message
5. Return `{ checkoutUrl: data.url, checkoutId: data.id }` from the response

## Existing Code to Reference
- `lib/email.ts` — pattern for external API helpers
- `lib/ai.ts` — pattern for throwing on non-OK responses

## Acceptance Criteria
- [ ] `lib/polar.ts` exports `createPolarCheckout`
- [ ] Uses `fetch` with `Authorization: Bearer`
- [ ] Throws descriptive error on non-2xx
- [ ] Returns `{ checkoutUrl, checkoutId }`
- [ ] No unused imports

## Dependencies
- Task 001 (schema defines the data model context)

## Commit Message
feat(lib): add Polar API client helper
