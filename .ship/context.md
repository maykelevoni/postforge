# Ship Context Log

## Key Decisions

- **Stack:** Next.js 14 (App Router) + TypeScript + Prisma + Neon + Auth.js
- **Styling:** Inline styles only, no Tailwind in JSX. shadcn/ui for primitives only.
- **Package manager:** pnpm only — never npm (WSL2+OneDrive 260-char path limit)
- **AI text:** OpenRouter (user-supplied API key + model, stored in DB Setting table)
- **AI images:** fal.ai Flux Schnell → generates image
- **AI video:** fal.ai Kling image-to-video → animates image into 5-10 sec clip
- Same video used for both Instagram Reels and TikTok (generate once, post twice)
- **Social posting:** post-bridge API — Twitter/X, LinkedIn, Reddit, Instagram, TikTok
- **Email:** Systeme.io broadcast API only — no Brevo, no SMTP
- **Discover is autonomous:** AI auto-discovers app ideas (full brief + landing page) and ClickBank products from research. User only approves/dismisses.
- **Promotions sourced from Discover only:** no manual promotion entry
- **6 pages:** Today, Research, Discover, Content, Promote, Settings
- **All API keys in DB Setting table** — never in .env. Only DATABASE_URL and AUTH_SECRET go in .env.
- **Gate mode:** when ON, social posts AND newsletters hold for manual approval
- **UI theme:** dark mode on the dashboard panel. Auth pages can be neutral.

## Constraints

- pnpm only (WSL2+OneDrive 260-char path limit breaks npm)
- Playwright tests go in `tests/` folder only
- Inline styles in all JSX (no Tailwind classes)
- Worker is a separate node-cron process running alongside Next.js via concurrently

## Notes

- Reference codebase: /mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/
- launch/ has working patterns for: SSE, Auth.js, Prisma, post-bridge, worker/cron, settings helpers
- Do NOT copy launch/ code directly — clean rewrite. Use launch/ as reference for patterns only.
