# Task 015: Create Subscribers page and API

## Type
ui

## Description
Build the Subscribers dashboard page and backing API so users can see and export their email list.

## Files
- `app/api/subscribers/route.ts` (create)
- `app/api/subscribers/export/route.ts` (create)
- `app/(dashboard)/subscribers/page.tsx` (create)

## Requirements
1. `GET /api/subscribers`:
   - Auth required
   - Query params: `landingPageId` (optional), `serviceId` (optional)
   - Returns array of subscribers for the logged-in user with: id, name, email, source, landingPage.slug (if any), service.name (if any), createdAt
   - Ordered by createdAt desc

2. `GET /api/subscribers/export`:
   - Auth required
   - Same filters as above
   - Returns CSV response with Content-Disposition: attachment header
   - CSV columns: Name, Email, Source, Landing Page, Service, Date Joined

3. `/subscribers` dashboard page:
   - Follows existing dashboard page patterns (inline styles, dark theme, "use client" + useEffect fetch)
   - Header: "Subscribers" title + total count badge + "Export CSV" button
   - Filter row: dropdown for Landing Page, dropdown for Service (populated from API)
   - Table columns: Name, Email, Source, Landing Page, Service, Date Joined
   - Empty state if no subscribers yet
   - Export CSV button calls `/api/subscribers/export` and triggers browser download

## Existing Code to Reference
- `app/(dashboard)/services/page.tsx` (page layout and inline style patterns)
- `app/api/services/route.ts` (API auth pattern)
- `app/api/tickets/route.ts` (list query pattern)

## Acceptance Criteria
- [ ] `/subscribers` page loads and shows subscriber list
- [ ] Filters work (by landing page, by service)
- [ ] Export CSV button downloads a valid CSV file
- [ ] Empty state shown when no subscribers
- [ ] Compiles without TypeScript errors

## Dependencies
- Task 002 (Subscriber model), Task 005 (subscriber creation on form submit)

## Commit Message
feat: add subscribers page and export API
