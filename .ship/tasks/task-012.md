# Task 012: Create landing page modal for Services page

## Description
Add a modal to the Services page that lets users create, edit, and manage landing pages for their services.

## Files
- `components/dashboard/services/landing-page-modal.tsx` (create)
- `app/(dashboard)/services/page.tsx` (modify)

## Requirements

### Landing Page Modal
1. `"use client"` component
2. Two modes: **create** (no existing page) and **edit** (page exists)
3. **Create mode:**
   - Show 3 template cards to select from
   - After selection, show variable editor:
     - Title (text input)
     - Subtitle (textarea)
     - Features (dynamic list — add/remove items)
     - CTA text (text input)
     - Testimonial (optional — name, quote, role)
   - Section toggles: checkboxes for hero, features, testimonial, cta, logoGrid
   - Publish button → calls POST /api/landing-pages
   - Preview button → opens `/l/[slug]` in new tab
4. **Edit mode:**
   - Show current values pre-filled
   - Same variable editor + section toggles
   - Save button → calls PATCH /api/landing-pages/[id]
   - Delete button → calls DELETE /api/landing-pages/[id]
   - Show published URL with copy-to-clipboard
5. Styled with existing shadcn/ui components or inline styles (dashboard convention)
6. Dark theme

### Services Page Modifications
1. Add "Generate Landing Page" button on each service card
2. If service has a landing page: show the URL and an "Edit" button
3. Wire up the modal to open in both create and edit modes

## Existing Code to Reference
- `app/(dashboard)/services/page.tsx` (current services page)
- `components/dashboard/services/` (existing modal patterns like ServiceForm)
- `app/api/landing-pages/route.ts` (from Task 007)

## Acceptance Criteria
- [ ] "Generate Landing Page" button visible on each service
- [ ] Template selection works
- [ ] Variable editor saves correctly
- [ ] Section toggles work
- [ ] Landing page URL displayed after creation
- [ ] Edit mode loads existing data
- [ ] Delete works and removes URL display
- [ ] Preview opens in new tab
- [ ] No TypeScript errors

## Dependencies
- Task 007, Task 009, Task 010, Task 011

## Commit Message
feat: add landing page create/edit modal to services page
