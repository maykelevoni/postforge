# Ship Context Log

## NEXT ACTION (resume here on /ship)
- Feature: pdf-document-generator is fully built and committed
- Dev server must be restarted (`pnpm dev`) — jspdf was downgraded v4→v2.5.1, old process is corrupted
- After restart: run `npx playwright test tests/documents.spec.ts --project=chromium`
- If all 18 tests pass → set phase to "complete", verified to true, done
- If any fail → read error, fix implementation or test, rerun

## Key Decisions

### Previous Project Decisions
- **Stack:** Next.js 14 (App Router) + TypeScript + Prisma + Neon + Auth.js
- **Styling:** Inline styles only, no Tailwind in JSX. shadcn/ui for primitives only.
- **Package manager:** pnpm only — never npm (WSL2+OneDrive 260-char path limit)
- **AI text:** OpenRouter (user-supplied API key + model, stored in DB Setting table)
- **AI images:** fal.ai Flux Schnell → generates image
- **AI video:** fal.ai Kling image-to-video → animates image into 5-10 sec clip
- **Same video used for both Instagram Reels and TikTok** (generate once, post twice)
- **Social posting:** post-bridge API — Twitter/X, LinkedIn, Reddit, Instagram, TikTok
- **Email:** Systeme.io broadcast API only — no Brevo, no SMTP
- **Discover is autonomous:** AI auto-discovers app ideas (full brief + landing page) and ClickBank products from research. User only approves/dismisses.
- **Promotions sourced from Discover only:** no manual promotion entry
- **6 pages:** Today, Research, Discover, Content, Promote, Settings
- **All API keys in DB Setting table** — never in .env. Only DATABASE_URL and AUTH_SECRET go in .env.
- **Gate mode:** when ON, social posts AND newsletters hold for manual approval
- **UI theme:** dark mode on the dashboard panel. Auth pages can be neutral.

### Icons & Templates Feature Decisions

**Phase 1: Developer Icons**
- **Icon Library:** Replace lucide-react with developer-icons from https://github.com/xandemon/developer-icons
- **Implementation Strategy:** Complete replacement (not parallel) for visual consistency
- **Component System:** Create centralized icon component in `components/ui/icon.tsx`
- **Icon Mapping:** Reference mapping in `lib/icon-mapping.ts` for consistent icon usage
- **Components Affected:** 15+ components including sidebar, nav-item, dashboard cards, auth pages
- **Priority:** Navigation first, then dashboard cards, then auth pages
- **Rollback Plan:** Keep lucide-react as commented dependency, use git commits for easy rollback

**Phase 2: Content Templates System**
- **Template Data Structure:** Templates with variables, constraints, examples
- **9 Content Types:** Twitter, LinkedIn, Reddit, Instagram, TikTok, Email Subject, Email Body, Image Prompts, Video Prompts
- **Template Types:** Pre-built (viral frameworks) + Custom (user-created)
- **Variable System:** Smart variable filling with AI generation (text, number, ai_generated types)
- **Constraint Enforcement:** Character limits, required sections, hashtag counts, platform-specific rules
- **Database Schema:** New Template and GeneratedContent models, updates to ContentPiece and Newsletter
- **API Design:** Full CRUD for templates, template-based generation endpoints, preview/validation
- **Frontend Pages:** New `/templates` page with platform tabs and template gallery
- **Integration:** Template selection modal in content generation flow
- **AI Integration:** Template-aware generation in `lib/ai.ts`, modifications to `worker/content/generate.ts` and `worker/content/media.ts`
- **Pre-built Templates:** 45-90 viral templates (5-10 per platform)
- **Validation:** Real-time validation with character counts, required sections, platform rules

**Architecture Patterns:**
- **Service Layer:** `lib/templates.ts` for template business logic
- **Component Pattern:** `"use client"` + `useEffect` fetch + `useState` (no server components)
- **API Pattern:** `auth()` → 401 check → Prisma query → `NextResponse.json()`
- **Inline Styling:** Continue inline styling approach (no Tailwind in JSX)

**Implementation Order:**
1. Phase 1: Developer Icons (2-4 hours) - Quick visual improvement
2. Phase 2: Content Templates (8-12 hours) - Major feature with database, API, UI, and AI integration

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

## Icons & Templates Specific Notes

- **Icon Availability:** Check developer-icons repository for all required icons before starting Phase 1
- **Template Performance:** Monitor template generation speed, optimize if > 5s
- **User Feedback:** Collect template performance data for future improvements
- **Extensibility:** Design template system to easily add new content types in future
- **AI Strictness:** AI must follow template constraints strictly - validation layer for enforcement
- **Fallback:** If template generation fails, fall back to existing generation (but log why it failed)