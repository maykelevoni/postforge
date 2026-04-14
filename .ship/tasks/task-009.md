# Task 009: Ticket Drawer UI Component

## Type
ui

## Description
Right-side sliding drawer that opens when a ticket is clicked. Shows full ticket detail, quote editor, and deliverables section.

## Files
- `components/dashboard/services/ticket-drawer.tsx` (create)

## Requirements
Props: `ticket` (with service), `onClose`, `onUpdate(updatedTicket)`

### Layout
- Fixed panel on right side (width 480px, full viewport height, bg #111, border-left #222)
- Overlays the page (z-index above pipeline)
- Close button (X) top right

### Header section
- Client name (large, white)
- Email (gray, mailto: link)
- Niche badge (indigo)
- Service name (gray)
- Source (gray, small, if present)
- Created date (gray, small)

### Status section
- Status dropdown (`<select>`) — options: New / Quoted / In Progress / Delivered / Closed
- On change: PATCH /api/tickets/[id] with new status, call onUpdate

### Notes section
- Label "Internal Notes"
- Textarea (auto-save on blur via PATCH /api/tickets/[id])

### Quote section
- Label "Quote / Proposal"
- [Generate Quote] button (indigo) → POST /api/tickets/[id]/quote → populates textarea below
- Loading state on button ("Generating...")
- Editable textarea (save on blur via PATCH)
- [Send Quote] button (green) — disabled if no quote text
  - POST /api/tickets/[id]/send-quote
  - Shows "Sent on {date}" after send
- If quoteSentAt: show timestamp

### Deliverables section (only when status = "in_progress" or "delivered")
- Label "Deliverables"
- [Generate Deliverables] button (indigo) → POST /api/tickets/[id]/deliver → shows preview
- Scrollable pre/textarea for preview
- [Send Delivery] button (green) — POST /api/tickets/[id]/send-delivery
- If deliveredAt: show timestamp

## Existing Code to Reference
- `app/(dashboard)/settings/page.tsx` — inline style patterns
- `components/dashboard/discover/app-idea-card.tsx` — modal pattern reference

## Acceptance Criteria
- [ ] Drawer opens/closes correctly
- [ ] Status change calls API and updates parent
- [ ] Notes auto-save on blur
- [ ] Generate Quote populates textarea
- [ ] Send Quote/Send Delivery show sent timestamps
- [ ] Deliverables section only visible for in_progress/delivered

## Dependencies
- Task 003, Task 004, Task 005

## Commit Message
feat: add ticket drawer component with quote and deliverables sections
