# Ship Context Log

## NEXT ACTION (resume here on /ship)
- Feature: landing-pages-email — in implementation, task 1 complete, task 2 is next
- Run: `./ship.sh run all` to execute remaining 15 tasks (002–016)

## Key Decisions

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
