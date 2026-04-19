# Task 019: Create Landing Pages dashboard page

## Type
ui

## Files
- `app/(dashboard)/landing-pages/page.tsx` (create)

## Requirements
1. "use client", fetch `/api/landing-pages` on mount
2. Header: "Landing Pages" h1 + total count badge (total subscribers across all pages)
3. Table with columns: URL | Template | Service | Subscribers | Created | Actions
4. URL: `/l/{slug}` as anchor with ExternalLink icon, opens new tab
5. Template: "saas"→"SaaS", "service"→"Service", "lead_magnet"→"Lead Magnet"
6. Service: service.name or "—"
7. Subscribers: `_count.subscribers`
8. Created: formatted date "Apr 17, 2026"
9. Actions: Preview (ExternalLink icon button), Edit (text button → opens LandingPageModal), Delete (Trash2 icon button, confirm first)
10. After edit/delete: reload list. After delete: call DELETE /api/landing-pages/:id
11. Import LandingPageModal from `@/components/dashboard/services/landing-page-modal`
12. When edit clicked: set editingPage state, open modal with existingPage prop
13. Empty state: "No landing pages yet. Create one from a service card."
14. Loading state: "Loading..."
15. Inline styles only — follow subscribers/page.tsx pattern exactly

## Existing Code to Reference
- `app/(dashboard)/subscribers/page.tsx` — table layout, loading/empty states, inline styles
- `app/(dashboard)/services/page.tsx` — LandingPageModal usage pattern

## Acceptance Criteria
- [ ] Lists all landing pages in table
- [ ] Preview opens public page in new tab
- [ ] Edit opens modal with existing data, save refreshes list
- [ ] Delete removes page with confirmation
- [ ] Empty/loading states work

## Dependencies
- Task 018

## Commit Message
feat: add Landing Pages management page
