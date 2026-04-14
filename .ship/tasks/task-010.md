# Task 010: Services Page + Sidebar Nav Item

## Type
ui

## Description
Wire all service components into the main /services page and add Services to the sidebar nav.

## Files
- `app/(dashboard)/services/page.tsx` (create)
- `components/layout/sidebar.tsx` (modify)

## Requirements

### app/(dashboard)/services/page.tsx
- "use client"
- State: services[], tickets[], selectedTicket, showForm, editingService
- On mount: fetch /api/services + /api/tickets
- Layout (dark, padding 24px):

  **Top section — Service Catalog:**
  - Page title "Services" (h1, white)
  - [+ Add Service] button (top right)
  - Grid of ServiceCard components (2 columns)
  - ServiceForm modal rendered when showForm=true (create) or editingService set (edit)
  - On save: POST or PATCH /api/services → refresh services list
  - On delete: DELETE /api/services/[id] → refresh
  - On toggle: PATCH /api/services/[id] with { status: "active"|"paused" } → refresh

  **Divider**

  **Bottom section — Ticket Pipeline:**
  - Section title "Client Pipeline" (h2)
  - Filter row: [All Services] dropdown to filter tickets by serviceId
  - TicketPipeline component with filtered tickets
  - TicketDrawer rendered when selectedTicket is set
  - On ticket update: refresh tickets list, keep drawer open with updated data

### components/layout/sidebar.tsx
- Add "Services" nav item between Promote and Settings
- Icon: use an appropriate lucide-react icon (e.g., Briefcase or LayoutList)
- href: /services

## Existing Code to Reference
- `app/(dashboard)/content/page.tsx` — two-tab page wiring pattern
- `app/(dashboard)/discover/page.tsx` — tab + card list pattern
- `components/layout/sidebar.tsx` — existing nav item pattern

## Acceptance Criteria
- [ ] /services page loads and shows catalog + pipeline
- [ ] Add/Edit/Delete/Toggle service works end-to-end
- [ ] Clicking a ticket opens the drawer
- [ ] Drawer close refreshes ticket list
- [ ] Services appears in sidebar between Promote and Settings

## Dependencies
- Task 007, Task 008, Task 009

## Commit Message
feat: add services page and sidebar nav item
