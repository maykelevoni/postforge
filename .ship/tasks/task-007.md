# Task 007: Service Catalog UI Components

## Type
ui

## Description
Service card and form components for the catalog section of the /services page.

## Files
- `components/dashboard/services/service-card.tsx` (create)
- `components/dashboard/services/service-form.tsx` (create)

## Requirements

### service-card.tsx
Props: `service` (with _count.tickets), `onEdit`, `onDelete`, `onToggleStatus`
- Dark card (background #111, border #222)
- Header row: service name (bold, white) + status badge ("active" green / "paused" gray)
- Body: description (truncated 2 lines), price range ($priceMin–$priceMax), turnaround (X days)
- Footer: ticket count badge + [Edit] button + [Pause/Activate] toggle + [Delete] button
- Inline styles only

### service-form.tsx
Props: `service?` (null = create mode), `onSave(data)`, `onCancel`
- Modal overlay (fixed, dark semi-transparent background)
- Form card (centered, max-width 560px, dark theme)
- Fields:
  - Name (text input, required)
  - Description (textarea, 3 rows)
  - Deliverables Template (textarea, 6 rows, placeholder: "Generate 10 video scripts about [niche]...")
  - Price Min / Max (side by side number inputs)
  - Turnaround Days (number input)
  - Funnel URL (text input, optional)
- [Cancel] + [Save Service] buttons
- Pre-fills fields when editing (service prop passed)
- Calls onSave with form data on submit

## Existing Code to Reference
- `components/dashboard/discover/app-idea-card.tsx` — card pattern
- `app/(dashboard)/settings/page.tsx` — modal/form inline style patterns

## Acceptance Criteria
- [ ] ServiceCard renders service data correctly
- [ ] ServiceForm opens in create and edit mode
- [ ] Template textarea has [niche] placeholder hint
- [ ] Form validates required fields before calling onSave

## Dependencies
- Task 002 (API shape reference)

## Commit Message
feat: add service catalog card and form components
