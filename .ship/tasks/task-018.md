# Task 018: Today Page (Command Center)

## Type
ui

## Description
Build the Today dashboard page — the main command center with live SSE updates, today's queue, active promotion, and research feed.

## Files
- `app/(dashboard)/page.tsx` (create)
- `components/dashboard/today/queue-card.tsx` (create)
- `components/dashboard/today/promotion-card.tsx` (create)
- `components/dashboard/today/research-feed.tsx` (create)

## Requirements

### Today page
- Page title "Today" + current date (e.g. "April 13, 2026")
- SSE connection via `useEffect` + `EventSource('/api/sse')`
- On `engine_update` event: show toast or inline status banner
- On `post_published` event: update queue card status live
- On `discover_new` event: update Discover nav badge

Layout (dark theme, inline styles, 3 sections):

**Top row** — full width
- Engine status bar: last run time + [▶ Run Now] button → POST `/api/engine/run`

**Middle row** — 2 columns
- Left: Today's Queue (QueueCard)
- Right: Active Promotion (PromotionCard) + Research Feed (ResearchFeed)

### QueueCard
- Title "Today's Queue"
- 6 rows (one per platform + email): platform icon, platform name, scheduled time, status badge
  - Status colors: published=green, scheduled=yellow, draft=gray, failed=red, pending approval=orange
- Click on failed row → shows error tooltip

### PromotionCard (Today variant)
- "Promoting Today" label
- Promotion name (large, bold)
- Type badge
- Funnel URL (clickable link)
- "Priority {n}" label

### ResearchFeed
- "Top Research Today" label
- List of top 3 research topics (score, title, source icon)
- "View all →" link to /research

## Acceptance Criteria
- [ ] SSE connection opens on page load
- [ ] Queue shows correct statuses for today's content
- [ ] Run Now button triggers engine and shows feedback
- [ ] Active promotion displayed
- [ ] Research feed shows today's top 3 topics
- [ ] Live status updates when posts publish

## Dependencies
- Task 015
- Task 016
- Task 017

## Commit Message
feat: add Today command center page with SSE live updates
