# Task 018: Add Landing Pages nav + subscriber count to API

## Files
- `components/layout/nav-item.tsx` (modify)
- `app/api/landing-pages/route.ts` (modify)

## Requirements
1. In navItems, add `{ href: "/landing-pages", icon: "globe", label: "Landing Pages" }` between Services and Subscribers entries
2. In GET /api/landing-pages, add `_count: { select: { subscribers: true } }` inside the `select` block

## Acceptance Criteria
- [ ] "Landing Pages" appears in sidebar between Services and Subscribers
- [ ] API returns `_count: { subscribers: N }` per page

## Dependencies
- Task 017

## Commit Message
feat: add Landing Pages nav and subscriber count to API
