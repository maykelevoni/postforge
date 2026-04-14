# Task 008: Ticket Pipeline UI Components

## Type
ui

## Description
Kanban pipeline with 5 columns and ticket cards for the /services page.

## Files
- `components/dashboard/services/ticket-pipeline.tsx` (create)
- `components/dashboard/services/ticket-card.tsx` (create)

## Requirements

### ticket-pipeline.tsx
Props: `tickets[]`, `onTicketClick(ticket)`
- 5-column horizontal layout (CSS grid or flexbox, equal width)
- Column headers: New | Quoted | In Progress | Delivered | Closed
- Each column: header (with count badge) + list of TicketCards for that status
- Empty column: subtle "No tickets" text
- Inline styles, dark theme (bg #0a0a0a, column bg #111)
- Scrollable columns if many tickets

### ticket-card.tsx
Props: `ticket` (with service.name), `onClick`
- Compact dark card (bg #1a1a1a, border #222, border-radius 6px, padding 12px)
- Client name (white, bold, truncated)
- Niche tag (small badge, indigo bg)
- Service name (gray, small)
- Days in current stage (e.g. "3 days" — calculated from updatedAt)
- Cursor pointer, hover darkens slightly
- Calls onClick on click

## Existing Code to Reference
- `components/dashboard/discover/app-idea-card.tsx` — card pattern
- `components/dashboard/today/queue-card.tsx` — status badge pattern

## Acceptance Criteria
- [ ] Pipeline renders 5 columns
- [ ] Tickets appear in correct column by status
- [ ] Days in stage calculated and displayed
- [ ] Clicking a card calls onTicketClick

## Dependencies
- Task 003 (ticket data shape)

## Commit Message
feat: add ticket pipeline and card components
