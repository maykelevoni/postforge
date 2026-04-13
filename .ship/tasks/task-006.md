# Task 006: Dashboard Layout & Sidebar

## Type
ui

## Description
Build the dark-mode dashboard shell — sidebar navigation, layout wrapper, and nav items for all 6 pages.

## Files
- `app/(dashboard)/layout.tsx` (create)
- `components/layout/sidebar.tsx` (create)
- `components/layout/nav-item.tsx` (create)
- `styles/globals.css` (create)

## Requirements
1. Dark theme throughout: background `#0a0a0a`, surface `#111111`, border `#222222`, text `#f5f5f5`, muted `#888888`, accent `#6366f1` (indigo)
2. Inline styles on all elements — no Tailwind in JSX
3. Sidebar: fixed left, 220px wide, full height
4. Nav items with icons (lucide-react): Today (Home), Research (TrendingUp), Discover (Sparkles), Content (FileText), Promote (Megaphone), Settings (Settings)
5. Active nav item highlighted with accent color
6. App name "PostForge" at top of sidebar
7. Main content area: `margin-left: 220px`, padding `24px`, `min-height: 100vh`
8. Auth guard: redirect to `/sign-in` if no session (use `auth()` from `auth.ts`)
9. `globals.css`: `box-sizing: border-box`, remove default margins, dark background on `html/body`

## Acceptance Criteria
- [ ] Sidebar visible on all dashboard pages
- [ ] Active page highlighted in nav
- [ ] Dark background throughout
- [ ] Redirects to sign-in if unauthenticated

## Dependencies
- Task 005

## Commit Message
feat: add dark dashboard layout with sidebar navigation
