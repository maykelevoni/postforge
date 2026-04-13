# Task 017: Promote API + Promote Page

## Type
ui

## Description
API routes for promotions and the Promote page for managing active promotions.

## Files
- `app/api/promote/route.ts` (create)
- `app/api/promote/[id]/route.ts` (create)
- `app/(dashboard)/promote/page.tsx` (create)
- `components/dashboard/promote/promotion-card.tsx` (create)

## Requirements

### API
- `GET /api/promote?status=active|paused|archived` — returns Promotions with discoverItem nested
- `PATCH /api/promote/[id]` — body `{ status?, priority?, funnelUrl? }` — update fields
- `DELETE /api/promote/[id]` — sets status='archived'

### Promote page (dark theme, inline styles)
- Page title "Promote" + subtitle "Active promotions in rotation"
- Status tabs: Active | Paused | Archived
- List of PromotionCards

### PromotionCard
- Name (bold)
- Type badge: "App Idea" (indigo) or "Affiliate" (orange)
- Priority number (1-10) with [−] [+] buttons to adjust
- Funnel URL (editable inline, shows link icon)
- Status indicator dot (green=active, yellow=paused, gray=archived)
- [Pause] / [Resume] toggle button
- [Archive] button (ghost, destructive)
- Last generated date (muted)

## Acceptance Criteria
- [ ] Active promotions listed
- [ ] Priority adjust saves to DB
- [ ] Funnel URL editable inline
- [ ] Pause/Resume updates status
- [ ] Archive removes from active view

## Dependencies
- Task 006
- Task 011

## Commit Message
feat: add promote API and promote page
