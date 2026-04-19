# Task 020: Move Client Pipeline to Subscribers + clean up Services

## Type
ui

## Files
- `app/(dashboard)/subscribers/page.tsx` (modify)
- `app/(dashboard)/services/page.tsx` (modify)

## Requirements

### Services page cleanup
Remove everything related to the ticket pipeline:
- Remove imports: `TicketPipeline`, `TicketDrawer`, `Ticket` type
- Remove state: `tickets`, `selectedTicket`, `filterServiceId`
- Remove handlers: `handleTicketClick`, `handleTicketUpdate`, `handleDrawerClose`, `filteredTickets`
- Remove from loadData: the `ticketsRes` fetch (only fetch services)
- Remove from JSX: divider, "Client Pipeline" section, TicketPipeline component, TicketDrawer component, filterRowStyle, filterLabelStyle, selectStyle (if only used for pipeline)
- Keep everything else (service cards, landing page rows, service form modal, landing page modal)

### Subscribers page: add Clients tab
- Add tab switcher UI at top: two tabs "Subscribers" and "Clients"
- Tab active style: border-bottom indigo, text white. Inactive: text #888
- "Subscribers" tab: existing table (no changes to existing logic)
- "Clients" tab:
  - Import TicketPipeline from `@/components/dashboard/services/ticket-pipeline`
  - Import TicketDrawer from `@/components/dashboard/services/ticket-drawer`
  - Fetch `/api/tickets` when Clients tab is first activated (lazy load)
  - Show TicketPipeline with tickets
  - TicketDrawer for selected ticket
  - Filter row: "Filter by service:" select (fetch services from /api/services)
  - Loading state for tickets
- State to add: `activeTab` ("subscribers" | "clients"), `tickets`, `selectedTicket`, `ticketServices`, `ticketsLoaded`, `filterServiceId`

### Redesign TicketPipeline columns (in ticket-pipeline.tsx)
- Column header: colored dot + label + count badge
- Colors: New=#3b82f6, Quoted=#f59e0b, In Progress=#6366f1, Delivered=#22c55e, Closed=#6b7280
- Remove maxHeight from columnStyle
- Empty column: dashed border placeholder instead of plain text

### Redesign TicketCard (in ticket-card.tsx)
- Status pill at top-right: small colored badge matching column color
- Client name: prominent, 15px font
- Service name: smaller, #888
- Niche badge: more subtle (gray, not indigo)
- Days indicator: keep but style cleaner

## Existing Code to Reference
- `app/(dashboard)/subscribers/page.tsx` — current structure to extend
- `components/dashboard/services/ticket-pipeline.tsx` — to modify column styles
- `components/dashboard/services/ticket-card.tsx` — to modify card styles
- `app/(dashboard)/services/page.tsx` — what to remove

## Acceptance Criteria
- [ ] Services page has no pipeline section
- [ ] Subscribers page has Subscribers / Clients tabs
- [ ] Clients tab shows kanban with color-coded columns
- [ ] TicketDrawer opens when clicking a ticket card
- [ ] Services filter works in Clients tab

## Dependencies
- Task 019

## Commit Message
feat: move client pipeline to subscribers tab and redesign kanban
