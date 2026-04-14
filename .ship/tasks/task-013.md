# Task 013: Create Templates Page and Core Components

## Type
ui

## Description
Create the main /templates page with platform tabs, template gallery, and template card components for browsing and selecting templates.

## Files
- `app/(dashboard)/templates/page.tsx` (create)
- `components/dashboard/templates/platform-tabs.tsx` (create)
- `components/dashboard/templates/template-filters.tsx` (create)
- `components/dashboard/templates/template-gallery.tsx` (create)
- `components/dashboard/templates/template-card.tsx` (create)

## Requirements
1. Create /templates page with two-panel layout (platform tabs + gallery)
2. Platform tabs component for filtering by category
3. Template filters component (search, type filter, favorites)
4. Template gallery component to display template cards
5. Template card component showing name, example, variables count, favorite button
6. All components use inline styles (no Tailwind)
7. Proper state management (useState, useEffect)
8. Fetch templates from API
9. Handle loading and error states
10. Responsive design

## Existing Code to Reference
- `app/(dashboard)/services/page.tsx` - Pattern for dashboard pages
- `components/dashboard/promote/promotion-card.tsx` - Pattern for card components
- Technical plan - Templates page specifications

## Acceptance Criteria
- [ ] /templates page created with two-panel layout
- [ ] Platform tabs component filters by category
- [ ] Template filters component supports search and filtering
- [ ] Template gallery displays templates in grid
- [ ] Template card shows name, example, variables, favorite button
- [ ] All components use inline styles
- [ ] Templates fetched from API successfully
- [ ] Loading and error states handled
- [ ] Responsive design works on mobile
- [ ] Page navigation functional

## Dependencies
- Task 011 (Template CRUD API routes)

## Commit Message
feat: create templates page with core components