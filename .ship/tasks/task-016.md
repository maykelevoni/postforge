# Task 016: Content API + Content Page

## Type
ui

## Description
API routes for content pieces and newsletters, and the Content page for viewing, editing, approving, and manually publishing.

## Files
- `app/api/content/route.ts` (create)
- `app/api/content/[id]/route.ts` (create)
- `app/api/content/[id]/approve/route.ts` (create)
- `app/api/content/[id]/publish/route.ts` (create)
- `app/(dashboard)/content/page.tsx` (create)
- `components/dashboard/content/content-piece-card.tsx` (create)
- `components/dashboard/content/newsletter-card.tsx` (create)

## Requirements

### API
- `GET /api/content?type=posts|newsletters&platform=&status=&page=` — returns ContentPieces or Newsletters, 20/page
- `PATCH /api/content/[id]` — body `{ content?, subject?, body? }` — edit draft fields
- `POST /api/content/[id]/approve` — sets approved=true, status='scheduled'
- `POST /api/content/[id]/publish` — immediately fires post via post-bridge or Systeme.io, updates status

### Content page (dark theme, inline styles)
- Two tabs: **Posts** | **Newsletters**
- Filter bar: platform filter (All/Twitter/LinkedIn/Reddit/Instagram/TikTok), status filter (All/Draft/Scheduled/Published/Failed)
- List of cards, newest first

### ContentPieceCard
- Platform icon + name
- Content text (truncated, 3 lines)
- Image/video thumbnail if present
- Status badge (color-coded)
- Scheduled time (if set)
- Promotion name (small, muted)
- [Edit] → inline textarea to edit content → [Save]
- [Approve] button (shown if status=draft and gate_mode=true)
- [Publish Now] button → POST publish → status updates live
- Failed: show error message in red

### NewsletterCard
- Email icon
- Subject line (bold)
- Body preview (3 lines)
- Status badge
- Scheduled time
- [Edit] → edit subject + body → [Save]
- [Approve] [Send Now] buttons

## Acceptance Criteria
- [ ] Posts tab shows ContentPieces with correct filters
- [ ] Newsletter tab shows Newsletters
- [ ] Edit updates content in DB
- [ ] Approve sets status to scheduled
- [ ] Publish Now fires immediately and updates status
- [ ] Failed pieces show error

## Dependencies
- Task 006
- Task 012
- Task 013

## Commit Message
feat: add content API and content page
