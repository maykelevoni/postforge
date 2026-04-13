# Task 011: Discover API + Discover Page

## Type
ui

## Description
API routes for discover items and the Discover page where users approve or dismiss app ideas and affiliate products.

## Files
- `app/api/discover/route.ts` (create)
- `app/api/discover/[id]/approve/route.ts` (create)
- `app/api/discover/[id]/dismiss/route.ts` (create)
- `app/(dashboard)/discover/page.tsx` (create)
- `components/dashboard/discover/app-idea-card.tsx` (create)
- `components/dashboard/discover/affiliate-card.tsx` (create)

## Requirements

### API
- `GET /api/discover?type=&status=&page=` — paginated DiscoverItems with nested `appIdea` or `affiliate` included
- `POST /api/discover/[id]/approve`:
  - Sets DiscoverItem status to 'approved'
  - Creates `Promotion` record from the item data
  - Sets linked ResearchTopic status to 'used'
  - Returns `{ promotionId }`
- `POST /api/discover/[id]/dismiss` — sets status to 'dismissed'

### Discover page (dark theme, inline styles)
- Page title "Discover" + subtitle "AI-surfaced opportunities"
- Two tabs: **App Ideas** | **Affiliate Products** (pending count badge on each)
- Grid of cards per tab

### AppIdeaCard
- Title (bold, large)
- "App Idea" badge (indigo)
- Problem statement (2 lines)
- Target audience chip
- "Why now" text (italic, muted)
- [View Full Brief] button → opens Dialog with:
  - Full brief (all fields)
  - Landing page HTML preview (iframe or sanitized render)
- [Approve] button (green) → POST approve → card moves to approved state
- [Dismiss] button (ghost) → POST dismiss → card fades out

### AffiliateCard
- Product image (if imageUrl, else placeholder)
- Product name + vendor
- "Affiliate" badge (orange)
- Commission % (green, bold)
- Gravity score
- [View Details] button → opens Dialog with:
  - Full description
  - Promo rules
  - Content angles (bulleted list)
  - Affiliate link (copyable)
- [Approve] and [Dismiss] buttons

## Acceptance Criteria
- [ ] App Ideas tab shows pending items
- [ ] Affiliate tab shows pending items
- [ ] Approve creates Promotion and removes item from pending
- [ ] Dismiss removes from view
- [ ] Full brief dialog shows all fields
- [ ] Affiliate dialog shows promo rules and copy link

## Dependencies
- Task 006
- Task 009

## Commit Message
feat: add discover API and discover page
