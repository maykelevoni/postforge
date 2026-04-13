# Task 010: Research API + Research Page

## Type
ui

## Description
API routes for research topics and the Research dashboard page.

## Files
- `app/api/research/route.ts` (create)
- `app/api/research/[id]/route.ts` (create)
- `app/(dashboard)/research/page.tsx` (create)
- `components/dashboard/research/topic-card.tsx` (create)

## Requirements

### API
- `GET /api/research?source=&status=&page=` — paginated list of ResearchTopics for session user, newest first, 20/page
- `PATCH /api/research/[id]` — body `{ status: "used" | "dismissed" }` — updates topic status

### Research page (dark theme, inline styles)
- Page title "Research" + subtitle "Today's trending signals"
- Filter bar: source buttons (All / YouTube / Reddit / News), status tabs (New / Used / Dismissed)
- Grid of `TopicCard` components
- Empty state when no topics yet

### TopicCard component
- Source icon (YouTube = red play, Reddit = orange, News = blue)
- Score badge (1-10, color: green >7, yellow 4-7, red <4)
- Title (bold)
- Summary (2 lines, truncated)
- Date + URL link (external)
- Action buttons: [Mark Used] [Dismiss] — PATCH `/api/research/[id]`
- Dark card: background `#111`, border `#222`, hover `#1a1a1a`

## Acceptance Criteria
- [ ] Topics list renders with correct source icons
- [ ] Filter by source works
- [ ] Status filter works
- [ ] Mark used / dismiss updates card status visually

## Dependencies
- Task 006
- Task 008

## Commit Message
feat: add research API and research page
