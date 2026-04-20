# Ship Context Log

## NEXT ACTION (resume here on /ship)
- Feature: payment-polar — COMPLETE. Phase = complete, verified = true.
- 53/53 tests pass in tests/use-cases.spec.ts
- One test (Workflow 7, test 31) had a 15s timeout under load — fixed with timeout: 45000

## Key Decisions

### payment-polar Feature Decisions (2026-04-20)
- **Payment provider:** Polar API (not Stripe) — polar.sh, creator-focused
- **Checkout type:** `POST /v1/checkouts/custom` — custom amount per ticket
- **Webhook:** `/api/webhooks/polar` — verify via HMAC-SHA256 (webhook-id + timestamp + body)
- **Keys stored:** `polar_api_key` + `polar_webhook_secret` in DB Setting table
- **New ticket statuses:** `awaiting_payment`, `paid` (additive — no migration needed for enum)
- **Delivery gate:** send-delivery API blocks unless status is `paid` or `in_progress`
- **Bug 1 fixed:** service-form.tsx inputs need `id`/`htmlFor` (all 8 fields)
- **Bug 2 fixed:** landing-pages POST must guard against double-encoding of sections/variables

### Project Decisions
- **Stack:** Next.js 14 (App Router) + TypeScript + Prisma + Neon + Auth.js
- **Styling:** Inline styles only, no Tailwind in JSX. shadcn/ui for primitives only.
- **Package manager:** pnpm only — never npm (WSL2+OneDrive 260-char path limit)
- **AI text:** OpenRouter (user-supplied API key + model, stored in DB Setting table)
- **AI images:** fal.ai Flux Schnell
- **AI video:** fal.ai Kling image-to-video
- **Same video used for both Instagram Reels and TikTok** (generate once, post twice)
- **Social posting:** post-bridge API — Twitter/X, LinkedIn, Reddit, Instagram, TikTok
- **Email:** Resend API only — Systeme.io removed entirely. Resend is delivery-only; subscriber list lives in local DB Subscriber table
- **Discover is autonomous:** AI auto-discovers app ideas + ClickBank products. User only approves/dismisses.
- **Promotions sourced from Discover only:** no manual promotion entry
- **Gate mode:** when ON, social posts AND newsletters hold for manual approval
- **All API keys in DB Setting table** — never in .env. Only DATABASE_URL and AUTH_SECRET go in .env.
- **UI theme:** dark mode on the dashboard panel. Auth pages can be neutral.

### Architecture Patterns
- **Service Layer:** `lib/templates.ts` for template business logic
- **Component Pattern:** `"use client"` + `useEffect` fetch + `useState` (no server components)
- **API Pattern:** `auth()` → 401 check → Prisma query → `NextResponse.json()`
- **Inline Styling:** Continue inline styling approach (no Tailwind in JSX)

## Constraints
- pnpm only (WSL2+OneDrive 260-char path limit breaks npm)
- Playwright tests go in `tests/` folder only
- Inline styles in all JSX (no Tailwind classes)
- Worker is a separate node-cron process running alongside Next.js via concurrently
- **Prisma Version:** Always specify `@5.20.0` for Prisma commands to avoid v7 breaking changes

## Notes
- Reference codebase: /mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/
- launch/ has working patterns for: SSE, Auth.js, Prisma, post-bridge, worker/cron, settings helpers
- Do NOT copy launch/ code directly — clean rewrite. Use launch/ as reference for patterns only.
